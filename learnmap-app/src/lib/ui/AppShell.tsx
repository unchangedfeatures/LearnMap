import Link from "next/link";

import { cn } from "@/lib/ui/cn";

import ProfileMenu from "@/lib/ui/ProfileMenu";

type AppShellProps = {
  title?: string;
  subtitle?: string;
  sidebarContent?: React.ReactNode;
  children: React.ReactNode;
};

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[11px] font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
};

function MaterialSymbol({ name, filled }: { name: string; filled?: boolean }) {
  return (
    <span
      className="material-symbols-outlined text-[22px]"
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function NavItem({ href, label, icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-[16px] transition-colors active:scale-[0.99]",
        active
          ? "bg-[color:var(--surface-container-high)] text-[color:var(--primary)] font-extrabold border-r-4 border-[color:var(--primary)]"
          : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--surface-container-high)] hover:text-[color:var(--primary)] font-semibold"
      )}
    >
      <MaterialSymbol name={icon} filled={active} />
      <span>{label}</span>
    </Link>
  );
}

export default function AppShell({ title, subtitle, sidebarContent, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:bg-[color:var(--surface-container-low)] lg:px-6 lg:py-10 lg:border-r lg:border-[color:var(--outline-variant)]/20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-[color:var(--primary)] flex items-center justify-center text-white font-extrabold">
            L
          </div>
          <div>
            <div className="text-[20px] font-bold text-[color:var(--primary)]">
              LearnMap
            </div>
            <div className="text-[12px] text-[color:var(--muted-foreground)]">
              AI Learning Platform
            </div>
          </div>
        </div>

        {sidebarContent ? (
          <div className="flex-1 flex flex-col gap-6">
            {sidebarContent}

            <SidebarSection title="Navigation">
              <nav className="flex flex-col gap-2">
                <NavItem href="/home" label="Home" icon="home" active={title === "Home"} />
                <NavItem
                  href="/roadmaps"
                  label="Roadmaps"
                  icon="map"
                  active={
                    title === "Roadmaps" ||
                    title === "Roadmap" ||
                    title === "Chapter" ||
                    title === "Guide" ||
                    title === "Quiz"
                  }
                />
                <NavItem
                  href="/progress"
                  label="Progress"
                  icon="leaderboard"
                  active={title === "Progress"}
                />
                <NavItem href="/profile" label="Profile" icon="person" active={title === "Profile"} />
                <NavItem href="/settings" label="Settings" icon="settings" active={title === "Settings"} />
              </nav>
            </SidebarSection>
          </div>
        ) : (
          <nav className="flex-1 flex flex-col gap-2">
            <NavItem href="/home" label="Home" icon="home" active={title === "Home"} />
            <NavItem
              href="/roadmaps"
              label="Roadmaps"
              icon="map"
              active={title === "Roadmaps" || title === "Roadmap" || title === "Chapter" || title === "Guide" || title === "Quiz"}
            />
            <NavItem href="/progress" label="Progress" icon="leaderboard" active={title === "Progress"} />
            <NavItem href="/profile" label="Profile" icon="person" active={title === "Profile"} />
            <NavItem href="/settings" label="Settings" icon="settings" active={title === "Settings"} />
          </nav>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <Link
            href="/learn"
            className="h-12 rounded-xl bg-[color:var(--primary)] text-white font-semibold inline-flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(35,70,213,0.2)] hover:bg-[color:var(--primary-container)] transition-colors"
          >
            <MaterialSymbol name="add" filled />
            <span>New Roadmap</span>
          </Link>

          <div className="pt-4 border-t border-[color:var(--outline-variant)]/40 flex flex-col gap-2">
            <NavItem href="/help" label="Help" icon="help" active={title === "Help"} />
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[color:var(--outline-variant)]/30 bg-[color:var(--surface)]/95 backdrop-blur-xl">
          <div className="mx-auto flex h-20 w-full max-w-[var(--lm-max-width)] items-center justify-between px-5 lg:px-[var(--lm-margin)]">
            <div className="flex items-center gap-5">
              {/* Search (UI only) */}
              <div className="hidden lg:flex items-center gap-3 h-12 w-96 rounded-full bg-[color:var(--surface-container-low)] px-4 border border-[color:var(--surface-container-highest)] focus-within:ring-2 focus-within:ring-[color:var(--primary)]/20">
                <MaterialSymbol name="search" />
                <input
                  className="w-full bg-transparent border-none focus:outline-none text-[16px]"
                  placeholder="Search roadmaps, topics..."
                />
              </div>

              {title ? (
                <div>
                  <div className="text-[20px] font-bold text-[color:var(--on-surface)]">
                    {subtitle || title}
                  </div>
                  {subtitle ? (
                    <div className="text-[12px] font-semibold text-[color:var(--muted-foreground)]">
                      {title}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link href="/roadmaps" className="text-[20px] font-bold text-[color:var(--primary)]">
                  LearnMap
                </Link>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                className="h-10 w-10 rounded-full hover:bg-[color:var(--surface-container-high)] text-[color:var(--muted-foreground)] transition-colors"
                aria-label="Notifications"
              >
                <MaterialSymbol name="notifications" />
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-full hover:bg-[color:var(--surface-container-high)] text-[color:var(--muted-foreground)] transition-colors"
                aria-label="Settings"
              >
                <MaterialSymbol name="settings" />
              </button>
              <ProfileMenu />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[var(--lm-max-width)] px-5 lg:px-[var(--lm-margin)] py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
