"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { booksForTile, subcategoryBooks, tileBookCount } from "@/lib/category-books";
import { cn, formatCount } from "@/lib/utils";

/** Category landing page: main category, its sub-shelves and their books. */
export function CategoryDetail({ slug }: { slug: string }) {
  const { content, hydrated } = useCategoryContent();
  const { books: extraBooks } = useBookContent();
  const [activeSub, setActiveSub] = useState<string | null>(null);

  const tile = content.tiles.find((item) => item.slug === slug);

  if (!hydrated) {
    return (
      <section className="py-16">
        <Container>
          <p className="text-center text-sm text-muted">Loading category…</p>
        </Container>
      </section>
    );
  }

  if (!tile) {
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg rounded-[10px] border border-line bg-white p-8 text-center">
            <h1 className="font-display text-xl font-bold text-ink">
              Category not found
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This shelf may have been created in another browser. Demo categories are
              stored locally — open the admin editor in this browser to create it.
            </p>
            <Link
              href="/categories"
              className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
            >
              Browse all categories <ArrowRight size={13} />
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const selected = tile.subcategories.find((sub) => sub.slug === activeSub);
  const visibleBooks = selected
    ? subcategoryBooks(tile, selected, extraBooks)
    : booksForTile(tile, undefined, extraBooks);

  return (
    <>
      <PageHeader
        eyebrow={tile.englishName}
        title={tile.name}
        description={tile.description}
        crumbs={[
          { label: "Categories", href: "/categories" },
          { label: tile.name },
        ]}
      >
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3.5 py-1.5 text-[11px] font-medium text-forest-800 hover:border-forest-900/30"
          >
            <LayoutGrid size={12} /> All categories
          </Link>
          {content.tiles.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
                item.id === tile.id
                  ? "border-forest-900 bg-forest-900 text-cream-50"
                  : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          {/* Main category banner */}
          <div className="relative overflow-hidden rounded-[10px] border border-line bg-white p-5 sm:p-7">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-forest-900/10"
            />
            <div className="relative flex flex-wrap items-center gap-4">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[8px] text-xl font-bold text-white"
                style={{ backgroundColor: tile.accent }}
              >
                {tile.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tile.src} alt="" className="h-full w-full object-cover" />
                ) : tile.audio ? (
                  <CategoryIcon icon={tile.icon} size={22} className="text-white" />
                ) : (
                  tile.name.charAt(0)
                )}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                  Main category
                </p>
                <h2 className="mt-0.5 font-display text-2xl font-bold text-ink">
                  {tile.name}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {formatCount(tileBookCount(tile, extraBooks))} {tile.audio ? "audio titles" : "books"} across{" "}
                  {tile.subcategories.length || 1} shelves
                </p>
              </div>
            </div>
          </div>

          {/* Subcategories */}
          {tile.subcategories.length > 0 && (
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                    Browse deeper
                  </p>
                  <h3 className="font-display text-lg font-bold text-ink">
                    Subcategories of {tile.name}
                  </h3>
                </div>
                {selected && (
                  <button
                    type="button"
                    onClick={() => setActiveSub(null)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tile.subcategories.map((sub) => {
                  const count = subcategoryBooks(tile, sub, extraBooks).length;
                  const active = activeSub === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveSub(active ? null : sub.slug)}
                      className={cn(
                        "group rounded-[8px] border bg-white p-4 text-left transition-colors hover:border-brand-300",
                        active ? "border-brand-500 ring-2 ring-brand-500/15" : "border-line",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className="grid h-9 w-9 place-items-center rounded-[6px] text-sm font-bold text-brand-900"
                          style={{ backgroundColor: `${tile.accent}55` }}
                        >
                          {sub.name.charAt(0)}
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                        />
                      </div>
                      <p className="mt-3 text-[13px] font-bold text-ink">{sub.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {formatCount(count)} {count === 1 ? "book" : "books"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Books */}
          <div className="mt-9">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                  {selected ? "Subcategory" : "All books"}
                </p>
                <h3 className="font-display text-lg font-bold text-ink">
                  {selected ? selected.name : `Books in ${tile.name}`}
                </h3>
              </div>
              <p className="text-xs text-muted">
                {formatCount(visibleBooks.length)} {visibleBooks.length === 1 ? "book" : "books"} found
              </p>
            </div>
            {visibleBooks.length > 0 ? (
              <BookGrid books={visibleBooks} columns="five" />
            ) : (
              <p className="rounded-[8px] border border-line bg-white p-8 text-center text-sm text-muted">
                No books here yet. New titles will be added soon.
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
