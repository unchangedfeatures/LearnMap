"use client";

import { useEffect, useState } from "react";

import GuideContentClient from "./GuideContentClient";
import MarkCompleteClient from "./MarkCompleteClient";

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

export default function GuidePageClient({
  roadmapId,
  chapterId,
  chapterTitle,
  chapterNumber,
  guideId,
  guideTitle,
  guideNumber,
  initialContentMd,
}: {
  roadmapId: string;
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  guideId: string;
  guideTitle: string;
  guideNumber: number;
  initialContentMd: string;
}) {
  const [showRightRail, setShowRightRail] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("learnmap:guide:rightRail");
      if (raw === "hide") setShowRightRail(false);
    } catch {
      // ignore
    }
  }, []);

  function toggleRightRail() {
    setShowRightRail((v) => {
      const next = !v;
      try {
        window.localStorage.setItem("learnmap:guide:rightRail", next ? "show" : "hide");
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div className="flex bg-[color:var(--surface)] min-h-[calc(100vh-80px-4px)]">
      {/* Center reading column */}
      <section id="lm-guide-scroll" className="flex-1 overflow-y-auto">
        <div
          className={
            "mx-auto px-5 lg:px-12 py-10 " +
            (showRightRail ? "max-w-[820px]" : "max-w-[980px]")
          }
        >
          <div className="mb-8 flex items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[color:var(--muted-foreground)]">
                <span className="text-[18px]" aria-hidden>
                  <MaterialSymbol name="school" />
                </span>
                <span className="text-xs font-semibold tracking-widest uppercase">
                  Chapter {chapterNumber} · Guide {guideNumber}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <h1 className="text-[36px] font-semibold tracking-[-0.01em]">
                  {guideTitle}
                </h1>
                {generating ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--outline-variant)]/30 bg-white px-3 py-1 text-xs font-semibold text-[color:var(--muted-foreground)]">
                    <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--primary)] animate-pulse" aria-hidden />
                    Generating
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[18px] text-[color:var(--muted-foreground)]">
                {chapterTitle}
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRightRail}
                className="h-10 rounded-full border border-[color:var(--outline-variant)]/30 bg-white px-4 text-sm font-semibold text-[color:var(--on-surface)] hover:bg-[color:var(--surface-container-low)] transition-colors"
              >
                {showRightRail ? "Hide resources" : "Show resources"}
              </button>
            </div>
          </div>

          <GuideContentClient
            guideId={guideId}
            initialContentMd={initialContentMd}
            onBusyChange={setGenerating}
          />

          <div className="mt-10">
            <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
              <MarkCompleteClient guideId={guideId} chapterId={chapterId} />
            </div>
          </div>
        </div>
      </section>

      {/* Right rail */}
      {showRightRail ? (
        <aside className="hidden lg:block w-80 shrink-0 border-l border-[color:var(--outline-variant)]/20 bg-[color:var(--surface-container-low)]/30 overflow-y-auto p-6 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold tracking-wider text-[color:var(--outline)] uppercase">
                Related resources
              </div>
              <span className="text-[18px] text-[color:var(--outline)]" aria-hidden>
                <MaterialSymbol name="open_in_new" />
              </span>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-white border border-[color:var(--outline-variant)]/30 p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(67,97,238,0.10)] flex items-center justify-center text-[color:var(--primary)]">
                    <MaterialSymbol name="movie" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold line-clamp-1">Visualizing this concept</div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="text-xs font-semibold tracking-wider text-[color:var(--outline)] uppercase mb-3">
              Key terms
            </div>
            <div className="flex flex-wrap gap-2">
              {["Concept", "Example", "Practice"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-[rgba(101,97,240,0.08)] text-[color:var(--primary)] border border-[rgba(101,97,240,0.18)] text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-[color:var(--primary-container)]/10 border border-[color:var(--primary-container)]/20 rounded-3xl p-6">
            <div className="text-[20px] font-semibold">Stuck?</div>
            <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Soon you’ll be able to ask LearnMap AI to explain sections in simpler terms.
            </div>
            <button
              type="button"
              className="mt-4 h-11 w-full rounded-xl bg-[color:var(--primary)] text-white font-semibold inline-flex items-center justify-center gap-2"
              disabled
            >
              <MaterialSymbol name="smart_toy" />
              Explain to me
            </button>
          </section>
        </aside>
      ) : null}

      {/* Floating restore button when hidden */}
      {!showRightRail ? (
        <div className="fixed bottom-6 right-6 hidden lg:block">
          <button
            type="button"
            onClick={toggleRightRail}
            className="h-12 rounded-full bg-white border border-[color:var(--outline-variant)]/30 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-sm font-semibold text-[color:var(--on-surface)] inline-flex items-center gap-2"
          >
            <span className="text-[20px] text-[color:var(--muted-foreground)]" aria-hidden>
              <MaterialSymbol name="menu_open" />
            </span>
            Show resources
          </button>
        </div>
      ) : null}
    </div>
  );
}
