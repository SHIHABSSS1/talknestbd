"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight, BadgePercent, BookMarked, ChevronDown, Flame, GraduationCap, Headphones, Moon, RotateCcw, Search, SlidersHorizontal, Package, Star, TrendingUp, Truck, X, type LucideIcon } from "lucide-react";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { categories } from "@/data/categories";
import type { Book, BookTag } from "@/lib/types";
import { cn, formatCount, formatPrice, siteConfig } from "@/lib/utils";
import { BookGrid } from "@/components/books/BookGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

type SortKey = "popular" | "newest" | "price-low" | "price-high" | "rating";

type MultiFilterKey =
  | "categories"
  | "publishers"
  | "bindings"
  | "languages"
  | "collections"
  | "priceBands";

interface Filters {
  query: string;
  categories: string[];
  publishers: string[];
  bindings: string[];
  languages: string[];
  collections: string[];
  priceBands: string[];
  minRating: number;
  inStockOnly: boolean;
  sort: SortKey;
}

const initialFilters: Filters = {
  query: "",
  categories: [],
  publishers: [],
  bindings: [],
  languages: [],
  collections: [],
  priceBands: [],
  minRating: 0,
  inStockOnly: false,
  sort: "popular",
};

const sorts: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

const priceBands: { id: string; label: string; match: (price: number) => boolean }[] = [
  { id: "under-300", label: `Under ${formatPrice(300)}`, match: (price) => price < 300 },
  {
    id: "300-399",
    label: `${formatPrice(300)} – ${formatPrice(399)}`,
    match: (price) => price >= 300 && price < 400,
  },
  {
    id: "400-499",
    label: `${formatPrice(400)} – ${formatPrice(499)}`,
    match: (price) => price >= 400 && price < 500,
  },
  {
    id: "500-plus",
    label: `${formatPrice(500)} & above`,
    match: (price) => price >= 500,
  },
];

const collectionOptions: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "bestseller", label: "Bestsellers", icon: Flame },
  { value: "new", label: "New arrivals", icon: Package },
  { value: "viral", label: "Viral books", icon: TrendingUp },
  { value: "free-delivery", label: "Free delivery", icon: Truck },
  { value: "audio", label: "Audiobooks", icon: Headphones },
  { value: "up-sale", label: "50% up-sale", icon: BadgePercent },
  { value: "sunnah", label: "Sunnah picks", icon: Moon },
  { value: "student", label: "Student picks", icon: GraduationCap },
];

const quickLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Best Sellers", href: "/best-sellers", icon: Flame },
  { label: "New Arrivals", href: "/new-books", icon: Package },
  { label: "Buy Used Books", href: "/used-books", icon: BookMarked },
  { label: "Audiobooks", href: "/audio-books", icon: Headphones },
  { label: "50% Up Sale", href: "/up-sales", icon: TrendingUp },
  { label: "Sunnah Essentials", href: "/sunnah-items", icon: Moon },
];

/**
 * Books uploaded in the admin always use a tile slug, but older/shelf data can
 * carry a sub-shelf slug in `category`. Folding those into the six real shelves
 * keeps the sidebar counts and filtering accurate across the unified catalogue.
 */
const categoryAliases: Record<string, string> = {
  "bangla-novels": "uponnash",
  translations: "uponnash",
  "short-stories": "sahitto",
  poetry: "sahitto",
  essays: "sahitto",
  "islamic-history": "islamic-itihas",
  sunnah: "islamic-itihas",
  "seerah-biography": "jiboni",
  autobiography: "jiboni",
  history: "jiboni",
  "exam-guides": "student",
  language: "student",
  "self-help": "student",
  fiction: "international",
  "personal-development": "international",
};

function groupCategory(book: Book): string {
  return categoryAliases[book.category] ?? book.category;
}

function prettify(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function countBy(books: Book[], valuesOf: (book: Book) => string | string[]) {
  const counts: Record<string, number> = {};
  for (const book of books) {
    const raw = valuesOf(book);
    for (const value of Array.isArray(raw) ? raw : [raw]) {
      counts[value] = (counts[value] ?? 0) + 1;
    }
  }
  return counts;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <section className="border-b border-line pb-5 last:border-0">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 py-1 text-left"
        >
          <span>{title}</span>
          <ChevronDown
            size={14}
            className={cn("shrink-0 text-muted transition-transform", open && "rotate-180")}
          />
        </button>
      </h3>
      {open && <div className="mt-3 space-y-1">{children}</div>}
    </section>
  );
}

