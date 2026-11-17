import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/Button";
import { freeDeliveryBooks } from "@/data/books";
import { formatPrice, siteConfig, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Delivery",
  description:
    "Free delivery across Bangladesh on orders of ৳999 or more. Selected books always ship free — TalkNest BD.",
};

const steps = [
  {
    icon: ShoppingBag,
    title: "Pick your books",
    text: `Add books worth ${formatPrice(siteConfig.freeDeliveryThreshold)} or more to your cart.`,
  },
  {
    icon: Gift,
    title: "Free delivery applies automatically",
    text: "The delivery charge drops to ৳0 at checkout — no coupon code needed.",
  },
  {
    icon: Truck,
    title: "Delivered to your door",
    text: "Books arrive in 2–4 days inside Dhaka and 3–7 business days outside Dhaka.",
  },
];

const zones = [
  { zone: "Dhaka city", time: "2–4 business days", charge: 60 },
  { zone: "Outside Dhaka district", time: "3–7 business days", charge: 120 },
  { zone: "Chattogram, Sylhet, Rajshahi", time: "3–7 business days", charge: 120 },
  { zone: "Remote and hill areas", time: "5–10 business days", charge: 150 },
];

export default function FreeOrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free Delivery"
        title="Free delivery nationwide on orders of ৳999+"
        description="Delivery is free with your books — no extra charge to worry about. And selected titles always ship free."
        tone="dark"
        crumbs={[{ label: "Free Delivery" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Automatic, no code needed
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Available nationwide
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Always free on selected books
          </span>
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
                  <Truck size={12} /> Free Delivery
                </span>
                <h2 className="mt-4 max-w-xl font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl">
                  Fill your cart to {formatPrice(siteConfig.freeDeliveryThreshold)} and delivery is on us
                </h2>
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-forest-800/65 sm:text-[13px]">
                  When your cart total reaches {formatPrice(siteConfig.freeDeliveryThreshold)} or
                  more, the delivery charge is removed automatically. Even one book is
                  worth it — treat yourself or pick one as a gift.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="/books" size="sm">
                    Browse books
                    <ArrowRight size={13} />
                  </Button>
                  <Button href="/cart" variant="outline" size="sm">
                    Go to cart
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-forest-900/10 bg-cream-50/90 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay-500">
                  Order threshold
                </p>
                <div className="mt-1 flex items-end gap-2">
                  <p className="font-display text-5xl font-bold leading-none text-forest-950">
                    {formatPrice(siteConfig.freeDeliveryThreshold)}
                  </p>
                  <span className="pb-1 text-[11px] text-muted">or more</span>
                </div>
                <div className="mt-3 space-y-2 border-t border-dashed border-forest-900/15 pt-3 text-[10px]">
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-muted">Standard delivery charge</span>
                    <span className="font-semibold text-forest-900">{formatPrice(60)}</span>
                  </p>
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-muted">With free delivery</span>
                    <span className="font-semibold text-forest-600">৳0 (free)</span>
                  </p>
                </div>
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-forest-100/70 px-2.5 py-2 text-[9px] text-forest-800">
                  <BadgeCheck size={11} /> On this demo site, the charge is shown for illustration only
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <step.icon size={17} />
                  </span>
                  <span className="font-display text-2xl font-bold text-forest-900/15">
                    {toBn(index + 1)}
                  </span>
                </div>
                <h2 className="mt-3 text-[12px] font-semibold text-forest-950">{step.title}</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <section className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest-900/8 bg-cream-100/50 px-5 py-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-forest-950">
                    Selected free-delivery books
                  </h2>
                  <p className="mt-0.5 text-[10px] text-muted">
                    Add any of these to your cart and their delivery is completely free.
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
                  Delivery charges and times
                </h2>
                <div className="mt-3 divide-y divide-forest-900/8">
                  {zones.map((zone) => (
                    <div key={zone.zone} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[11px] font-medium text-forest-900">{zone.zone}</p>
                        <p className="flex items-center gap-1 text-[9px] text-muted">
                          <Clock3 size={9} />
                          {zone.time}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold text-forest-800">
                        {formatPrice(zone.charge)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 rounded-lg bg-gold-500/10 px-2.5 py-2 text-[9px] leading-relaxed text-forest-800/70">
                  During festivals or Eid, courier volumes may add 1–2 days to delivery.
                </p>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
                  <PackageCheck size={16} className="text-forest-600" />
                  Good to know
                </h2>
                <ul className="mt-3 space-y-2">
                  {[
                    "Free delivery depends on your cart total",
                    "Buying several books together gets you to the threshold faster",
                    "Express delivery carries an extra charge",
                    "Delivery charges are not refunded on returns",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-forest-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl bg-forest-950 p-5 text-cream-50">
                <Banknote size={20} className="text-gold-400" />
                <h2 className="mt-2 font-display text-base font-bold">No worries about payment</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-cream-100/55">
                  Cash on delivery, bKash and Nagad — pay the way you prefer. No real
                  money is charged on this demo site.
                </p>
                <Button href="/checkout" variant="gold" size="sm" className="mt-3">
                  View checkout
                </Button>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-5 py-4 sm:flex-row">
            <p className="text-center text-[11px] text-forest-800/70 sm:text-left">
              Questions about delivery? Our team is here from 10:00 AM to 8:00 PM.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/contact" variant="primary" size="sm">Contact</Button>
              <Button href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
