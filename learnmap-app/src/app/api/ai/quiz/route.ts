import { aiChat } from "@/lib/ai/client";
import { parseWithZodOrThrow } from "@/lib/ai/parse";
import { QuizSchema } from "@/lib/ai/schemas";
import { jsonRepairPrompt, quizPrompt } from "@/lib/ai/prompts";
import { jsonError, toPublicErrorMessage } from "@/lib/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function truncate(s: string, max: number) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = (await req.json()) as unknown;
    } catch (e) {
      console.error(`[quiz:${requestId}] Invalid JSON body`, {
        error: e instanceof Error ? e.message : String(e),
      });
      return jsonError("Invalid JSON body.", 400);
    }

    const chapterId =
      typeof (body as any)?.chapterId === "string" ? (body as any).chapterId.trim() : "";

    if (!chapterId) return jsonError("Please provide chapterId.", 400);

    const smartModel = process.env.AI_MODEL_SMART;
    if (!smartModel) {
      console.error(`[quiz:${requestId}] Missing AI_MODEL_SMART`);
      return jsonError("Missing AI_MODEL_SMART env var.", 500);
    }

    const supabase = createSupabaseServerClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error(`[quiz:${requestId}] Supabase getUser failed`, {
        error: userErr.message,
      });
      return jsonError(userErr.message, 401);
    }
    const userId = userData.user?.id;
    const isAnonymous = (userData.user as any)?.is_anonymous === true;
    if (!userId || isAnonymous) {
      return jsonError("Please sign in to generate quizzes.", 401);
    }

    // Load chapter
    const { data: chapter, error: chapterErr } = await supabase
      .from("chapters")
      .select("id, title, roadmap_id")
      .eq("id", chapterId)
      .single();

    if (chapterErr) {
      console.error(`[quiz:${requestId}] Select chapter failed`, {
        error: chapterErr.message,
      });
      return jsonError(chapterErr.message, 500);
    }

    // Verify ownership via roadmap
    const { data: roadmap, error: roadmapErr } = await supabase
      .from("roadmaps")
      .select("id, user_id, topic, persona")
      .eq("id", chapter.roadmap_id)
      .single();

    if (roadmapErr) {
      console.error(`[quiz:${requestId}] Select roadmap failed`, {
        error: roadmapErr.message,
      });
      return jsonError(roadmapErr.message, 500);
    }

    if (roadmap.user_id !== userId) return jsonError("Not authorized.", 403);

    // Existing quiz?
    const { data: existing } = await supabase
      .from("quizzes")
      .select("id, status, payload")
      .eq("chapter_id", chapterId)
      .maybeSingle();

    if (existing?.payload) {
      return Response.json({ quizId: existing.id, payload: existing.payload });
    }

    const { data: guides, error: guidesErr } = await supabase
      .from("guides")
      .select("title, content_md, position, status")
      .eq("chapter_id", chapterId)
      .order("position", { ascending: true });

    if (guidesErr) {
      console.error(`[quiz:${requestId}] Select guides failed`, {
        error: guidesErr.message,
      });
      return jsonError(guidesErr.message, 500);
    }

    const guideTitles = (guides || []).map((g: any) => String(g.title));
    const guideTextSnippets = (guides || [])
      .filter((g: any) => typeof g.content_md === "string" && g.content_md.trim())
      .slice(0, 6)
      .map((g: any) => truncate(g.content_md, 400));

    const prompt = quizPrompt({
      topic: roadmap.topic,
      chapterTitle: chapter.title,
      persona: roadmap.persona,
      guideTitles,
      guideTextSnippets,
    });

    const first = await aiChat({
      model: smartModel,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      temperature: 0.2,
    });

    const quizJson = await (async () => {
      try {
        return await parseWithZodOrThrow(first.text, QuizSchema);
      } catch (err) {
        console.error(`[quiz:${requestId}] AI quiz parse failed; retrying once`, {
          error: err instanceof Error ? err.message : String(err),
          aiTextPreview: String(first.text).slice(0, 500),
        });

        const repair = jsonRepairPrompt(
          first.text,
          '{"questions":[{"question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}]}'
        );

        const second = await aiChat({
          model: smartModel,
          messages: [
            { role: "system", content: repair.system },
            { role: "user", content: repair.user },
          ],
          temperature: 0,
        });

        return await parseWithZodOrThrow(second.text, QuizSchema);
      }
    })();

    // Upsert quiz row. (No unique constraint in schema.sql, so do best-effort.)
    if (existing?.id) {
      const { error: updErr } = await supabase
        .from("quizzes")
        .update({ status: "available", payload: quizJson })
        .eq("id", existing.id);

      if (updErr) return jsonError(updErr.message, 500);
      return Response.json({ quizId: existing.id, payload: quizJson });
    }

    const { data: inserted, error: insErr } = await supabase
      .from("quizzes")
      .insert({ chapter_id: chapterId, status: "available", payload: quizJson })
      .select("id")
      .single();

    if (insErr) {
      console.error(`[quiz:${requestId}] Insert quiz failed`, {
        error: insErr.message,
      });
      return jsonError(insErr.message, 500);
    }

    return Response.json({ quizId: inserted.id, payload: quizJson });
  } catch (err) {
    console.error(`[quiz:${requestId}] Request failed`, {
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