function FilterCheckbox({
  id,
  label,
  count,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: ReactNode;
  count: number;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-[4px] px-1 py-1.5 text-[12px] transition-colors hover:bg-brand-50",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="h-3.5 w-3.5 shrink-0 rounded border-line accent-brand-600"
      />
      <span className="flex-1 text-body">{label}</span>
      <span className="text-[10px] tabular-nums text-muted">{formatCount(count)}</span>
    </label>
  );
}

export function BooksExplorer() {
  const { books } = useBookContent();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const facets = useMemo(() => {
    const priceCounts: Record<string, number> = {};
    for (const band of priceBands) {
      priceCounts[band.id] = books.filter((book) => band.match(book.price)).length;
    }
    return {
      categories: countBy(books, groupCategory),
      publishers: countBy(books, (book) => book.publisher),
      bindings: countBy(books, (book) => book.binding),
      languages: countBy(books, (book) => book.language),
      collections: countBy(books, (book) => book.tags),
      price: priceCounts,
      rating4: books.filter((book) => book.rating >= 4).length,
      rating45: books.filter((book) => book.rating >= 4.5).length,
      inStock: books.filter((book) => book.stock > 0).length,
    };
  }, [books]);

  const categoryOptions = useMemo(() => {
    const options = categories.map((category) => ({
      value: category.slug as string,
      label: category.name,
    }));
    if (facets.categories.used) options.push({ value: "used", label: "Used Books" });
    for (const value of Object.keys(facets.categories)) {
      if (!options.some((option) => option.value === value)) {
        options.push({ value, label: prettify(value) });
      }
    }
    return options;
  }, [facets]);

  const publisherOptions = useMemo(
    () => Object.keys(facets.publishers).sort((a, b) => facets.publishers[b] - facets.publishers[a]),
    [facets],
  );
  const bindingOptions = useMemo(() => Object.keys(facets.bindings).sort(), [facets]);
  const languageOptions = useMemo(() => Object.keys(facets.languages).sort(), [facets]);

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const result = books.filter((book) => {
      if (filters.categories.length && !filters.categories.includes(groupCategory(book))) {
        return false;
      }
      if (filters.publishers.length && !filters.publishers.includes(book.publisher)) return false;
      if (filters.bindings.length && !filters.bindings.includes(book.binding)) return false;
      if (filters.languages.length && !filters.languages.includes(book.language)) return false;
      if (filters.collections.length && !filters.collections.every((tag) => book.tags.includes(tag as BookTag))) {
        return false;
      }
      if (
        filters.priceBands.length &&
        !filters.priceBands.some((id) => priceBands.find((band) => band.id === id)?.match(book.price))
      ) {
        return false;
      }
      if (filters.minRating && book.rating < filters.minRating) return false;
      if (filters.inStockOnly && book.stock <= 0) return false;
      if (
        query &&
        !`${book.title} ${book.subtitle ?? ""} ${book.author} ${book.publisher} ${book.category} ${book.tags.join(" ")}`
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return b.publishedYear - a.publishedYear || b.rating - a.rating;
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return b.rating * b.reviewCount - a.rating * a.reviewCount;
      }
    });
  }, [books, filters]);

  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; remove: () => void }[] = [];
    const removeFrom = (key: MultiFilterKey, value: string) =>
      setFilters((previous) => ({
        ...previous,
        [key]: previous[key].filter((item) => item !== value),
      }));

    if (filters.query.trim()) {
      chips.push({
        id: "query",
        label: `“${filters.query.trim()}”`,
        remove: () => setFilters((previous) => ({ ...previous, query: "" })),
      });
    }
    for (const value of filters.categories) {
      chips.push({
        id: `category-${value}`,
        label: categoryOptions.find((option) => option.value === value)?.label ?? prettify(value),
        remove: () => removeFrom("categories", value),
      });
    }
    for (const value of filters.publishers) {
      chips.push({
        id: `publisher-${value}`,
        label: value,
        remove: () => removeFrom("publishers", value),
      });
    }
    for (const value of filters.bindings) {
      chips.push({
        id: `binding-${value}`,
        label: value,
        remove: () => removeFrom("bindings", value),
      });
    }
    for (const value of filters.languages) {
      chips.push({
        id: `language-${value}`,
        label: value,
        remove: () => removeFrom("languages", value),
      });
    }
    for (const value of filters.collections) {
      chips.push({
        id: `collection-${value}`,
        label: collectionOptions.find((option) => option.value === value)?.label ?? prettify(value),
        remove: () => removeFrom("collections", value),
      });
    }
    for (const value of filters.priceBands) {
      chips.push({
        id: `price-${value}`,
        label: priceBands.find((band) => band.id === value)?.label ?? prettify(value),
        remove: () => removeFrom("priceBands", value),
      });
    }
    if (filters.minRating) {
      chips.push({
        id: "rating",
        label: `${filters.minRating}★ & up`,
        remove: () => setFilters((previous) => ({ ...previous, minRating: 0 })),
      });
    }
    if (filters.inStockOnly) {
      chips.push({
        id: "stock",
        label: "In stock only",
        remove: () => setFilters((previous) => ({ ...previous, inStockOnly: false })),
      });
    }
    return chips;
  }, [filters, categoryOptions]);

  const hasFilters = activeChips.length > 0;

  const toggleMulti = (key: MultiFilterKey, value: string) =>
    setFilters((previous) => ({
      ...previous,
      [key]: previous[key].includes(value)
        ? previous[key].filter((item) => item !== value)
        : [...previous[key], value],
    }));

  const clearAll = () => setFilters(initialFilters);

  function renderSidebar(prefix: string) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-brand-600" />
            <h2 className="text-[13px] font-bold text-ink">Filters</h2>
            {hasFilters && (
              <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                {formatCount(activeChips.length)}
              </span>
            )}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-clay-600 hover:text-brand-700"
            >
              <RotateCcw size={11} /> Clear all
            </button>
          )}
        </div>

        <FilterSection title="Category">
          {categoryOptions.map((option) => (
            <FilterCheckbox
              key={option.value}
              id={`${prefix}-category-${option.value}`}
              label={option.label}
              count={facets.categories[option.value] ?? 0}
              checked={filters.categories.includes(option.value)}
              onChange={() => toggleMulti("categories", option.value)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Price range">
          {priceBands.map((band) => (
            <FilterCheckbox
              key={band.id}
              id={`${prefix}-price-${band.id}`}
              label={band.label}
              count={facets.price[band.id] ?? 0}
              checked={filters.priceBands.includes(band.id)}
              onChange={() => toggleMulti("priceBands", band.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Collections & offers">
          {collectionOptions.map((option) => {
            const Icon = option.icon;
            return (
              <FilterCheckbox
                key={option.value}
                id={`${prefix}-collection-${option.value}`}
                label={
                  <span className="flex items-center gap-2">
                    <Icon size={13} className="text-brand-500" />
                    {option.label}
                  </span>
                }
                count={facets.collections[option.value] ?? 0}
                checked={filters.collections.includes(option.value)}
                onChange={() => toggleMulti("collections", option.value)}
              />
            );
          })}
        </FilterSection>

        <FilterSection title="Publisher">
          {publisherOptions.map((publisher) => (
            <FilterCheckbox
              key={publisher}
              id={`${prefix}-publisher-${publisher}`}
              label={publisher}
              count={facets.publishers[publisher] ?? 0}
              checked={filters.publishers.includes(publisher)}
              onChange={() => toggleMulti("publishers", publisher)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Customer rating">
          {[
            { value: 0, label: "All ratings", count: books.length },
            { value: 4, label: "4★ & up", count: facets.rating4 },
            { value: 4.5, label: "4.5★ & up", count: facets.rating45 },
          ].map((option) => (
            <label
              key={option.value}
              htmlFor={`${prefix}-rating-${option.value}`}
              className="flex cursor-pointer items-center gap-2.5 rounded-[4px] px-1 py-1.5 text-[12px] transition-colors hover:bg-brand-50"
            >
              <input
                id={`${prefix}-rating-${option.value}`}
                type="radio"
                name={`${prefix}-rating`}
                checked={filters.minRating === option.value}
                onChange={() => setFilters((previous) => ({ ...previous, minRating: option.value }))}
                className="h-3.5 w-3.5 shrink-0 accent-brand-600"
              />
              <span className="flex-1 text-body">
                {option.value === 0 ? (
                  option.label
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} className="fill-sale text-sale" /> {option.label}
                  </span>
                )}
              </span>
              <span className="text-[10px] tabular-nums text-muted">{formatCount(option.count)}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Book details">
          {bindingOptions.map((binding) => (
            <FilterCheckbox
              key={binding}
              id={`${prefix}-binding-${binding}`}
              label={binding}
              count={facets.bindings[binding] ?? 0}
              checked={filters.bindings.includes(binding)}
              onChange={() => toggleMulti("bindings", binding)}
            />
          ))}
          {languageOptions.map((language) => (
            <FilterCheckbox
              key={language}
              id={`${prefix}-language-${language}`}
              label={language}
              count={facets.languages[language] ?? 0}
              checked={filters.languages.includes(language)}
              onChange={() => toggleMulti("languages", language)}
            />
          ))}
          <FilterCheckbox
            id={`${prefix}-stock`}
            label="In stock only"
            count={facets.inStock}
            checked={filters.inStockOnly}
            onChange={() =>
              setFilters((previous) => ({ ...previous, inStockOnly: !previous.inStockOnly }))
            }
          />
        </FilterSection>

        <div className="border-t border-line pt-5">
          <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
            Explore TalkNest
          </h3>
          <ul className="space-y-0.5">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center gap-2.5 rounded-[4px] px-1 py-1.5 text-[12px] text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon size={14} className="shrink-0 text-brand-500" />
                  <span className="flex-1">{label}</span>
                  <ArrowRight
                    size={12}
                    className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="brand-wash rounded-[6px] border border-brand-100 p-4">
          <div className="flex items-center gap-2 text-brand-800">
            <Truck size={16} className="shrink-0" />
            <span className="text-[12px] font-semibold">
              Free delivery over {formatPrice(siteConfig.freeDeliveryThreshold)}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Finished a book? Sell it back and get {siteConfig.sellUsedBookRate}% of what you paid.
          </p>
          <Link
            href="/free-order"
            onClick={() => setMobileOpen(false)}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
          >
            See details <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[232px_minmax(0,1fr)] xl:gap-8">
        <aside className="hidden lg:block" aria-label="Book filters">
          <div className="sticky top-20 rounded-[8px] border border-line bg-surface p-4 soft-shadow">
            {renderSidebar("desktop")}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-[8px] border border-line bg-surface p-3 soft-shadow sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="search"
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((previous) => ({ ...previous, query: event.target.value }))
                  }
                  placeholder="Search books, authors, publishers or subjects..."
                  aria-label="Search books"
                  className="h-11 w-full rounded-[4px] border border-line bg-canvas pl-11 pr-10 text-[13px] text-ink placeholder:text-muted focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                {filters.query && (
                  <button
                    type="button"
                    onClick={() => setFilters((previous) => ({ ...previous, query: "" }))}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-brand-50 hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-[4px] border border-line bg-canvas px-4 text-[12px] font-semibold text-ink transition-colors hover:border-brand-300 lg:hidden"
                >
                  <SlidersHorizontal size={15} className="text-brand-600" />
                  Filters
                  {hasFilters && (
                    <span className="rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      {formatCount(activeChips.length)}
                    </span>
                  )}
                </button>
                <div className="relative flex-1 lg:flex-none">
                  <select
                    value={filters.sort}
                    onChange={(event) =>
                      setFilters((previous) => ({
                        ...previous,
                        sort: event.target.value as SortKey,
                      }))
                    }
                    aria-label="Sort books"
                    className="h-11 w-full appearance-none rounded-[4px] border border-line bg-canvas pl-4 pr-9 text-[12px] font-medium text-ink focus:border-brand-300 focus:outline-none lg:min-w-[178px]"
                  >
                    {sorts.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.remove}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[11px] font-medium text-brand-800 transition-colors hover:border-brand-400 hover:bg-brand-100"
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2 text-[11px] font-medium text-clay-600 hover:text-brand-700"
              >
                <RotateCcw size={11} /> Clear all
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-xs text-muted">
              Showing{" "}
              <span className="font-semibold text-ink">{formatCount(filtered.length)}</span> of{" "}
              {formatCount(books.length)} books
            </p>
            <p className="text-[11px] text-muted">
              Sorted by{" "}
              <span className="font-semibold text-brand-700">
                {sorts.find((item) => item.value === filters.sort)?.label}
              </span>
            </p>
          </div>

          <div className="mt-5">
            {filtered.length > 0 ? (
              <BookGrid books={filtered} columns="five" />
            ) : (
              <EmptyState
                title="No books found"
                description="Try a different search or remove a few filters to see more of the shelf."
                action={<Button href="/books">Browse all books</Button>}
              />
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/45 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Book filters"
            className="absolute inset-y-0 left-0 flex w-[min(340px,88vw)] flex-col bg-surface shadow-2xl"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <span className="text-sm font-bold text-ink">Filter books</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
                autoFocus
                className="grid h-9 w-9 place-items-center rounded-[4px] text-muted hover:bg-brand-50 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto p-4">{renderSidebar("mobile")}</div>
            <div className="shrink-0 border-t border-line bg-surface p-3">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-11 w-full rounded-[4px] bg-brand-600 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Show {formatCount(filtered.length)} books
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
