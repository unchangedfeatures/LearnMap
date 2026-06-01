import Link from "next/link";

import AppShell from "@/lib/ui/AppShell";
import { requireRealUser } from "@/lib/auth/require-user";

function ChapterError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function MaterialSymbol({ name, filled }: { name: string; filled?: boolean }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function pct(n: number) {
  const v = Math.max(0, Math.min(1, n));
  return `${Math.round(v * 100)}%`;
}

export default async function ChapterPage({
  params,
}: {
  params: { id: string; chapterId: string };
}) {
  const { supabase } = await requireRealUser("/roadmaps");

  const { data: chapter, error: chapterErr } = await supabase
    .from("chapters")
    .select("id, title, description, status, position, roadmap_id")
    .eq("id", params.chapterId)
    .single();

  if (chapterErr) {
    return (
      <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)] p-5">
        <ChapterError message={chapterErr.message} />
      </div>
    );
  }

  if (!chapter || chapter.roadmap_id !== params.id) {
    return (
      <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)] p-5">
        <ChapterError message="Chapter not found." />
      </div>
    );
  }

  const { data: guides, error: guidesErr } = await supabase
    .from("guides")
    .select("id, title, status, position")
    .eq("chapter_id", chapter.id)
    .order("position", { ascending: true });

  const guideList = (guides || []) as any[];
  const completed = guideList.filter((g) => g.status === "complete").length;
  const progress = guideList.length ? completed / guideList.length : 0;

  const chapterNumber = Number(chapter.position) + 1;

  const sidebar = (
    <div className="flex flex-col gap-6">
      <section>
        <div className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
          Chapter progress
        </div>
        <div className="mt-2 rounded-2xl bg-[color:var(--surface-container-lowest)] border border-[color:var(--outline-variant)]/30 p-4 shadow-sm">
          <div className="text-sm font-semibold text-[color:var(--primary)] line-clamp-2">
            Chapter {chapterNumber}: {chapter.title}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[color:var(--muted-foreground)]">
            <span>{pct(progress)} complete</span>
            <span>
              {completed}/{guideList.length || 0} guides
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[color:var(--surface-container)] overflow-hidden">
            <div
              className="h-full bg-[color:var(--primary)] transition-all"
              style={{ width: pct(progress) }}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
          Guides
        </div>

        {guidesErr ? (
          <div className="mt-2 text-xs font-semibold text-[color:var(--muted-foreground)]">
            {guidesErr.message}
          </div>
        ) : null}

        <div className="mt-2 space-y-1">
          {guideList.map((g) => {
            const locked = g.status === "locked";
            const complete = g.status === "complete";

            if (locked) {
              return (
                <div
                  key={g.id}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[color:var(--muted-foreground)] opacity-60"
                >
                  <MaterialSymbol name="lock" />
                  <span className="line-clamp-1">{g.title}</span>
                </div>
              );
            }

            return (
              <Link
                key={g.id}
                href={`/guide/${g.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-container-high)] hover:text-[color:var(--primary)] transition-colors"
              >
                <MaterialSymbol
                  name={complete ? "check_circle" : "play_circle"}
                  filled={complete}
                />
                <span className="line-clamp-1">{g.title}</span>
              </Link>
            );
          })}

          <div className="mt-4">
            <Link
              href={`/roadmap/${params.id}`}
              className="text-sm font-semibold text-[color:var(--primary)]"
            >
              ← Back to roadmap
            </Link>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <AppShell title="Chapter" subtitle={`Chapter ${chapterNumber}`} sidebarContent={sidebar}>
      <div className="-mx-5 lg:-mx-[var(--lm-margin)] -my-10">
        <div className="sticky top-20 z-10 h-1 bg-[color:var(--surface-container-high)]">
          <div
            className="h-full bg-[color:var(--primary)] shadow-[0_0_12px_rgba(35,70,213,0.35)] transition-all"
            style={{ width: pct(progress) }}
          />
        </div>

        <div className="flex bg-[color:var(--surface)] min-h-[calc(100vh-80px-4px)]">
          {/* Center content */}
          <section className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[900px] px-5 lg:px-12 py-10">
              <div className="mb-6">
                <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
                  Chapter {chapterNumber}
                </div>
                <h1 className="mt-2 text-[36px] font-semibold tracking-[-0.01em]">
                  {chapter.title}
                </h1>
                {chapter.description ? (
                  <p className="mt-3 text-[18px] text-[color:var(--muted-foreground)]">
                    {chapter.description}
                  </p>
                ) : null}
              </div>

              <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold">Next actions</div>
                <div className="mt-3 flex flex-col gap-3">
                  {guideList.map((g) => {
                    const locked = g.status === "locked";
                    const available = g.status === "available";
                    const complete = g.status === "complete";

                    const icon = locked
                      ? "lock"
                      : complete
                      ? "check_circle"
                      : "play_circle";

                    const inner = (
                      <div
                        className={
                          "rounded-xl border p-4 transition-all " +
                          (locked ? "opacity-60 bg-[color:var(--surface-container-low)]" : "bg-white")
                        }
                        style={{
                          borderColor:
                            "color-mix(in oklab, var(--outline-variant), transparent 35%)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
                              GUIDE {Number(g.position) + 1}
                            </div>
                            <div className="mt-1 text-sm font-semibold">{g.title}</div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--muted-foreground)]">
                            <MaterialSymbol name={icon} filled={available || complete} />
                            <span>
                              {complete
                                ? "Complete"
                                : available
                                ? "Available"
                                : "Locked"}
                            </span>
                          </div>
                        </div>

                        {locked ? (
                          <div className="mt-3 text-xs font-semibold text-[color:var(--muted-foreground)]">
                            Complete the previous guide to unlock.
                          </div>
                        ) : null}
                      </div>
                    );

                    if (locked) return <div key={g.id}>{inner}</div>;

                    return (
                      <Link
                        key={g.id}
                        href={`/guide/${g.id}`}
                        className="block hover:-translate-y-[1px] transition-transform"
                      >
                        {inner}
                      </Link>
                    );
                  })}
                </div>

                {chapter.status === "ready_for_quiz" || chapter.status === "complete" ? (
                  <div className="mt-8">
                    <Link
                      href={`/quiz/${chapter.id}`}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-white px-6 font-semibold shadow-[0_4px_12px_rgba(35,70,213,0.2)] hover:bg-[color:var(--primary-container)]"
                    >
                      Take chapter quiz
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
