import { NextResponse } from "next/server";

import { sanitizeNext } from "@/lib/auth/next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code") || "";
  const nextRaw = url.searchParams.get("next");
  const next = sanitizeNext(nextRaw);

  if (!code) {
    return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(next)}`, url));
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/auth?next=${encodeURIComponent(next)}`, url));
  }

  return NextResponse.redirect(new URL(next, url));
}
