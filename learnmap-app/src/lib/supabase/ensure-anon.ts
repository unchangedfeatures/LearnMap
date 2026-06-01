import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Ensures the user has a Supabase session (anonymous for MVP).
 * Call from client-side code.
 */
export async function ensureAnonymousSession() {
  const supabase = createSupabaseBrowserClient();

  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) return sessionData.session;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.session) {
    if (error?.message?.toLowerCase().includes("anonymous sign-ins are disabled")) {
      throw new Error(
        "Anonymous sign-ins are disabled in Supabase. Enable them in Supabase Dashboard → Authentication → Providers (or Settings) → Anonymous Sign-ins."
      );
    }

    throw new Error(error?.message || "Failed to start an anonymous session.");
  }

  return data.session;
}
