"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { books } from "@/data/books";
import { categories } from "@/data/categories";
import type { CategorySlug } from "@/lib/types";
import { cn, toBn } from "@/lib/utils";
import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

type SortKey = "popular" | "newest" | "price-low" | "price-high";

const sorts: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

export function BooksExplorer() {
  const [category, setCategory] = useState<"all" | CategorySlug>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [query, setQuery] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = books.filter((book) => {
      if (category !== "all" && book.category !== category) return false;
      if (freeOnly && !book.tags.includes("free-delivery")) return false;
      if (
        normalized &&
        !`${book.title} ${book.author} ${book.publisher}`
          .toLowerCase()
          .includes(normalized)
      ) {
        return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.publishedYear - a.publishedYear;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
  }, [category, sort, query, freeOnly]);

  const hasFilters = category !== "all" || query.trim() || freeOnly;

  return (
    <div>
      <div className="rounded-2xl border border-forest-900/10 bg-cream-100/50 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-700/40"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search books, authors or publishers in this collection..."
              className="h-11 w-full rounded-full border border-forest-900/10 bg-cream-50 pl-11 pr-4 text-[13px] focus:border-forest-700/30 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-forest-900/10 bg-cream-50 px-4 text-[11px] font-medium text-forest-800">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(event) => setFreeOnly(event.target.checked)}
                className="h-3.5 w-3.5 accent-forest-900"
              />
              Free delivery
            </label>
            <div className="relative">
              <SlidersHorizontal
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/50"
              />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                aria-label="Sort by"
                className="h-10 appearance-none rounded-full border border-forest-900/10 bg-cream-50 pl-9 pr-8 text-[11px] font-medium text-forest-800 focus:border-forest-700/30 focus:outline-none"
              >
                {sorts.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
              category === "all"
                ? "border-forest-900 bg-forest-900 text-cream-50"
                : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
            )}
          >
            All books
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setCategory(item.slug)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
                category === item.slug
                  ? "border-forest-900 bg-forest-900 text-cream-50"
                  : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          Showing <span className="font-semibold text-forest-900">{toBn(filtered.length)}</span> books
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setQuery("");
              setFreeOnly(false);
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-clay-600 hover:text-clay-500"
          >
            <RotateCcw size={12} />
            Reset filters
          </button>
        )}
      </div>

      <div className="mt-4">
        {filtered.length > 0 ? (
          <BookGrid books={filtered} columns="five" />
        ) : (
          <EmptyState
            title="No books found"
            description="Try a different search term or adjust your filters."
            action={<Button href="/books">Browse all books</Button>}
          />
        )}
      </div>
    </div>
  );
}
