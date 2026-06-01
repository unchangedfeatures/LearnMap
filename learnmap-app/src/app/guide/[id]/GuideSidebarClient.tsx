"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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

type GuideStub = {
  id: string;
  title: string;
  status: string;
  position: number;
};

function pct(n: number) {
  return `${Math.round(Math.max(0, Math.min(1, n)) * 100)}%`;
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function GuideSidebarClient({
  roadmapId,
  chapterId,
  chapterTitle,
  chapterNumber,
  guideId,
  guideTitle,
  guideNumber,
}: {
  roadmapId: string;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  guideId: string;
  guideTitle: string;
  guideNumber: number;
}) {
  const [guides, setGuides] = useState<GuideStub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase
          .from("guides")
          .select("id, title, status, position")
          .eq("chapter_id", chapterId)
          .order("position", { ascending: true });

        if (!alive) return;
        if (error) throw error;
        setGuides(((data || []) as any[]) as GuideStub[]);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load guides.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [chapterId]);

  const completedGuides = guides.filter((g) => g.status === "complete").length;
  const progress = guides.length ? completedGuides / guides.length : 0;

  return (
    <div className="flex flex-col gap-6">
      <SidebarSection title="Chapter">
        <div className="rounded-2xl bg-[color:var(--surface-container-lowest)] border border-[color:var(--outline-variant)]/30 p-4 shadow-sm">
          <div className="text-sm font-semibold text-[color:var(--primary)] line-clamp-2">
            Chapter {chapterNumber}: {chapterTitle}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[color:var(--muted-foreground)]">
            <span>{loading ? "Loading…" : `Guide ${guideNumber} of ${guides.length || 0}`}</span>
            <span>{loading ? "" : `${completedGuides}/${guides.length || 0} complete`}</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[color:var(--surface-container)] overflow-hidden">
            <div
              className="h-full bg-[color:var(--primary)] transition-all"
              style={{ width: pct(progress) }}
            />
          </div>
        </div>

        <div className="mt-3">
          <Link
            href={`/roadmap/${roadmapId}/chapter/${chapterId}`}
            className="text-sm font-semibold text-[color:var(--primary)]"
          >
            ← Back to chapter
          </Link>
        </div>
      </SidebarSection>

      <SidebarSection title="Guides">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="space-y-1">
          {loading ? (
            <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-4 text-xs font-semibold text-[color:var(--muted-foreground)]">
              Loading guides…
            </div>
          ) : null}

          {!loading
            ? guides.map((g) => {
                const isActive = g.id === guideId;
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
                    className={
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors " +
                      (isActive
                        ? "bg-[rgba(67,97,238,0.10)] border border-[rgba(67,97,238,0.20)] text-[color:var(--primary)] font-semibold"
                        : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-container-high)] hover:text-[color:var(--primary)]")
                    }
                  >
                    <MaterialSymbol
                      name={complete ? "check_circle" : "play_circle"}
                      filled={complete || isActive}
                    />
                    <span className="line-clamp-1">{g.title}</span>
                  </Link>
                );
              })
            : null}

          <div className="mt-4">
            <Link href="/roadmaps" className="text-sm font-semibold text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]">
              ← All roadmaps
            </Link>
          </div>
        </div>
      </SidebarSection>
    </div>
  );
}
