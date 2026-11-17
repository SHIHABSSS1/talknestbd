"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Headphones,
  GraduationCap,
  Home,
  Mic2,
  PlayCircle,
  Sparkles,
  ShoppingBag,
  Truck,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const destinations = [
  {
    label: "Browse books",
    detail: "Bestsellers, new arrivals and more",
    href: "/books",
    icon: BookOpen,
    className: "bg-brand-50 text-brand-700",
  },
  {
    label: "Audiobooks",
    detail: "Free titles and chapter previews",
    href: "/audio-books",
    icon: Headphones,
    className: "bg-gold-300/20 text-gold-600",
  },
  {
    label: "Podcast",
    detail: "New episodes every Thursday",
    href: "/video#podcast",
    icon: Mic2,
    className: "bg-lavender/30 text-brand-700",
  },
  {
    label: "Videos",
    detail: "Watch and learn with us",
    href: "/video",
    icon: PlayCircle,
    className: "bg-mint/25 text-forest-700",
  },
  {
    label: "Quizzes",
    detail: "Test what you just read",
    href: "/quiz",
    icon: GraduationCap,
    className: "bg-clay-400/10 text-clay-600",
  },
  {
    label: "Sunnah items",
    detail: "Miswak, attar, tasbih and more",
    href: "/sunnah-items",
    icon: Sparkles,
    className: "bg-brand-50 text-brand-700",
  },
];

export function EmptyCart() {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-forest-900/8 bg-gradient-to-br from-cream-100 via-white to-brand-50/70 px-6 py-10 text-center sm:px-10 sm:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-brand-300/30"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full border border-gold-400/25"
        />
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-brand-900 text-gold-300 shadow-[0_18px_45px_-25px_rgba(11,61,122,0.7)]">
            <ShoppingBag size={32} />
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">
            Your bag is waiting
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-forest-950 sm:text-3xl">
            Your cart is empty
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[13px] leading-relaxed text-muted">
            Add books or Sunnah items you love to start shopping. Sell a used book to us
            after reading and get 50% of the purchase price back.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href="/books">
              Browse books <ArrowRight size={14} />
            </Button>
            <Button href="/" variant="outline">
              <Home size={14} /> Back to home
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Truck size={13} className="text-brand-600" /> Free delivery over ৳999
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UploadCloud size={13} className="text-brand-600" /> 50% back after reading
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Headphones size={13} className="text-brand-600" /> Listen on any device
            </span>
          </div>
        </div>
      </section>

      <Container className="px-0">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">
              Explore more
            </p>
            <h2 className="font-display text-lg font-bold text-forest-950">
              Find something good to add
            </h2>
          </div>
          <Link
            href="/books"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
          >
            See the full catalogue <ArrowRight size={12} />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-shadow"
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${item.className}`}
                >
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold text-forest-950">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-muted">{item.detail}</span>
                </span>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
