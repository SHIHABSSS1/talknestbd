"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Repeat2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SellIcon } from "@/components/ui/SellIcon";
import { SellUsedBookCalculator } from "@/components/services/SellUsedBookCalculator";
import { useSellContent } from "@/components/providers/SellContentProvider";
import { toBn } from "@/lib/utils";

const assuranceIcons = ["clock", "shield", "recycle"] as const;

export function SellUsedBooksPageContent() {
  const { content } = useSellContent();
  const { page } = content;

  return (
    <>
      <PageHeader
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        tone="dark"
        crumbs={[{ label: page.hero.eyebrow || "Sell Used Books" }]}
      >
        <div className="flex flex-wrap gap-2">
          {page.hero.badges.map((badge, index) => (
            <span
              key={index}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80"
            >
              {badge}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {page.steps.map((step, index) => (
              <div
                key={step.id}
                className="relative rounded-2xl border border-forest-900/8 bg-cream-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <SellIcon icon={step.icon} size={17} />
                  </span>
                  <span className="font-display text-2xl font-bold text-forest-900/15">
                    {toBn(index + 1)}
                  </span>
                </div>
                <h2 className="mt-3 text-[12px] font-semibold leading-snug text-forest-950">
                  {step.title}
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-forest-950 p-6 text-cream-50 sm:p-8">
                <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.1]" />
                <div
                  aria-hidden="true"
                  className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold-400/20"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-white/10"
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                    <Repeat2 size={11} /> {page.why.eyebrow}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-[1.7rem]">
                    {page.why.title}
                  </h2>
                  <p className="mt-2 max-w-lg text-xs leading-relaxed text-cream-100/60">
                    {page.why.description}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {page.why.stats.map((stat) => (
                      <div
                        key={stat.id}
                        className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"
                      >
                        <p className="font-display text-xl font-bold text-gold-300">
                          {stat.value}
                        </p>
                        <p className="mt-0.5 text-[8px] text-cream-100/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      href={page.why.ctaPrimaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="gold"
                      size="sm"
                    >
                      {page.why.ctaPrimary}
                      <ArrowRight size={13} />
                    </Button>
                    <Button href={page.why.ctaSecondaryHref || "#calculator"} variant="light" size="sm">
                      {page.why.ctaSecondary}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-forest-500/20 bg-forest-50/60 p-4">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
                    <CheckCircle2 size={13} className="text-forest-600" />
                    What we accept
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {page.accepted.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75"
                      >
                        <CheckCircle2 size={10} className="mt-0.5 shrink-0 text-forest-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-clay-500/20 bg-clay-500/5 p-4">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
                    <XCircle size={13} className="text-clay-600" />
                    What we can&apos;t accept
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {page.notAccepted.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75"
                      >
                        <XCircle size={10} className="mt-0.5 shrink-0 text-clay-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 text-[10px] text-forest-800/70">
                {page.assurances.map((item, index) => (
                  <span key={index} className="flex items-center gap-1.5">
                    <SellIcon
                      icon={assuranceIcons[index % assuranceIcons.length]}
                      size={13}
                      className="text-forest-600"
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-[88px]">
              <SellUsedBookCalculator />
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
                  <Sparkles size={13} className="text-gold-600" /> How selling works
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-muted">
                  {page.sellingNote}{" "}
                  <Link
                    href={page.policyLink.href}
                    className="font-semibold text-clay-600"
                  >
                    {page.policyLink.label}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                <HeartHandshake size={17} className="text-forest-600" /> Reader experiences
              </h2>
              <div className="mt-3 space-y-2.5">
                {page.testimonials.map((review) => (
                  <div key={review.id} className="rounded-xl bg-cream-100/60 px-3.5 py-3">
                    <p className="text-[10px] leading-relaxed text-forest-800/75">
                      “{review.text}”
                    </p>
                    <p className="mt-1.5 text-[9px] font-semibold text-forest-900">
                      — {review.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
              <h2 className="font-display text-lg font-bold text-forest-950">Common questions</h2>
              <div className="mt-3 space-y-2">
                {page.faqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group rounded-xl border border-forest-900/8 bg-cream-100/40 px-3.5 py-2.5"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-semibold text-forest-950">
                      {faq.question}
                      <span className="text-[12px] text-clay-600 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-1.5 text-[9px] leading-relaxed text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-clay-500 px-5 py-4 text-cream-50 sm:flex-row">
            <p className="text-center text-xs font-medium sm:text-left">
              {page.bottomCta.text}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href={page.bottomCta.primaryHref} variant="light" size="sm">
                {page.bottomCta.primaryLabel}
              </Button>
              <Button href={page.bottomCta.secondaryHref} variant="gold" size="sm">
                {page.bottomCta.secondaryLabel}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
