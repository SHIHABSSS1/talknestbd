import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { QuizPageHeader } from "@/components/quiz/QuizPageHeader";
import { QuizTabs, type QuizTab } from "@/components/quiz/QuizTabs";
import { WatchQuiz } from "@/components/quiz/WatchQuiz";
import { QuizBookPanel } from "@/components/quiz/QuizBookPanel";
import { QuizLeaderboard } from "@/components/quiz/QuizLeaderboard";

export const metadata: Metadata = {
  title: "TalkNest Quiz — Watch & Quiz, Book Quiz and Leaderboard",
  description:
    "Take the Watch & Quiz or the Book Quiz, then compare your score on the live reader leaderboard.",
};

function QuizLoading() {
  return (
    <div aria-hidden="true">
      <div className="grid gap-2.5 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-24 animate-pulse rounded-[8px] border border-line bg-white" />
        ))}
      </div>
      <div className="mt-5 h-80 animate-pulse rounded-[10px] border border-line bg-white" />
    </div>
  );
}

async function QuizContent({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const active: QuizTab =
    tab === "book" ? "book" : tab === "leaderboard" ? "leaderboard" : "watch";

  return (
    <>
      <QuizTabs active={active} />
      {active === "watch" ? (
        <div className="mt-5 rounded-[10px] border border-line bg-white p-4 shadow-[0_24px_60px_-56px_rgba(8,42,82,0.55)] sm:p-6">
          <WatchQuiz mode="page" />
        </div>
      ) : active === "book" ? (
        <QuizBookPanel />
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_290px] lg:items-start">
          <div className="rounded-[10px] border border-line bg-white p-4 sm:p-6">
            <QuizLeaderboard mode="full" />
          </div>
          <aside className="space-y-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
            <p className="text-[11px] font-semibold text-forest-950">How ranking works</p>
            <ul className="space-y-1.5 text-[10px] leading-relaxed text-muted">
              <li>• Each submission is scored on the server</li>
              <li>• Your best result per quiz is ranked</li>
              <li>• The overall board compares your best percentage</li>
              <li>• Trying again cannot lower your rank</li>
            </ul>
            <p className="border-t border-brand-100 pt-3 text-[9px] text-muted">
              <span className="font-semibold text-brand-700">Note:</span> a friendly reading quiz for fun — no prizes.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}

export default function QuizPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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
