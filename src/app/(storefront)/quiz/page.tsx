import type { Metadata } from "next";
import { Suspense } from "react";
import { Award, BookOpen, Brain, PlayCircle, Trophy, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { QuizPageHeader } from "@/components/quiz/QuizPageHeader";
import { QuizGame } from "@/components/quiz/QuizGame";
import { QuizTabs, type QuizTab } from "@/components/quiz/QuizTabs";
import { WatchQuiz } from "@/components/quiz/WatchQuiz";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "TalkNest Quiz — Watch & Quiz and Book Quiz",
  description:
    "Two ways to play: watch a TalkNest episode and take the quiz below it, or jump straight into the book quiz and this week's leaderboard.",
};

const leaderboard = [
  { name: "Tasnim Jahan", score: "6/6", city: "Chattogram", color: "#1b5b45" },
  { name: "Ariful Islam", score: "6/6", city: "Rajshahi", color: "#9a4830" },
  { name: "Nafisa Tabassum", score: "5/6", city: "Dhaka", color: "#6b4b7a" },
  { name: "Sadia Afrin", score: "5/6", city: "Sylhet", color: "#365f8e" },
];

export default function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return (
    <>
      <QuizPageHeader />

      <section className="bg-canvas py-8 sm:py-10">
        <Container>
          <Suspense fallback={<QuizLoading />}>
            <QuizContent searchParams={searchParams} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}

function QuizLoading() {
  return (
    <div aria-hidden="true">
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-[78px] animate-pulse rounded-[8px] border border-line bg-white"
          />
        ))}
      </div>
      <div className="mt-5 h-64 animate-pulse rounded-[10px] border border-line bg-white sm:h-80" />
    </div>
  );
}

async function QuizContent({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active: QuizTab = tab === "book" ? "book" : "watch";

  return (
    <>
      <QuizTabs active={active} />

      {active === "watch" ? (
        <div className="mt-5 rounded-[10px] border border-line bg-white p-4 shadow-[0_24px_60px_-56px_rgba(8,42,82,0.55)] sm:p-6">
          <WatchQuiz mode="page" />
        </div>
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_290px] lg:items-start">
          <div className="rounded-[10px] border border-line bg-white p-4 shadow-[0_24px_60px_-56px_rgba(8,42,82,0.55)] sm:p-6">
            <QuizGame />
          </div>

          <aside className="space-y-3 lg:sticky lg:top-[88px]">
            <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-gold-600" />
                <h2 className="font-display text-base font-bold text-forest-950">
                  This week&apos;s leaderboard
                </h2>
              </div>
              <div className="mt-3 space-y-1.5">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-2.5 rounded-xl bg-cream-100/50 px-3 py-2.5"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest-900 font-display text-[9px] font-bold text-gold-300">
                      {index + 1}
                    </span>
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold text-cream-50"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10px] font-medium text-forest-900">
                        {entry.name}
                      </span>
                      <span className="block text-[8px] text-muted">{entry.city}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-gold-500/15 px-2 py-0.5 text-[9px] font-bold text-gold-600">
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-forest-950 p-4 text-cream-50">
              <BookOpen size={18} className="text-gold-400" />
              <h2 className="mt-1.5 font-display text-base font-bold">
                Grow your knowledge
              </h2>
              <p className="mt-1 text-[9px] leading-relaxed text-cream-100/55">
                The answers to the quiz are hidden in the pages of our books. Pick
                up a new book today.
              </p>
              <a
                href="/books"
                className="mt-2.5 inline-flex h-8 items-center rounded-full bg-gold-500 px-3.5 text-[9px] font-semibold text-forest-950 hover:bg-gold-400"
              >
                Browse books
              </a>
            </div>

            <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
              <p className="text-[10px] font-semibold text-forest-950">Quiz rules</p>
              <ul className="mt-1.5 space-y-1 text-[9px] leading-relaxed text-muted">
                <li>• Each question has only one correct answer</li>
                <li>• An explanation appears after you answer</li>
                <li>• You&apos;ll get a total score and title at the end</li>
                <li>• Demo quiz — no real prizes</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
