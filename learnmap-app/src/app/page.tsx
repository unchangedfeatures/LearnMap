import Link from "next/link";

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-6 shadow-[0_10px_30px_rgba(10,10,40,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--surface-container-low)] text-[color:var(--primary)]">
          <span className="material-symbols-outlined" aria-hidden="true">
            {icon}
          </span>
        </div>
        <div className="text-[18px] font-extrabold tracking-[-0.01em]">{title}</div>
      </div>
      <p className="mt-3 text-[15px] leading-6 text-[color:var(--muted-foreground)]">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[color:var(--outline-variant)]/30 bg-[color:var(--surface)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[color:var(--primary)] text-white grid place-items-center font-extrabold">
              L
            </div>
            <div>
              <div className="text-[16px] font-extrabold tracking-[-0.01em] text-[color:var(--primary)]">
                LearnMap
              </div>
              <div className="text-[11px] font-semibold text-[color:var(--muted-foreground)]">
                AI learning roadmap MVP
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="hidden sm:inline-flex h-10 items-center justify-center rounded-full border border-[color:var(--outline-variant)] bg-white px-4 text-[14px] font-semibold text-[color:var(--primary)]"
            >
              View demo
            </Link>
            <Link
              href="/learn"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--primary)] px-4 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(35,70,213,0.22)]"
            >
              Start learning
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto w-full max-w-[1100px] px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--outline-variant)]/40 bg-white px-3 py-1 text-[12px] font-semibold text-[color:var(--muted-foreground)]">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                auto_awesome
              </span>
              Agentic-friendly product demo
            </div>

            <h1 className="mt-4 text-[42px] font-extrabold tracking-[-0.03em] leading-[1.05]">
              Personalized learning roadmaps in minutes.
            </h1>
            <p className="mt-4 text-[18px] leading-7 text-[color:var(--muted-foreground)]">
              LearnMap turns a topic into a structured study path: AI clarifying questions, a roadmap, on-demand guides,
              and quizzes that unlock progress.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/learn"
                className="lm-btn-primary inline-flex h-12 items-center justify-center rounded-full px-8 font-semibold shadow-[0_6px_16px_rgba(35,70,213,0.22)]"
              >
                Start a roadmap
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--outline-variant)] bg-white px-8 font-semibold text-[color:var(--primary)]"
              >
                View demo tour
              </Link>
              <Link
                href="/roadmaps"
                className="inline-flex h-12 items-center justify-center rounded-full px-4 text-[14px] font-semibold text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]"
              >
                My roadmaps →
              </Link>
            </div>

            <div className="mt-6 text-[12px] text-[color:var(--muted-foreground)]">
              Note: the full generation flow requires Supabase + an AI endpoint configured.
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--outline-variant)]/25 bg-white p-6 shadow-[0_18px_50px_rgba(10,10,40,0.08)]">
            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
              PRODUCT FLOW
            </div>
            <div className="mt-3 grid gap-3">
              {[
                { title: "Topic → questions", desc: "Gather intent and context quickly" },
                { title: "Roadmap → chapters", desc: "Generate a structured path" },
                { title: "Guides → reading", desc: "Create content on demand" },
                { title: "Quiz → unlock", desc: "Validate mastery and advance" },
              ].map((s) => (
                <div
                  key={s.title}
                  className="flex items-start gap-3 rounded-2xl border border-[color:var(--outline-variant)]/25 bg-[color:var(--surface-container-low)] p-4"
                >
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-[color:var(--primary)]/10 grid place-items-center text-[color:var(--primary)]">
                    <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                      check
                    </span>
                  </div>
                  <div>
                    <div className="text-[15px] font-extrabold">{s.title}</div>
                    <div className="mt-1 text-[13px] text-[color:var(--muted-foreground)]">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <section className="mt-14">
          <div className="text-[14px] font-semibold tracking-wide text-[color:var(--muted-foreground)]">
            WHY IT’S INTERESTING
          </div>
          <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.02em]">Built like a real product MVP</h2>
          <p className="mt-2 max-w-[70ch] text-[15px] leading-6 text-[color:var(--muted-foreground)]">
            The app treats AI output as untrusted input: parse defensively, validate with Zod, retry once with repair
            prompt when needed, then persist to Supabase.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon="verified"
              title="JSON safety"
              description="AI JSON is parsed with try/catch, validated with Zod, and retried once using a repair prompt."
            />
            <FeatureCard
              icon="hub"
              title="Provider-agnostic AI"
              description="One HTTP wrapper supports OpenAI-compatible and Anthropic-style responses (and even SSE quirks)."
            />
            <FeatureCard
              icon="lock"
              title="Auth + ownership"
              description="Server routes enforce signed-in users and ownership before generating or returning content."
            />
          </div>
        </section>

        <footer className="mt-16 flex flex-col gap-3 border-t border-[color:var(--outline-variant)]/30 pt-8 text-[13px] text-[color:var(--muted-foreground)]">
          <div>
            Want to see it without setup? Open the <Link className="font-semibold text-[color:var(--primary)]" href="/demo">demo tour</Link>.
          </div>
          <div>
            Ready to try the real flow? Start the <Link className="font-semibold text-[color:var(--primary)]" href="/learn">roadmap wizard</Link>.
          </div>
        </footer>
      </main>
    </div>
  );
}
