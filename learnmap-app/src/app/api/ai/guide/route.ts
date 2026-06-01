import { aiChat } from "@/lib/ai/client";
import { guidePrompt } from "@/lib/ai/prompts";
import { jsonError, toPublicErrorMessage } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = (await req.json()) as unknown;
    } catch (e) {
      console.error(`[guide:${requestId}] Invalid JSON body`, {
        error: e instanceof Error ? e.message : String(e),
      });
      return jsonError("Invalid JSON body.", 400);
    }

    const guideId =
      typeof (body as any)?.guideId === "string" ? (body as any).guideId.trim() : "";

    if (!guideId) return jsonError("Please provide guideId.", 400);

    const smartModel = process.env.AI_MODEL_SMART;
    if (!smartModel) {
      console.error(`[guide:${requestId}] Missing AI_MODEL_SMART`);
      return jsonError("Missing AI_MODEL_SMART env var.", 500);
    }

    const supabase = createSupabaseServerClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error(`[guide:${requestId}] Supabase getUser failed`, {
        error: userErr.message,
      });
      return jsonError(userErr.message, 401);
    }
    const userId = userData.user?.id;
    const isAnonymous = (userData.user as any)?.is_anonymous === true;
    if (!userId || isAnonymous) {
      return jsonError("Please sign in to generate guides.", 401);
    }

    // Load guide stub
    const { data: guide, error: guideErr } = await supabase
      .from("guides")
      .select("id, title, content_md, chapter_id")
      .eq("id", guideId)
      .single();

    if (guideErr) {
      console.error(`[guide:${requestId}] Supabase select guide failed`, {
        error: guideErr.message,
      });
      return jsonError(guideErr.message, 500);
    }

    if (!guide) return jsonError("Guide not found.", 404);

    if (typeof guide.content_md === "string" && guide.content_md.trim()) {
      return Response.json({
        guideId: guide.id,
        title: guide.title,
        contentMd: guide.content_md,
      });
    }

    // Verify ownership and get chapter + roadmap
    const { data: chapter, error: chapterErr } = await supabase
      .from("chapters")
      .select("id, title, roadmap_id")
      .eq("id", guide.chapter_id)
      .single();

    if (chapterErr) {
      console.error(`[guide:${requestId}] Supabase select chapter failed`, {
        error: chapterErr.message,
      });
      return jsonError(chapterErr.message, 500);
    }

    const { data: roadmap, error: roadmapErr } = await supabase
      .from("roadmaps")
      .select("id, user_id, title, topic, persona")
      .eq("id", chapter.roadmap_id)
      .single();

    if (roadmapErr) {
      console.error(`[guide:${requestId}] Supabase select roadmap failed`, {
        error: roadmapErr.message,
      });
      return jsonError(roadmapErr.message, 500);
    }

    if (roadmap.user_id !== userId) {
      return jsonError("Not authorized.", 403);
    }

    const prompt = guidePrompt({
      topic: roadmap.topic,
      roadmapTitle: roadmap.title,
      chapterTitle: chapter.title,
      guideTitle: guide.title,
      persona: roadmap.persona,
    });

    const first = await aiChat({
      model: smartModel,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      temperature: 0.2,
    });

    const contentMd = String(first.text || "").trim() + "\n";

    if (!contentMd.trim()) {
      return jsonError("AI returned empty guide content. Please try again.", 502);
    }

    // Basic safety: block obvious HTML. Guides should be markdown only.
    if (contentMd.includes("<script") || contentMd.includes("<iframe") || contentMd.includes("<style")) {
      return jsonError("AI returned unsafe HTML. Please try again.", 502);
    }

    const { error: updateErr } = await supabase
      .from("guides")
      .update({ content_md: contentMd })
      .eq("id", guideId);

    if (updateErr) {
      console.error(`[guide:${requestId}] Supabase update guide failed`, {
        error: updateErr.message,
      });

      const msg = updateErr.message.toLowerCase();
      if (msg.includes("row level security") || msg.includes("policy")) {
        return jsonError(
          "Database policy blocked guide caching. Re-apply supabase/schema.sql UPDATE policies in Supabase, then retry.",
          500
        );
      }

      return jsonError(updateErr.message, 500);
    }

    return Response.json({ guideId, title: guide.title, contentMd });
  } catch (err) {
    console.error(`[guide:${requestId}] Request failed`, {
      error: err instanceof Error ? err.message : String(err),
    });

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
