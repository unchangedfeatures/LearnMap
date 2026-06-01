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

function DisabledSetting({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--outline-variant)]/25 bg-white p-5 opacity-70">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[color:var(--surface-container-low)] border border-[color:var(--outline-variant)]/20 flex items-center justify-center text-[color:var(--muted-foreground)]">
          <MaterialSymbol name={icon} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs font-semibold text-[color:var(--muted-foreground)]">{desc}</div>
        </div>
        <div className="ml-auto text-[color:var(--muted-foreground)]">
          <MaterialSymbol name="lock" />
        </div>
      </div>
    </div>
  );
}

export default async function SettingsPage() {
  await requireRealUser("/settings");

  return (
    <AppShell title="Settings" subtitle="Preferences">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7">
          <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
              Week 1 MVP
            </div>
            <h1 className="mt-2 text-[36px] font-semibold tracking-[-0.01em]">Settings</h1>
            <p className="mt-2 text-[18px] text-[color:var(--muted-foreground)]">
              We’re keeping settings minimal until the core learning flow is fully stable.
            </p>

            <div className="mt-8 rounded-2xl border border-[color:var(--outline-variant)]/20 bg-[color:var(--surface-container-low)]/60 p-5">
              <div className="text-sm font-semibold">What you can do now</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-[color:var(--muted-foreground)] space-y-1">
                <li>Sign out from the top-right profile menu.</li>
                <li>Create and resume roadmaps from “Roadmaps”.</li>
              </ul>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-4">
          <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
            Coming soon
          </div>

          <DisabledSetting icon="palette" title="Theme" desc="Light/dark theme toggle (post-MVP)." />
          <DisabledSetting icon="translate" title="Language" desc="App language selection (post-MVP)." />
          <DisabledSetting
            icon="tune"
            title="AI quality controls"
            desc="Output length + depth controls (post-MVP)."
          />
        </aside>
      </div>
    </AppShell>
  );
}
