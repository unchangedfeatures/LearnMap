"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { postJson } from "@/lib/http/json";

type QuizPayload = {
  questions: Array<{
    question: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }>;
};

export default function QuizClient({
  chapterId,
  roadmapId,
  payload,
}: {
  chapterId: string;
  roadmapId: string;
  payload: QuizPayload;
}) {
  const router = useRouter();

  const questions = useMemo(() => payload.questions || [], [payload]);

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  const q = questions[idx];
  const total = questions.length;
  const passThreshold = 4; // Week 1 MVP rule: 4/5 to pass.

  async function finishQuiz() {
    setBusy(true);
    setError("");
    try {
      await postJson("/api/progress/complete-quiz", { chapterId });
      router.replace(`/roadmap/${roadmapId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to complete quiz.";
      const lower = msg.toLowerCase();
      if (lower.includes("please sign in")) {
        setError("Please sign in again to save progress.");
      } else if (lower.includes("not authorized")) {
        setError("You don’t have access to this roadmap.");
      } else if (lower.includes("row level security") || lower.includes("policy")) {
        setError(
          "Saving failed due to a database policy. Apply the UPDATE policies from supabase/schema.sql in Supabase, then retry."
        );
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  function resetQuiz() {
    setIdx(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setDone(false);
    setBusy(false);
    setError("");
  }

  function onPick(n: number) {
    if (revealed) return;
    if (!q) return;
    setSelected(n);
    setRevealed(true);

    if (n === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  function onNext() {
    if (busy) return;
    if (!revealed) return;

    if (idx >= total - 1) {
      setDone(true);
      return;
    }

    setIdx((n) => n + 1);
    setSelected(null);
    setRevealed(false);
  }

  if (!total) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        No quiz questions found.
      </div>
    );
  }

  if (done) {
    const passed = correctCount >= passThreshold;

    return (
      <div className="lm-card p-5">
        <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
          RESULTS
        </div>

        <div className="mt-2 text-[18px] font-bold leading-snug">You scored {correctCount}/{total}</div>

        <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
          Passing score is {passThreshold}/{total}.
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          {passed ? (
            <button
              type="button"
              className="lm-btn-primary h-12 w-full text-sm font-semibold disabled:opacity-50"
              onClick={finishQuiz}
              disabled={busy}
            >
              {busy ? "Saving…" : "Continue"}
            </button>
          ) : (
            <>
              <div className="rounded-xl border border-[color:var(--border)] bg-white p-3 text-sm">
                <div className="font-semibold">Not quite.</div>
                <div className="mt-1 text-[color:var(--muted-foreground)]">
                  You need at least {passThreshold} correct answers to unlock the next chapter.
                </div>
              </div>

              <button
                type="button"
                className="lm-btn-primary h-12 w-full text-sm font-semibold"
                onClick={resetQuiz}
                disabled={busy}
              >
                Try again
              </button>

              <button
                type="button"
                className="h-12 w-full rounded-full border border-[color:var(--outline-variant)]/30 bg-white px-6 text-sm font-semibold text-[color:var(--on-surface)] hover:bg-[color:var(--surface-container-low)] transition-colors disabled:opacity-50"
                onClick={() => router.replace(`/roadmap/${roadmapId}`)}
                disabled={busy}
              >
                Back to roadmap
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        No quiz questions found.
      </div>
    );
  }

  return (
    <div className="lm-card p-5">
      <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
        QUESTION {idx + 1} / {total}
      </div>
      <div className="mt-2 text-[18px] font-bold leading-snug">{q.question}</div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correctIndex;

          const classes =
            "rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-all " +
            (!revealed
              ? "border-[color:var(--border)] bg-white hover:-translate-y-[1px]"
              : isCorrect
              ? "border-[rgba(0,101,41,0.9)] bg-[rgba(0,101,41,0.08)]"
              : isSelected
              ? "border-red-400 bg-red-50"
              : "border-[color:var(--border)] bg-white opacity-70");

          return (
            <button
              key={opt}
              type="button"
              className={classes}
              onClick={() => onPick(i)}
              disabled={busy}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-white p-3 text-sm">
          <div className="font-semibold">Explanation</div>
          <div className="mt-1 text-[color:var(--muted-foreground)]">
            {q.explanation}
          </div>
        </div>
      )}

      <div className="mt-5">
        <button
          type="button"
          className="lm-btn-primary h-12 w-full text-sm font-semibold disabled:opacity-50"
          onClick={onNext}
          disabled={!revealed || busy}
        >
          {idx >= total - 1 ? "See results" : "Next"}
        </button>
      </div>
    </div>
  );
}
