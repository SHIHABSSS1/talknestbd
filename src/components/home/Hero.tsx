"use client";

import { useCallback, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { Container } from "@/components/ui/Container";
import { useHeroContent } from "@/components/providers/HeroContentProvider";
import { bannerSrc, bannerSrcSet } from "@/lib/hero-content";

const AUTOPLAY_MS = 6000;

/**
 * Image-only campaign banners. The carousel rotates on its own and can be
 * swiped, but it deliberately has no overlaid copy, buttons or navigation.
 * Slides are managed from /admin/sections/hero and stored in localStorage.
 */
export function Hero() {
  const { content } = useHeroContent();
  const banners = content.banners;
  const swiperRef = useRef<SwiperInstance | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startAutoplay = useCallback(
    (swiper: SwiperInstance) => {
      stopAutoplay();
      if (banners.length < 2) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      timerRef.current = window.setInterval(() => {
        if (!document.hidden) swiper.slideNext();
      }, AUTOPLAY_MS);
    },
    [banners.length, stopAutoplay],
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
      <h1 className="sr-only">Featured collections at TalkNest BD</h1>
      <Container>
        <div
          className="overflow-hidden rounded-[8px] border border-line bg-brand-100"
          onMouseEnter={stopAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocusCapture={stopAutoplay}
          onBlurCapture={resumeAutoplay}
        >
          {banners.length === 0 ? (
            <div className="flex aspect-[16/9] max-h-[380px] w-full items-center justify-center bg-brand-100 sm:aspect-[2.6/1] lg:aspect-[3.2/1]">
              <p className="px-4 text-center text-[12px] text-muted">
                No banner slides configured. Add one from the admin hero section.
              </p>
            </div>
          ) : (
            <Swiper
              loop={banners.length > 1}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bannerSrc(banner, 1600)}
                      srcSet={bannerSrcSet(banner)}
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
          )}
        </div>
      </Container>
    </section>
  );
}
