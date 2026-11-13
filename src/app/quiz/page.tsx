import type { Metadata } from "next";
import { Award, BookOpen, Brain, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { QuizGame } from "@/components/quiz/QuizGame";
import { quizQuestions } from "@/data/community";

export const metadata: Metadata = {
  title: "TalkNest Quiz",
  description:
    "Play a fun quiz about books, authors and Islamic history. Answer correctly and earn the Bookworm Champion title.",
};

const leaderboard = [
  { name: "Tasnim Jahan", score: "6/6", city: "Chattogram", color: "#1b5b45" },
  { name: "Ariful Islam", score: "6/6", city: "Rajshahi", color: "#9a4830" },
  { name: "Nafisa Tabassum", score: "5/6", city: "Dhaka", color: "#6b4b7a" },
  { name: "Sadia Afrin", score: "5/6", city: "Sylhet", color: "#365f8e" },
];

export default function QuizPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Quiz"
        title="How much of a bookworm are you?"
        description="Six questions on Bengali literature, authors and Islamic history. Every answer brings the joy of learning something new — start today."
        tone="dark"
        crumbs={[{ label: "Quiz" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            <Brain size={11} /> {quizQuestions.length} questions
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            <Trophy size={11} /> Bookworm Champion
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            <Users size={11} /> Reader community
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_290px] lg:items-start">
            <QuizGame />

            <aside className="space-y-3 lg:sticky lg:top-[88px]">
              <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-gold-600" />
                  <h2 className="font-display text-base font-bold text-forest-950">This week's leaderboard</h2>
                </div>
                <div className="mt-3 space-y-1.5">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2.5 rounded-xl bg-cream-100/50 px-3 py-2.5">
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
                        <span className="block truncate text-[10px] font-medium text-forest-900">{entry.name}</span>
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
                <h2 className="mt-1.5 font-display text-base font-bold">Grow your knowledge</h2>
                <p className="mt-1 text-[9px] leading-relaxed text-cream-100/55">
                  The answers to the quiz are hidden in the pages of our books. Pick up
                  a new book today.
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
                  <li>• You'll get a total score and title at the end</li>
                  <li>• Demo quiz — no real prizes</li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
