"use client";

import { useState } from "react";
import { Check, Save, UploadCloud, X } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { categories } from "@/data/categories";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import type { Book, BookTag, CoverMotif } from "@/lib/types";

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";

const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";

const motifs: CoverMotif[] = ["arch", "circle", "lines", "star", "wave", "grid"];
const tagOptions: { value: BookTag; label: string }[] = [
  { value: "bestseller", label: "Bestseller" },
  { value: "new", label: "New arrival" },
  { value: "viral", label: "Trending" },
  { value: "free-delivery", label: "Free delivery" },
];

interface FormState {
  title: string;
  subtitle: string;
  author: string;
  publisher: string;
  category: string;
  subcategory: string;
  price: string;
  oldPrice: string;
  stock: string;
  pages: string;
  language: string;
  binding: string;
  publishedYear: string;
  description: string;
  motif: CoverMotif;
  from: string;
  to: string;
  accent: string;
  tags: BookTag[];
}

function initialState(book?: Book): FormState {
  return {
    title: book?.title ?? "",
    subtitle: book?.subtitle ?? "",
    author: book?.author ?? "",
    publisher: book?.publisher ?? "",
    category: book?.category ?? categories[0].slug,
    subcategory: book?.subcategory ?? "",
    price: book ? String(book.price) : "",
    oldPrice: book?.oldPrice ? String(book.oldPrice) : "",
    stock: book ? String(book.stock) : "",
    pages: book ? String(book.pages) : "",
    language: book?.language ?? "Bangla",
    binding: book?.binding ?? "Paperback",
    publishedYear: book ? String(book.publishedYear) : "2026",
    description: book?.description ?? "",
    motif: book?.cover.motif ?? "arch",
    from: book?.cover.from ?? "#0e3b3f",
    to: book?.cover.to ?? "#1d6b62",
    accent: book?.cover.accent ?? "#e6c87c",
    tags: book?.tags ?? [],
  };
}

export function BookForm({ book, onCancel }: { book?: Book; onCancel: () => void }) {
  const [form, setForm] = useState<FormState>(() => initialState(book));
  const [notice, setNotice] = useState("");
  const { content } = useCategoryContent();
  const categoryOptions = content.tiles.filter((tile) => !tile.audio);
  const subcategoryOptions =
    categoryOptions.find((tile) => tile.slug === form.category)?.subcategories ?? [];

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const toggleTag = (tag: BookTag) => {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
    setNotice("");
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(
      "Design preview only — this form is not connected to a database yet.",
    );
  };

  return (
    <form onSubmit={submit} className="rounded-[10px] border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">
            {book ? `Edit book — ${book.title}` : "Upload new book"}
          </h2>
          <p className="text-[10px] text-muted">
            {book
              ? "Update the details below (design preview)"
              : "Fill in the details to add a book to the catalog"}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted transition-colors hover:text-ink"
          aria-label="Close form"
        >
          <X size={15} />
        </button>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Fields */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Title</span>
              <input
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
                placeholder="Book title"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Subtitle</span>
              <input
                value={form.subtitle}
                onChange={(event) => set("subtitle", event.target.value)}
                placeholder="Optional tagline"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Author</span>
              <input
                value={form.author}
                onChange={(event) => set("author", event.target.value)}
                placeholder="Author name"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Publisher</span>
              <input
                value={form.publisher}
                onChange={(event) => set("publisher", event.target.value)}
                placeholder="Publisher name"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block">
              <span className={labelClass}>Category</span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                    subcategory: "",
                  }))
                }
                className={inputClass}
              >
                {categoryOptions.map((tile) => (
                  <option key={tile.id} value={tile.slug}>
                    {tile.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Subcategory</span>
              <select
                value={form.subcategory}
                onChange={(event) => set("subcategory", event.target.value)}
                className={inputClass}
              >
                <option value="">— None —</option>
                {subcategoryOptions.map((sub) => (
                  <option key={sub.id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Price (BDT)</span>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                placeholder="380"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Old price</span>
              <input
                type="number"
                min={0}
                value={form.oldPrice}
                onChange={(event) => set("oldPrice", event.target.value)}
                placeholder="Optional"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={labelClass}>Stock</span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => set("stock", event.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Pages</span>
              <input
                type="number"
                min={0}
                value={form.pages}
                onChange={(event) => set("pages", event.target.value)}
                placeholder="240"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Published year</span>
              <input
                type="number"
                value={form.publishedYear}
                onChange={(event) => set("publishedYear", event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Language</span>
              <input
                value={form.language}
                onChange={(event) => set("language", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Binding</span>
              <select
                value={form.binding}
                onChange={(event) => set("binding", event.target.value)}
                className={inputClass}
              >
                <option>Paperback</option>
                <option>Hardcover</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Short description</span>
            <textarea
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              rows={3}
              placeholder="A sentence or two for the catalog"
              className={`${inputClass} resize-y`}
            />
          </label>

          <div>
            <span className={labelClass}>Collections</span>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const active = form.tags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                      active
                        ? "border-brand-300 bg-brand-50 text-brand-700"
                        : "border-line bg-white text-muted hover:border-brand-200"
                    }`}
                  >
                    {active && <Check size={11} />} {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className={labelClass}>Cover theme</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className="block">
                <span className="mb-1 block text-[9px] text-muted">Motif</span>
                <select
                  value={form.motif}
                  onChange={(event) => set("motif", event.target.value as CoverMotif)}
                  className={inputClass}
                >
                  {motifs.map((motif) => (
                    <option key={motif} value={motif}>
                      {motif}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-[9px] text-muted">From</span>
                <input
                  type="color"
                  value={form.from}
                  onChange={(event) => set("from", event.target.value)}
                  className="h-[42px] w-full cursor-pointer rounded-[4px] border border-line bg-white p-1"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[9px] text-muted">To</span>
                <input
                  type="color"
                  value={form.to}
                  onChange={(event) => set("to", event.target.value)}
                  className="h-[42px] w-full cursor-pointer rounded-[4px] border border-line bg-white p-1"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[9px] text-muted">Accent</span>
                <input
                  type="color"
                  value={form.accent}
                  onChange={(event) => set("accent", event.target.value)}
                  className="h-[42px] w-full cursor-pointer rounded-[4px] border border-line bg-white p-1"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Cover preview */}
        <div className="space-y-3">
          <div className="rounded-[8px] border border-line bg-canvas p-4">
            <p className="mb-3 text-[10px] font-semibold text-ink">Cover preview</p>
            <div className="mx-auto h-48 w-32">
              <BookCover
                size="sm"
                book={{
                  title: form.title || "Book title",
                  subtitle: form.subtitle || undefined,
                  author: form.author || "Author name",
                  publisher: form.publisher || "Publisher",
                  cover: {
                    from: form.from,
                    to: form.to,
                    accent: form.accent,
                    motif: form.motif,
                  },
                }}
              />
            </div>
            <p className="mt-3 text-center text-[9px] text-muted">
              Covers are generated from the theme — no image upload needed.
            </p>
          </div>

          <div className="rounded-[8px] border border-dashed border-line bg-white/60 p-3">
            <p className="text-[10px] leading-relaxed text-muted">
              Design preview only. Upload and save will be connected to your
              database later.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 sm:px-5">
        {notice ? (
          <p className="flex items-center gap-1.5 text-[10px] text-brand-700">
            <Check size={12} /> {notice}
          </p>
        ) : (
          <span className="text-[10px] text-muted">No changes saved</span>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {book ? <Save size={13} /> : <UploadCloud size={13} />}
            {book ? "Save changes" : "Upload book"}
          </button>
        </div>
      </div>
    </form>
  );
}
