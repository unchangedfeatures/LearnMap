import Link from "next/link";

import AppShell from "@/lib/ui/AppShell";

export default function Home() {
  return (
    <AppShell title="Home" subtitle="Dashboard">
      <div className="lm-card max-w-[920px] p-10">
        <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
          LEARNMAP MVP
        </div>
        <h1 className="mt-2 text-[36px] font-extrabold tracking-[-0.02em]">
          Start your next roadmap
        </h1>
        <p className="mt-2 text-[18px] text-[color:var(--muted-foreground)]">
          Begin the wizard, then sign in to generate and save your roadmap.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            className="lm-btn-primary inline-flex h-12 items-center justify-center rounded-full px-8 font-semibold shadow-[0_4px_12px_rgba(35,70,213,0.2)]"
            href="/learn"
          >
            New roadmap
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full border border-[color:var(--outline-variant)] bg-white px-8 font-semibold text-[color:var(--primary)]"
            href="/roadmaps"
          >
            My roadmaps
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-[color:var(--outline-variant)] bg-white px-4 py-3 text-sm text-[color:var(--muted-foreground)]">
          Developer note: test APIs at <span className="font-semibold">/api/ai/topic-questions</span> and{" "}
          <span className="font-semibold">/api/ai/roadmap</span>.
        </div>
      </div>
    </AppShell>
  );
}
