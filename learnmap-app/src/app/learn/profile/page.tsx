"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { readWizardState, updateWizardState } from "@/lib/storage/wizard";

type LearningStyle = "examples" | "logic" | "stories" | "direct";

type Goal = "exam" | "career" | "curiosity" | "specific_topic";

const MAX_EXTRA = 300;

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

export default function LearnProfilePage() {
  const router = useRouter();

  const state = useMemo(() => readWizardState(), []);
  const topic = state.topic || "";

  const [goal, setGoal] = useState<Goal | null>(state.profile?.goal ?? null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(
    state.profile?.learningStyle ?? null
  );
  const [extraContext, setExtraContext] = useState(
    state.profile?.extraContext || ""
  );

  const [error, setError] = useState<string>("");

  const canContinue = Boolean(goal && learningStyle);

  function onContinue() {
    setError("");

    if (!topic) {
      router.replace("/learn");
      return;
    }

    if (!goal || !learningStyle) {
      setError("Please pick a goal and learning style to continue.");
      return;
    }

    const extra = extraContext.trim().slice(0, MAX_EXTRA);

    updateWizardState({
      profile: {
        goal,
        learningStyle,
        extraContext: extra,
      },
    });

    router.push("/learn/generating");
  }

  function onChangeExtra(next: string) {
    setExtraContext(next.slice(0, MAX_EXTRA));
  }

  const progress = 3 / 4;

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Desktop */}
      <div className="hidden lg:block">
        <header className="fixed top-0 left-0 right-0 h-20 bg-[color:var(--surface)]/90 backdrop-blur-xl border-b border-[color:var(--outline-variant)]/20 z-40">
          <div className="mx-auto max-w-[var(--lm-max-width)] h-full px-5 lg:px-[var(--lm-margin)] flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] font-semibold transition-colors"
              onClick={() => router.back()}
            >
              <MaterialSymbol name="arrow_back" />
              Back
            </button>

            <div className="flex-1 max-w-md mx-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[color:var(--muted-foreground)]">
                  Step 3 of 4
                </span>
                <span className="text-sm font-bold text-[color:var(--primary)]">
                  {pct(progress)} Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-[color:var(--surface-container-highest)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[color:var(--primary)] transition-all duration-700 ease-out"
                  style={{ width: pct(progress) }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[color:var(--surface-container-high)] transition-colors text-[color:var(--muted-foreground)] active:scale-95"
                aria-label="Help"
              >
                <MaterialSymbol name="help_outline" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[color:var(--surface-container-high)] transition-colors text-[color:var(--muted-foreground)] active:scale-95"
                aria-label="Theme"
              >
                <MaterialSymbol name="light_mode" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center px-5 lg:px-[var(--lm-margin)] pt-32 pb-40">
          <div className="max-w-4xl w-full text-center mb-16">
            <h1 className="text-[48px] font-extrabold mb-3">
              Why are you learning this?
            </h1>
            <p className="text-[18px] text-[color:var(--muted-foreground)] max-w-2xl mx-auto">
              We’ll use this to set the right pace and recommend the best path.
            </p>
          </div>

          {error ? (
            <div className="w-full max-w-5xl mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
            {([
              {
                v: "curiosity",
                title: "Just Curious",
                desc: "Explore new topics at a relaxed pace without the pressure of deadlines.",
                icon: "lightbulb",
                meta: "5–10 min/day",
              },
              {
                v: "career",
                title: "Grow my career",
                desc: "Build skills you can apply at work with projects and real examples.",
                icon: "rocket_launch",
                meta: "20–30 min/day",
              },
              {
                v: "exam",
                title: "Pass an exam",
                desc: "Focus on the fundamentals with targeted practice and checkpoints.",
                icon: "school",
                meta: "30–60 min/day",
              },
            ] as const).map((o) => {
              const selected = goal === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setGoal(o.v)}
                  className={
                    "group flex flex-col items-start p-8 rounded-xl border transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.06)] " +
                    (selected
                      ? "bg-[rgba(67,97,238,0.06)] border-[color:var(--primary)]"
                      : "bg-[color:var(--surface-container-lowest)] border-[color:var(--outline-variant)] hover:border-[color:var(--primary)]")
                  }
                >
                  <div className={
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-transform " +
                    (selected
                      ? "bg-[rgba(67,97,238,0.18)] text-[color:var(--primary)]"
                      : "bg-[rgba(67,97,238,0.10)] text-[color:var(--primary)] group-hover:scale-110")
                  }>
                    <MaterialSymbol name={o.icon} filled={selected} />
                  </div>
                  <div className="text-[22px] font-semibold mb-2">{o.title}</div>
                  <div className="text-sm text-[color:var(--muted-foreground)] text-left mb-6">
                    {o.desc}
                  </div>
                  <div className="mt-auto inline-flex items-center px-3 py-1.5 bg-[color:var(--surface-container)] rounded-full text-xs font-semibold text-[color:var(--muted-foreground)]">
                    <span className="mr-2" aria-hidden>
                      <MaterialSymbol name="schedule" />
                    </span>
                    {o.meta}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="w-full max-w-5xl rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
            <div className="text-sm font-semibold">Learning style</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                { v: "examples", label: "Real examples" },
                { v: "logic", label: "Logic & theory" },
                { v: "stories", label: "Stories & analogies" },
                { v: "direct", label: "Straight to the point" },
              ] as const).map((o) => {
                const selected = learningStyle === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setLearningStyle(o.v)}
                    className={
                      "rounded-xl border px-3 py-2 text-sm font-semibold transition-all " +
                      (selected
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                        : "border-[color:var(--outline-variant)] bg-white")
                    }
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <label className="text-sm font-semibold" htmlFor="extra">
                Extra context (optional)
              </label>
              <textarea
                id="extra"
                className="lm-input mt-3 w-full p-4 text-sm"
                rows={3}
                placeholder="Anything else? e.g. 'I have 2 weeks', 'I'm a beginner'"
                value={extraContext}
                onChange={(e) => onChangeExtra(e.target.value)}
                maxLength={MAX_EXTRA}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--muted-foreground)]">
                <div>Optional</div>
                <div>
                  {Math.min(MAX_EXTRA, extraContext.length)}/{MAX_EXTRA}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[color:var(--outline-variant)] pt-6">
              <Link
                href="/learn/questions"
                className="text-sm font-semibold text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]"
              >
                ← Back to questions
              </Link>

              <button
                type="button"
                onClick={onContinue}
                disabled={!canContinue}
                className="h-12 px-10 rounded-lg font-semibold shadow-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-container)] transition-all active:scale-95 disabled:opacity-60"
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile (keep existing flow) */}
      <div className="lg:hidden">
        <header className="mx-auto flex h-[52px] w-full max-w-[390px] items-center justify-between px-5">
          <button
            type="button"
            className="text-[color:var(--primary)]"
            onClick={() => router.back()}
          >
            ←
          </button>
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
            3 of 4
          </div>
          <div className="w-6" />
        </header>

        <div className="mx-auto w-full max-w-[390px] px-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(67,97,238,0.1)]">
            <div className="h-full w-3/4 rounded-full bg-[color:var(--primary)]" />
          </div>
        </div>

        <main className="mx-auto flex w-full max-w-[390px] flex-col gap-6 px-5 pt-6 pb-[120px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em]">
              Your learning profile
            </h1>
            <p className="text-[16px] text-[color:var(--muted-foreground)]">
              This helps LearnMap tailor your roadmap.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="lm-card p-4">
            <div className="text-sm font-semibold">I want to…</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                { v: "exam", label: "Pass an exam" },
                { v: "career", label: "Grow my career" },
                { v: "curiosity", label: "Satisfy my curiosity" },
                { v: "specific_topic", label: "Master one specific thing" },
              ] as const).map((o) => {
                const selected = goal === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setGoal(o.v)}
                    className={
                      "rounded-xl border px-3 py-2 text-sm font-semibold transition-all " +
                      (selected
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                        : "border-[color:var(--border)] bg-white")
                    }
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lm-card p-4">
            <div className="text-sm font-semibold">I learn best through…</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                { v: "examples", label: "Real examples" },
                { v: "logic", label: "Logic & theory" },
                { v: "stories", label: "Stories & analogies" },
                { v: "direct", label: "Straight to the point" },
              ] as const).map((o) => {
                const selected = learningStyle === o.v;
                return (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setLearningStyle(o.v)}
                    className={
                      "rounded-xl border px-3 py-2 text-sm font-semibold transition-all " +
                      (selected
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                        : "border-[color:var(--border)] bg-white")
                    }
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lm-card p-4">
            <label className="text-sm font-semibold" htmlFor="extra">
              Extra context (optional)
            </label>
            <textarea
              id="extra"
              className="lm-input mt-3 w-full p-3 text-sm"
              rows={3}
              placeholder="Anything else? e.g. 'I have 2 weeks', 'I'm a beginner'"
              value={extraContext}
              onChange={(e) => onChangeExtra(e.target.value)}
              maxLength={MAX_EXTRA}
            />
            <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--muted-foreground)]">
              <div>Optional</div>
              <div>
                {Math.min(MAX_EXTRA, extraContext.length)}/{MAX_EXTRA}
              </div>
            </div>
          </div>
        </main>

        <div className="pointer-events-none fixed bottom-0 left-0 w-full bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)] to-transparent pb-[34px] pt-4">
          <div className="pointer-events-auto mx-auto w-full max-w-[390px] px-5">
            <button
              type="button"
              onClick={onContinue}
              className="lm-btn-primary h-[56px] w-full font-bold shadow-[0_4px_20px_rgba(35,70,213,0.15)] disabled:opacity-50"
              disabled={!canContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
