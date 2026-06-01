import type { RoadmapRequest } from "@/lib/ai/schemas";

export function topicQuestionsPrompt(topic: string) {
  return {
    system:
      "You are an expert curriculum designer. Output ONLY valid JSON. No markdown, no commentary.",
    user: `Create exactly 4 clarifying questions to personalize a learning roadmap about: "${topic}".\n\nReturn JSON with shape:\n{\n  \"questions\": [\n    { \"id\": \"q1\", \"question\": \"...\", \"options\": [\"...\"] }\n  ]\n}\n\nRules:\n- questions length must be 4\n- each options must be 3-6 short answer chips\n- options must be specific to the topic\n- keep language simple for a general audience\n`,
  };
}

export function roadmapPrompt(persona: RoadmapRequest) {
  const {
    topic,
    topicAnswers,
    topicAnswersTyped,
    learningStyle,
    goal,
    extraContext,
  } = persona;

  // Merge typed overrides into the effective answers for generation only.
  const effectiveAnswers = {
    ...(topicAnswers || {}),
    ...(topicAnswersTyped || {}),
  };

  return {
    system:
      "You are an expert curriculum designer. Output ONLY valid JSON. No markdown, no commentary.",
    user: `Create a personalized learning roadmap.\n\nPersona:\n- topic: ${JSON.stringify(
      topic
    )}\n- topicAnswers: ${JSON.stringify(
      effectiveAnswers
    )}\n- learningStyle: ${learningStyle}\n- goal: ${goal}\n- extraContext: ${JSON.stringify(extraContext || "")}\n\nReturn JSON with shape:\n{\n  \"title\": \"...\",\n  \"description\": \"...\",\n  \"chapters\": [\n    {\n      \"title\": \"...\",\n      \"description\": \"...\",\n      \"guides\": [ { \"title\": \"...\" } ]\n    }\n  ]\n}\n\nRules:\n- chapters must be 5 to 6\n- each chapter guides must be 5 to 6\n- guide titles must be short and action-oriented\n- keep the roadmap practical and progressive\n`,
  };
}

export function guidePrompt(input: {
  topic: string;
  roadmapTitle: string;
  chapterTitle: string;
  guideTitle: string;
  persona: any;
}) {
  const { topic, roadmapTitle, chapterTitle, guideTitle, persona } = input;

  return {
    system: `You are a world-class learning mentor.

Teaching style: clear, practical, personalized, concrete.

Output rules:
- Output clean markdown only.
- Do NOT wrap in code fences.
- Do NOT include unsafe HTML.
- Do NOT include citations or sources unless the user explicitly asked.
- Avoid generic filler.

Required blocks and structure:
# Guide Title
:::guide-overview
- What you’ll learn: ...
- When to use it: ...
- Prereqs (if any): ...
:::
## Core idea
## Why it matters
## Step-by-step explanation
## Example
:::key-takeaway
One concise takeaway.
:::
:::common-mistake
A likely mistake + correction.
:::
:::practice
One short exercise or reflection prompt.
:::
`,
    user: `Write one high-quality learning guide.

Context:
- topic: ${JSON.stringify(topic)}
- roadmapTitle: ${JSON.stringify(roadmapTitle)}
- chapterTitle: ${JSON.stringify(chapterTitle)}
- guideTitle: ${JSON.stringify(guideTitle)}
- learner persona: ${JSON.stringify(persona)}

Quality bar:
- Aim for a 1–2 page reading feel.
- Use concrete examples.
- Use code/tables only if it improves learning for this guide.

Return markdown only.`,
  };
}

export function quizPrompt(input: {
  topic: string;
  chapterTitle: string;
  persona: any;
  guideTitles: string[];
  guideTextSnippets: string[];
}) {
  const { topic, chapterTitle, persona, guideTitles, guideTextSnippets } = input;

  return {
    system:
      "You are an expert tutor. Output ONLY valid JSON. No markdown, no commentary.",
    user: `Create a 5-question multiple choice quiz.\n\nContext:\n- topic: ${JSON.stringify(
      topic
    )}\n- chapterTitle: ${JSON.stringify(
      chapterTitle
    )}\n- persona: ${JSON.stringify(persona)}\n- guideTitles: ${JSON.stringify(guideTitles)}\n- notes: ${JSON.stringify(guideTextSnippets)}\n\nReturn JSON with shape:\n{\n  "questions": [\n    {\n      "question": "...",\n      "options": ["A", "B", "C", "D"],\n      "correctIndex": 0,\n      "explanation": "..."\n    }\n  ]\n}\n\nRules:\n- questions length must be exactly 5.\n- options must be exactly 4.\n- correctIndex must be 0-3.\n- Keep questions grounded in the chapter content and avoid trick questions.\n`,
  };
}

export function jsonRepairPrompt(badText: string, targetShapeHint: string) {
  return {
    system:
      "You are a JSON repair tool. Output ONLY valid JSON that matches the requested shape. No markdown.",
    user: `The following text was supposed to be JSON but is invalid or does not match the schema.\n\nTarget shape:\n${targetShapeHint}\n\nText to repair:\n${badText}\n\nReturn ONLY repaired JSON.`,
  };
}
