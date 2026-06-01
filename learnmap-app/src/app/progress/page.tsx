import Link from "next/link";

import AppShell from "@/lib/ui/AppShell";
import { requireRealUser } from "@/lib/auth/require-user";

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

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
            {label}
          </div>
          <div className="mt-3 text-[34px] font-extrabold tracking-[-0.02em]">
            {value}
          </div>
          {hint ? (
            <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">{hint}</div>
          ) : null}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[rgba(67,97,238,0.10)] border border-[rgba(67,97,238,0.18)] flex items-center justify-center text-[color:var(--primary)]">
          <MaterialSymbol name={icon} filled />
        </div>
      </div>
    </div>
  );
}

export default async function ProgressPage() {
  const { supabase } = await requireRealUser("/progress");

  const [{ count: roadmapCount }, { count: guideCount }, { count: guidesCompleteCount }, { count: quizzesCompleteCount }] =
    await Promise.all([
      supabase.from("roadmaps").select("id", { count: "exact", head: true }),
      supabase.from("guides").select("id", { count: "exact", head: true }),
      supabase
        .from("guides")
        .select("id", { count: "exact", head: true })
        .eq("status", "complete"),
      supabase
        .from("quizzes")
        .select("id", { count: "exact", head: true })
        .eq("status", "complete"),
    ]).then((rows) => rows.map((r: any) => ({ count: r.count as number | null })) as any);

  const totalRoadmaps = roadmapCount ?? 0;
  const totalGuides = guideCount ?? 0;
  const completedGuides = guidesCompleteCount ?? 0;
  const completedQuizzes = quizzesCompleteCount ?? 0;

  return (
    <AppShell title="Progress" subtitle="Overview">
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
            Week 1 MVP
          </div>
          <h1 className="mt-2 text-[36px] font-semibold tracking-[-0.01em]">Your progress</h1>
          <p className="mt-2 text-[18px] text-[color:var(--muted-foreground)]">
            Simple progress stats while we build the full dashboard.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/roadmaps"
            className="h-12 rounded-full border border-[color:var(--outline-variant)]/30 bg-white px-6 text-sm font-semibold text-[color:var(--on-surface)] hover:bg-[color:var(--surface-container-low)] transition-colors inline-flex items-center gap-2"
          >
            <MaterialSymbol name="map" />
            My roadmaps
          </Link>
          <Link
            href="/learn"
            className="h-12 rounded-full bg-[color:var(--primary)] text-white px-6 text-sm font-semibold shadow-[0_4px_12px_rgba(35,70,213,0.2)] hover:bg-[color:var(--primary-container)] transition-colors inline-flex items-center gap-2"
          >
            <MaterialSymbol name="add" filled />
            New roadmap
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[var(--lm-gutter)]">
        <StatCard icon="map" label="Roadmaps" value={String(totalRoadmaps)} hint="Saved in your account" />
        <StatCard
          icon="menu_book"
          label="Guides completed"
          value={`${completedGuides}/${totalGuides}`}
          hint="Across all roadmaps"
        />
        <StatCard
          icon="quiz"
          label="Quizzes passed"
          value={String(completedQuizzes)}
          hint="4/5 to pass"
        />
        <StatCard
          icon="leaderboard"
          label="More analytics"
          value="Soon"
          hint="Streaks, mastery, and timelines (post-MVP)"
        />
      </div>

      <div className="mt-10 rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-semibold">What counts as progress?</div>
        <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
          Completing guides unlocks the quiz. Passing the quiz unlocks the next chapter.
        </div>
      </div>
    </AppShell>
  );
}
