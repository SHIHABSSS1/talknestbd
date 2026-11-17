"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Building2,
  CheckCircle2,
  LibraryBig,
  Store,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/books/BookCover";
import { WholesaleIcon } from "@/components/ui/WholesaleIcon";
import { WholesaleForm } from "@/components/services/WholesaleForm";
import { useWholesaleContent } from "@/components/providers/WholesaleProviders";
import { books } from "@/data/books";
import { formatPrice, siteConfig, toBn } from "@/lib/utils";

const whoIcons = [LibraryBig, Building2, Store, Users];

export function WholesalePageContent() {
  const { content } = useWholesaleContent();
  const page = content.page;
  const picks = books.filter((book) => book.tags.includes("bestseller")).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
        tone="dark"
        crumbs={[{ label: "Wholesale Orders" }]}
      >
        <div className="flex flex-wrap gap-2">
          {page.hero.badges.map((item, index) => (
            <span
              key={index}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-cream-100/80"
            >
              {item}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {page.benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <WholesaleIcon icon={benefit.icon} size={17} />
                </span>
                <h2 className="mt-3 text-[12px] font-semibold leading-snug text-forest-950">
                  {benefit.title}
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{benefit.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-5">
              <section className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
                <div className="border-b border-forest-900/8 bg-cream-100/50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <BadgePercent size={17} className="text-clay-600" />
                    <h2 className="font-display text-lg font-bold text-forest-950">
                      {page.priceList.heading}
                    </h2>
                  </div>
                  <p className="mt-1 text-[10px] text-muted">{page.priceList.note}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-forest-900/8 text-[9px] uppercase tracking-[0.12em] text-muted">
                        <th className="px-5 py-3 font-semibold">Package</th>
                        <th className="px-3 py-3 font-semibold">Quantity</th>
                        <th className="px-3 py-3 font-semibold">Commission</th>
                        <th className="px-5 py-3 font-semibold">Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.tiers.map((tier) => (
                        <tr
                          key={tier.id}
                          className={
                            tier.highlight
                              ? "border-b border-forest-900/8 bg-gold-500/8 last:border-b-0"
                              : "border-b border-forest-900/8 last:border-b-0"
                          }
                        >
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-2 text-[11px] font-semibold text-forest-950">
                              {tier.name}
                              {tier.highlight && (
                                <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[7px] font-bold text-forest-950">
                                  Popular
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-[11px] text-forest-800">
                            {tier.quantity}
                          </td>
                          <td className="px-3 py-3.5 text-[11px] font-semibold text-clay-600">
                            {tier.commission}
                          </td>
                          <td className="px-5 py-3.5 text-[11px] text-forest-800">
                            {tier.delivery}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 bg-cream-100/40 px-5 py-3 text-[9px] text-muted">
                  <span>{page.priceList.footer}</span>
                  <Link href="/terms" className="font-semibold text-forest-800 hover:text-clay-600">
                    {page.priceList.termsLabel}
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  {page.popularHeading}
                </h2>
                <p className="mt-1 text-[10px] text-muted">
                  The titles libraries and institutions order most.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {picks.map((book) => (
                    <Link key={book.slug} href={`/books/${book.slug}`} className="group">
                      <span className="block aspect-[3/4] overflow-hidden rounded-lg bg-cream-100 p-1.5 transition-transform group-hover:-translate-y-0.5">
                        <BookCover book={book} size="sm" />
                      </span>
                      <span className="mt-1.5 block line-clamp-1 text-[10px] font-semibold text-forest-900">
                        {book.title}
                      </span>
                      <span className="block text-[9px] text-muted">
                        {formatPrice(book.price)} · Special price on 10+ copies
                      </span>
                    </Link>
                  ))}
                </div>
                <Button href="/books" variant="outline" size="sm" className="mt-4">
                  {page.catalogueLabel}
                  <ArrowRight size={13} />
                </Button>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  {page.whoHeading}
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {page.who.map((item, index) => {
                    const Icon = whoIcons[index % whoIcons.length];
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 rounded-xl bg-cream-100/60 px-3 py-2.5"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forest-100 text-forest-700">
                          <Icon size={14} />
                        </span>
                        <span className="text-[11px] font-medium text-forest-900">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="space-y-4 lg:sticky lg:top-[88px]">
              <WholesaleForm />
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="text-[11px] font-semibold text-forest-950">
                  {page.whatsapp.heading}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  {page.whatsapp.text}
                </p>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex h-8 items-center rounded-full bg-forest-900 px-3.5 text-[9px] font-semibold text-cream-50 hover:bg-forest-700"
                >
                  {page.whatsapp.linkLabel}
                </a>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-forest-600" />
              <h2 className="font-display text-lg font-bold text-forest-950">
                {page.faqHeading}
              </h2>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {page.faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-xl border border-forest-900/8 bg-cream-100/40 px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-semibold text-forest-950">
                    {faq.question}
                    <span className="text-[13px] text-clay-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-forest-950 px-5 py-4 text-cream-50 sm:flex-row">
            <p className="text-center text-xs text-cream-100/60 sm:text-left">
              {page.bottomCta.text} Start from {toBn(10)}+ copies.
            </p>
            <Button href="/contact" variant="gold" size="sm">
              {page.bottomCta.label}
              <ArrowRight size={13} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
