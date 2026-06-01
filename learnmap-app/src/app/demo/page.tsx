import Link from "next/link";

import { demoGuideMarkdown, demoIntake, demoQuiz, demoRoadmap } from "@/lib/demo/demo-data";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[color:var(--outline-variant)]/25 bg-white p-6 shadow-[0_18px_50px_rgba(10,10,40,0.06)]">
      <div className="text-[12px] font-semibold tracking-wide text-[color:var(--muted-foreground)]">{subtitle}</div>
      <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.02em]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--outline-variant)]/35 bg-[color:var(--surface-container-low)] px-3 py-1 text-[13px] font-semibold text-[color:var(--on-surface)]">
      {label}
    </span>
  );
}

export default function DemoTourPage() {
  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      <header className="sticky top-0 z-20 border-b border-[color:var(--outline-variant)]/30 bg-[color:var(--surface)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[color:var(--primary)] text-white grid place-items-center font-extrabold">
              L
            </div>
            <div className="text-[16px] font-extrabold tracking-[-0.01em] text-[color:var(--primary)]">LearnMap</div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/learn"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--primary)] px-4 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(35,70,213,0.22)]"
            >
              Start a roadmap
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-5 py-10">
        <div className="rounded-3xl border border-[color:var(--outline-variant)]/25 bg-white p-8 shadow-[0_18px_50px_rgba(10,10,40,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--outline-variant)]/40 bg-[color:var(--surface-container-low)] px-3 py-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              travel_explore
            </span>
            Demo tour (no setup required)
          </div>
          <h1 className="mt-4 text-[34px] font-extrabold tracking-[-0.03em] leading-[1.1]">
            How LearnMap looks and feels
          </h1>
          <p className="mt-3 max-w-[80ch] text-[16px] leading-7 text-[color:var(--muted-foreground)]">
            This page is a recruiter-friendly walkthrough: it does not require Supabase, OAuth, or AI keys. The real app
            generates and stores roadmaps, guides, and quizzes — this tour just previews the UX and the product loop.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Pill label="Next.js App Router" />
            <Pill label="Supabase (RLS + OAuth)" />
            <Pill label="AI via provider-agnostic HTTP" />
            <Pill label="Zod-validated JSON" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Section title="1) Topic intake" subtitle="STEP 1">
            <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-[color:var(--surface-container-low)] p-4">
              <div className="text-[13px] font-semibold text-[color:var(--muted-foreground)]">Example topic</div>
              <div className="mt-2 text-[18px] font-extrabold">{demoIntake.topic}</div>
            </div>

            <div className="mt-4">
              <div className="text-[13px] font-semibold text-[color:var(--muted-foreground)]">
                AI clarifying questions (chips)
              </div>
              <div className="mt-3 grid gap-3">
                {demoIntake.questions.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-4"
                  >
                    <div className="text-[15px] font-extrabold">{item.q}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.answers.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center rounded-full border border-[color:var(--outline-variant)]/30 bg-[color:var(--surface-container-low)] px-3 py-1 text-[13px] font-semibold"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="2) Generated roadmap" subtitle="STEP 2">
            <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-5">
              <div className="text-[12px] font-semibold tracking-wide text-[color:var(--muted-foreground)]">TITLE</div>
              <div className="mt-1 text-[18px] font-extrabold">{demoRoadmap.title}</div>
              <p className="mt-2 text-[14px] leading-6 text-[color:var(--muted-foreground)]">{demoRoadmap.description}</p>

              <div className="mt-5 grid gap-3">
                {demoRoadmap.chapters.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-[color:var(--surface-container-low)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[15px] font-extrabold">{c.title}</div>
                      <span className="inline-flex items-center rounded-full bg-[color:var(--primary)]/10 px-3 py-1 text-[12px] font-semibold text-[color:var(--primary)]">
                        available
                      </span>
                    </div>

                    <ul className="mt-3 list-disc pl-5 text-[14px] leading-6 text-[color:var(--muted-foreground)]">
                      {c.guides.slice(0, 4).map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                      {c.guides.length > 4 ? <li>…</li> : null}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section title="3) Guide (Markdown)" subtitle="STEP 3">
            <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-[color:var(--surface-container-low)] p-4">
              <div className="text-[13px] font-semibold text-[color:var(--muted-foreground)]">Example excerpt</div>
              <pre className="mt-3 overflow-auto rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-4 text-[12px] leading-5">
{demoGuideMarkdown}
              </pre>
            </div>
            <div className="mt-4 text-[14px] leading-6 text-[color:var(--muted-foreground)]">
              In the real app, guide content is generated on demand and stored in Supabase. The UI renders Markdown with
              GFM support.
            </div>
          </Section>

          <Section title="4) Quiz + unlock" subtitle="STEP 4">
            <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-5">
              <div className="text-[12px] font-semibold tracking-wide text-[color:var(--muted-foreground)]">QUIZ</div>
              <div className="mt-1 text-[16px] font-extrabold">{demoQuiz.title}</div>
              <div className="mt-1 text-[13px] text-[color:var(--muted-foreground)]">{demoQuiz.passRule}</div>

              <div className="mt-4 grid gap-3">
                {demoQuiz.questions.map((q) => (
                  <div key={q.q} className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-[color:var(--surface-container-low)] p-4">
                    <div className="text-[14px] font-extrabold">{q.q}</div>
                    <div className="mt-3 grid gap-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={opt}
                          className={
                            "rounded-xl border px-3 py-2 text-[13px] font-semibold " +
                            (i === q.answer
                              ? "border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                              : "border-[color:var(--outline-variant)]/35 bg-white text-[color:var(--on-surface)]")
                          }
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-[14px] leading-6 text-[color:var(--muted-foreground)]">
              Passing quizzes unlocks the next chapter. Failing does not unlock progression.
            </div>
          </Section>
        </div>

        <div className="mt-10 rounded-3xl border border-[color:var(--outline-variant)]/25 bg-white p-7 shadow-[0_18px_50px_rgba(10,10,40,0.06)]">
          <h3 className="text-[18px] font-extrabold tracking-[-0.02em]">Try the real flow</h3>
          <p className="mt-2 text-[14px] leading-6 text-[color:var(--muted-foreground)]">
            If you want to generate a real roadmap, you’ll need Supabase + an AI endpoint configured.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/learn"
              className="lm-btn-primary inline-flex h-12 items-center justify-center rounded-full px-8 font-semibold shadow-[0_6px_16px_rgba(35,70,213,0.22)]"
            >
              Start a roadmap wizard
            </Link>
            <Link
              href="/roadmaps"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--outline-variant)] bg-white px-8 font-semibold text-[color:var(--primary)]"
            >
              Go to app
            </Link>
          </div>
        </div>

        <footer className="mt-10 pb-12 text-center text-[12px] text-[color:var(--muted-foreground)]">
          LearnMap demo tour — built for fast recruiter review.
        </footer>
      </main>
    </div>
  );
}
