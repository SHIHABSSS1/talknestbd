import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Heart,
  Mic,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { StoriesWall } from "@/components/stories/StoriesWall";
import { Button } from "@/components/ui/Button";
import { formatCount } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reader Stories",
  description:
    "Stories from TalkNest readers — memories, feelings and small moments shared as voice notes, written pieces and PDF diaries.",
};

const stats = [
  { icon: PenLine, value: "210+", label: "Stories shared" },
  { icon: Mic, value: "84", label: "Voice stories" },
  { icon: Users, value: "12K", label: "Reader family" },
];

const rules = [
  "The story must be your own experience or clearly labelled fiction.",
  "Do not share another person's private information or photos without permission.",
  "Avoid insults, hate speech and political arguments.",
  "Keep voice recordings under five minutes where possible.",
  "PDF uploads should be clear and easy to read.",
  "Our editorial team reviews every story before publication.",
];

export default function StoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Share to My Heart"
        title="Your story, in every heart"
        description="Share the small stories, memories and feelings that make a life — write them down, record them in your own voice or upload a PDF diary. Every story here matters."
        tone="dark"
        crumbs={[{ label: "Reader Stories" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Button href="/stories/share" variant="white" size="sm">
            <Mic size={13} /> Share your story
          </Button>
          <Button href="#stories" variant="light" size="sm">
            Read all stories
          </Button>
        </div>
      </PageHeader>

      <section className="bg-white py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-[8px] border border-line bg-white px-4 py-3.5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] bg-brand-50 text-brand-600">
                  <stat.icon size={17} />
                </span>
                <div>
                  <p className="text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-[10px] text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div id="stories" className="mt-7 scroll-mt-32">
            <StoriesWall />
          </div>

          <div className="mt-8 grid gap-3 sm:gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-[8px] border border-line bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-brand-600" />
                <h2 className="text-lg font-bold text-ink">
                  Simple rules for sharing
                </h2>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {rules.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-[4px] bg-canvas px-3 py-2.5"
                  >
                    <Heart size={11} className="mt-0.5 shrink-0 fill-sale/20 text-sale" />
                    <span className="text-[10px] leading-relaxed text-body">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[8px] bg-brand-600 p-5 text-white sm:p-6">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/15"
              />
              <Sparkles size={20} className="text-white/80" />
              <h2 className="mt-2 text-xl font-bold leading-snug">
                Share one story and change someone&apos;s day
              </h2>
              <p className="mt-1.5 text-[10px] leading-relaxed text-white/70">
                Your words, your voice or your diary might be exactly the
                courage another reader needs today.
              </p>
              <Link
                href="/stories/share"
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-white px-4 text-[10px] font-semibold text-brand-700 hover:bg-brand-50"
              >
                Start your story
                <ArrowRight size={12} />
              </Link>
              <div className="mt-4 flex items-center gap-2 text-[9px] text-white/60">
                <FileText size={11} /> Voice · Written · PDF
              </div>
            </section>
          </div>

          <p className="mt-5 text-center text-[10px] text-muted">
            {formatCount(210)} stories shared this month · every story belongs to
            its reader
          </p>
        </Container>
      </section>
    </>
  );
}
