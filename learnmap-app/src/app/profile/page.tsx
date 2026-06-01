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

function DisabledRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-[color:var(--surface-container-low)]/40 p-5 opacity-70">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white border border-[color:var(--outline-variant)]/25 flex items-center justify-center text-[color:var(--muted-foreground)]">
          <MaterialSymbol name={icon} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[color:var(--on-surface)]">{title}</div>
          <div className="mt-1 text-xs font-semibold text-[color:var(--muted-foreground)]">{desc}</div>
        </div>
        <div className="ml-auto text-[color:var(--muted-foreground)]">
          <MaterialSymbol name="lock" />
        </div>
      </div>
    </div>
  );
}

export default async function ProfilePage() {
  const { user } = await requireRealUser("/profile");

  const email = (user as any)?.email || "";
  const provider = String((user as any)?.app_metadata?.provider || "");

  return (
    <AppShell title="Profile" subtitle="Account">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
              Signed in
            </div>
            <div className="mt-3 flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="text-[28px] font-extrabold tracking-[-0.02em] line-clamp-2">
                  {email || "Account"}
                </div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--muted-foreground)]">
                  Provider: <span className="text-[color:var(--on-surface)]">{provider || "email"}</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[rgba(67,97,238,0.10)] border border-[rgba(67,97,238,0.18)] flex items-center justify-center text-[color:var(--primary)]">
                <MaterialSymbol name="person" filled />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[color:var(--outline-variant)]/20 bg-[color:var(--surface-container-low)]/60 p-5">
              <div className="text-sm font-semibold">Week 1 MVP note</div>
              <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                Profile editing is intentionally limited this week. Your roadmap progress is still saved to your account.
              </div>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
            Coming next
          </div>

          <DisabledRow
            icon="tune"
            title="Learning preferences"
            desc="Learning style, pace, and content depth controls (post-MVP)."
          />
          <DisabledRow
            icon="security"
            title="Security"
            desc="Password changes, connected providers, and sessions (post-MVP)."
          />
          <DisabledRow
            icon="notifications"
            title="Notifications"
            desc="Reminders and weekly goals (post-MVP)."
          />
        </aside>
      </div>
    </AppShell>
  );
}
