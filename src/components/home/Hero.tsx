"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  LayoutGrid,
  Repeat2,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { books } from "@/data/books";
import { categoryLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const slides = [
  {
    eyebrow: "The TalkNest Bookstore",
    title: "Stories that stay",
    highlight: "with you.",
    description:
      "Discover bestsellers, new voices, Islamic history and thoughtful non-fiction — curated for readers in Bangladesh.",
    primary: { label: "Shop all books", href: "/books" },
    secondary: { label: "Browse categories", href: "/categories" },
    note: "Free delivery on orders over ৳999",
    covers: ["neel-megh", "atomic-habits", "the-alchemist"],
    badge: "Reader favourites",
    badgeValue: "1,200+",
    badgeLabel: "curated books",
  },
  {
    eyebrow: "TalkNest Audio Library",
    title: "A good story",
    highlight: "for every commute.",
    description:
      "Listen to bestselling novels, thoughtful non-fiction and the Seerah, narrated by voices you will want to spend hours with.",
    primary: { label: "Explore audiobooks", href: "/audio-books" },
    secondary: { label: "See audio favourites", href: "/best-sellers" },
    note: "First chapters are free",
    covers: ["moner-gohine", "rasuler-jiboni", "safolotar-30-siri"],
    badge: "Listen anywhere",
    badgeValue: "4",
    badgeLabel: "featured audiobooks",
  },
  {
    eyebrow: "Read. Return. Repeat.",
    title: "Finished a book?",
    highlight: "Get 50% back.",
    description:
      "Buy from TalkNest, read at your own pace and return the book in good condition. We will give you half the purchase price back.",
    primary: { label: "How buyback works", href: "/buyback" },
    secondary: { label: "Shop used books", href: "/used-books" },
    note: "A simpler, more sustainable reading habit",
    covers: ["sahityer-rangin-pata", "deep-work", "the-prophet"],
    badge: "Readers' buyback",
    badgeValue: "50%",
    badgeLabel: "cash back",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const featuredCovers = useMemo(
    () =>
      slide.covers
        .map((slug) => books.find((book) => book.slug === slug))
        .filter((book): book is NonNullable<typeof book> => Boolean(book)),
    [slide.covers],
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured books and offers"
      className="bg-brand-50/60 py-4 sm:py-5"
    >
      <Container>
        <div className="grid gap-3 lg:grid-cols-[204px_minmax(0,1fr)_272px] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <aside className="hidden overflow-hidden rounded-[8px] border border-line bg-white lg:block">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
              <LayoutGrid size={16} className="text-brand-600" />
              <h2 className="text-[13px] font-bold text-ink">Shop by category</h2>
            </div>
            <nav aria-label="Shop by category" className="py-1">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-[9px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                  <ChevronRight size={12} className="text-muted" />
                </Link>
              ))}
              <Link
                href="/best-sellers"
                className="flex items-center justify-between px-4 py-[9px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                Best Sellers
                <ChevronRight size={12} className="text-muted" />
              </Link>
              <Link
                href="/new-books"
                className="flex items-center justify-between px-4 py-[9px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                New Arrivals
                <ChevronRight size={12} className="text-muted" />
              </Link>
            </nav>
            <div className="border-t border-line p-3">
              <Link
                href="/categories"
                className="flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-brand-50 text-[11px] font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                View all categories
                <ArrowRight size={12} />
              </Link>
            </div>
          </aside>

          <div className="hero-mesh relative min-h-[390px] overflow-hidden rounded-[8px] text-white sm:min-h-[430px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-27 -top-35 h-96 w-96 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 right-20 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12] paper-texture"
            />

            <div className="relative grid h-full min-h-[390px] gap-5 p-6 sm:min-h-[430px] sm:p-8 lg:grid-cols-[1.13fr_0.87fr] lg:items-center lg:p-10">
              <div key={`hero-copy-${active}`} className="animate-fade-up">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white/85 backdrop-blur">
                  <Sparkles size={11} className="text-brand-200" />
                  {slide.eyebrow}
                </span>
                <h1 className="mt-4 max-w-[13ch] text-[32px] font-bold leading-[1.08] sm:text-[40px] lg:text-[44px] xl:text-[50px]">
                  {slide.title}{" "}
                  <span className="text-brand-200">{slide.highlight}</span>
                </h1>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/70 sm:text-sm">
                  {slide.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Button href={slide.primary.href} variant="gold" size="md">
                    {slide.primary.label}
                    <ArrowRight size={15} />
                  </Button>
                  <Button href={slide.secondary.href} variant="light" size="md">
                    {slide.secondary.label}
                  </Button>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-white/55">
                  <Truck size={12} />
                  {slide.note}
                </p>
              </div>

              <div className="relative hidden min-h-[270px] lg:block" aria-hidden="true">
                <div className="absolute left-[28%] top-1/2 w-[41%] -translate-y-1/2 rotate-[-8deg]">
                  {featuredCovers[0] && (
                    <div className="aspect-[3/4]">
                      <BookCover book={featuredCovers[0]} size="sm" />
                    </div>
                  )}
                </div>
                <div className="absolute left-[1%] top-[12%] w-[33%] -translate-y-0 rotate-[7deg] opacity-95">
                  {featuredCovers[1] && (
                    <div className="aspect-[3/4]">
                      <BookCover book={featuredCovers[1]} size="sm" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-[4%] right-[4%] w-[32%] rotate-[5deg] opacity-95">
                  {featuredCovers[2] && (
                    <div className="aspect-[3/4]">
                      <BookCover book={featuredCovers[2]} size="sm" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-[16%] border border-white/20 bg-brand-950/75 px-3 py-2 backdrop-blur">
                  <p className="text-xl font-bold leading-none text-white">
                    {slide.badgeValue}
                  </p>
                  <p className="mt-1 text-[9px] text-white/60">{slide.badgeLabel}</p>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-6 bottom-5 flex items-center gap-3 sm:inset-x-8 lg:inset-x-10">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Previous slide"
                className="grid h-7 w-7 place-items-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                <ChevronLeft size={13} />
              </button>
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose a slide">
                {slides.map((item, index) => (
                  <button
                    key={item.eyebrow}
                    type="button"
                    role="tab"
                    aria-selected={active === index}
                    aria-label={`Slide ${index + 1}: ${item.title}`}
                    onClick={() => goTo(index)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      active === index ? "w-6 bg-white" : "w-1.5 bg-white/30 hover:bg-white/55",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Next slide"
                className="grid h-7 w-7 place-items-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                <ChevronRight size={13} />
              </button>
              <span className="ml-1 text-[10px] tabular-nums text-white/45">
                0{active + 1} / 0{slides.length}
              </span>
              <span className="ml-auto hidden items-center gap-1.5 text-[10px] text-white/55 sm:flex">
                <Star size={11} className="fill-sale text-sale" />
                4.9 reader rating
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href="/buyback"
              className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-[8px] border border-[#ffd08a] bg-[#fff5e6] p-5 transition-colors hover:border-sale sm:min-h-[200px]"
            >
              <div
                aria-hidden="true"
                className="absolute -right-9 -top-9 h-32 w-32 rounded-full border border-sale/15"
              />
              <div className="relative flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[4px] bg-sale text-ink">
                  <Repeat2 size={18} />
                </span>
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-[9px] font-medium text-body">
                  50% cash back
                </span>
              </div>
              <div className="relative mt-4">
                <h2 className="max-w-[15ch] text-xl font-bold leading-tight text-ink">
                  Read it. Return it. Get 50% back.
                </h2>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-sale">
                  Learn about buyback
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/free-order"
              className="group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-[8px] bg-brand-600 p-5 text-white transition-colors hover:bg-brand-700 sm:min-h-[200px]"
            >
              <div
                aria-hidden="true"
                className="absolute -bottom-14 -right-10 h-40 w-40 rounded-full border border-white/10"
              />
              <div className="relative flex items-start justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-[4px] bg-white/15 text-white">
                  <Truck size={19} />
                </span>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-medium text-white/90">
                  Bangladesh-wide
                </span>
              </div>
              <div className="relative mt-4">
                <h2 className="max-w-[15ch] text-xl font-bold leading-tight">
                  Free delivery over ৳999.
                </h2>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand-200">
                  See delivery details
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/audio-books"
              className="group hidden min-h-[92px] items-center gap-3 rounded-[8px] border border-line bg-white p-4 transition-colors hover:border-brand-300 lg:flex"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] bg-brand-50 text-brand-600">
                <Headphones size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-ink">Listen on the go</p>
                <p className="mt-0.5 text-[10px] text-muted">Audiobooks from ৳99</p>
              </div>
              <ChevronRight size={14} className="ml-auto shrink-0 text-muted" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
