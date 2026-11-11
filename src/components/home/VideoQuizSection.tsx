import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleHelp, Play, Trophy } from "lucide-react";
import { videos, quizQuestions } from "@/data/community";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function VideoQuizSection() {
  const feature = videos[0];
  const question = quizQuestions[0];

  return (
    <section className="py-9 sm:py-12">
      <Container>
        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            href="/video"
            className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-forest-950 text-cream-50"
          >
            <img
              src={feature.thumbnail}
              alt={feature.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/10" />
            <div className="relative flex h-full min-h-[360px] flex-col justify-between p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur">
                  TalkNest Video
                </span>
                <span className="rounded-full bg-forest-950/60 px-2.5 py-1 text-[9px] text-cream-100/70 backdrop-blur">
                  {feature.duration}
                </span>
              </div>

              <div>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-forest-950 shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <Play size={22} className="ml-0.5 fill-forest-950" />
                </span>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {feature.category}
                </p>
                <h2 className="mt-1.5 max-w-md font-display text-2xl font-bold leading-snug sm:text-3xl">
                  {feature.title}
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-cream-100/60 sm:text-[13px]">
                  লেখক, বই ও পাঠকের গল্প নিয়ে TalkNest-এর ভিডিও আয়োজন। দেখুন,
                  শুনুন এবং নতুন বইয়ের খোঁজ পান।
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300">
                  সব ভিডিও দেখুন
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          <div className="relative overflow-hidden rounded-[2rem] border border-gold-500/25 bg-cream-200 p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-forest-900/10"
            />
            <div
              aria-hidden="true"
              className="absolute -right-5 -top-5 h-24 w-24 rounded-full border border-forest-900/10"
            />
            <div className="relative flex h-full min-h-[360px] flex-col justify-between">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  <Trophy size={11} />
                  TalkNest Quiz
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-950 text-gold-300">
                  <CircleHelp size={21} />
                </span>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-clay-600">
                  আজকের প্রশ্ন
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-forest-950 sm:text-[1.8rem]">
                  আপনি কতটা বইপোকা?
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-forest-800/65">
                  বই, লেখক আর ইতিহাস নিয়ে মজার কুইজ খেলুন। সঠিক উত্তর দিয়ে জিতে
                  নিন ছাড় ও ছোট উপহার।
                </p>

                <div className="mt-5 rounded-2xl border border-forest-900/10 bg-cream-50/80 p-4">
                  <p className="text-xs font-semibold text-forest-950">
                    {question.question}
                  </p>
                  <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                    {question.options.slice(0, 2).map((option) => (
                      <span
                        key={option}
                        className="rounded-lg border border-forest-900/10 bg-white/60 px-3 py-2 text-[10px] text-forest-800"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Button href="/quiz" variant="primary">
                    কুইজ শুরু করুন
                    <ArrowRight size={15} />
                  </Button>
                  <span className="text-[10px] text-muted">৬টি প্রশ্ন · ২ মিনিট</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
