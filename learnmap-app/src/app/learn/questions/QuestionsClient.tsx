"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { postJson } from "@/lib/http/json";
import {
  readCachedTopicQuestions,
  readWizardState,
  updateWizardState,
  writeCachedTopicQuestions,
  writeWizardState,
} from "@/lib/storage/wizard";

type TopicQuestionsResponse = {
  questions: Array<{
    id: "q1" | "q2" | "q3" | "q4";
    question: string;
    options: string[];
  }>;
};

const ORDER: Array<"q1" | "q2" | "q3" | "q4"> = ["q1", "q2", "q3", "q4"];

function clampStep(n: number) {
  if (Number.isNaN(n)) return 1;
  return Math.min(4, Math.max(1, n));
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

export default function QuestionsClient() {
  const router = useRouter();
  const search = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<TopicQuestionsResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [typed, setTyped] = useState<Record<string, string>>({});

  const OTHER_LABEL = "Something else (type)";

  const topic = useMemo(() => readWizardState().topic || "", []);

  const step = clampStep(Number(search.get("step") || "1"));
  const activeId = ORDER[step - 1];

  useEffect(() => {
    (async () => {
      if (!topic) {
        router.replace("/learn");
        return;
      }

      const state = readWizardState();
      if (state.topicQuestions?.questions?.length) {
        setData(state.topicQuestions as any);
        setAnswers(state.topicAnswers || {});
        setTyped({});
        setLoading(false);
        return;
      }

      // Cache: if user already asked the same topic before, reuse it.
      const cached = readCachedTopicQuestions(topic);
      if (cached?.questions?.length) {
        updateWizardState({ topicQuestions: cached as any });
        setData(cached as any);
        setAnswers(state.topicAnswers || {});
        setTyped({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await postJson<TopicQuestionsResponse>(
          "/api/ai/topic-questions",
          { topic }
        );

        updateWizardState({ topicQuestions: res as any });
        writeCachedTopicQuestions(topic, res as any);

        setData(res);
        setAnswers({});
        setTyped({});
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load questions.");
        setLoading(false);
      }
    })();
  }, [router, topic]);

  const activeQuestion = data?.questions?.find((q) => q.id === activeId) || null;

  const activeOptions = useMemo(() => {
    const opts = activeQuestion?.options || [];
    return opts.includes(OTHER_LABEL) ? opts : [...opts, OTHER_LABEL];
  }, [activeQuestion, OTHER_LABEL]);

  const otherSelected =
    activeQuestion?.id !== null && answers[activeId] === OTHER_LABEL;

  const otherValue = (typed[activeId] || "").trim();

  function goStep(next: number) {
    const url = new URL(window.location.href);
    url.searchParams.set("step", String(next));
    router.replace(url.pathname + "?" + url.searchParams.toString());
  }

  function onBack() {
    setError("");
    if (step <= 1) {
      router.back();
      return;
    }
    goStep(step - 1);
  }

  function onSelectOption(id: string, option: string) {
    setError("");

    setAnswers((prev) => ({
      ...prev,
      [id]: option,
    }));

    if (option !== OTHER_LABEL) {
      setTyped((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  function onContinue() {
    setError("");

    if (!activeQuestion) return;

    const selected = answers[activeQuestion.id] || "";
    if (!selected) {
      setError("Please pick an option to continue.");
      return;
    }

    if (selected === OTHER_LABEL) {
      const v = (typed[activeQuestion.id] || "").trim();
      if (!v) {
        setError("Please type your answer to continue.");
        return;
      }
    }

    if (step < 4) {
      goStep(step + 1);
      return;
    }

    // Step 4 complete: require all answers
    for (const id of ORDER) {
      if (!answers[id]) {
        setError("Please answer all 4 questions.");
        goStep(ORDER.indexOf(id) + 1);
        return;
      }
      if (answers[id] === OTHER_LABEL && !(typed[id] || "").trim()) {
        setError("Please type your answer to continue.");
        goStep(ORDER.indexOf(id) + 1);
        return;
      }
    }

    const state = readWizardState();
    // Persist only chip answers; typed answers are ephemeral.
    writeWizardState({ ...state, topicAnswers: answers });

    // Store typed answers in sessionStorage only for the immediate generation step,
    // and clear them after generating.
    window.sessionStorage.setItem(
      "learnmap:wizard:typed",
      JSON.stringify(typed)
    );

    router.push("/learn/profile");
  }

  const completion = Math.round((step / 4) * 100);

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Desktop */}
      <div className="hidden lg:block">
        <header className="fixed top-0 left-0 right-0 h-20 bg-[color:var(--surface)]/90 backdrop-blur-xl border-b border-[color:var(--outline-variant)]/20 z-40">
          <div className="mx-auto max-w-[var(--lm-max-width)] h-full px-5 lg:px-[var(--lm-margin)] flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] font-semibold transition-colors"
              onClick={onBack}
            >
              <MaterialSymbol name="arrow_back" />
              Back
            </button>

            <div className="flex-1 max-w-md mx-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[color:var(--muted-foreground)]">
                  Step {step} of 4
                </span>
                <span className="text-sm font-bold text-[color:var(--primary)]">
                  {completion}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-[color:var(--surface-container-highest)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[color:var(--primary-container)] transition-all duration-700 ease-out"
                  style={{ width: `${completion}%` }}
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

        <main className="mx-auto max-w-[var(--lm-max-width)] px-5 lg:px-[var(--lm-margin)] pt-32 pb-40 min-h-screen flex flex-col items-center">
          <div className="text-center max-w-2xl mb-16">
            <h1 className="text-[44px] font-extrabold text-[color:var(--on-surface)] mb-4">
              {activeQuestion?.question || "Quick questions"}
            </h1>
            <p className="text-[18px] text-[color:var(--muted-foreground)]">
              We’ll emphasize these areas in your personalized roadmap.
            </p>
            <div className="mt-3 text-sm text-[color:var(--muted-foreground)]">
              Topic: <span className="font-semibold">{topic}</span>
            </div>
          </div>

          {error && (
            <div className="w-full max-w-3xl mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !data ? (
            <div className="lm-card p-8 w-full max-w-3xl">
              <div className="text-sm font-semibold">
                Generating your quick questions…
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                This usually takes a few seconds.
              </div>
              <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[rgba(67,97,238,0.12)]">
                <div className="h-full w-1/2 rounded-full bg-[color:var(--primary)] animate-pulse" />
              </div>
            </div>
          ) : null}

          {!loading && data && !activeQuestion ? (
            <div className="w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Could not find question for step {step}.
            </div>
          ) : null}

          {!loading && activeQuestion ? (
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--lm-gutter)] mb-8">
                {activeOptions
                  .filter((o) => o !== OTHER_LABEL)
                  .map((opt) => {
                    const selectedOpt = answers[activeId] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onSelectOption(activeId, opt)}
                        className={
                          "group bg-[color:var(--surface-container-lowest)] p-8 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col items-center text-center cursor-pointer " +
                          (selectedOpt
                            ? "border-[color:var(--primary)] shadow-[0_0_0_4px_rgba(67,97,238,0.10)]"
                            : "border-transparent hover:border-[color:var(--primary-fixed-dim)]")
                        }
                      >
                        <div
                          className={
                            "w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-colors " +
                            (selectedOpt
                              ? "bg-[color:var(--primary)] text-white"
                              : "bg-[rgba(67,97,238,0.08)] text-[color:var(--primary)]")
                          }
                        >
                          <span
                            className="material-symbols-outlined text-[32px]"
                            aria-hidden
                          >
                            psychology
                          </span>
                        </div>
                        <div className="text-[18px] font-semibold text-[color:var(--on-surface)]">
                          {opt}
                        </div>
                      </button>
                    );
                  })}

                <button
                  type="button"
                  onClick={() => onSelectOption(activeId, OTHER_LABEL)}
                  className={
                    "group bg-[color:var(--surface-container-lowest)] p-8 rounded-[1.5rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center text-center cursor-pointer " +
                    (answers[activeId] === OTHER_LABEL
                      ? "border-[color:var(--primary)]"
                      : "border-[color:var(--outline-variant)] hover:border-[color:var(--primary-fixed-dim)]")
                  }
                >
                  <div className="w-16 h-16 rounded-full bg-[color:var(--surface-container)] flex items-center justify-center mb-5 text-[color:var(--outline)]">
                    <span
                      className="material-symbols-outlined text-[32px]"
                      aria-hidden
                    >
                      edit
                    </span>
                  </div>
                  <div className="text-[18px] font-semibold">Something else</div>
                  <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                    Type your own.
                  </div>

                  {answers[activeId] === OTHER_LABEL ? (
                    <div className="mt-4 w-full text-left">
                      <label
                        className="text-xs font-semibold text-[color:var(--muted-foreground)]"
                        htmlFor="other"
                      >
                        Type your answer
                      </label>
                      <input
                        id="other"
                        className="lm-input mt-2 w-full px-4 py-3 text-[16px]"
                        placeholder="Type your answer…"
                        value={typed[activeId] || ""}
                        onChange={(e) =>
                          setTyped((prev) => ({
                            ...prev,
                            [activeId]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ) : null}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-[color:var(--outline-variant)] pt-8">
                <div className="text-sm text-[color:var(--muted-foreground)]">
                  {otherSelected && !otherValue
                    ? "Type your custom answer to continue."
                    : ""}
                </div>
                <button
                  type="button"
                  onClick={onContinue}
                  className="h-12 px-10 rounded-lg font-semibold shadow-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-container)] transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* Mobile (original flow) */}
      <div className="lg:hidden">
        <header className="mx-auto flex h-[52px] w-full max-w-[390px] items-center justify-between px-5">
          <button
            type="button"
            className="text-[color:var(--primary)]"
            onClick={onBack}
          >
            ←
          </button>
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
            {step} of 4
          </div>
          <div className="w-6" />
        </header>

        <div className="mx-auto w-full max-w-[390px] px-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(67,97,238,0.1)]">
            <div
              className="h-full rounded-full bg-[color:var(--primary)] transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <main className="mx-auto flex w-full max-w-[390px] flex-col gap-6 px-5 pt-6 pb-[120px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em]">
              Quick questions
            </h1>
            <p className="text-[16px] text-[color:var(--muted-foreground)]">
              Answer {step} of 4.
            </p>
            <div className="text-sm text-[color:var(--muted-foreground)]">
              Topic: <span className="font-semibold">{topic}</span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && !data && (
            <div className="lm-card p-6">
              <div className="text-sm font-semibold">
                Generating your quick questions…
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                This usually takes a few seconds.
              </div>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[rgba(67,97,238,0.12)]">
                <div className="h-full w-1/2 rounded-full bg-[color:var(--primary)] animate-pulse" />
              </div>
            </div>
          )}

          {!loading && data && activeQuestion && (
            <div className="lm-card p-4">
              <div className="text-sm font-semibold">{activeQuestion.question}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeOptions.map((opt) => {
                  const selected = answers[activeQuestion.id] === opt;
                  const isOther = opt === OTHER_LABEL;

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={
                        "rounded-xl border px-3 py-2 text-sm font-semibold transition-colors " +
                        (selected
                          ? "border-[color:var(--primary)] bg-[rgba(67,97,238,0.08)] text-[color:var(--primary)]"
                          : "border-[color:var(--border)] bg-white text-[color:var(--foreground)] hover:border-[color:var(--primary)]")
                      }
                      onClick={() => onSelectOption(activeQuestion.id, opt)}
                    >
                      {isOther ? "Something else" : opt}
                    </button>
                  );
                })}
              </div>

              {otherSelected && (
                <div className="mt-3">
                  <label
                    className="text-xs font-semibold text-[color:var(--muted-foreground)]"
                    htmlFor="other"
                  >
                    Type your answer
                  </label>
                  <input
                    id="other"
                    className="lm-input mt-2 w-full px-4 py-3 text-[16px]"
                    placeholder="Type your answer…"
                    value={typed[activeId] || ""}
                    onChange={(e) =>
                      setTyped((prev) => ({
                        ...prev,
                        [activeId]: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          )}

          {!loading && data && !activeQuestion && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Could not find question for step {step}.
            </div>
          )}
        </main>

        <div className="pointer-events-none fixed bottom-0 left-0 w-full bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)] to-transparent pb-[34px] pt-4">
          <div className="pointer-events-auto mx-auto w-full max-w-[390px] px-5">
            <button
              type="button"
              onClick={onContinue}
              className="lm-btn-primary h-[56px] w-full font-bold shadow-[0_4px_20px_rgba(35,70,213,0.15)]"
              disabled={loading || !data}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
