"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { sanitizeNext } from "@/lib/auth/next";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
      {children}
    </div>
  );
}

function ProviderButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      className="h-12 w-full rounded-xl border border-[color:var(--outline-variant)] bg-white px-4 text-[15px] font-semibold text-[color:var(--on-surface)] shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-[0_10px_30px_-12px_rgba(35,70,213,0.20)] active:scale-[0.99] disabled:opacity-60 disabled:hover:translate-y-0"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center gap-3">
        <span className="text-[20px] text-[color:var(--muted-foreground)]" aria-hidden>
          <MaterialSymbol name={icon} />
        </span>
        <span>{label}</span>
      </div>
    </button>
  );
}

export default function AuthClient() {
  const router = useRouter();
  const search = useSearchParams();

  const next = useMemo(() => sanitizeNext(search.get("next")), [search]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function signInWithProvider(provider: "google" | "discord") {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();

      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });

      if (error) throw error;
      // OAuth flow continues via redirect.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed.");
      setBusy(false);
    }
  }

  async function signInWithEmail() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      setMessage("Signed in. Redirecting…");
      router.replace(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Email sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function signUpWithEmail() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      if (data.session) {
        router.replace(next);
        return;
      }

      setMessage(
        "Account created. If email confirmation is enabled, check your inbox, then come back to sign in."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-up failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      {/* Desktop */}
      <div className="hidden lg:block">
        <header className="fixed top-0 left-0 right-0 h-20 bg-[color:var(--surface)]/90 backdrop-blur-xl border-b border-[color:var(--outline-variant)]/20 z-40">
          <div className="mx-auto max-w-[var(--lm-max-width)] h-full px-5 lg:px-[var(--lm-margin)] flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] font-semibold transition-colors"
              onClick={() => router.back()}
            >
              <MaterialSymbol name="arrow_back" />
              Back
            </button>

            <div className="text-sm font-semibold text-[color:var(--outline)]">
              Sign in
            </div>

            <div className="w-24" />
          </div>
        </header>

        <main className="mx-auto max-w-[var(--lm-max-width)] px-5 lg:px-[var(--lm-margin)] pt-32 pb-24 min-h-screen">
          <div className="grid grid-cols-12 gap-10 items-start">
            <section className="col-span-12 lg:col-span-6">
              <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--muted-foreground)]">
                LearnMap
              </div>
              <h1 className="mt-3 text-[52px] font-extrabold tracking-[-0.03em] leading-[1.05]">
                Continue your
                <span className="text-[color:var(--primary)]"> roadmap</span>
              </h1>
              <p className="mt-4 text-[18px] text-[color:var(--muted-foreground)] max-w-[38ch]">
                Sign in to generate and save your personal roadmaps. Anonymous users can’t create personal roadmaps.
              </p>

              <div className="mt-10 rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-8 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold">Quick sign-in</div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                  <ProviderButton
                    icon="mail"
                    label="Continue with Google"
                    onClick={() => signInWithProvider("google")}
                    disabled={busy}
                  />
                  <ProviderButton
                    icon="forum"
                    label="Continue with Discord"
                    onClick={() => signInWithProvider("discord")}
                    disabled={busy}
                  />
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-[color:var(--outline-variant)]/40" />
                  <div className="text-xs font-semibold tracking-wider text-[color:var(--muted-foreground)]">
                    OR
                  </div>
                  <div className="h-px flex-1 bg-[color:var(--outline-variant)]/40" />
                </div>

                {error ? (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                {message ? (
                  <div className="mt-5 rounded-xl border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] p-3 text-sm">
                    {message}
                  </div>
                ) : null}

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FieldLabel>Email</FieldLabel>
                    <input
                      className="lm-input mt-2 h-12 w-full px-4 text-[15px]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="col-span-2">
                    <FieldLabel>Password</FieldLabel>
                    <input
                      className="lm-input mt-2 h-12 w-full px-4 text-[15px]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={signInWithEmail}
                    disabled={busy}
                    className="h-12 rounded-xl bg-[color:var(--primary)] text-white font-semibold shadow-[0_6px_18px_rgba(35,70,213,0.18)] hover:bg-[color:var(--primary-container)] transition-colors disabled:opacity-60"
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={signUpWithEmail}
                    disabled={busy}
                    className="h-12 rounded-xl border border-[color:var(--outline-variant)] bg-white font-semibold text-[color:var(--primary)] hover:bg-[rgba(67,97,238,0.06)] transition-colors disabled:opacity-60"
                  >
                    Create account
                  </button>

                  <div className="col-span-2 text-xs text-[color:var(--muted-foreground)]">
                    Redirect after sign-in: <span className="font-semibold">{next}</span>
                  </div>
                </div>
              </div>
            </section>

            <aside className="hidden lg:block col-span-6">
              <div className="rounded-3xl bg-[rgba(67,97,238,0.06)] border border-[rgba(67,97,238,0.12)] p-10 shadow-[0_18px_50px_rgba(35,70,213,0.06)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-widest uppercase text-[color:var(--primary)]">
                      Week 1 MVP
                    </div>
                    <div className="mt-2 text-[28px] font-extrabold tracking-[-0.02em]">
                      Why sign-in is required
                    </div>
                    <p className="mt-3 text-[16px] text-[color:var(--muted-foreground)] max-w-[52ch]">
                      We save your roadmap, guide progress, and quiz unlocks to your account. This prevents expensive re-generation and keeps your learning consistent across devices.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[color:var(--outline-variant)]/30 flex items-center justify-center text-[color:var(--primary)]">
                    <MaterialSymbol name="shield" filled />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {[
                    { icon: "map", title: "Saved roadmaps", desc: "Reopen anytime from My Roadmaps." },
                    { icon: "auto_awesome", title: "Cached guides", desc: "Guides generate once, then load fast." },
                    { icon: "quiz", title: "Quiz unlocks", desc: "Pass 4/5 to unlock the next chapter." },
                    { icon: "devices", title: "Sync", desc: "Continue on desktop or mobile." },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="rounded-2xl bg-white border border-[color:var(--outline-variant)]/20 p-5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[rgba(67,97,238,0.10)] text-[color:var(--primary)] flex items-center justify-center">
                        <MaterialSymbol name={f.icon} />
                      </div>
                      <div className="mt-3 text-sm font-semibold">{f.title}</div>
                      <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                        {f.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Mobile (keep original structure, light polish) */}
      <div className="lg:hidden">
        <header className="mx-auto flex h-[52px] w-full max-w-[390px] items-center justify-between px-5">
          <button
            type="button"
            className="text-[color:var(--primary)]"
            onClick={() => router.back()}
          >
            ←
          </button>
          <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
            Sign in
          </div>
          <div className="w-6" />
        </header>

        <main className="mx-auto flex w-full max-w-[390px] flex-col gap-5 px-5 pt-6 pb-[90px]">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
              AUTH
            </div>
            <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-[-0.02em]">
              Continue to LearnMap
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Sign in to generate and save your personal roadmaps.
            </p>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-xl border border-[color:var(--border)] bg-white p-3 text-sm">
              {message}
            </div>
          ) : null}

          <div className="lm-card p-5">
            <div className="text-sm font-semibold">Quick sign-in</div>
            <div className="mt-3 flex flex-col gap-2">
              <button
                type="button"
                className="h-11 rounded-xl border border-[color:var(--border)] bg-white px-4 text-sm font-semibold text-[color:var(--foreground)]"
                onClick={() => signInWithProvider("google")}
                disabled={busy}
              >
                Continue with Google
              </button>
              <button
                type="button"
                className="h-11 rounded-xl border border-[color:var(--border)] bg-white px-4 text-sm font-semibold text-[color:var(--foreground)]"
                onClick={() => signInWithProvider("discord")}
                disabled={busy}
              >
                Continue with Discord
              </button>
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[color:var(--border)]" />
              <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
                OR
              </div>
              <div className="h-px flex-1 bg-[color:var(--border)]" />
            </div>

            <div className="grid gap-3">
              <div>
                <FieldLabel>Email</FieldLabel>
                <input
                  className="lm-input mt-2 h-11 w-full px-4 text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div>
                <FieldLabel>Password</FieldLabel>
                <input
                  className="lm-input mt-2 h-11 w-full px-4 text-sm"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="button"
                className="lm-btn-primary h-11 w-full font-semibold disabled:opacity-60"
                onClick={signInWithEmail}
                disabled={busy}
              >
                Sign in
              </button>
              <button
                type="button"
                className="h-11 w-full rounded-xl border border-[color:var(--border)] bg-white font-semibold text-[color:var(--primary)] disabled:opacity-60"
                onClick={signUpWithEmail}
                disabled={busy}
              >
                Create account
              </button>
            </div>
          </div>

          <div className="text-xs text-[color:var(--muted-foreground)]">
            Next: <span className="font-semibold">{next}</span>
          </div>
        </main>
      </div>
    </div>
  );
}
