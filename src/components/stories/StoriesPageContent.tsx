"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Mic, ShieldCheck } from "lucide-react";
import { useStories } from "@/components/providers/StoriesProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StoriesWall } from "@/components/stories/StoriesWall";

export function StoriesPageContent() {
  const { copy } = useStories();
  const page = copy.page;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        tone="dark"
        crumbs={[{ label: "Reader Stories" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Button href="/stories/share" variant="gold" size="sm">
            <Mic size={13} aria-hidden="true" /> {page.primaryLabel}
          </Button>
          <Link
            href="#stories"
            className="inline-flex h-9 items-center rounded-[4px] border border-white/25 px-4 text-[11px] font-medium text-cream-100/85 hover:bg-white/10"
          >
            Read all stories
          </Link>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-3 sm:grid-cols-3">
            {page.stats.map((stat, index) => (
              <div key={index} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-5 text-center">
                <p className="font-display text-2xl font-bold text-forest-950">{stat.value}</p>
                <p className="mt-1 text-[10px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div id="stories" className="mt-8 scroll-mt-[88px]">
            <StoriesWall />
          </div>

          <section className="mt-8 grid gap-4 rounded-2xl border border-line bg-white p-6 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                {page.rulesEyebrow}
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-forest-950">{page.rulesTitle}</h2>
              <ul className="mt-3 space-y-2">
                {page.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-[11px] leading-relaxed text-forest-800/80">
                    <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-forest-950 p-6 text-cream-50">
              <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300">
                <ShieldCheck size={13} aria-hidden="true" /> {page.ctaEyebrow}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold">{page.ctaTitle}</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-cream-100/60">{page.ctaText}</p>
              <Button href="/stories/share" variant="gold" size="sm" className="mt-4">
                {page.ctaLabel} <ArrowRight size={13} aria-hidden="true" />
              </Button>
            </div>
          </section>

          <p className="mt-6 text-center text-[10px] text-muted">
            {page.footerNote}
          </p>
        </Container>
      </section>
    </>
  );
}
