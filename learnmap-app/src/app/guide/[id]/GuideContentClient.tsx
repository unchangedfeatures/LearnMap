"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { postJson } from "@/lib/http/json";

import GuideMarkdown from "./GuideMarkdown";

function GuideError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function SkeletonLine({ w }: { w: string }) {
  return (
    <div
      className="h-3 rounded-full bg-[color:var(--surface-container-high)] animate-pulse"
      style={{ width: w }}
    />
  );
}

export default function GuideContentClient({
  guideId,
  initialContentMd,
  onBusyChange,
}: {
  guideId: string;
  initialContentMd: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const router = useRouter();
  const [contentMd, setContentMd] = useState(initialContentMd);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    let running = false;

    async function run() {
      if (running) return;
      if (String(contentMd || "").trim()) return;

      running = true;
      setBusy(true);
      onBusyChange?.(true);
      setError("");
      try {
        const res = await postJson<{ contentMd: string }>("/api/ai/guide", { guideId });
        if (!alive) return;
        const md = String((res as any)?.contentMd || "").trim();
        if (!md) throw new Error("Guide generation returned empty content.");
        setContentMd(md + "\n");

        // Ensure server components pick up the cached content.
        router.refresh();
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Guide generation failed.");
      } finally {
        running = false;
        if (!alive) return;
        setBusy(false);
        onBusyChange?.(false);
      }
    }

    run();

    return () => {
      alive = false;
      running = false;
      setBusy(false);
      onBusyChange?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId]);

  useEffect(() => {
    setContentMd(initialContentMd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId, initialContentMd]);

  if (error) return <GuideError message={error} />;

  if (!String(contentMd || "").trim()) {
    return (
      <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-10 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
        <div className="text-sm font-semibold">
          {busy ? "Generating your guide…" : "Preparing your guide…"}
        </div>
        <div className="mt-2 text-sm text-[color:var(--muted-foreground)]">
          This usually takes a few seconds.
        </div>

        <div className="mt-8 space-y-4">
          <SkeletonLine w="92%" />
          <SkeletonLine w="88%" />
          <SkeletonLine w="75%" />

          <div className="h-6" />

          <SkeletonLine w="80%" />
          <SkeletonLine w="90%" />
          <SkeletonLine w="72%" />

          <div className="h-6" />

          <SkeletonLine w="86%" />
          <SkeletonLine w="64%" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[color:var(--outline-variant)]/20 bg-white p-10 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
      <div className="font-[family-name:var(--font-literata)] text-[17px] leading-[1.8]">
        <GuideMarkdown md={contentMd} />
      </div>
    </div>
  );
}
