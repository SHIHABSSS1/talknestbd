"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useVideoQuiz } from "@/components/providers/VideoQuizProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { VideoGallery } from "@/components/video/VideoGallery";

export function VideoPageContent() {
  const { copy } = useVideoQuiz();
  const page = copy.videoPage;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        crumbs={[{ label: "Videos" }]}
      >
        <div className="flex flex-wrap gap-2">
          {page.pills.map((pill, index) => (
            <span
              key={index}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80"
            >
              {pill}
            </span>
          ))}
        </div>
      </PageHeader>

      <VideoGallery />

      <section className="border-t border-line bg-canvas py-8 sm:py-10">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                {page.promoEyebrow}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold text-forest-950">
                {page.promoTitle}
              </h2>
              <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-muted">
                {page.promoText}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/quiz?tab=watch"
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
              >
                Watch & Quiz <ArrowRight size={13} />
              </Link>
              <Button href="/quiz?tab=book" variant="outline" size="sm">
                Book Quiz
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
