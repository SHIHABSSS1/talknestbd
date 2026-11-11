import Link from "next/link";
import {
  ArrowUpRight,
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
import { toBn } from "@/lib/utils";
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
  const primary = categories.filter((category) => category.primary);
  const secondary = categories.filter((category) => !category.primary);

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <SectionHeader
          eyebrow="Explore by genre"
          title="আপনার পছন্দের ক্যাটাগরি"
          description="যেকোনো মেজাজে, যেকোনো সময়ে — আপনার জন্য থাকুক একটি ভালো বই।"
          href="/categories"
          linkLabel="সব ক্যাটাগরি"
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {primary.map((category) => {
            const Icon = categoryIcons[category.slug];
            const count = books.filter((book) => book.category === category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative min-h-[168px] overflow-hidden rounded-2xl p-5 text-cream-50 soft-shadow sm:min-h-[196px] sm:p-6"
                style={{
                  background: `linear-gradient(145deg, ${category.accent} 0%, #0a2118 130%)`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/10 transition-transform duration-500 group-hover:scale-125"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full border border-white/10"
                />
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur">
                  <Icon size={19} />
                </span>
                <div className="mt-5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/45">
                    {category.englishName}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold sm:text-2xl">
                    {category.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-cream-100/55 sm:text-[11px]">
                      {toBn(count)}টি বই
                    </span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition-colors group-hover:bg-gold-500 group-hover:text-forest-950">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-2">
          {secondary.map((category) => {
            const Icon = categoryIcons[category.slug];
            const count = books.filter((book) => book.category === category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden rounded-2xl border border-forest-900/10 bg-cream-100/60 px-4 py-4 transition-colors hover:border-forest-900/20 hover:bg-cream-100 sm:gap-4 sm:px-5"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-cream-50 sm:h-11 sm:w-11"
                  style={{ backgroundColor: category.accent }}
                >
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-semibold text-forest-950">
                    {category.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted">
                    {category.description}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[10px] text-muted min-[380px]:block">
                  {toBn(count)}টি বই
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-forest-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
