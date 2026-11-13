"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { categoryLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

type HeroSlide = {
  id: string;
  image: string;
  alt: string;
  badge: string;
  title: string;
  accent: string;
  text: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  stat: { value: string; label: string };
  note: string;
};

/** Demo banners: online stock photography (Unsplash). */
const slides: HeroSlide[] = [
  {
    id: "welcome",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1600&h=900&q=80",
    alt: "An open book glowing at the end of a bookshop aisle",
    badge: "The TalkNest Bookstore",
    title: "Stories that stay",
    accent: "with you.",
    text: "Discover bestsellers, new voices, Islamic history and thoughtful non-fiction — curated for readers in Bangladesh.",
    primary: { href: "/books", label: "Shop all books" },
    secondary: { href: "/categories", label: "Browse categories" },
    stat: { value: "1,200+", label: "curated books" },
    note: "Free delivery over ৳999",
  },
  {
    id: "bestsellers",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&h=900&q=80",
    alt: "Shelves filled with colourful old books",
    badge: "Handpicked shelf",
    title: "Bestsellers that",
    accent: "earned their place.",
    text: "Our editors pick the titles readers keep coming back for — and we ship them the same day you order.",
    primary: { href: "/best-sellers", label: "See best sellers" },
    secondary: { href: "/new-books", label: "New arrivals" },
    stat: { value: "Top 50", label: "reader picks" },
    note: "Updated every month",
  },
  {
    id: "students",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&h=900&q=80",
    alt: "Students reading together around a table",
    badge: "Exam season",
    title: "Study smarter with",
    accent: "student editions.",
    text: "Campus favourites, solved problems and second-hand notes at student prices — delivered across Dhaka and beyond.",
    primary: { href: "/student-books", label: "Student books" },
    secondary: { href: "/quiz", label: "Try the quiz" },
    stat: { value: "৳150", label: "student pricing" },
    note: "Bulk order discounts",
  },
  {
    id: "audiobooks",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&h=900&q=80",
    alt: "Headphones resting on a clean desk",
    badge: "Listen now",
    title: "Books that",
    accent: "speak to you.",
    text: "Narrated audiobooks for commutes, chores and late nights — listen on any device, no subscription needed.",
    primary: { href: "/audio-books", label: "Browse audiobooks" },
    secondary: { href: "/video", label: "Watch video" },
    stat: { value: "120+", label: "audio titles" },
    note: "Free delivery over ৳999",
  },
  {
    id: "used-books",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1600&h=900&q=80",
    alt: "A stack of pre-loved books on a table",
    badge: "Second reads",
    title: "Half price,",
    accent: "twice the story.",
    text: "Sell the books you have finished and buy another reader's favourites for less. Every exchange keeps a good story in circulation.",
    primary: { href: "/used-books", label: "Browse used books" },
    secondary: { href: "/used-books#sell", label: "Sell your books" },
    stat: { value: "50%", label: "off pre-loved" },
    note: "Checked before delivery",
  },
];

export function Hero() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const timerRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  /**
   * Autoplay is hand-rolled on purpose: swiper's own autoplay module reads
   * `new Date()` while initialising, which Next.js refuses to prerender.
   */
  const startAutoplay = useCallback((swiper: SwiperInstance) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!document.hidden) swiper.slideNext();
    }, 5500);
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    startAutoplay(swiper);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [startAutoplay]);

  return (
    <section aria-label="Featured books" className="bg-brand-50/60 py-4 sm:py-5">
      <Container>
        <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
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
                  className="flex items-center justify-between px-4 py-[8px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                  <ChevronRight size={12} className="text-muted" />
                </Link>
              ))}
              <Link
                href="/best-sellers"
                className="flex items-center justify-between px-4 py-[8px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                Best Sellers
                <ChevronRight size={12} className="text-muted" />
              </Link>
              <Link
                href="/new-books"
                className="flex items-center justify-between px-4 py-[8px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
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

          <div className="relative overflow-hidden rounded-[8px] bg-brand-950">
            <Swiper
              loop
              spaceBetween={0}
              slidesPerView={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                startAutoplay(swiper);
              }}
              onSlideChange={(swiper) => setActive(swiper.realIndex)}
              aria-label="Featured book collections"
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <div className="relative flex min-h-[430px] w-full items-center overflow-hidden sm:min-h-[460px] lg:min-h-[500px]">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/70 to-brand-950/35 lg:bg-gradient-to-r lg:from-brand-950/95 lg:via-brand-950/70 lg:to-brand-950/15"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 paper-texture opacity-[0.10]"
                    />

                    <div className="relative w-full p-6 sm:p-9 lg:max-w-[58%] lg:p-12">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white/85 backdrop-blur">
                        <Sparkles size={11} className="text-brand-200" />
                        {slide.badge}
                      </span>
                      {index === 0 ? (
                        <h1 className="mt-4 max-w-[13ch] text-[32px] font-bold leading-[1.08] text-white sm:text-[40px] lg:text-[44px] xl:text-[48px]">
                          {slide.title}{" "}
                          <span className="text-brand-200">{slide.accent}</span>
                        </h1>
                      ) : (
                        <h2 className="mt-4 max-w-[15ch] text-[28px] font-bold leading-[1.1] text-white sm:text-[34px] lg:text-[38px] xl:text-[42px]">
                          {slide.title}{" "}
                          <span className="text-brand-200">{slide.accent}</span>
                        </h2>
                      )}
                      <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/75 sm:text-[15px]">
                        {slide.text}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6">
                        <Button href={slide.primary.href} variant="gold" size="md">
                          {slide.primary.label}
                          <ArrowRight size={15} />
                        </Button>
                        <Button href={slide.secondary.href} variant="light" size="md">
                          {slide.secondary.label}
                        </Button>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-white/60">
                        <span className="flex items-center gap-1.5">
                          <Truck size={12} />
                          {slide.note}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star size={11} className="fill-sale text-sale" />
                          4.9 reader rating
                        </span>
                      </div>
                    </div>

                    <div className="absolute right-6 top-6 hidden border border-white/20 bg-brand-950/80 px-3.5 py-2.5 backdrop-blur lg:block">
                      <p className="text-xl font-bold leading-none text-white">
                        {slide.stat.value}
                      </p>
                      <p className="mt-1 text-[9px] text-white/60">{slide.stat.label}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="pointer-events-none absolute inset-y-0 right-3 z-20 hidden items-center gap-2 sm:flex sm:right-5">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous banner"
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-brand-950/50 text-white backdrop-blur transition-colors hover:bg-brand-950/80"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next banner"
                className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-brand-950/50 text-white backdrop-blur transition-colors hover:bg-brand-950/80"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 sm:bottom-6 sm:right-6">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => swiperRef.current?.slideTo(index)}
                  aria-label={`Show banner ${index + 1}: ${slide.badge}`}
                  aria-current={active === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    active === index ? "w-7 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
