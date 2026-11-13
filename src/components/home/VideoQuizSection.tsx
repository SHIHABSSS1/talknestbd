import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleHelp, Play, Trophy } from "lucide-react";
import { videos, quizQuestions } from "@/data/community";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function VideoQuizSection() {
  const feature = videos[0];
  const question = quizQuestions[0];

  return (
    <section className="bg-canvas py-8 sm:py-10">
      <Container>
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <Link
            href="/video"
            className="group relative min-h-[340px] overflow-hidden rounded-[8px] bg-brand-950 text-white"
          >
            <img
              src={feature.thumbnail}
              alt={feature.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/60 to-brand-950/10" />
            <div className="relative flex h-full min-h-[340px] flex-col justify-between p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-[3px] bg-brand-600 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]">
                  TalkNest Video
                </span>
                <span className="rounded-[3px] bg-brand-950/60 px-2 py-1 text-[9px] text-white/75 backdrop-blur">
                  {feature.duration}
                </span>
              </div>

              <div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-brand-700 transition-transform duration-300 group-hover:scale-105">
                  <Play size={19} className="ml-0.5 fill-current" />
                </span>
                <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-brand-200">
                  {feature.category}
                </p>
                <h2 className="mt-1 max-w-md text-2xl font-bold leading-snug sm:text-[26px]">
                  {feature.title}
                </h2>
                <p className="mt-2 max-w-md text-[12px] leading-relaxed text-white/65 sm:text-[13px]">
                  Conversations with authors, honest book reviews and stories
                  from readers — a closer look at the books we love.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-brand-200">
                  Watch all videos
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </div>
          </Link>

          <div className="relative overflow-hidden rounded-[8px] border border-brand-200 bg-brand-50 p-5 sm:p-7">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-brand-200"
            />
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-24 w-24 rounded-full border border-brand-200"
            />
            <div className="relative flex h-full min-h-[340px] flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-brand-600 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white">
                  <Trophy size={11} />
                  TalkNest Quiz
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-[4px] bg-white text-brand-600">
                  <CircleHelp size={20} />
                </span>
              </div>

              <div className="mt-6">
                <SectionTitle
                  size="lg"
                  eyebrow={"Today's question"}
                  title="How well do you know your books?"
                  description="Test yourself on books, authors and literary history. Answer correctly and unlock discounts and small reader rewards."
                />

                <div className="mt-4 rounded-[8px] border border-brand-200 bg-white p-3.5">
                  <p className="text-[12px] font-medium text-ink">
                    {question.question}
                  </p>
                  <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                    {question.options.slice(0, 2).map((option) => (
                      <span
                        key={option}
                        className="rounded-[3px] border border-line bg-canvas px-2.5 py-2 text-[10px] text-body"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button href="/quiz" variant="primary">
                    Start the quiz
                    <ArrowRight size={14} />
                  </Button>
                  <span className="text-[10px] text-muted">
                    6 questions · 2 minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
