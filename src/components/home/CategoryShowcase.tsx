"use client";

import Link from "next/link";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { tileBookCount } from "@/lib/category-books";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";

export function CategoryShowcase() {
  const { content } = useCategoryContent();

  if (content.tiles.length === 0) return null;

  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={content.heading.eyebrow}
          title={content.heading.title}
          description={content.heading.description}
          href="/categories"
          linkLabel={content.heading.linkLabel}
          className="mb-5 sm:mb-6"
        />

        <Swiper
          modules={[FreeMode]}
          freeMode
          grabCursor
          slidesPerView={3.15}
          spaceBetween={8}
          breakpoints={{
            480: { slidesPerView: 4.15, spaceBetween: 10 },
            640: { slidesPerView: 5.15, spaceBetween: 12 },
            900: { slidesPerView: 6.15, spaceBetween: 12 },
            1200: { slidesPerView: 7, spaceBetween: 12 },
          }}
          aria-label="Book categories"
          className="!overflow-visible"
        >
          {content.tiles.map((tile) => {
            const count = tileBookCount(tile);
            return (
              <SwiperSlide key={tile.id} className="!h-auto">
                <Link
                  href={tile.href || "/categories"}
                  className="group flex h-full min-h-[126px] flex-col items-center justify-center gap-2 rounded-[8px] border border-line bg-white px-1.5 py-3.5 text-center transition-colors hover:border-brand-300 hover:bg-brand-50/70 sm:min-h-[142px] sm:px-2 sm:py-4"
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-14 sm:w-14"
                    style={{ backgroundColor: `${tile.accent}55` }}
                  >
                    {tile.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tile.src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <CategoryIcon icon={tile.icon} className="text-brand-900" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-700 sm:text-[12px]">
                      {tile.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted">
                      {formatCount(count)} {tile.audio ? "titles" : "books"}
                    </span>
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <ViewAllRow
          href="/categories"
          label={content.heading.linkLabel}
          count={`${content.tiles.length} shelves`}
        />
      </Container>
    </section>
  );
}
