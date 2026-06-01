import { NextResponse } from "next/server";

import { aiChat } from "@/lib/ai/client";
import { TopicQuestionsSchema } from "@/lib/ai/schemas";

const responseFormatJsonSchema = {
  type: "json_schema",
  json_schema: {
    name: "topic_questions_response",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["questions"],
      properties: {
        questions: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "question", "options"],
            properties: {
              id: { type: "string", enum: ["q1", "q2", "q3", "q4"] },
              question: { type: "string" },
              options: {
                type: "array",
                minItems: 3,
                maxItems: 6,
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;

const systemPrompt = `
You are an expert curriculum designer.

Return exactly one valid JSON object.
Do not return markdown.
Do not return commentary.
Do not repeat the JSON.
Do not wrap the JSON in code fences.
The response must match the provided JSON schema.
`;

function userPrompt(topic: string) {
  return `
Create exactly 4 clarifying questions to personalize a learning roadmap about: "${topic}".

The questions should help understand the learner's current level, preferred subtopics, constraints (time/depth), and what kind of practice they want.
Do not ask about the learner's overall goal or learning style (those are collected separately).

Rules:
- Return exactly 4 questions.
- Each question must have an id: q1, q2, q3, q4.
- Each options array must contain 3 to 6 short answer chips.
- Options must be specific to "${topic}".
- Include emojis in the option strings when it fits (1 emoji prefix is enough, e.g. "📚 Beginner").
- Keep language simple for a general audience.
`;
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: { message } }, { status });
}

/**
 * Extract the first complete JSON object from a string.
 * Handles cases like: `{...}{...}` (concatenated objects) by returning the first one.
 */
function extractFirstJsonObject(text: string): string {
  const s = text.trim();

  const start = s.indexOf("{");
  if (start === -1) throw new Error("No JSON object start found.");

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (depth === 0) {
      return s.slice(start, i + 1);
    }
  }

  throw new Error("No complete JSON object found.");
}

function normalizeConcatenatedQuestionsObject(parsed: any) {
  // Accept the model's (bad) shape: { q1: {question, options}, q2: ... }
  // and convert to the required shape: { questions: [ {id, question, options}, ...] }
  const keys = ["q1", "q2", "q3", "q4"] as const;
  const looksLikeLegacy =
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    parsed.questions === undefined &&
    keys.every((k) => parsed[k] && typeof parsed[k] === "object");

  if (!looksLikeLegacy) return parsed;

  return {
    questions: keys.map((id) => ({
      id,
      question: String(parsed[id]?.question ?? "").trim(),
      options: Array.isArray(parsed[id]?.options)
        ? parsed[id].options.map((x: any) => String(x))
        : [],
    })),
  };
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    // 1) Read body using await req.json()
    let body: unknown;
    try {
      body = (await req.json()) as unknown;
    } catch (e) {
      console.error(`[topic-questions:${requestId}] Invalid JSON body`, {
        error: e instanceof Error ? e.message : String(e),
      });
      return jsonError("Invalid JSON body.", 400);
    }

    const topic =
      typeof (body as any)?.topic === "string" ? (body as any).topic.trim() : "";

    // 2) Validate topic
    if (!topic) {
      return jsonError("Please provide a topic.", 400);
    }

    const fastModel = process.env.AI_MODEL_FAST;
    if (!fastModel) {
      console.error(`[topic-questions:${requestId}] Missing AI_MODEL_FAST`);
      return jsonError("Missing AI_MODEL_FAST env var.", 500);
    }

    // 3-4) No streaming; call AI in non-streaming mode
    // 5) response_format: cannot be passed through current aiChat() wrapper.
    //     Fallback: enforce strict JSON in prompt + extract first complete JSON object.
    const result = await aiChat({
      model: fastModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt(topic) },
      ],
      temperature: 0,
      response_format: responseFormatJsonSchema,
    });

    // 6-8) Force exactly one JSON object; parse/validate; return only parsed
    try {
      const firstJson = extractFirstJsonObject(result.text);
      const parsedUnknown = JSON.parse(firstJson);
      const normalized = normalizeConcatenatedQuestionsObject(parsedUnknown);
      const parsed = TopicQuestionsSchema.parse(normalized);

      return NextResponse.json(parsed);
    } catch (err) {
      // 9) server-side logging
      console.error(`[topic-questions:${requestId}] Parse/validate failed`, {
        topic,
        error: err instanceof Error ? err.message : String(err),
        aiTextPreview: String(result.text).slice(0, 500),
      });

      // 10) safe JSON error
      return jsonError(
        "AI returned invalid JSON for topic questions. Please try again.",
        502
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);

    // 9) server-side logging for failures
    console.error(`[topic-questions:${requestId}] Request failed`, {
      error: msg,
    });

    // (request JSON parse errors are handled above)

    if (err instanceof Error && err.message.includes("Expected property name")) {
      return jsonError(
        "AI returned invalid JSON for topic questions. Please try again.",
        502
      );
    }

    // If AI client threw (network / 4xx/5xx), treat as bad gateway
    if (
      err instanceof Error &&
      (err.message.startsWith("AI request failed") ||
        err.message.includes("AI response did not include"))
    ) {
      return jsonError("AI request failed. Please try again.", 502);
    }

    return jsonError("Internal server error.", 500);
  }
}
