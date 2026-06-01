export function sanitizeNext(raw: string | null | undefined): string {
  const fallback = "/roadmaps";
  const next = typeof raw === "string" ? raw.trim() : "";
  if (!next) return fallback;

  // Must be a relative path.
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;

  // Prevent weird whitespace/control chars.
  if (/\s/.test(next)) return fallback;

  // Conservative allowlist.
  // Keep this small. Only allow internal pages we explicitly support.
  if (
    next === "/" ||
    next === "/demo" ||
    next === "/help" ||
    next === "/learn" ||
    next.startsWith("/learn/") ||
    next === "/roadmaps" ||
    next.startsWith("/roadmap/") ||
    next.startsWith("/guide/") ||
    next.startsWith("/quiz/") ||
    next === "/progress" ||
    next === "/profile" ||
    next === "/settings"
  ) {
    return next;
  }

  return fallback;
}
