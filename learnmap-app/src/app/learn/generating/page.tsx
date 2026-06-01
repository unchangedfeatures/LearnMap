"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { postJson } from "@/lib/http/json";
import { readWizardState } from "@/lib/storage/wizard";

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

export default function LearnGeneratingPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [stage, setStage] = useState<
    "Starting session" | "Generating roadmap" | "Saving roadmap" | "Redirecting"
  >("Starting session");
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const state = useMemo(() => readWizardState(), []);

  async function run() {
    setError("");
    setTimedOut(false);
    setBusy(true);

    const timeout = window.setTimeout(() => {
      setTimedOut(true);
    }, 20000);

    try {
      if (!state.topic || !state.topicQuestions || !state.topicAnswers || !state.profile) {
        router.replace("/learn");
        return;
      }

      setStage("Starting session");

      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user || (data.user as any).is_anonymous === true) {
        router.replace("/auth?next=/learn/generating");
        return;
      }

      setStage("Generating roadmap");

      const typedRaw = window.sessionStorage.getItem("learnmap:wizard:typed");
      const typed = typedRaw ? (JSON.parse(typedRaw) as Record<string, string>) : {};

      const payload = {
        topic: state.topic,
        topicAnswers: state.topicAnswers,
        topicAnswersTyped: typed,
        learningStyle: state.profile.learningStyle,
        goal: state.profile.goal,
        extraContext: state.profile.extraContext || "",
      };

      const res = await postJson<{ roadmapId: string }>("/api/ai/roadmap", payload);

      setStage("Saving roadmap");

      // Cleanup ephemeral typed answers.
      window.sessionStorage.removeItem("learnmap:wizard:typed");

      setStage("Redirecting");

      // Go to the newly created roadmap.
      router.replace(`/roadmap/${res.roadmapId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate roadmap.");
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  const pct =
    stage === "Starting session"
      ? 20
      : stage === "Generating roadmap"
      ? 55
      : stage === "Saving roadmap"
      ? 75
      : 95;

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Desktop */}
      <div className="hidden lg:block">
        <header className="fixed top-0 left-0 right-0 h-20 bg-[color:var(--surface)]/90 backdrop-blur-xl border-b border-[color:var(--outline-variant)]/20 z-40">
          <div className="mx-auto max-w-[var(--lm-max-width)] h-full px-5 lg:px-[var(--lm-margin)] flex items-center justify-between">
            <Link
              href="/learn/profile"
              className="flex items-center gap-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] font-semibold transition-colors"
            >
              <MaterialSymbol name="arrow_back" />
              Back
            </Link>

            <div className="flex-1 max-w-md mx-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[color:var(--muted-foreground)]">
                  Step 4 of 4
                </span>
                <span className="text-sm font-bold text-[color:var(--primary)]">
                  {pct}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-[color:var(--surface-container-highest)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[color:var(--primary-container)] transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
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

        <main className="container mx-auto max-w-[var(--lm-max-width)] px-5 lg:px-[var(--lm-margin)] pt-32 pb-40 min-h-screen flex flex-col items-center">
          <div className="text-center max-w-2xl mb-10">
            <h1 className="text-[44px] font-extrabold text-[color:var(--on-surface)] mb-4">
              Your roadmap is generating
            </h1>
            <p className="text-[18px] text-[color:var(--muted-foreground)]">
              {stage}…
            </p>
          </div>

          {error ? (
            <div className="w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="font-semibold">Something went wrong</div>
              <div className="mt-1">{error}</div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setAttempt((n) => n + 1)}
                  className="h-11 px-5 rounded-lg bg-[color:var(--primary)] text-white font-semibold disabled:opacity-60"
                >
                  Retry
                </button>
                <Link
                  href="/learn/profile"
                  className="h-11 px-5 rounded-lg border border-[color:var(--outline-variant)] bg-white font-semibold text-[color:var(--primary)] inline-flex items-center justify-center"
                >
                  Edit answers
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
              <div className="relative h-40 w-full overflow-hidden rounded-[20px] bg-[rgba(67,97,238,0.06)]">
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute left-10 top-10 h-12 w-12 rounded-full bg-[rgba(99,57,219,0.9)]" />
                  <div className="absolute left-6 top-6 h-28 w-28 animate-spin rounded-full border border-[rgba(116,118,134,0.25)]" />
                  <div className="absolute right-14 bottom-10 h-8 w-8 rounded-full bg-[rgba(67,97,238,0.9)]" />
                </div>

                <div className="absolute bottom-5 left-6 right-6">
                  <div className="h-2 overflow-hidden rounded-full bg-[rgba(67,97,238,0.12)]">
                    <div
                      className="h-full rounded-full bg-[color:var(--primary)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[color:var(--muted-foreground)]">
                    <span>AI working</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </div>

              {timedOut ? (
                <div className="mt-6 rounded-xl border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] p-4">
                  <div className="font-semibold">Still working…</div>
                  <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                    If this doesn’t finish soon, you can retry.
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setAttempt((n) => n + 1)}
                      className="h-11 px-5 rounded-lg bg-[color:var(--primary)] text-white font-semibold disabled:opacity-60"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </main>
      </div>

      {/* Mobile (keep previous layout) */}
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
            4 of 4
          </div>
          <div className="w-6" />
        </header>

        <main className="mx-auto flex w-full max-w-[390px] flex-col gap-6 px-5 pt-10 pb-10">
          <div className="lm-card p-6">
            <div className="text-sm font-semibold">Generating your roadmap…</div>
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              {stage}…
            </p>

            {!error && (
              <div className="mt-5">
                <div className="relative h-32 w-full overflow-hidden rounded-[16px] bg-[rgba(67,97,238,0.06)]">
                  <div className="absolute inset-0 opacity-60">
                    <div className="absolute left-6 top-8 h-10 w-10 rounded-full bg-[rgba(99,57,219,0.9)]" />
                    <div className="absolute left-3 top-5 h-24 w-24 animate-spin rounded-full border border-[rgba(116,118,134,0.25)]" />
                    <div className="absolute right-10 bottom-8 h-6 w-6 rounded-full bg-[rgba(67,97,238,0.9)]" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 h-2 overflow-hidden rounded-full bg-[rgba(67,97,238,0.12)]">
                    <div
                      className="h-full rounded-full bg-[color:var(--primary)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {timedOut && (
                  <div className="mt-3 rounded-xl border border-[color:var(--border)] bg-white p-3 text-sm">
                    <div className="font-semibold">Still working…</div>
                    <div className="mt-1 text-[color:var(--muted-foreground)]">
                      If this doesn’t finish soon, you can retry.
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="lm-btn-primary h-10 px-4 text-sm font-semibold"
                        onClick={() => setAttempt((n) => n + 1)}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
