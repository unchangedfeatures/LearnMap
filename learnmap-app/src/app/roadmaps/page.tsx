import Link from "next/link";

import { requireRealUser } from "@/lib/auth/require-user";
import AppShell from "@/lib/ui/AppShell";

function RoadmapsError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
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

export default async function RoadmapsPage() {
  const { supabase } = await requireRealUser("/roadmaps");

  const { data: roadmaps, error } = await supabase
    .from("roadmaps")
    .select("id, title, description, topic, created_at")
    .order("created_at", { ascending: false });

  return (
    <AppShell title="Roadmaps" subtitle="My Roadmaps">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-[36px] font-semibold tracking-[-0.01em] text-[color:var(--on-surface)]">
            My Roadmaps
          </h1>
          <p className="mt-2 text-[18px] text-[color:var(--muted-foreground)]">
            Track your progress and continue learning.
          </p>
        </div>

        <div className="flex bg-[color:var(--surface-container-low)] rounded-lg p-1">
          <button
            type="button"
            className="px-6 py-2 rounded-md bg-[color:var(--surface-container-lowest)] text-[color:var(--primary)] text-sm font-semibold shadow-sm"
          >
            All
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-md text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] text-sm font-semibold transition-colors"
          >
            In Progress
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-md text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] text-sm font-semibold transition-colors"
          >
            Completed
          </button>
        </div>
      </div>

      {error ? <RoadmapsError message={error.message} /> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--lm-gutter)]">
        {(roadmaps || []).map((r: any) => (
          <Link
            key={r.id}
            href={`/roadmap/${r.id}`}
            className="group block rounded-xl border border-[color:var(--surface-container)] bg-[color:var(--surface-container-lowest)] p-8 shadow-[0_2px_8px_rgba(35,70,213,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(35,70,213,0.08)]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-xl bg-[rgba(67,97,238,0.1)] flex items-center justify-center text-[color:var(--primary)]">
                <span className="text-[28px]" aria-hidden>
                  <MaterialSymbol name="map" filled />
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[rgba(67,97,238,0.1)] text-[color:var(--primary)] text-xs font-semibold">
                In Progress
              </span>
            </div>

            <div className="text-[24px] font-semibold text-[color:var(--on-surface)]">
              {r.title}
            </div>
            <p className="mt-2 text-[16px] text-[color:var(--muted-foreground)] line-clamp-3">
              {r.description || "Continue your personalized learning path."}
            </p>

            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-[color:var(--on-surface)]">
                  Saved roadmap
                </span>
                <span className="text-xs font-semibold text-[color:var(--muted-foreground)]">
                  Topic: {String(r.topic || "").trim() || "—"}
                </span>
              </div>
              <div className="h-2 w-full bg-[color:var(--surface-container)] rounded-full overflow-hidden">
                <div className="h-full bg-[color:var(--primary)] rounded-full w-[12%]" />
              </div>
            </div>
          </Link>
        ))}

        <Link
          href="/learn"
          className="group rounded-xl border-2 border-dashed border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] p-8 min-h-[300px] flex flex-col items-center justify-center text-center transition-all hover:border-[color:var(--primary)] hover:bg-[rgba(67,97,238,0.05)]"
        >
          <div className="w-16 h-16 rounded-full bg-[color:var(--surface-container-highest)] flex items-center justify-center text-[color:var(--muted-foreground)] mb-4 group-hover:text-[color:var(--primary)] transition-colors">
            <span className="text-[36px]" aria-hidden>
              <MaterialSymbol name="add" />
            </span>
          </div>
          <div className="text-[20px] font-semibold text-[color:var(--on-surface)]">
            Start a New Journey
          </div>
          <p className="mt-2 text-[16px] text-[color:var(--muted-foreground)] max-w-xs">
            Generate a new AI-powered learning roadmap based on your career goals.
          </p>
        </Link>

        {!error && (!roadmaps || roadmaps.length === 0) ? (
          <div className="md:col-span-2 xl:col-span-2 rounded-xl border border-[color:var(--surface-container)] bg-[color:var(--surface-container-lowest)] p-8">
            <div className="text-sm font-semibold">No roadmaps yet</div>
            <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Create your first personalized learning roadmap.
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
