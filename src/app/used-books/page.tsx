import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookHeart,
  CheckCircle2,
  HandCoins,
  MapPin,
  MessagesSquare,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { UsedBookSellForm, UsedBooksMarket } from "@/components/used-books/UsedBooksMarket";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Used Books (Up to 50% Off)",
  description:
    "Buy used books from reader to reader at half price, or sell the books you've finished — the TalkNest BD used book market.",
};

const steps = [
  {
    icon: BookHeart,
    title: "Find a book",
    text: "Choose a used book you like by condition and location. Every book's condition is verified.",
  },
  {
    icon: MessagesSquare,
    title: "Talk to the seller",
    text: "Ask questions about the book, view photos and get in touch if you want to buy.",
  },
  {
    icon: Truck,
    title: "Get your book safely",
    text: "Hand delivery in Dhaka, courier outside. Check the book's condition before paying.",
  },
];

export default function UsedBooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Used Book Marketplace"
        title="Used books, new joy"
        description="A book's journey from reader to reader. Sell the books you've finished, or buy another reader's favorite at half price."
        tone="dark"
        crumbs={[{ label: "Used Books" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Save up to 50%
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Verified condition
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            A second life for books
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="mb-7 grid gap-3 overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-7">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-600">
                <Recycle size={13} /> A second life for books
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl">
                The more a book is passed on, the longer it lives
              </h2>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted sm:text-[13px]">
                An old book doesn't mean an old story — it's a treasured story waiting
                for a new reader. Selling or buying on TalkNest's used book market is
                equally easy.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href="#market" size="sm">
                  Browse books
                  <ArrowRight size={13} />
                </Button>
                <Button href="#sell" variant="outline" size="sm">
                  Sell a book
                </Button>
              </div>
            </div>
            <div className="relative min-h-[160px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80"
                alt="A collection of used books"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-950/25 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-cream-50/90 px-3 py-1.5 text-[9px] font-semibold text-forest-900 backdrop-blur">
                50% off · Reader-to-reader
              </span>
            </div>
          </div>

          <div id="market" className="scroll-mt-[88px]">
            <UsedBooksMarket />
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-clay-600" />
                  <h2 className="font-display text-lg font-bold text-forest-950">How it works</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                        <step.icon size={16} />
                      </span>
                      <div className="border-b border-forest-900/6 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[11px] font-semibold text-forest-950">
                          {index + 1}. {step.title}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                  <ShieldCheck size={17} className="text-forest-600" /> Safe trading rules
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { icon: BadgeCheck, text: "Every book's condition is verified" },
                    { icon: MapPin, text: "See the book in person based on location" },
                    { icon: HandCoins, text: "Inspect the book before paying" },
                    { icon: CheckCircle2, text: "Support if the description was wrong" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2 rounded-xl bg-cream-100/60 px-3 py-2.5">
                      <item.icon size={13} className="mt-0.5 shrink-0 text-forest-600" />
                      <span className="text-[10px] leading-relaxed text-forest-800/80">{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-xl border border-dashed border-forest-900/15 px-3 py-2 text-[9px] leading-relaxed text-muted">
                  No real payments are made in this demo marketplace. Verify the seller
                  and book details carefully before any real transaction.
                </p>
              </section>

              <div className="rounded-2xl bg-forest-950 p-5 text-cream-50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                  Buyback vs used books
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-cream-100/60">
                  Return a book you bought from TalkNest and get 50% cash back. To sell
                  directly to another reader, list it on the used book market.
                </p>
                <Link
                  href="/buyback"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-gold-300 hover:text-gold-400"
                >
                  Learn about buyback
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>

            <div id="sell" className="scroll-mt-[88px] lg:sticky lg:top-[88px]">
              <UsedBookSellForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
