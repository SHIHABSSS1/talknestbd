"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Grid2X2, List, Pencil, Search, SlidersHorizontal } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { books } from "@/data/books";
import { categories } from "@/data/categories";
import type { BookTag } from "@/lib/types";

type View = "grid" | "list";
type Sort = "title" | "price-low" | "price-high" | "stock";

const collections: { value: BookTag | "all"; label: string }[] = [
  { value: "all", label: "All collections" },
  { value: "bestseller", label: "Bestsellers" },
  { value: "new", label: "New arrivals" },
  { value: "viral", label: "Viral" },
  { value: "free-delivery", label: "Free delivery" },
  { value: "up-sale", label: "50% up sale" },
  { value: "trending", label: "Trending now" },
  { value: "sunnah", label: "Sunnah essentials" },
  { value: "international", label: "International" },
  { value: "student", label: "Student books" },
  { value: "audio", label: "Audiobook" },
];

export function CatalogManager() {
  const [view, setView] = useState<View>("grid");
  const [category, setCategory] = useState("all");
  const [collection, setCollection] = useState<BookTag | "all">("all");
  const [sort, setSort] = useState<Sort>("title");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const result = books.filter((book) => {
      const matchesTerm =
        !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term);
      const matchesCategory = category === "all" || book.category === category;
      const matchesCollection = collection === "all" || book.tags.includes(collection);
      return matchesTerm && matchesCategory && matchesCollection;
    });
    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "stock") return a.stock - b.stock;
      return a.title.localeCompare(b.title);
    });
  }, [category, collection, sort, query]);

  const selectClass =
    "h-9 rounded-[4px] border border-line bg-white px-3 text-[11px] text-ink focus:border-brand-400 focus:outline-none";

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span>Dashboard</span><span>/</span><span className="font-semibold text-ink">All books view</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">All books view</h1>
        <p className="mt-1 text-[12px] text-muted">
          Browse the catalog the way your readers see it.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Catalog titles", value: books.length, icon: BookOpen },
          { label: "Categories", value: categories.length, icon: SlidersHorizontal },
          { label: "On display", value: visible.length, icon: Grid2X2 },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-[10px] border border-line bg-white p-4">
            <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-brand-50 text-brand-700">
              <stat.icon size={15} />
            </span>
            <div>
              <p className="text-[10px] text-muted">{stat.label}</p>
              <p className="font-display text-lg font-bold text-ink">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Toolbar */}
      <section className="rounded-[10px] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
          <label className="relative block min-w-[180px] flex-1 sm:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or author…"
              aria-label="Search catalog"
              className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink placeholder:text-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter category" className={selectClass}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>{item.name}</option>
            ))}
          </select>
          <select
            value={collection}
            onChange={(event) => setCollection(event.target.value as BookTag | "all")}
            aria-label="Filter collection"
            className={selectClass}
          >
            {collections.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} aria-label="Sort books" className={selectClass}>
            <option value="title">Sort: Title</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="stock">Stock: low to high</option>
          </select>
          <div className="ml-auto flex overflow-hidden rounded-[4px] border border-line">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`grid h-9 w-9 place-items-center ${view === "grid" ? "bg-brand-600 text-white" : "bg-white text-muted hover:text-brand-700"}`}
            >
              <Grid2X2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`grid h-9 w-9 place-items-center ${view === "list" ? "bg-brand-600 text-white" : "bg-white text-muted hover:text-brand-700"}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {visible.length === 0 ? (
            <p className="py-12 text-center text-[12px] text-muted">No books match your filters.</p>
          ) : view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((book) => (
                <div key={book.slug} className="overflow-hidden rounded-[9px] border border-line bg-white transition-shadow hover:shadow-[0_14px_35px_-28px_rgba(11,61,122,0.7)]">
                  <div className="flex h-44 items-center justify-center bg-canvas p-4">
                    <div className="h-full w-28">
                      <BookCover size="sm" book={book} />
                    </div>
                  </div>
                  <div className="border-t border-line p-3">
                    <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-ink">{book.title}</p>
                    <p className="mt-0.5 text-[9px] text-muted">{book.author}</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-ink">৳{book.price}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${book.stock <= 18 ? "bg-gold-500/10 text-gold-600" : "bg-mint/25 text-forest-700"}`}>
                        {book.stock <= 18 ? "Low stock" : "In stock"}
                      </span>
                    </div>
                    <Link
                      href="/admin/books"
                      className="mt-3 flex h-8 items-center justify-center gap-1.5 rounded-[4px] border border-line text-[10px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Pencil size={11} /> Edit book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {visible.map((book) => (
                <li key={book.slug} className="flex items-center gap-3 py-3">
                  <div className="h-14 w-10 shrink-0"><BookCover size="sm" book={book} /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-ink">{book.title}</p>
                    <p className="text-[9px] text-muted">{book.author} · {book.pages} pages</p>
                  </div>
                  <span className="hidden text-[10px] text-muted sm:block">{categories.find((c) => c.slug === book.category)?.name}</span>
                  <span className="w-16 text-right text-[11px] font-semibold text-ink">৳{book.price}</span>
                  <span className="w-16 text-right text-[10px] text-body">Stock {book.stock}</span>
                  <Link
                    href="/admin/books"
                    aria-label={`Edit ${book.title}`}
                    className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    <Pencil size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
          Showing {visible.length} of {books.length} titles · Design preview — no data is saved
        </div>
      </section>
    </div>
  );
}
