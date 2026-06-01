"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { readWizardState, updateWizardState } from "@/lib/storage/wizard";

const TOPICS = [
  { emoji: "🧮", label: "Mathematics" },
  { emoji: "💻", label: "Computer Science" },
  { emoji: "🎨", label: "Design" },
  { emoji: "🌍", label: "World History" },
  { emoji: "🔬", label: "Biology" },
  { emoji: "📈", label: "Economics" },
  { emoji: "🧠", label: "Psychology" },
  { emoji: "🗣️", label: "Languages" },
  { emoji: "🎵", label: "Music Theory" },
  { emoji: "📸", label: "Photography" },
  { emoji: "🍳", label: "Culinary Arts" },
  { emoji: "🚀", label: "Physics" },
];

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

export default function LearnTopicPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOPICS;
    return TOPICS.filter((t) => t.label.toLowerCase().includes(q));
  }, [query]);

  function onContinue() {
    const typed = query.trim();
    const chosen = selected.trim();

    const topic = typed || chosen;
    if (!topic) return;

    // If topic changes, clear downstream state to avoid mismatched questions/answers.
    const prev = readWizardState();
    if (prev.topic && prev.topic !== topic) {
      updateWizardState({
        topic,
        topicQuestions: undefined,
        topicAnswers: undefined,
        profile: undefined,
      });
    } else {
      updateWizardState({ topic });
    }

    router.push("/learn/questions");
  }

  const hasTopic = Boolean(selected || query.trim());

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Desktop (matches desktop-only comp direction) */}
      <div className="hidden lg:block">
        <header className="mx-auto w-full max-w-[800px] px-5 lg:px-[var(--lm-margin)] pt-10">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-wider text-[color:var(--primary)] uppercase">
              Step 1 of 4
            </div>
            <div className="text-sm font-semibold text-[color:var(--outline)]">
              Select Topic
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-[color:var(--surface-container)] overflow-hidden">
            <div className="h-full w-1/4 bg-[color:var(--primary)] rounded-full transition-all duration-700" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[var(--lm-max-width)] px-5 lg:px-[var(--lm-margin)] pt-10 pb-32 flex flex-col items-center">
          <section className="text-center mb-10 max-w-[720px]">
            <h1 className="text-[48px] font-extrabold tracking-[-0.02em]">
              What do you want to learn?
            </h1>
            <p className="mt-3 text-[18px] text-[color:var(--muted-foreground)]">
              Select a topic to generate your personalized learning roadmap.
            </p>
          </section>

          <div className="w-full max-w-[640px] mb-12">
            <div className="relative flex items-center h-[64px] bg-[color:var(--surface-container-lowest)] border border-[color:var(--outline-variant)] rounded-xl px-5 transition-all duration-300 focus-within:ring-4 focus-within:ring-[color:var(--primary)]/10 focus-within:border-[color:var(--primary)]">
              <span className="text-[24px] text-[color:var(--outline)]" aria-hidden>
                <MaterialSymbol name="search" />
              </span>
              <input
                className="w-full bg-transparent border-none focus:outline-none text-[18px] px-3 placeholder:text-[color:var(--outline)]/60"
                placeholder="Search for a topic (e.g., Quantum Physics, Photography...)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selected) setSelected("");
                }}
              />
              <div className="hidden sm:flex items-center gap-2 text-[color:var(--outline)]/40">
                <kbd className="px-2 py-[2px] bg-[color:var(--surface-container-high)] rounded text-xs font-semibold">
                  ⌘
                </kbd>
                <kbd className="px-2 py-[2px] bg-[color:var(--surface-container-high)] rounded text-xs font-semibold">
                  K
                </kbd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1200px]">
            {filtered.map((t) => {
              const isSelected = selected === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    setSelected(t.label);
                    if (query) setQuery("");
                  }}
                  className={
                    "group relative flex flex-col p-8 rounded-xl border text-left transition-all duration-300 overflow-hidden shadow-[0_4px_20px_-2px_rgba(35,70,213,0.05)] " +
                    (isSelected
                      ? "border-[color:var(--primary)] bg-[rgba(67,97,238,0.05)]"
                      : "border-[color:var(--outline-variant)] bg-[color:var(--surface-container-lowest)] hover:-translate-y-1 hover:shadow-[0_10px_30px_-4px_rgba(35,70,213,0.08)]")
                  }
                >
                  <div
                    className={
                      "w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-colors " +
                      (isSelected
                        ? "bg-[color:var(--primary)] text-white"
                        : "bg-[rgba(67,97,238,0.05)] text-[color:var(--primary)] group-hover:bg-[color:var(--primary)] group-hover:text-white")
                    }
                  >
                    <span className="text-[28px]" aria-hidden>
                      {t.emoji}
                    </span>
                  </div>
                  <div className="text-[24px] font-semibold">{t.label}</div>
                  <div className="mt-2 text-sm text-[color:var(--muted-foreground)] opacity-80">
                    Personalized chapter-by-chapter roadmap.
                  </div>

                  <span
                    className={
                      "absolute right-4 top-4 text-[color:var(--primary)] transition-opacity " +
                      (isSelected ? "opacity-100" : "opacity-0")
                    }
                    aria-hidden="true"
                  >
                    <MaterialSymbol name="check_circle" filled />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full max-w-[1200px] mt-14 flex items-center justify-between border-t border-[color:var(--outline-variant)] pt-8">
            <Link
              href="/roadmaps"
              className="flex items-center gap-2 text-[color:var(--muted-foreground)] font-semibold hover:text-[color:var(--primary)] transition-colors"
            >
              <span className="text-[20px]" aria-hidden>
                <MaterialSymbol name="arrow_back" />
              </span>
              <span>Back</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-[16px] text-[color:var(--muted-foreground)]">
                {hasTopic ? "1 topic selected" : "0 topics selected"}
              </div>
              <button
                type="button"
                onClick={onContinue}
                disabled={!hasTopic}
                className={
                  "h-12 px-10 rounded-lg font-semibold shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed " +
                  (hasTopic
                    ? "bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-container)]"
                    : "bg-[color:var(--outline-variant)] text-[color:var(--on-surface-variant)]")
                }
              >
                Continue
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile (keep previous flow intact) */}
      <div className="lg:hidden">
        <header className="mx-auto flex h-[52px] w-full max-w-[390px] items-center justify-between px-5">
          <div className="font-semibold text-[color:var(--primary)]">LearnMap</div>
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
            1 of 4
          </div>
        </header>

        <div className="mx-auto w-full max-w-[390px] px-5">
          <div className="flex gap-1 pb-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={
                  "h-2 flex-1 rounded-full " +
                  (i === 0
                    ? "bg-[color:var(--primary)]"
                    : "bg-[rgba(67,97,238,0.1)]")
                }
              />
            ))}
          </div>
        </div>

        <main className="mx-auto flex w-full max-w-[390px] flex-col gap-6 px-5 pt-6 pb-[100px]">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.02em]">
              What do you want to learn?
            </h1>
            <p className="mt-2 text-[16px] text-[color:var(--muted-foreground)]">
              Select a topic to generate your personalized learning roadmap.
            </p>
          </div>

          <div className="relative">
            <input
              className="lm-input w-full px-4 py-3 pl-11 text-[16px]"
              placeholder="Search topics..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selected) setSelected("");
              }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]">
              ⌕
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((t) => {
              const isSelected = selected === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    setSelected(t.label);
                    if (query) setQuery("");
                  }}
                  className={
                    "lm-card group relative flex items-center gap-2 px-4 py-3 text-left transition-all " +
                    (isSelected
                      ? "border-2 border-[color:var(--primary)] ring-2 ring-[color:var(--primary)]/20 bg-[color:var(--primary)]/5 shadow-[0_4px_20px_rgba(67,97,238,0.15)]"
                      : "border border-[color:var(--border)] hover:-translate-y-[1px] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]")
                  }
                >
                  <span className="text-[20px]">{t.emoji}</span>
                  <span className="text-sm font-semibold">{t.label}</span>
                  <span
                    className={
                      "absolute right-3 top-3 text-[color:var(--primary)] transition-opacity " +
                      (isSelected ? "opacity-100" : "opacity-0")
                    }
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        <div className="pointer-events-none fixed bottom-0 left-0 w-full bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)] to-transparent pb-[34px] pt-4">
          <div className="pointer-events-auto mx-auto w-full max-w-[390px] px-5">
            <button
              type="button"
              onClick={onContinue}
              className="lm-btn-primary h-[56px] w-full font-bold shadow-[0_4px_20px_rgba(35,70,213,0.15)] transition-opacity hover:opacity-95 active:scale-[0.99] disabled:opacity-60"
              disabled={!hasTopic}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
