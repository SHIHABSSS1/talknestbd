"use client";

import Link from "next/link";
import {
  BookOpen,
  Feather,
  Globe2,
  GraduationCap,
  Headphones,
  Landmark,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { books } from "@/data/books";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";

const categoryIcons: Record<CategorySlug, LucideIcon> = {
  uponnash: BookOpen,
  sahitto: Feather,
  "islamic-itihas": Landmark,
  jiboni: Users,
  student: GraduationCap,
  international: Globe2,
};

const categoryItems = [
  ...categories.map((category) => ({
    key: category.slug,
    name: category.name,
    href: `/category/${category.slug}`,
    accent: category.accent,
    count: books.filter((book) => book.category === category.slug).length,
    icon: categoryIcons[category.slug],
  })),
  {
    key: "audio-books",
    name: "Audiobooks",
    href: "/audio-books",
    accent: "#37AAF7",
    count: books.filter((book) => Boolean(book.audio)).length,
    icon: Headphones,
  },
];

export function CategoryShowcase() {
  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow="Browse the shelves"
          title="Shop by category"
          description="Find your next read by mood, subject or the season of life you are in."
          href="/categories"
          linkLabel="All categories"
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
          {categoryItems.map((category) => {
            const Icon = category.icon;
            return (
              <SwiperSlide key={category.key} className="!h-auto">
                <Link
                  href={category.href}
                  className="group flex h-full min-h-[126px] flex-col items-center justify-center gap-2 rounded-[8px] border border-line bg-white px-1.5 py-3.5 text-center transition-colors hover:border-brand-300 hover:bg-brand-50/70 sm:min-h-[142px] sm:px-2 sm:py-4"
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-14 sm:w-14"
                    style={{ backgroundColor: `${category.accent}55` }}
                  >
                    <Icon size={22} className="text-brand-900" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-700 sm:text-[12px]">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-muted">
                      {formatCount(category.count)} {category.key === "audio-books" ? "titles" : "books"}
                    </span>
                  </span>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <ViewAllRow href="/categories" label="All categories" count={`${categoryItems.length} shelves`} />
      </Container>
    </section>
  );
}
