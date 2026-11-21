"use client";

import { BookOpen, Brain, PlayCircle, Trophy } from "lucide-react";
import { useVideoQuiz } from "@/components/providers/VideoQuizProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { toBn } from "@/lib/utils";

export function QuizPageHeader() {
  const { copy, quizzes } = useVideoQuiz();
  const page = copy.quizPage;
  const [first, second, third, fourth] = page.pills;

  return (
    <PageHeader
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      tone="dark"
      crumbs={[{ label: "Quiz" }]}
    >
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
          <PlayCircle size={11} /> {first}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
          <BookOpen size={11} /> {second}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
          <Brain size={11} /> {toBn(quizzes.length)} {third}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
          <Trophy size={11} /> {fourth}
        </span>
      </div>
    </PageHeader>
  );
}
