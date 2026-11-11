"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mic,
  Sparkles,
  Star,
} from "lucide-react";
import { books } from "@/data/books";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BookCover } from "@/components/books/BookCover";
import { cn } from "@/lib/utils";

const slides = [
  {
    eyebrow: "বাংলাদেশের প্রিয় বইয়ের নীড়",
    title: "পাতা উল্টালেই খুলে যায়",
    highlight: "নতুন এক দুনিয়া।",
    description:
      "উপন্যাস থেকে ইসলামিক ইতিহাস, অডিও বুক থেকে পুরাতন বই — TalkNest BD-তে খুঁজে নিন আপনার পরের প্রিয় বইটি। পড়া শেষে বই ফেরত দিলে ফিরে পান মূল্যের ৫০%।",
    primary: { label: "বই ঘুরে দেখুন", href: "/books" },
    secondary: { label: "অডিও শুনুন", href: "/audio-books" },
    icon: Sparkles,
    coverOne: "neel-megh",
    coverTwo: "the-alchemist",
    badgeValue: "৫০%",
    badgeLabel: "বই ফেরতের নিশ্চয়তা",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1100&q=80",
    imageAlt: "বইয়ের তাকে সাজানো বই",
    imageEyebrow: "Reader's Choice",
    imageCaption: "পাঠকের ভালোবাসায় সাজানো প্রতিটি তাক",
  },
  {
    eyebrow: "TalkNest Audio Library",
    title: "চোখ ব্যস্ত থাকুক,",
    highlight: "গল্প শুনুন কানে।",
    description:
      "দেশের জনপ্রিয় বাচকদের কণ্ঠে উপন্যাস, সিরাত ও নন-ফিকশন। ভ্রমণে, রান্নাঘরে বা ঘুমের আগে — শুনে নিন আপনার প্রিয় বই।",
    primary: { label: "অডিও লাইব্রেরি", href: "/audio-books" },
    secondary: { label: "সব বই দেখুন", href: "/books" },
    icon: Headphones,
    coverOne: "moner-gohine",
    coverTwo: "rasuler-jiboni",
    badgeValue: "৫টি",
    badgeLabel: "জনপ্রিয় অডিও বই",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1100&q=80",
    imageAlt: "হেডফোন পড়ে বই শোনার অনুভূতি",
    imageEyebrow: "Listen Anywhere",
    imageCaption: "আপনার গল্পের জগৎ, এখন কানে",
  },
  {
    eyebrow: "Share to My Heart",
    title: "আপনার গল্প,",
    highlight: "সবার হৃদয়ে।",
    description:
      "জীবনের ছোট ছোট স্মৃতি, অনুভূতি আর গল্প শেয়ার করুন — লিখে, নিজের কণ্ঠে ভয়েস রেকর্ড করে কিংবা PDF আপলোড করে। পাঠকেরা হবেন আপনার গল্পের অংশ।",
    primary: { label: "গল্প শেয়ার করুন", href: "/stories/share" },
    secondary: { label: "সব গল্প পড়ুন", href: "/stories" },
    icon: Mic,
    coverOne: "valo-thakar-50-upay",
    coverTwo: "safolotar-30-siri",
    badgeValue: "২১০+",
    badgeLabel: "এই মাসের শেয়ার করা গল্প",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=80",
    imageAlt: "বন্ধুদের সঙ্গে বই ও গল্পের আড্ডা",
    imageEyebrow: "Our Community",
    imageCaption: "প্রতিটি মানুষের ভেতরে একটি গল্প থাকে",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  const slide = slides[active];
  const Icon = slide.icon;

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

  const coverOne = useMemo(
    () => books.find((book) => book.slug === slide.coverOne) ?? books[0],
    [slide.coverOne],
  );
  const coverTwo = useMemo(
    () => books.find((book) => book.slug === slide.coverTwo) ?? books[1],
    [slide.coverTwo],
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="TalkNest BD ফিচার্ড"
      className="relative overflow-hidden hero-mesh text-cream-50"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-[0.14]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full border border-gold-400/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-gold-400/10"
      />

      <Container className="relative grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-8 lg:py-20">
        <div className="relative z-10">
          <div key={`content-${active}`} className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-white/5 px-3.5 py-1.5 text-[10px] font-semibold tracking-wide text-gold-300 sm:text-[11px]">
              <Icon size={13} />
              {slide.eyebrow}
            </span>

            <h1 className="mt-5 max-w-[22ch] font-display text-[2.15rem] font-bold leading-[1.22] tracking-tight sm:text-5xl lg:text-[3.55rem] lg:leading-[1.18]">
              {slide.title} <span className="text-gold-300">{slide.highlight}</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream-100/70 sm:text-base">
              {slide.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={slide.primary.href} variant="gold" size="lg">
                {slide.primary.label}
                <ArrowRight size={17} />
              </Button>
              <Button href={slide.secondary.href} variant="light" size="lg">
                <Headphones size={18} />
                {slide.secondary.label}
              </Button>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/10 pt-6">
            <div>
              <p className="font-display text-xl font-bold text-cream-50 sm:text-2xl">১,২০০+</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cream-100/45 sm:text-[11px]">
                বাছাই করা বই
              </p>
            </div>
            <span className="h-8 w-px bg-white/10" />
            <div>
              <p className="font-display text-xl font-bold text-cream-50 sm:text-2xl">১০ হাজার+</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-cream-100/45 sm:text-[11px]">
                সুখী পাঠক
              </p>
            </div>
            <span className="hidden h-8 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <span className="flex gap-0.5 text-gold-400">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} size={13} className="fill-gold-400" />
                ))}
              </span>
              <p className="text-[11px] text-cream-100/55">৪.৯ পাঠক রেটিং</p>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="আগের স্লাইড"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-cream-100/70 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <ChevronLeft size={15} />
            </button>
            <div className="flex items-center gap-1.5" role="tablist" aria-label="স্লাইড নির্বাচন">
              {slides.map((item, index) => (
                <button
                  key={item.eyebrow}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-label={`${index + 1} নম্বর স্লাইড: ${item.title}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    active === index
                      ? "w-7 bg-gold-400"
                      : "w-1.5 bg-white/25 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="পরের স্লাইড"
              className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-cream-100/70 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <ChevronRight size={15} />
            </button>
            <span className="ml-1 text-[10px] tabular-nums text-cream-100/40">
              ০{active + 1} / ০{slides.length}
            </span>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="relative mx-auto w-[76%] sm:w-[70%] lg:w-[78%]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] rounded-tl-[8rem] border border-white/15">
              {slides.map((item, index) => (
                <img
                  key={item.eyebrow}
                  src={item.image}
                  alt={item.imageAlt}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                    active === index ? "opacity-100" : "opacity-0",
                  )}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/10 to-transparent" />
              <div key={`caption-${active}`} className="absolute inset-x-0 bottom-0 animate-fade-up p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {slide.imageEyebrow}
                </p>
                <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-cream-50 sm:text-xl">
                  {slide.imageCaption}
                </p>
              </div>
            </div>

            <div key={`cover-one-${active}`} className="absolute -left-6 bottom-4 w-[34%] animate-fade-up sm:-left-10 sm:bottom-8 sm:w-[36%]">
              <div className="animate-float">
                <div className="aspect-[3/4] -rotate-6">
                  <BookCover book={coverOne} size="sm" />
                </div>
              </div>
            </div>

            <div key={`cover-two-${active}`} className="absolute -right-2 top-10 w-[30%] animate-fade-up sm:-right-5 sm:top-12 sm:w-[32%]">
              <div className="animate-float [animation-delay:1.2s]">
                <div className="aspect-[3/4] rotate-6">
                  <BookCover book={coverTwo} size="sm" />
                </div>
              </div>
            </div>

            <div
              key={`badge-${active}`}
              className="absolute -right-1 bottom-6 animate-fade-up rounded-2xl border border-gold-400/20 bg-forest-950/90 px-3.5 py-3 shadow-xl backdrop-blur sm:-right-4 sm:bottom-10 sm:px-4"
            >
              <p className="font-display text-2xl font-bold text-gold-300 sm:text-3xl">
                {slide.badgeValue}
              </p>
              <p className="mt-0.5 text-[9px] font-medium text-cream-100/60 sm:text-[10px]">
                {slide.badgeLabel}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-5 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] text-cream-100/65 backdrop-blur sm:text-[11px]">
            <span className="flex -space-x-2">
              {["রা", "সা", "তা"].map((initial, index) => (
                <span
                  key={initial}
                  className="grid h-6 w-6 place-items-center rounded-full border-2 border-forest-950 text-[8px] font-bold text-forest-950"
                  style={{ backgroundColor: ["#c8a24a", "#b95e3d", "#559876"][index] }}
                >
                  {initial}
                </span>
              ))}
            </span>
            <span>আজ ৩২ জন নতুন বই অর্ডার করেছেন</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
