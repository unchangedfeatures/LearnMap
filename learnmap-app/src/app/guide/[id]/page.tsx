import AppShell from "@/lib/ui/AppShell";
import { requireRealUser } from "@/lib/auth/require-user";

import ScrollProgressBar from "@/lib/ui/ScrollProgressBar";

import GuidePageClient from "./GuidePageClient";
import GuideSidebarClient from "./GuideSidebarClient";

function GuideError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}


export default async function GuidePage({ params }: { params: { id: string } }) {
  const { supabase } = await requireRealUser("/roadmaps");

  const { data: guide, error: guideErr } = await supabase
    .from("guides")
    .select("id, title, status, position, content_md, chapter_id")
    .eq("id", params.id)
    .single();

  if (guideErr) {
    return (
      <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)] p-5">
        <GuideError message={guideErr.message} />
      </div>
    );
  }

  const { data: chapter, error: chapterErr } = await supabase
    .from("chapters")
    .select("id, title, position, roadmap_id")
    .eq("id", guide.chapter_id)
    .single();

  if (chapterErr) {
    return (
      <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)] p-5">
        <GuideError message={chapterErr.message} />
      </div>
    );
  }

  const { data: roadmap, error: roadmapErr } = await supabase
    .from("roadmaps")
    .select("id, title, topic, persona")
    .eq("id", chapter.roadmap_id)
    .single();

  if (roadmapErr) {
    return (
      <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--on-surface)] p-5">
        <GuideError message={roadmapErr.message} />
      </div>
    );
  }

  const initialContentMd: string = String(guide.content_md || "");

  const chapterNumber = Number(chapter.position) + 1;
  const guideNumber = Number(guide.position) + 1;

  return (
    <AppShell
      title="Guide"
      subtitle={`${roadmap.title} · Chapter ${chapterNumber}`}
      sidebarContent={
        <GuideSidebarClient
          roadmapId={chapter.roadmap_id}
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          chapterNumber={chapterNumber}
          guideId={guide.id}
          guideTitle={guide.title}
          guideNumber={guideNumber}
        />
      }
    >
      <div className="-mx-5 lg:-mx-[var(--lm-margin)] -my-10">
        {/* Scroll progress bar (reading progress) */}
        <ScrollProgressBar containerId="lm-guide-scroll" />

        <GuidePageClient
          roadmapId={chapter.roadmap_id}
          chapterId={chapter.id}
          chapterTitle={chapter.title}
          chapterNumber={chapterNumber}
          guideId={guide.id}
          guideTitle={guide.title}
          guideNumber={guideNumber}
          initialContentMd={initialContentMd}
        />
      </div>
    </AppShell>
  );
}

