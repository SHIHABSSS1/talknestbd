"use client";

import { useCallback, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { Container } from "@/components/ui/Container";

type HeroBanner = {
  id: string;
  imageId: string;
  alt: string;
  position?: string;
};

/**
 * Image-only campaign banners. The carousel rotates on its own and can be
 * swiped, but it deliberately has no overlaid copy, buttons or navigation.
 */
const banners: HeroBanner[] = [
  {
    id: "library",
    imageId: "1481627834876-b7833e8f5570",
    alt: "A warm, softly lit aisle of bookshelves in a library",
  },
  {
    id: "open-book",
    imageId: "1532012197267-da84d127e765",
    alt: "An open book glowing at the end of a bookshop aisle",
    position: "50% 45%",
  },
  {
    id: "readers",
    imageId: "1523240795612-9a054b0db644",
    alt: "Students laughing together over books in a library",
    position: "55% 45%",
  },
  {
    id: "audiobooks",
    imageId: "1546435770-a3e426bf472b",
    alt: "Headphones resting on a light desk beside a keyboard",
  },
];

const AUTOPLAY_MS = 6000;
const IMAGE_WIDTHS = [800, 1200, 1600, 2000];

function bannerImage(imageId: string, width: number) {
  const height = Math.round(width * 0.35);
  return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

export function Hero() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startAutoplay = useCallback(
    (swiper: SwiperInstance) => {
      stopAutoplay();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      timerRef.current = window.setInterval(() => {
        if (!document.hidden) swiper.slideNext();
      }, AUTOPLAY_MS);
    },
    [stopAutoplay],
  );

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    startAutoplay(swiper);
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  const resumeAutoplay = useCallback(() => {
    const swiper = swiperRef.current;
    if (swiper) startAutoplay(swiper);
  }, [startAutoplay]);

  return (
    <section aria-label="Featured collections" className="bg-brand-50/60 py-4 sm:py-5">
      <h1 className="sr-only">
        TalkNest BD — books, audiobooks and a reader community in Bangladesh
      </h1>
      <Container>
        <div
          className="overflow-hidden rounded-[8px] border border-line bg-brand-100"
          onMouseEnter={stopAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocusCapture={stopAutoplay}
          onBlurCapture={resumeAutoplay}
        >
          <Swiper
            loop
            speed={900}
            slidesPerView={1}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              startAutoplay(swiper);
            }}
            onTouchStart={stopAutoplay}
            onTouchEnd={resumeAutoplay}
            aria-label="Featured collections"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={banner.id}>
                <div className="relative aspect-[16/9] max-h-[380px] w-full overflow-hidden bg-brand-100 sm:aspect-[2.6/1] lg:aspect-[3.2/1]">
                  <img
                    src={bannerImage(banner.imageId, 1600)}
                    srcSet={IMAGE_WIDTHS.map(
                      (width) => `${bannerImage(banner.imageId, width)} ${width}w`,
                    ).join(", ")}
                    sizes="(min-width: 1425px) 1361px, 100vw"
                    alt={banner.alt}
                    width={1600}
                    height={560}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={banner.position ? { objectPosition: banner.position } : undefined}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    decoding="async"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
}
