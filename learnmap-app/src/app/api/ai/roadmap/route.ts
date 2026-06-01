import { aiChat } from "@/lib/ai/client";
import { jsonRepairPrompt, roadmapPrompt } from "@/lib/ai/prompts";
import {
  RoadmapRequestSchema,
  RoadmapSchema,
  type RoadmapRequest,
} from "@/lib/ai/schemas";
import { parseWithZodOrThrow, zodErrorToMessage } from "@/lib/ai/parse";
import { jsonError, toPublicErrorMessage } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function pickChapterStatus(idx: number) {
  return idx === 0 ? "available" : "locked";
}

function pickGuideStatus(chapterIdx: number, guideIdx: number) {
  return chapterIdx === 0 && guideIdx === 0 ? "available" : "locked";
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = (await req.json()) as unknown;
    } catch (e) {
      console.error(`[roadmap:${requestId}] Invalid JSON body`, {
        error: e instanceof Error ? e.message : String(e),
      });
      return jsonError("Invalid JSON body.", 400);
    }

    const persona = RoadmapRequestSchema.parse(body);

    // Do not persist free-form typed answers; they are only used to shape generation.
    const { topicAnswersTyped, ...personaToPersist } = persona;

    const smartModel = process.env.AI_MODEL_SMART;
    if (!smartModel) {
      console.error(`[roadmap:${requestId}] Missing AI_MODEL_SMART`);
      return jsonError("Missing AI_MODEL_SMART env var.", 500);
    }

    const supabase = createSupabaseServerClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error(`[roadmap:${requestId}] Supabase getUser failed`, {
        error: userErr.message,
      });
      return jsonError(userErr.message, 401);
    }
    const userId = userData.user?.id;
    const isAnonymous = (userData.user as any)?.is_anonymous === true;

    if (!userId || isAnonymous) {
      console.error(`[roadmap:${requestId}] No real user session`, {
        hasUser: Boolean(userId),
        isAnonymous,
      });
      return jsonError("Please sign in to generate a roadmap.", 401);
    }

    const prompt = roadmapPrompt(persona); // includes typed overrides for generation only.

    const first = await aiChat({
      model: smartModel,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      temperature: 0.3,
    });

    const roadmapJson = await (async () => {
      try {
        return await parseWithZodOrThrow(first.text, RoadmapSchema);
      } catch (err) {
        console.error(`[roadmap:${requestId}] AI roadmap parse failed; retrying once`, {
          error: err instanceof Error ? err.message : String(err),
          aiTextPreview: String(first.text).slice(0, 500),
        });

        const repair = jsonRepairPrompt(
          first.text,
          '{"title":"...","description":"...","chapters":[{"title":"...","description":"...","guides":[{"title":"..."}]}]}'
        );
        const second = await aiChat({
          model: smartModel,
          messages: [
            { role: "system", content: repair.system },
            { role: "user", content: repair.user },
          ],
          temperature: 0,
        });

        return await parseWithZodOrThrow(second.text, RoadmapSchema);
      }
    })();

    // Insert roadmap
    const { data: roadmapRow, error: roadmapErr } = await supabase
      .from("roadmaps")
      .insert({
        user_id: userId,
        topic: persona.topic,
        title: roadmapJson.title,
        description: roadmapJson.description,
        persona: personaToPersist as RoadmapRequest,
      })
      .select("id")
      .single();

    if (roadmapErr) {
      console.error(`[roadmap:${requestId}] Supabase insert roadmaps failed`, {
        error: roadmapErr.message,
      });
      return jsonError(roadmapErr.message, 500);
    }

    const roadmapId = roadmapRow.id as string;

    // Insert chapters
    const chaptersToInsert = roadmapJson.chapters.map((ch, idx) => ({
      roadmap_id: roadmapId,
      position: idx,
      title: ch.title,
      description: ch.description ?? "",
      status: pickChapterStatus(idx),
    }));

    const { data: chapterRows, error: chaptersErr } = await supabase
      .from("chapters")
      .insert(chaptersToInsert)
      .select("id, position")
      .order("position", { ascending: true });

    if (chaptersErr) {
      console.error(`[roadmap:${requestId}] Supabase insert chapters failed`, {
        error: chaptersErr.message,
      });
      return jsonError(chaptersErr.message, 500);
    }

    // Insert guides (stubs)
    const chapterIdByPosition = new Map<number, string>(
      (chapterRows ?? []).map((r: any) => [r.position, r.id])
    );

    const guidesToInsert: Array<any> = [];
    roadmapJson.chapters.forEach((ch, chapterIdx) => {
      const chapterId = chapterIdByPosition.get(chapterIdx);
      if (!chapterId) return;

      ch.guides.forEach((g, guideIdx) => {
        guidesToInsert.push({
          chapter_id: chapterId,
          position: guideIdx,
          title: g.title,
          status: pickGuideStatus(chapterIdx, guideIdx),
        });
      });
    });

    const { error: guidesErr } = await supabase
      .from("guides")
      .insert(guidesToInsert);

    if (guidesErr) {
      console.error(`[roadmap:${requestId}] Supabase insert guides failed`, {
        error: guidesErr.message,
      });
      return jsonError(guidesErr.message, 500);
    }

    return Response.json({ roadmapId });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : `Invalid request: ${String(err)}`;

    console.error(`[roadmap:${requestId}] Request failed`, {
      error: msg,
    });

    // zod parse
    if (
      msg.toLowerCase().includes("invalid") ||
      msg.toLowerCase().includes("expected")
    ) {
      return jsonError(`Invalid request: ${msg}`);
    }

    // AI failures
    if (
      err instanceof Error &&
      (err.message.includes("Could not find valid JSON") ||
        err.message.startsWith("AI request failed") ||
        err.message.includes("AI response"))
    ) {
      return jsonError("AI request failed. Please try again.", 502);
    }

    return jsonError(toPublicErrorMessage(err), 500);
  }
}
