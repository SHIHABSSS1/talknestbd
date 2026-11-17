import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Headphones } from "lucide-react";
import { categories } from "@/data/categories";
import { books } from "@/data/books";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { formatCount } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse novels, literature, Islamic history, biographies, student books and international titles.",
};

export default function CategoriesPage() {
  const audioBooks = books.filter((book) => Boolean(book.audio));

  return (
    <>
      <PageHeader
        eyebrow="Browse by Genre"
        title="Choose a category for your mood"
        description="Every category brings together reader-approved books, simple filters and fresh voices."
        crumbs={[{ label: "Categories" }]}
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
                  className="group relative overflow-hidden rounded-[8px] border border-line bg-white p-5 transition-colors duration-200 hover:border-brand-300 sm:p-6"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-forest-900/10"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid h-11 w-11 place-items-center rounded-[4px] text-lg font-bold text-white"
                      style={{ backgroundColor: category.accent }}
                    >
                      {category.name.charAt(0)}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                    />
                  </div>
                  <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                    {category.englishName}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-ink">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px]">
                    <span className="font-medium text-brand-700">
                      {formatCount(categoryBooks.length)} books
                    </span>
                    <span className="flex -space-x-3">
                      {categoryBooks.slice(0, 3).map((book) => (
                        <span
                          key={book.slug}
                          className="h-7 w-5 rounded-[2px] border border-white shadow-sm"
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
            <Link
              href="/audio-books"
              className="group relative overflow-hidden rounded-[8px] border border-line bg-white p-5 transition-colors duration-200 hover:border-brand-300 sm:p-6"
            >
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-brand-200"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-[4px] bg-brand-600 text-white">
                  <Headphones size={20} />
                </span>
                <ArrowUpRight
                  size={18}
                  className="text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </div>
              <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                Listen anywhere
              </p>
              <h2 className="mt-1 text-xl font-bold text-ink">Audiobooks</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Narrated stories, thoughtful non-fiction and free first-chapter previews.
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px]">
                <span className="font-medium text-brand-700">
                  {formatCount(audioBooks.length)} audio titles
                </span>
                <span className="flex -space-x-3">
                  {audioBooks.slice(0, 3).map((book) => (
                    <span
                      key={book.slug}
                      className="h-7 w-5 rounded-[2px] border border-white shadow-sm"
                      style={{
                        background: `linear-gradient(145deg, ${book.cover.from}, ${book.cover.to})`,
                      }}
                    />
                  ))}
                </span>
              </div>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
