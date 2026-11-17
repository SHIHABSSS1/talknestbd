"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useShelfContent } from "@/components/providers/ShelfContentProvider";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import { categoryLabel } from "@/data/categories";
import { BookCover } from "@/components/books/BookCover";
import { BookForm } from "./BookForm";
import type { Book, BookTag } from "@/lib/types";
import type { ShelfHeading } from "@/lib/shelf-content";
import { cn, formatPrice } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

type Notice = { text: string; error?: boolean };
type Tab = "books" | "settings";

export interface ShelfConfig {
  slug: string;
  tag: BookTag;
  href: string;
  shelfName: string;
}

export function ShelfEditor({ label, config }: { label: string; config: ShelfConfig }) {
  const { books, saveBook } = useBookContent();
  const { getHeading, saveHeading, resetHeading } = useShelfContent();
  const { content: categoryContent } = useCategoryContent();
  const [tab, setTab] = useState<Tab>("books");
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [editing, setEditing] = useState<Book | "new" | null>(null);
  const [draftHeading, setDraftHeading] = useState<ShelfHeading>(() =>
    getHeading(config.slug),
  );
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => setDraftHeading(getHeading(config.slug)), [getHeading, config.slug]);

  const shelfBooks = useMemo(
    () => books.filter((book) => book.tags.includes(config.tag)),
    [books, config.tag],
  );

  const categories = categoryContent.tiles.filter((tile) => !tile.audio);
  const visibleBooks = shelfBooks.filter((book) => {
    const term = query.trim().toLowerCase();
    const matchesTerm =
      !term ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term);
    const matchesCat = filterCat === "all" || book.category === filterCat;
    return matchesTerm && matchesCat;
  });

  const categoryName = (slug: string) => categoryLabel(slug);

  const removeFromShelf = (book: Book) => {
    const result = saveBook({
      ...book,
      tags: book.tags.filter((tag) => tag !== config.tag),
    });
    setNotice({
      text: result.ok
        ? `${book.title} removed from ${config.shelfName}. The book stays in the catalogue.`
        : result.message,
      error: !result.ok,
    });
  };

  const updateHeading = (key: keyof ShelfHeading, value: string) => {
    setDraftHeading((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const handleSaveHeading = () => {
    const result = saveHeading(config.slug, draftHeading);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleResetHeading = () => {
    const result = resetHeading(config.slug);
    setDraftHeading(getHeading(config.slug));
    setNotice({ text: result.message, error: !result.ok });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="transition-colors hover:text-brand-700">
          Dashboard
        </Link>
        <span>/</span>
        <span>Homepage sections</span>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
            <span className="rounded-full bg-mint/25 px-2.5 py-1 text-[9px] font-semibold text-forest-700">
              Published
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            Upload books with the same editor as Admin → Books. Books added here are real
            catalogue books with their own <code className="text-brand-700">/books/&lt;slug&gt;</code>{" "}
            detail page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={config.href}
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Eye size={13} /> View shelf
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-[8px] border border-line bg-white p-1">
        {(
          [
            { key: "books", label: "Books", count: shelfBooks.length },
            { key: "settings", label: "Settings" },
          ] as { key: Tab; label: string; count?: number }[]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
              tab === item.key
                ? "bg-brand-600 text-white"
                : "text-muted hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px]",
                  tab === item.key ? "bg-white/20" : "bg-brand-50 text-brand-700",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "books" && editing ? (
        <BookForm
          book={editing === "new" ? undefined : editing}
          defaultTags={[config.tag]}
          showPreview={false}
          onCancel={() => setEditing(null)}
          onSave={(book) => {
            const result = saveBook(book);
            setNotice({
              text: result.ok
                ? `${book.title} saved to the catalogue and this shelf.`
                : result.message,
              error: !result.ok,
            });
            if (result.ok) setEditing(null);
            return result;
          }}
        />
      ) : (
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {tab === "books" && (
            <section className="rounded-[10px] border border-line bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
                <div>
                  <h2 className="text-[13px] font-semibold text-ink">Shelf books</h2>
                  <p className="text-[10px] text-muted">
                    {shelfBooks.length} book{shelfBooks.length === 1 ? "" : "s"} · tagged “{config.tag}”
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing("new")}
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add book
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
                <div className="relative flex-1">
                  <Search
                    size={13}
                    className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search title or author…"
                    className={`${fieldClass} pl-8`}
                  />
                </div>
                <select
                  value={filterCat}
                  onChange={(event) => setFilterCat(event.target.value)}
                  className={`${fieldClass} w-auto min-w-[140px]`}
                >
                  <option value="all">All categories</option>
                  {categories.map((tile) => (
                    <option key={tile.id} value={tile.slug}>
                      {tile.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto p-2 sm:p-3">
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Book</th>
                      <th className="px-2 py-2 font-semibold">Category</th>
                      <th className="px-2 py-2 font-semibold">Price</th>
                      <th className="px-2 py-2 font-semibold">Stock</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleBooks.map((book) => (
                      <tr key={book.slug} className="border-b border-line/70 last:border-0">
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="h-12 w-8 shrink-0 overflow-hidden rounded-[3px]">
                              <BookCover book={book} size="sm" />
                            </span>
                            <div className="min-w-0">
                              <Link
                                href={`/books/${book.slug}`}
                                className="block truncate text-[11px] font-semibold text-ink hover:text-brand-700"
                              >
                                {book.title}
                              </Link>
                              <p className="text-[9px] text-muted">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2.5">
                          <p className="text-[10px] text-ink">{categoryName(book.category)}</p>
                          {book.subcategory && (
                            <p className="text-[9px] text-muted">
                              {book.subcategory.replace(/-/g, " ")}
                            </p>
                          )}
                        </td>
                        <td className="px-2 py-2.5 text-[10px] text-ink">
                          {formatPrice(book.price)}
                        </td>
                        <td className="px-2 py-2.5 text-[10px] text-ink">{book.stock}</td>
                        <td className="px-2 py-2.5">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setEditing(book)}
                              title="Edit book"
                              className="rounded-[4px] p-1.5 text-muted hover:bg-brand-50 hover:text-brand-700"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromShelf(book)}
                              title="Remove from shelf (book stays in catalogue)"
                              className="rounded-[4px] p-1.5 text-muted hover:bg-brand-50 hover:text-brand-700"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visibleBooks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-2 py-8 text-center text-[11px] text-muted">
                          No books match this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "settings" && (
            <section className="rounded-[10px] border border-line bg-white">
              <div className="border-b border-line px-4 py-3.5 sm:px-5">
                <h2 className="text-[13px] font-semibold text-ink">Section copy</h2>
                <p className="text-[10px] text-muted">
                  Shown above the shelf on the homepage and the shelf page.
                </p>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                <label className="block">
                  <span className={subLabel}>Eyebrow</span>
                  <input
                    value={draftHeading.eyebrow}
                    onChange={(event) => updateHeading("eyebrow", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input
                    value={draftHeading.title}
                    onChange={(event) => updateHeading("title", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={subLabel}>Description</span>
                  <textarea
                    value={draftHeading.description}
                    onChange={(event) => updateHeading("description", event.target.value)}
                    rows={2}
                    className={`${fieldClass} resize-y leading-relaxed`}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={subLabel}>Link label</span>
                  <input
                    value={draftHeading.linkLabel}
                    onChange={(event) => updateHeading("linkLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3.5 sm:px-5">
                <button
                  type="button"
                  onClick={handleSaveHeading}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
                >
                  <Save size={13} /> Save copy
                </button>
                <button
                  type="button"
                  onClick={handleResetHeading}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
                >
                  <RotateCcw size={13} /> Restore default
                </button>
              </div>
            </section>
          )}

          {notice && (
            <div
              className={cn(
                "flex items-start gap-2 rounded-[8px] border px-3 py-2.5",
                notice.error
                  ? "border-gold-300 bg-gold-300/15"
                  : "border-brand-100 bg-brand-50",
              )}
            >
              {notice.error ? (
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" />
              ) : (
                <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />
              )}
              <p
                className={cn(
                  "text-[10px] leading-relaxed",
                  notice.error ? "text-ink" : "text-brand-800",
                )}
              >
                {notice.text}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
                <Eye size={14} className="text-brand-700" />
                <h2 className="text-[13px] font-semibold text-ink">
                  {tab === "settings" ? "Section preview" : "Shelf preview"}
                </h2>
                <span className="ml-auto text-[9px] text-muted">Updates as you type</span>
              </div>
              <div className="brand-wash p-4 sm:p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                  {draftHeading.eyebrow || "Eyebrow"}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">
                  {draftHeading.title || "Section title"}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  {draftHeading.description || "Section description"}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700">
                  {draftHeading.linkLabel || "View all"} →
                </span>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {shelfBooks.slice(0, 6).map((book) => (
                    <div key={book.slug} className="h-20 overflow-hidden rounded-[3px]">
                      <BookCover book={book} size="sm" />
                    </div>
                  ))}
                </div>
            </div>
          </section>
        </div>
      </div>
      )}
    </div>
  );
}
