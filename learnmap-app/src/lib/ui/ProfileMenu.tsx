"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState<string>("");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient> | null>(null);
  if (!supabaseRef.current) {
    supabaseRef.current = createSupabaseBrowserClient();
  }

  useEffect(() => {
    let alive = true;

    const supabase = supabaseRef.current!;

    async function load() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!alive) return;
        const u = data.user;
        const isAnon = (u as any)?.is_anonymous === true;
        setEmail(!u || isAnon ? "" : u.email || "");
      } catch {
        // Non-critical UI.
      }
    }

    load();

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      const isAnon = (u as any)?.is_anonymous === true;
      setEmail(!u || isAnon ? "" : u.email || "");

      if (!session) {
        setOpen(false);
        setBusy(false);
      }
    });

    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as any)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      alive = false;
      authSub?.subscription?.unsubscribe();
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, []);

  async function onSignOut() {
    setBusy(true);
    try {
      const supabase = supabaseRef.current!;
      await supabase.auth.signOut();
      router.replace("/auth");
      router.refresh();
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full bg-[color:var(--surface-container-high)] border border-[color:var(--surface-container-highest)] hover:bg-[color:var(--surface-container)] transition-colors inline-flex items-center justify-center"
        aria-label="Profile"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="text-[18px] text-[color:var(--muted-foreground)]" aria-hidden>
          <MaterialSymbol name="person" filled />
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-[color:var(--outline-variant)]/30 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden"
        >
          <div className="px-4 py-3 bg-[color:var(--surface-container-low)] border-b border-[color:var(--outline-variant)]/20">
            <div className="text-xs font-semibold tracking-wide text-[color:var(--muted-foreground)]">
              Signed in
            </div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--on-surface)] truncate">
              {email || "Account"}
            </div>
          </div>

          <div className="p-2">
            <button
              type="button"
              role="menuitem"
              onClick={onSignOut}
              disabled={busy}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[rgba(186,26,26,0.95)] hover:bg-[rgba(186,26,26,0.06)] transition-colors disabled:opacity-60"
            >
              <span className="text-[20px]" aria-hidden>
                <MaterialSymbol name="logout" />
              </span>
              <span>{busy ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
