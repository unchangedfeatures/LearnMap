import { z, type ZodType } from "zod";

export function safeJsonParseFromText(text: string): unknown {
  const trimmed = text.trim();

  // 1) direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  // 2) extract first {...} block
  const firstObj = trimmed.indexOf("{");
  const lastObj = trimmed.lastIndexOf("}");
  if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
    const slice = trimmed.slice(firstObj, lastObj + 1);
    try {
      return JSON.parse(slice);
    } catch {
      // continue
    }
  }

  // 3) extract first [...] block
  const firstArr = trimmed.indexOf("[");
  const lastArr = trimmed.lastIndexOf("]");
  if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
    const slice = trimmed.slice(firstArr, lastArr + 1);
    try {
      return JSON.parse(slice);
    } catch {
      // continue
    }
  }

  throw new Error("Could not find valid JSON in AI response.");
}

export async function parseWithZodOrThrow<T>(
  text: string,
  schema: ZodType<T>
): Promise<T> {
  const json = safeJsonParseFromText(text);
  return schema.parse(json);
}

export function zodErrorToMessage(err: unknown): string {
  if (err instanceof z.ZodError) {
    const first = err.issues[0];
    if (!first) return "Invalid data.";
    const path = first.path.length ? first.path.join(".") : "value";
    return `Invalid ${path}: ${first.message}`;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error.";
}
