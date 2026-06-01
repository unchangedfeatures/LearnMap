import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sanitizeNext } from "@/lib/auth/next";

export async function requireUser(nextPath?: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    const next = sanitizeNext(nextPath || "/roadmaps");
    redirect(`/auth?next=${encodeURIComponent(next)}`);
  }

  return { supabase, user: data.user };
}

export async function requireRealUser(nextPath?: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const user = data.user;

  if (!user) {
    const next = sanitizeNext(nextPath || "/roadmaps");
    redirect(`/auth?next=${encodeURIComponent(next)}`);
  }

  // Supabase anonymous sessions still produce a "user".
  // Week 1 MVP rule: anonymous users cannot generate/persist personal content.
  if ((user as any).is_anonymous === true) {
    const next = sanitizeNext(nextPath || "/roadmaps");
    redirect(`/auth?next=${encodeURIComponent(next)}`);
  }

  return { supabase, user };
}
