"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { postJson } from "@/lib/http/json";

export default function MarkCompleteClient({
  guideId,
  chapterId,
}: {
  guideId: string;
  chapterId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  async function onMarkComplete() {
    setBusy(true);
    setError("");
    try {
      const res = await postJson<{
        nextGuideId: string | null;
        chapterComplete: boolean;
      }>("/api/progress/complete-guide", { guideId });

      if (res.nextGuideId) {
        router.replace(`/guide/${res.nextGuideId}`);
        return;
      }

      // Chapter done -> go to quiz.
      if (res.chapterComplete) {
        router.replace(`/quiz/${chapterId}`);
        return;
      }

      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to mark complete.";
      if (msg.toLowerCase().includes("please sign in")) {
        setError("Please sign in again to save progress.");
      } else if (msg.toLowerCase().includes("not authorized")) {
        setError("You don’t have access to this roadmap.");
      } else if (msg.toLowerCase().includes("row level security") || msg.toLowerCase().includes("policy")) {
        setError(
          "Saving failed due to a database policy. Apply the UPDATE policies from supabase/schema.sql in Supabase, then retry."
        );
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        className="lm-btn-primary h-[56px] w-full font-bold shadow-[0_4px_20px_rgba(35,70,213,0.15)] disabled:opacity-50"
        onClick={onMarkComplete}
        disabled={busy}
      >
        {busy ? "Saving…" : "Mark complete"}
      </button>
    </div>
  );
}
