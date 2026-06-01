import { Suspense } from "react";

import QuestionsClient from "@/app/learn/questions/QuestionsClient";

export default function LearnQuestionsPage() {
  return (
    <Suspense fallback={<div className="p-5 text-sm">Loading…</div>}>
      <QuestionsClient />
    </Suspense>
  );
}
