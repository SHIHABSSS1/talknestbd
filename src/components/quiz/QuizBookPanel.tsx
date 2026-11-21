"use client";

import Link from "next/link";
import { BookOpen, CircleHelp, Clock3, Trophy } from "lucide-react";

import { useVideoQuiz } from "@/components/providers/VideoQuizProvider";
import { QuizGame } from "@/components/quiz/QuizGame";
import { QuizLeaderboard } from "@/components/quiz/QuizLeaderboard";
import { CommentThread } from "@/components/community/CommentThread";
import { toBn } from "@/lib/utils";

export function QuizBookPanel() {
  const { copy, quizOfType, loading } = useVideoQuiz();
  const quiz = quizOfType("book");

  if (loading && !quiz) {
    return <div className="h-80 animate-pulse rounded-[10px] bg-white" aria-hidden="true" />;
  }

  return (
    <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_290px] lg:items-start">
      <div className="space-y-4">
        <div className="rounded-[10px] border border-line bg-white p-4 shadow-[0_24px_60px_-56px_rgba(8,42,82,0.55)] sm:p-6">
          {quiz ? (
            <>
              <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-line pb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-gold-300">
                  <Trophy size={11} /> {quiz.title}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted">
                  <CircleHelp size={10} /> {toBn(quiz.questionCount)} questions
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[9px] text-muted">
                  <Clock3 size={10} /> {quiz.durationMinutes || 2} minutes
                </span>
              </div>
              <QuizGame quiz={quiz} />
            </>
          ) : (
            <p className="py-10 text-center text-[12px] text-muted">No book quiz is published yet.</p>
          )}
        </div>
        {quiz && <CommentThread target="quiz" targetId={quiz.id} title="Book quiz discussion" />}
      </div>

      <aside className="space-y-3 lg:sticky lg:top-[88px]">
        <QuizLeaderboard mode="preview" limit={6} />

        <div className="rounded-3xl bg-forest-950 p-4 text-cream-50">
          <BookOpen size={18} className="text-gold-400" />
          <h2 className="mt-1.5 font-display text-base font-bold">Grow your knowledge</h2>
          <p className="mt-1 text-[9px] leading-relaxed text-cream-100/55">
            The answers to the quiz are hidden in the pages of our books. Pick up a new book today.
          </p>
          <Link href="/books" className="mt-2.5 inline-flex h-8 items-center rounded-full bg-gold-500 px-3.5 text-[9px] font-semibold text-forest-950 hover:bg-gold-400">
            Browse books
          </Link>
        </div>

        <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
          <p className="text-[10px] font-semibold text-forest-950">
            {copy.quizPage.eyebrow} rules
          </p>
          <ul className="mt-1.5 space-y-1 text-[9px] leading-relaxed text-muted">
            <li>• Each question has one correct answer</li>
            <li>• An explanation appears after you answer</li>
            <li>• Your best score is ranked on the leaderboard</li>
            <li>• Sign in to save your result — no prizes</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
