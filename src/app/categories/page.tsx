import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { books } from "@/data/books";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ক্যাটাগরি",
  description: "উপন্যাস, সাহিত্য, ইসলামিক ইতিহাস, জীবনী, স্টুডেন্ট বুকস ও আন্তর্জাতিক বইয়ের ক্যাটাগরি।",
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Browse by Genre"
        title="মনের মেজাজ অনুযায়ী ক্যাটাগরি বেছে নিন"
        description="প্রতিটি ক্যাটাগরিতে আছে পাঠকেরা বেছে নেওয়া বই, সহজ ফিল্টার আর নতুন লেখকের সম্ভার।"
        crumbs={[{ label: "ক্যাটাগরি" }]}
      />
      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryBooks = books.filter(
                (book) => book.category === category.slug,
              );
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-100/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-cream-100 hover:shadow-[0_24px_50px_-36px_rgba(10,33,24,0.5)] sm:p-7"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-forest-900/10"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl font-display text-lg font-bold text-cream-50"
                      style={{ backgroundColor: category.accent }}
                    >
                      {category.name.charAt(0)}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-forest-900/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay-500"
                    />
                  </div>
                  <p className="mt-6 text-[9px] uppercase tracking-[0.2em] text-muted">
                    {category.englishName}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-forest-950">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {category.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-forest-900/8 pt-4 text-[11px]">
                    <span className="font-semibold text-forest-800">
                      {toBn(categoryBooks.length)}টি বই
                    </span>
                    <span className="flex -space-x-3">
                      {categoryBooks.slice(0, 3).map((book) => (
                        <span
                          key={book.slug}
                          className="h-7 w-5 rounded-sm border border-cream-100 shadow-sm"
                          style={{
                            background: `linear-gradient(145deg, ${book.cover.from}, ${book.cover.to})`,
                          }}
                        />
                      ))}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
