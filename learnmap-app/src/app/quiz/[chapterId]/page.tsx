import { aiChat } from "@/lib/ai/client";
import Link from "next/link";
import { parseWithZodOrThrow } from "@/lib/ai/parse";
import { jsonRepairPrompt, quizPrompt } from "@/lib/ai/prompts";
import { QuizSchema } from "@/lib/ai/schemas";
import AppShell from "@/lib/ui/AppShell";
import { requireRealUser } from "@/lib/auth/require-user";

import QuizClient from "./QuizClient";

function QuizError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function truncate(s: string, max: number) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

export default async function QuizPage({
  params,
}: {
  params: { chapterId: string };
}) {
  const { supabase } = await requireRealUser("/roadmaps");

  const { data: chapter, error: chapterErr } = await supabase
    .from("chapters")
    .select("id, title, position, roadmap_id")
    .eq("id", params.chapterId)
    .single();

  if (chapterErr) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] p-5">
        <QuizError message={chapterErr.message} />
      </div>
    );
  }

  const { data: roadmap, error: roadmapErr } = await supabase
    .from("roadmaps")
    .select("id, title")
    .eq("id", chapter.roadmap_id)
    .single();

  if (roadmapErr) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] p-5">
        <QuizError message={roadmapErr.message} />
      </div>
    );
  }

  const { data: quizRow, error: quizErr } = await supabase
    .from("quizzes")
    .select("id, payload, status")
    .eq("chapter_id", chapter.id)
    .maybeSingle();

  let payload = quizRow?.payload as any;
  let loadError = quizErr?.message || "";

  if (!loadError && !payload) {
    try {
      const { data: roadmapFull, error: roadmapFullErr } = await supabase
        .from("roadmaps")
        .select("id, user_id, topic, persona")
        .eq("id", chapter.roadmap_id)
        .single();

      if (roadmapFullErr) throw new Error(roadmapFullErr.message);

      const { data: guides, error: guidesErr } = await supabase
        .from("guides")
        .select("title, content_md, position")
        .eq("chapter_id", chapter.id)
        .order("position", { ascending: true });

      if (guidesErr) throw new Error(guidesErr.message);

      const guideTitles = (guides || []).map((g: any) => String(g.title));
      const guideTextSnippets = (guides || [])
        .filter((g: any) => typeof g.content_md === "string" && g.content_md.trim())
        .slice(0, 6)
        .map((g: any) => truncate(g.content_md, 400));

      const prompt = quizPrompt({
        topic: roadmapFull.topic,
        chapterTitle: chapter.title,
        persona: roadmapFull.persona,
        guideTitles,
        guideTextSnippets,
      });

      const smartModel = process.env.AI_MODEL_SMART;
      if (!smartModel) throw new Error("Missing AI_MODEL_SMART env var.");

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
        } catch {
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

      if (quizRow?.id) {
        const { error: updErr } = await supabase
          .from("quizzes")
          .update({ status: "available", payload: quizJson })
          .eq("id", quizRow.id);
        if (updErr) throw new Error(updErr.message);
      } else {
        const { error: insErr } = await supabase
          .from("quizzes")
          .insert({ chapter_id: chapter.id, status: "available", payload: quizJson });
        if (insErr) throw new Error(insErr.message);
      }

      payload = quizJson;
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Quiz generation failed.";
    }
  }

  return (
    <AppShell title="Quiz" subtitle={`Chapter ${Number(chapter.position) + 1}` }>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
            QUIZ
          </div>
          <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-[-0.02em]">
            {chapter.title}
          </h1>
        </div>

        <Link
          href={`/roadmap/${roadmap.id}/chapter/${chapter.id}`}
          className="text-sm font-semibold text-[color:var(--primary)]"
        >
          ← Back
        </Link>
      </div>

      <div className="mt-5">
        {loadError ? <QuizError message={loadError} /> : null}

        {payload ? (
          <QuizClient chapterId={chapter.id} roadmapId={roadmap.id} payload={payload} />
        ) : (
          <div className="lm-card p-6">
            <div className="text-sm font-semibold">Generating your quiz…</div>
            <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              This usually takes a few seconds.
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[rgba(67,97,238,0.12)]">
              <div className="h-full w-1/2 rounded-full bg-[color:var(--primary)] animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
