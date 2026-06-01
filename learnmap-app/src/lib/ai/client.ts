export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AiChatInput = {
  model: string;
  messages: AiMessage[];
  temperature?: number;
  /**
   * Optional OpenAI-compatible structured output control.
   * If the upstream endpoint supports it, this helps guarantee valid JSON.
   */
  response_format?: unknown;
};

type AiChatResult = {
  text: string;
  raw: unknown;
};

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export async function aiChat(input: AiChatInput): Promise<AiChatResult> {
  const endpoint = requireEnv("AI_ENDPOINT_URL");
  const apiKey = process.env.AI_API_KEY;

  const url = endpoint.endsWith("/chat/completions")
    ? endpoint
    : `${endpoint.replace(/\/$/, "")}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: input.model,
      messages: input.messages,
      temperature: input.temperature ?? 0.3,
      stream: false,
      ...(input.response_format ? { response_format: input.response_format } : {}),
    }),
  });

  const rawText = await res.text();

  // Some OpenAI-compatible endpoints return Server-Sent Events (SSE) even when stream=false.
  // Detect and recover by reassembling the streamed deltas into one text.
  const looksLikeSse = rawText.startsWith("data: ") || rawText.includes("\ndata: ");
  const sseToText = (s: string) => {
    const lines = s.split(/\r?\n/);
    let out = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload);
        const delta = evt?.choices?.[0]?.delta;
        const piece = delta?.content;
        if (typeof piece === "string") out += piece;
      } catch {
        // ignore malformed chunks
      }
    }
    return out;
  };

  const data = ((): any => {
    try {
      return JSON.parse(rawText);
    } catch {
      if (looksLikeSse) {
        const text = sseToText(rawText);
        if (text.trim()) {
          return {
            choices: [{ message: { role: "assistant", content: text } }],
            _streamed: true,
          };
        }
      }
      return null;
    }
  })();

  if (!res.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      `AI request failed with status ${res.status}`;

    console.error("[aiChat] Non-2xx from AI endpoint", {
      status: res.status,
      statusText: res.statusText,
      bodyPreview: rawText.slice(0, 500),
    });

    throw new Error(msg);
  }

  if (!data) {
    console.error("[aiChat] AI response was not valid JSON", {
      status: res.status,
      bodyPreview: rawText.slice(0, 500),
    });
    throw new Error("AI response was not valid JSON.");
  }

  // OpenAI-style: data.choices[0].message.content
  const openAiText = data?.choices?.[0]?.message?.content;
  if (typeof openAiText === "string" && openAiText.trim()) {
    return { text: openAiText, raw: data };
  }

  // Some providers return `choices[0].text` (legacy completions)
  const legacyText = data?.choices?.[0]?.text;
  if (typeof legacyText === "string" && legacyText.trim()) {
    return { text: legacyText, raw: data };
  }

  // Anthropic-style: data.content[0].text
  const anthropicText = data?.content?.[0]?.text;
  if (typeof anthropicText === "string" && anthropicText.trim()) {
    return { text: anthropicText, raw: data };
  }

  // Diagnostic: log top-level shape to help debugging mismatched providers
  try {
    const keys = data && typeof data === "object" ? Object.keys(data) : [];
    console.error("[aiChat] Could not extract text from AI response", {
      topLevelKeys: keys,
      hasChoices: Boolean(data?.choices),
      choices0Keys:
        data?.choices?.[0] && typeof data.choices[0] === "object"
          ? Object.keys(data.choices[0])
          : [],
      messageKeys:
        data?.choices?.[0]?.message && typeof data.choices[0].message === "object"
          ? Object.keys(data.choices[0].message)
          : [],
      anthropicContent0Keys:
        data?.content?.[0] && typeof data.content[0] === "object"
          ? Object.keys(data.content[0])
          : [],
    });
  } catch {
    // ignore
  }

  throw new Error(
    "AI response did not include text in expected format (choices[0].message.content, choices[0].text, or content[0].text)."
  );
}
