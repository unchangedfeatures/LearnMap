import Link from "next/link";

import AppShell from "@/lib/ui/AppShell";

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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--outline-variant)]/20 bg-white p-6">
      <div className="text-sm font-semibold">{q}</div>
      <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">{a}</div>
    </div>
  );
}

export default function HelpPage() {
  return (
    <AppShell title="Help" subtitle="Support">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
              Help center
            </div>
            <h1 className="mt-2 text-[36px] font-semibold tracking-[-0.01em]">
              Getting started
            </h1>
            <p className="mt-2 text-[18px] text-[color:var(--muted-foreground)]">
              LearnMap is a Week 1 MVP. The goal is a stable roadmap → guide → quiz learning flow.
            </p>

            <div className="mt-8 space-y-4">
              <FaqItem
                q="Why do I need to sign in?"
                a="We save your roadmap, guide cache, and progress to your account. Anonymous users can view later, but personal generation is account-based for cost control and consistency."
              />
              <FaqItem
                q="How do unlocks work?"
                a="Finish guides to unlock the chapter quiz. Score 4/5 to pass and unlock the next chapter."
              />
              <FaqItem
                q="A guide is generating slowly — is it stuck?"
                a="If the guide content isn’t cached yet, the first open triggers generation. You should see a generating skeleton. Reloading after generation should be fast."
              />
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-sm font-semibold">Quick links</div>
                <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                  Jump back into your learning flow.
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[rgba(67,97,238,0.10)] border border-[rgba(67,97,238,0.18)] flex items-center justify-center text-[color:var(--primary)]">
                <MaterialSymbol name="support_agent" filled />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Link
                href="/roadmaps"
                className="rounded-2xl border border-[color:var(--outline-variant)]/20 bg-[color:var(--surface-container-low)]/40 px-4 py-3 text-sm font-semibold text-[color:var(--on-surface)] flex items-center justify-between hover:bg-[color:var(--surface-container-low)] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <MaterialSymbol name="map" />
                  My roadmaps
                </span>
                <MaterialSymbol name="chevron_right" />
              </Link>
              <Link
                href="/learn"
                className="rounded-2xl bg-[color:var(--primary)] text-white px-4 py-3 text-sm font-semibold flex items-center justify-between hover:bg-[color:var(--primary-container)] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <MaterialSymbol name="add" filled />
                  New roadmap
                </span>
                <MaterialSymbol name="chevron_right" filled />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-[rgba(67,97,238,0.06)] p-8">
            <div className="text-sm font-semibold">Need help debugging?</div>
            <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              If progress saving or caching fails, it’s usually due to Supabase RLS policies not applied yet.
              Re-apply <span className="font-semibold">supabase/schema.sql</span> in the Supabase SQL editor.
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
