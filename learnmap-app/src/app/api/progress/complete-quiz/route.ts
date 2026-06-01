import { createSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, toPublicErrorMessage } from "@/lib/errors";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = (await req.json()) as unknown;
    } catch (e) {
      console.error(`[complete-quiz:${requestId}] Invalid JSON body`, {
        error: e instanceof Error ? e.message : String(e),
      });
      return jsonError("Invalid JSON body.", 400);
    }

    const chapterId =
      typeof (body as any)?.chapterId === "string" ? (body as any).chapterId.trim() : "";

    if (!chapterId) return jsonError("Please provide chapterId.", 400);

    const supabase = createSupabaseServerClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error(`[complete-quiz:${requestId}] Supabase getUser failed`, {
        error: userErr.message,
      });
      return jsonError(userErr.message, 401);
    }
    const userId = userData.user?.id;
    const isAnonymous = (userData.user as any)?.is_anonymous === true;
    if (!userId || isAnonymous) {
      return jsonError("Please sign in to save progress.", 401);
    }

    // Load chapter + verify ownership.
    const { data: chapter, error: chapterErr } = await supabase
      .from("chapters")
      .select("id, position, roadmap_id")
      .eq("id", chapterId)
      .single();

    if (chapterErr) return jsonError(chapterErr.message, 500);

    const { data: roadmap, error: roadmapErr } = await supabase
      .from("roadmaps")
      .select("id, user_id")
      .eq("id", chapter.roadmap_id)
      .single();

    if (roadmapErr) return jsonError(roadmapErr.message, 500);
    if (roadmap.user_id !== userId) return jsonError("Not authorized.", 403);

    // Mark quiz complete
    const { error: quizUpdateErr } = await supabase
      .from("quizzes")
      .update({ status: "complete" })
      .eq("chapter_id", chapterId);

    if (quizUpdateErr) return jsonError(quizUpdateErr.message, 500);

    // Mark chapter complete
    const { error: chapterUpdateErr } = await supabase
      .from("chapters")
      .update({ status: "complete" })
      .eq("id", chapterId);

    if (chapterUpdateErr) return jsonError(chapterUpdateErr.message, 500);

    // Unlock next chapter
    const nextPos = Number(chapter.position) + 1;
    const { data: nextChapter } = await supabase
      .from("chapters")
      .select("id, status")
      .eq("roadmap_id", chapter.roadmap_id)
      .eq("position", nextPos)
      .maybeSingle();

    if (nextChapter?.id && nextChapter.status === "locked") {
      const { error: unlockErr } = await supabase
        .from("chapters")
        .update({ status: "available" })
        .eq("id", nextChapter.id);

      if (unlockErr) return jsonError(unlockErr.message, 500);
    }

    return Response.json({ nextChapterId: nextChapter?.id ?? null });
  } catch (err) {
    console.error(`[complete-quiz:${requestId}] Request failed`, {
      error: err instanceof Error ? err.message : String(err),
    });
    return jsonError(toPublicErrorMessage(err), 500);
  }
}
