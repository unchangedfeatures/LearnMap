import Link from "next/link";

import AppShell from "@/lib/ui/AppShell";
import { requireRealUser } from "@/lib/auth/require-user";

function RoadmapError({ message }: { message: string }) {
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

function pct(n: number) {
  return `${Math.round(Math.max(0, Math.min(1, n)) * 100)}%`;
}

export default async function RoadmapPage({
  params,
}: {
  params: { id: string };
}) {
  const { supabase } = await requireRealUser("/roadmaps");

  const { data: roadmap, error: roadmapErr } = await supabase
    .from("roadmaps")
    .select("id, title, description")
    .eq("id", params.id)
    .single();

  const { data: chapters, error: chaptersErr } = await supabase
    .from("chapters")
    .select("id, title, description, status, position")
    .eq("roadmap_id", params.id)
    .order("position", { ascending: true });

  const list = (chapters || []) as any[];
  const total = list.length || 1;
  const completedCount = list.filter((c) => c.status === "complete").length;
  const progress = completedCount / total;

  const current = list.find((c) => c.status !== "complete" && c.status !== "locked") || null;

  return (
    <AppShell title="Roadmap" subtitle={roadmap?.title || "Roadmap"}>
      {roadmapErr ? <RoadmapError message={roadmapErr.message} /> : null}
      {chaptersErr ? <RoadmapError message={chaptersErr.message} /> : null}

      <div className="-mx-5 lg:-mx-[var(--lm-margin)] -my-10 lg:-my-10">
        <div
          className={
            "relative h-[calc(100vh-80px)] overflow-auto scroll-smooth " +
            "bg-[color:var(--surface)] text-[color:var(--on-surface)]"
          }
        >
          {/* Dot grid background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(196,197,215,0.9) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative mx-auto min-h-full max-w-[var(--lm-max-width)] px-5 lg:px-[var(--lm-margin)] py-10 flex flex-col items-center">
            {/* Roadmap header (progress) */}
            <div className="w-full max-w-[720px]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
                    ROADMAP
                  </div>
                  <div className="mt-1 text-[20px] font-bold">{roadmap?.title}</div>
                  {roadmap?.description ? (
                    <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                      {roadmap.description}
                    </div>
                  ) : null}
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="h-2 w-32 bg-[color:var(--surface-container-highest)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[color:var(--primary)] transition-all duration-500"
                      style={{ width: pct(progress) }}
                    />
                  </div>
                  <div className="text-xs font-semibold text-[color:var(--muted-foreground)]">
                    {pct(progress)} Complete
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap start */}
            <div className="mt-10 w-16 h-16 rounded-full bg-[color:var(--primary-container)] flex items-center justify-center shadow-lg z-10">
              <span className="text-[28px] text-[color:var(--primary-foreground)]" aria-hidden>
                <MaterialSymbol name="flag" filled />
              </span>
            </div>

            <div
              className="w-1 h-12 -mt-2 mb-2"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, rgba(116,118,134,0.6) 0, rgba(116,118,134,0.6) 8px, transparent 8px, transparent 16px)",
              }}
            />

            {/* Nodes */}
            <div className="flex flex-col items-center w-full">
              {list.map((c) => {
                const isLocked = c.status === "locked";
                const isComplete = c.status === "complete";
                const isCurrent = current?.id === c.id;

                const nodeBase =
                  "rounded-xl border transition-all duration-300 relative overflow-hidden";

                if (isCurrent) {
                  return (
                    <div key={c.id} className="flex flex-col items-center relative z-10">
                      <div className="pointer-events-none absolute inset-0 rounded-full bg-[rgba(67,97,238,0.1)] blur-xl scale-150" />

                      <Link
                        href={`/roadmap/${params.id}/chapter/${c.id}`}
                        className={
                          nodeBase +
                          " group w-[440px] bg-[color:var(--surface-container-lowest)] p-8 border-2 border-[color:var(--primary)] shadow-2xl hover:-translate-y-1"
                        }
                      >
                        <div className="pointer-events-none absolute top-0 right-0 p-6 opacity-10">
                          <span className="text-[120px]" aria-hidden>
                            <MaterialSymbol name="rocket_launch" />
                          </span>
                        </div>

                        <div className="relative">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="px-3 py-1 rounded-full bg-[color:var(--primary)] text-white text-xs font-extrabold">
                              CURRENT FOCUS
                            </span>
                            <span className="text-sm font-semibold text-[color:var(--primary)]">
                              Module {Number(c.position) + 1} of {list.length}
                            </span>
                          </div>
                          <div className="text-[24px] font-extrabold">
                            {c.title}
                          </div>
                          {c.description ? (
                            <div className="mt-2 text-[18px] text-[color:var(--muted-foreground)]">
                              {c.description}
                            </div>
                          ) : null}

                          <div className="mt-6">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span>Next step</span>
                              <span className="text-[color:var(--primary)]">Open guides</span>
                            </div>
                            <div className="mt-2 h-3 w-full bg-[color:var(--surface-container)] rounded-full overflow-hidden">
                              <div className="h-full w-[35%] bg-[color:var(--primary)] rounded-full" />
                            </div>
                          </div>

                          <div className="mt-6 relative z-20">
                            <div className="w-full py-3 rounded-full bg-[color:var(--primary)] text-white font-bold text-center group-hover:bg-[color:var(--primary-container)] group-hover:text-white transition-colors">
                              Resume Learning
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="w-1 h-16 bg-[color:var(--outline-variant)]" />
                    </div>
                  );
                }

                if (isComplete) {
                  return (
                    <div key={c.id} className="flex flex-col items-center">
                      <Link
                        href={`/roadmap/${params.id}/chapter/${c.id}`}
                        className={
                          nodeBase +
                          " w-80 bg-[color:var(--surface-container-lowest)] p-6 border-[color:var(--primary-container)]/20 shadow-md hover:-translate-y-1"
                        }
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="px-2 py-1 rounded-full bg-[rgba(67,97,238,0.1)] text-[color:var(--primary)] text-[10px] font-extrabold tracking-wider uppercase">
                            Completed
                          </span>
                          <span className="text-[20px] text-[color:var(--primary)]" aria-hidden>
                            <MaterialSymbol name="check_circle" filled />
                          </span>
                        </div>
                        <div className="text-[18px] font-semibold">{c.title}</div>
                        {c.description ? (
                          <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                            {c.description}
                          </div>
                        ) : null}
                      </Link>
                      <div
                        className="w-1 h-16"
                        style={{
                          background:
                            "repeating-linear-gradient(to bottom, rgba(116,118,134,0.6) 0, rgba(116,118,134,0.6) 8px, transparent 8px, transparent 16px)",
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={c.id}
                    className={
                      "flex flex-col items-center " +
                      (isLocked ? "opacity-60 grayscale-[0.5]" : "")
                    }
                  >
                    {isLocked ? (
                      <div
                        className={
                          nodeBase +
                          " w-80 bg-[color:var(--surface-container-low)] p-6 border-[color:var(--outline-variant)]/30"
                        }
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="px-2 py-1 rounded-full bg-[color:var(--surface-container-highest)] text-[color:var(--muted-foreground)] text-[10px] font-extrabold tracking-wider uppercase">
                            Locked
                          </span>
                          <span className="text-[20px] text-[color:var(--outline)]" aria-hidden>
                            <MaterialSymbol name="lock" />
                          </span>
                        </div>
                        <div className="text-[18px] font-semibold">{c.title}</div>
                        {c.description ? (
                          <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                            {c.description}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <Link
                        href={`/roadmap/${params.id}/chapter/${c.id}`}
                        className={
                          nodeBase +
                          " w-80 bg-[color:var(--surface-container-lowest)] p-6 border-[color:var(--primary-container)]/20 shadow-md hover:-translate-y-1"
                        }
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="px-2 py-1 rounded-full bg-[rgba(67,97,238,0.1)] text-[color:var(--primary)] text-[10px] font-extrabold tracking-wider uppercase">
                            Available
                          </span>
                          <span className="text-[20px] text-[color:var(--primary)]" aria-hidden>
                            <MaterialSymbol name="play_circle" filled />
                          </span>
                        </div>
                        <div className="text-[18px] font-semibold">{c.title}</div>
                        {c.description ? (
                          <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                            {c.description}
                          </div>
                        ) : null}
                      </Link>
                    )}

                    <div
                      className="w-1 h-16 opacity-60"
                      style={{
                        background:
                          "repeating-linear-gradient(to bottom, rgba(116,118,134,0.6) 0, rgba(116,118,134,0.6) 8px, transparent 8px, transparent 16px)",
                      }}
                    />
                  </div>
                );
              })}

              {/* Roadmap end */}
              <div className="w-16 h-16 rounded-full bg-[color:var(--surface-container-highest)] flex items-center justify-center shadow-inner mt-1 opacity-60">
                <span className="text-[26px] text-[color:var(--muted-foreground)]" aria-hidden>
                  <MaterialSymbol name="workspace_premium" />
                </span>
              </div>
              <div className="mt-2 text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
                Mastery Milestone
              </div>
              <div className="h-16" />
            </div>

            <div className="mt-10 w-full max-w-[720px] flex items-center justify-between">
              <Link
                href="/roadmaps"
                className="text-sm font-semibold text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]"
              >
                ← Back to Roadmaps
              </Link>
              <Link
                href="/learn"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[color:var(--primary)] text-white px-6 font-semibold shadow-[0_4px_12px_rgba(35,70,213,0.2)] hover:bg-[color:var(--primary-container)]"
              >
                New roadmap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
