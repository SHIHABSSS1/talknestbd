import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgePercent, CheckCircle2, HandCoins, Repeat2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { UpSaleBooksGrid } from "@/components/books/UpSaleBooksGrid";
import { UpSaleCount } from "@/components/books/UpSaleCount";
import { getUpSaleShelfContent } from "@/lib/db/queries/shelves";
import { toUpSaleBook } from "@/lib/up-sale";

export const metadata: Metadata = {
  title: "50% Up Sale",
  description:
    "Used books sold to TalkNest by readers, checked and re-listed at 50% above the selling price — still below a new copy.",
};

const pricingSteps = [
  {
    icon: BadgePercent,
    step: "01",
    title: "New shelf price",
    text: "A brand-new copy carries the publisher's list price — ৳380 for A Journey Through Blue Clouds, for example.",
    amount: "৳380",
    tone: "bg-brand-50 text-brand-700",
  },
  {
    icon: Repeat2,
    step: "02",
    title: "Reader sells at 50%",
    text: "Finish the book and sell it to us in readable condition. We pay 50% of the purchase price through our used-book programme.",
    amount: "৳190",
    tone: "bg-[#fff5e6] text-gold-600",
  },
  {
    icon: BadgePercent,
    step: "03",
    title: "+50% up sale",
    text: "We inspect, clean and re-list that same copy 50% above our payout — 25% below new, ready for its next reader.",
    amount: "৳285",
    tone: "bg-forest-50 text-forest-700",
  },
];

export default async function UpSalePage() {
  const content = await getUpSaleShelfContent();
  const upSaleBooks = content.books.map(toUpSaleBook);

  return (
    <>
      <PageHeader
        eyebrow={content.heading.eyebrow}
        title={content.heading.title}
        description={content.heading.description}
        tone="dark"
        crumbs={[{ label: "50% Up Sale" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            <UpSaleCount count={upSaleBooks.length} />
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Condition checked by TalkNest
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Save 25% vs a new copy
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="overflow-hidden rounded-[8px] border border-line bg-white">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line bg-canvas px-4 py-4 sm:px-6">
              <SectionTitle
                eyebrow="The pricing ladder"
                title="Readers get half. The next reader saves 25%."
                description="One transparent formula across every used copy. No haggling shelf, no surprise condition grades at checkout."
              />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[10px] font-semibold text-brand-700">
                <ShieldCheck size={12} />
                Inspected before listing
              </span>
            </div>

            <div className="grid gap-0 sm:grid-cols-3">
              {pricingSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative border-b border-line p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:p-5 sm:last:border-r-0"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`grid h-9 w-9 place-items-center rounded-[6px] ${step.tone}`}>
                        <Icon size={16} />
                      </span>
                      <span className="font-display text-xl font-bold text-ink/10">{step.step}</span>
                    </div>
                    <p className="mt-3 text-[12px] font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">{step.text}</p>
                    <p className="mt-3 font-display text-lg font-bold text-ink">{step.amount}</p>
                    {index < pricingSteps.length - 1 && (
                      <ArrowRight
                        size={14}
                        className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 rotate-90 rounded-full bg-white text-muted sm:-right-2 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:rotate-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-[10.5px] text-muted sm:px-6">
              <span className="inline-flex items-center gap-1.5">
                <HandCoins size={12} className="text-gold-600" />
                Reader gets 50% cash back
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BadgePercent size={12} className="text-brand-600" />
                TalkNest adds 50% on that payout
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-forest-600" />
                Next reader saves 25% against new
              </span>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              eyebrow="On the up-sale shelf"
              title="Pre-loved copies, ready for a second reader"
              description="Each copy below was sold to us by a reader, was checked by hand and is priced with the same +50% formula."
            />
            <Button href="/sell-used-books" variant="outline" size="sm">
              Sell used books
              <ArrowRight size={13} />
            </Button>
          </div>

          <UpSaleBooksGrid className="mt-5" books={upSaleBooks} />

          <div className="mt-7 grid gap-3 rounded-[8px] border border-line bg-canvas p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
            <div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
                <BadgePercent size={13} className="text-gold-600" />
                Want to sell a book instead?
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
                If you bought it from TalkNest, finish reading, then estimate your 50%
                selling payout in a minute. Our team confirms the payout and pickup.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href="/sell-used-books" size="sm">
                Try the selling calculator
              </Button>
              <Button href="/used-books" variant="outline" size="sm">
                Buy used books
              </Button>
            </div>
          </div>

          <p className="mt-4 text-center text-[9px] leading-relaxed text-muted">
            Prices shown are indicative. Condition and stock are confirmed before dispatch.{" "}
            <Link href="/terms" className="font-semibold text-brand-700 hover:text-brand-800">
              Read our terms
            </Link>
          </p>
        </Container>
      </section>
    </>
  );
}
