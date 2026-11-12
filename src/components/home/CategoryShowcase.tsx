import Link from "next/link";
import {
  BookOpen,
  Feather,
  Globe2,
  GraduationCap,
  Landmark,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { books } from "@/data/books";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/lib/types";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const categoryIcons: Record<CategorySlug, LucideIcon> = {
  uponnash: BookOpen,
  sahitto: Feather,
  "islamic-itihas": Landmark,
  jiboni: Users,
  student: GraduationCap,
  international: Globe2,
};

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

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug];
            const count = books.filter((book) => book.category === category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center gap-2 rounded-[8px] border border-transparent px-1.5 py-3.5 text-center transition-colors hover:border-brand-200 hover:bg-brand-50/70 sm:px-2 sm:py-4"
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
                    {formatCount(count)} books
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
