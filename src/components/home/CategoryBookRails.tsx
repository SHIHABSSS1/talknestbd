"use client";

import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { BookCard } from "@/components/books/BookCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import { booksForTile } from "@/lib/category-books";

/**
 * One horizontal book slider per homepage category. The shelves and their
 * visibility are managed in /admin/sections/categories.
 */
export function CategoryBookRails() {
  const { content } = useCategoryContent();
  const tiles = content.tiles.filter((tile) => tile.homeBooks);
  if (tiles.length === 0) return null;

  return (
    <>
      {tiles.map((tile, index) => {
        const tileBooks = booksForTile(tile);
        if (tileBooks.length === 0) return null;
        return (
          <section
            key={tile.id}
            className={`border-b border-line py-8 sm:py-10 ${
              index % 2 === 1 ? "bg-canvas" : "bg-white"
            }`}
          >
            <Container>
              <SectionHeader
                eyebrow={tile.englishName || "Explore the shelf"}
                title={tile.name}
                description={tile.description}
                href={tile.href}
                linkLabel={`All ${tile.name}`}
                className="mb-5 sm:mb-6"
              />
              <Swiper
                modules={[FreeMode]}
                freeMode
                grabCursor
                slidesPerView={2.1}
                spaceBetween={10}
                breakpoints={{
                  480: { slidesPerView: 2.6, spaceBetween: 12 },
                  640: { slidesPerView: 3.3, spaceBetween: 14 },
                  900: { slidesPerView: 4.3, spaceBetween: 14 },
                  1200: { slidesPerView: 5.3, spaceBetween: 16 },
                }}
                aria-label={`${tile.name} books`}
                className="!overflow-visible"
              >
                {tileBooks.map((book) => (
                  <SwiperSlide key={book.slug} className="!h-auto">
                    <BookCard book={book} compact />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Container>
          </section>
        );
      })}
    </>
  );
}
