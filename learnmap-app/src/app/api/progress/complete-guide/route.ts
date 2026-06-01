import { createSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, toPublicErrorMessage } from "@/lib/errors";

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = (await req.json()) as unknown;
    } catch (e) {
      console.error(`[complete-guide:${requestId}] Invalid JSON body`, {
        error: e instanceof Error ? e.message : String(e),
      });
      return jsonError("Invalid JSON body.", 400);
    }

    const guideId =
      typeof (body as any)?.guideId === "string" ? (body as any).guideId.trim() : "";

    if (!guideId) return jsonError("Please provide guideId.", 400);

    const supabase = createSupabaseServerClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      console.error(`[complete-guide:${requestId}] Supabase getUser failed`, {
        error: userErr.message,
      });
      return jsonError(userErr.message, 401);
    }
    const userId = userData.user?.id;
    const isAnonymous = (userData.user as any)?.is_anonymous === true;
    if (!userId || isAnonymous) {
      return jsonError("Please sign in to save progress.", 401);
    }

    // Load guide and verify ownership via joins.
    const { data: guide, error: guideErr } = await supabase
      .from("guides")
      .select("id, status, position, chapter_id")
      .eq("id", guideId)
      .single();

    if (guideErr) {
      console.error(`[complete-guide:${requestId}] Select guide failed`, {
        error: guideErr.message,
      });
      return jsonError(guideErr.message, 500);
    }

    const { data: chapter, error: chapterErr } = await supabase
      .from("chapters")
      .select("id, status, position, roadmap_id")
      .eq("id", guide.chapter_id)
      .single();

    if (chapterErr) {
      console.error(`[complete-guide:${requestId}] Select chapter failed`, {
        error: chapterErr.message,
      });
      return jsonError(chapterErr.message, 500);
    }

    const { data: roadmap, error: roadmapErr } = await supabase
      .from("roadmaps")
      .select("id, user_id")
      .eq("id", chapter.roadmap_id)
      .single();

    if (roadmapErr) {
      console.error(`[complete-guide:${requestId}] Select roadmap failed`, {
        error: roadmapErr.message,
      });
      return jsonError(roadmapErr.message, 500);
    }

    if (roadmap.user_id !== userId) return jsonError("Not authorized.", 403);

    // 1) Mark guide complete
    const { error: updateGuideErr } = await supabase
      .from("guides")
      .update({ status: "complete" })
      .eq("id", guideId);

    if (updateGuideErr) {
      console.error(`[complete-guide:${requestId}] Update guide failed`, {
        error: updateGuideErr.message,
      });

      const msg = updateGuideErr.message.toLowerCase();
      if (msg.includes("row level security") || msg.includes("policy")) {
        return jsonError(
          "Database policy blocked progress saving. Re-apply supabase/schema.sql UPDATE policies in Supabase, then retry.",
          500
        );
      }

      return jsonError(updateGuideErr.message, 500);
    }

    // 2) Insert progress row if not already present
    const { data: existingProgress } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", userId)
      .eq("guide_id", guideId)
      .maybeSingle();

    if (!existingProgress) {
      const { error: progressErr } = await supabase.from("progress").insert({
        user_id: userId,
        guide_id: guideId,
        status: "complete",
        xp: 50,
      });

      if (progressErr) {
        console.error(`[complete-guide:${requestId}] Insert progress failed`, {
          error: progressErr.message,
        });
        return jsonError(progressErr.message, 500);
      }
    }

    // 3) Unlock next guide in the chapter
    const nextPos = Number(guide.position) + 1;
    const { data: nextGuide, error: nextGuideErr } = await supabase
      .from("guides")
      .select("id, status")
      .eq("chapter_id", guide.chapter_id)
      .eq("position", nextPos)
      .maybeSingle();

    if (nextGuideErr) {
      console.error(`[complete-guide:${requestId}] Select next guide failed`, {
        error: nextGuideErr.message,
      });
      return jsonError(nextGuideErr.message, 500);
    }

    let chapterComplete = false;
    if (nextGuide?.id) {
      if (nextGuide.status === "locked") {
        const { error: unlockErr } = await supabase
          .from("guides")
          .update({ status: "available" })
          .eq("id", nextGuide.id);

        if (unlockErr) {
          console.error(`[complete-guide:${requestId}] Unlock next guide failed`, {
            error: unlockErr.message,
          });

          const msg = unlockErr.message.toLowerCase();
          if (msg.includes("row level security") || msg.includes("policy")) {
            return jsonError(
              "Database policy blocked guide unlocking. Re-apply supabase/schema.sql UPDATE policies in Supabase, then retry.",
              500
            );
          }

          return jsonError(unlockErr.message, 500);
        }
      }
    } else {
      // No next guide -> chapter complete for guide reading
      chapterComplete = true;

      if (chapter.status !== "ready_for_quiz" && chapter.status !== "complete") {
        const { error: chapterUpdateErr } = await supabase
          .from("chapters")
          .update({ status: "ready_for_quiz" })
          .eq("id", chapter.id);

        if (chapterUpdateErr) {
          console.error(`[complete-guide:${requestId}] Update chapter failed`, {
            error: chapterUpdateErr.message,
          });

          const msg = chapterUpdateErr.message.toLowerCase();
          if (msg.includes("row level security") || msg.includes("policy")) {
            return jsonError(
              "Database policy blocked chapter status update. Re-apply supabase/schema.sql UPDATE policies in Supabase, then retry.",
              500
            );
          }

          return jsonError(chapterUpdateErr.message, 500);
        }
      }
    }

    return Response.json({
      nextGuideId: nextGuide?.id ?? null,
      chapterComplete,
    });
  } catch (err) {
    console.error(`[complete-guide:${requestId}] Request failed`, {
      error: err instanceof Error ? err.message : String(err),
    });
    return jsonError(toPublicErrorMessage(err), 500);
  }
}
