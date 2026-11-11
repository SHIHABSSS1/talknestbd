"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { quizQuestions } from "@/data/community";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function QuizGame() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[index];
  const answered = selected !== null;
  const correct = answered && selected === question.answerIndex;
  const score = answers.reduce((sum, answer, questionIndex) => {
    return sum + (answer === quizQuestions[questionIndex]?.answerIndex ? 1 : 0);
  }, 0);
  const progress = useMemo(
    () => Math.round((index / quizQuestions.length) * 100),
    [index],
  );

  const choose = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = optionIndex;
      return next;
    });
  };

  const next = () => {
    if (index + 1 >= quizQuestions.length) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const badge =
      percentage >= 80
        ? { title: "বইপোকা চ্যাম্পিয়ন", emoji: "🏆", text: "আপনার বই ও ইতিহাসের জ্ঞান অসাধারণ!" }
        : percentage >= 50
          ? { title: "পাঠক পাঠিকা", emoji: "📚", text: "ভালো করছেন! আরও বই পড়লেই চ্যাম্পিয়ন।" }
          : { title: "নতুন পাঠক", emoji: "🌱", text: "শুরুটা হয়েছে — প্রতিটি প্রশ্নই শেখার সুযোগ।" };

    return (
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-950 p-6 text-center text-cream-50 sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.1]" />
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold-400/20" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-500 font-display text-3xl">
              {badge.emoji}
            </span>
            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              TalkNest Quiz Result
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{badge.title}</h2>
            <p className="mt-1 text-xs text-cream-100/55">{badge.text}</p>

            <div className="mx-auto mt-5 flex max-w-xs items-center justify-center gap-5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div>
                <p className="font-display text-3xl font-bold text-gold-300">
                  {toBn(score)}/{toBn(quizQuestions.length)}
                </p>
                <p className="text-[8px] text-cream-100/45">সঠিক উত্তর</p>
              </div>
              <span className="h-10 w-px bg-white/10" />
              <div>
                <p className="font-display text-3xl font-bold text-gold-300">{toBn(percentage)}%</p>
                <p className="text-[8px] text-cream-100/45">স্কোর</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button type="button" variant="gold" size="sm" onClick={restart}>
                <RotateCcw size={13} /> আবার খেলুন
              </Button>
              <Button href="/books" variant="light" size="sm">
                <BookOpen size={13} /> বই ঘুরে দেখুন
              </Button>
              <Button href="/reviews" variant="light" size="sm">
                রিভিউ পড়ুন
              </Button>
            </div>
            <p className="mt-4 text-[8px] text-cream-100/35">
              ডেমো কুইজ · কোনো পুরস্কার স্বয়ংক্রিয়ভাবে প্রদান করা হয় না
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
          <p className="flex items-center gap-2 text-[11px] font-semibold text-forest-950">
            <Sparkles size={13} className="text-gold-600" /> আজকের স্কোর কার্ড
          </p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {quizQuestions.map((item, questionIndex) => {
              const userAnswer = answers[questionIndex];
              const isCorrect = userAnswer === item.answerIndex;
              return (
                <div key={item.question} className="flex items-start gap-1.5 rounded-lg bg-cream-100/60 px-2.5 py-2 text-[9px]">
                  {isCorrect ? (
                    <CheckCircle2 size={11} className="mt-0.5 shrink-0 text-forest-600" />
                  ) : (
                    <XCircle size={11} className="mt-0.5 shrink-0 text-clay-500" />
                  )}
                  <span className="line-clamp-2 text-forest-800/80">{item.question}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-gold-300">
          <CircleHelp size={11} /> বুক কুইজ
        </span>
        <span className="text-[10px] font-semibold text-forest-800">
          প্রশ্ন {toBn(index + 1)} / {toBn(quizQuestions.length)}
        </span>
      </div>

      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cream-300">
        <div className="h-full rounded-full bg-gold-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-7">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-clay-500">
          Question {toBn(index + 1)}
        </p>
        <h2 className="mt-2 font-display text-xl font-bold leading-snug text-forest-950 sm:text-2xl">
          {question.question}
        </h2>

        <div className="mt-4 grid gap-2">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isCorrectOption = optionIndex === question.answerIndex;
            let tone =
              "border-forest-900/10 bg-cream-50 text-forest-900 hover:border-forest-900/35 hover:bg-cream-100";
            if (answered) {
              if (isCorrectOption) tone = "border-forest-600 bg-forest-100/70 text-forest-900";
              else if (isSelected) tone = "border-clay-500 bg-clay-500/8 text-clay-700";
              else tone = "border-forest-900/8 bg-cream-50 text-forest-900/50";
            }
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(optionIndex)}
                disabled={answered}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[12px] font-medium transition-colors disabled:cursor-default",
                  tone,
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9px] font-bold",
                    answered && isCorrectOption
                      ? "bg-forest-700 text-cream-50"
                      : answered && isSelected
                        ? "bg-clay-500 text-cream-50"
                        : "bg-cream-200 text-forest-800",
                  )}
                >
                  {answered && isCorrectOption ? (
                    <CheckCircle2 size={13} />
                  ) : answered && isSelected ? (
                    <XCircle size={13} />
                  ) : (
                    String.fromCharCode(2453 + optionIndex)
                  )}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={cn(
              "mt-4 rounded-xl border px-3.5 py-3",
              correct ? "border-forest-600/25 bg-forest-100/60" : "border-clay-500/25 bg-clay-500/5",
            )}
          >
            <p className={cn("flex items-center gap-1.5 text-[11px] font-semibold", correct ? "text-forest-900" : "text-clay-700")}>
              {correct ? <CheckCircle2 size={14} /> : <Lightbulb size={14} />}
              {correct ? "সঠিক উত্তর!" : "উত্তরটি ঠিক হয়নি"}
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-forest-800/75">{question.explanation}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-forest-900/8 pt-4">
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted hover:text-forest-900"
          >
            <RotateCcw size={11} /> রিসেট
          </button>
          <Button type="button" size="sm" onClick={next} disabled={!answered}>
            {index + 1 >= quizQuestions.length ? (
              <>
                ফলাফল দেখুন <Trophy size={13} />
              </>
            ) : (
              <>
                পরের প্রশ্ন <ArrowRight size={13} />
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="mt-3 text-center text-[9px] text-muted">
        বই, লেখক ও ইতিহাস নিয়ে {toBn(quizQuestions.length)}টি প্রশ্ন · প্রতিটি সঠিক উত্তরে{" "}
        <Link href="/books" className="font-semibold text-clay-600">নতুন কিছু শেখার</Link> সুযোগ
      </p>
    </div>
  );
}
