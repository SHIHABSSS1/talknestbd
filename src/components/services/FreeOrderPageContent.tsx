"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Gift,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/Button";
import { freeDeliveryBooks } from "@/data/books";
import { useWholesaleContent } from "@/components/providers/WholesaleProviders";
import { toBn } from "@/lib/utils";

const stepIcons = [ShoppingBag, Gift, Truck];

/** /free-order page, driven by the DB-backed `wholesale` document. */
export function FreeOrderPageContent() {
  const { content } = useWholesaleContent();
  const page = content.freeOrderPage;

  return (
    <>
      <PageHeader
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        tone="dark"
        crumbs={[{ label: page.hero.eyebrow }]}
      >
        <div className="flex flex-wrap gap-2">
          {page.hero.badges.map((badge) => (
            <span key={badge} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
              {badge}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-cream-200 p-5 sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-20 h-60 w-60 rounded-full border border-forest-900/10" />
            <div aria-hidden="true" className="absolute -bottom-24 right-24 h-60 w-60 rounded-full bg-gold-400/20 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  <Truck size={12} /> {page.hero.eyebrow}
                </span>
                <h2 className="mt-4 max-w-xl font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl">
                  {page.intro.heading}
                </h2>
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-forest-800/65 sm:text-[13px]">
                  {page.intro.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="/books" size="sm">
                    {page.cta.primaryLabel}
                    <ArrowRight size={13} />
                  </Button>
                  <Button href="/cart" variant="outline" size="sm">
                    Go to cart
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-forest-900/10 bg-cream-50/90 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay-500">
                  Free delivery
                </p>
                <div className="mt-3 space-y-2 border-t border-dashed border-forest-900/15 pt-3 text-[10px]">
                  {page.charges.zones.map((zone) => (
                    <p key={zone.id} className="flex items-center justify-between gap-2">
                      <span className="text-muted">{zone.label}</span>
                      <span className="font-semibold text-forest-900">{zone.charge}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-forest-100/70 px-2.5 py-2 text-[9px] text-forest-800">
                  <BadgeCheck size={11} /> {page.intro.note}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {page.steps.map((step, index) => {
              const Icon = stepIcons[index % stepIcons.length];
              return (
                <div key={step.id} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                      <Icon size={17} />
                    </span>
                    <span className="font-display text-2xl font-bold text-forest-900/15">
                      {toBn(index + 1)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-[12px] font-semibold text-forest-950">{step.title}</h2>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">{step.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <section className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest-900/8 bg-cream-100/50 px-5 py-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-forest-950">
                    Selected free-delivery books
                  </h2>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {page.charges.description}
                  </p>
                </div>
                <Link href="/books" className="text-[10px] font-semibold text-clay-600 hover:text-clay-500">
                  All books →
                </Link>
              </div>
              <div className="p-4 sm:p-5">
                <BookGrid books={freeDeliveryBooks.slice(0, 8)} columns="four" />
              </div>
            </section>

            <div className="space-y-4">
              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
                  <MapPin size={16} className="text-forest-600" />
                  {page.charges.heading}
                </h2>
                <ul className="mt-3 space-y-2">
                  {page.goodToKnow.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-forest-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl bg-forest-950 p-5 text-cream-50">
                <Banknote size={20} className="text-gold-400" />
                <h2 className="mt-2 font-display text-base font-bold">{page.cta.heading}</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-cream-100/55">
                  {page.cta.text}
                </p>
                <Button href="/checkout" variant="gold" size="sm" className="mt-3">
                  View checkout
                </Button>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-5 py-4 sm:flex-row">
            <p className="text-center text-[11px] text-forest-800/70 sm:text-left">
              {page.cta.text}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/contact" variant="primary" size="sm">Contact</Button>
              <Button href="/cart" variant="outline" size="sm">Go to cart</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
