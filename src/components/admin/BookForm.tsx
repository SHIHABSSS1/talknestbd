"use client";

import { useState } from "react";
import { Check, ImagePlus, Save, UploadCloud, X } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { fileToDataUrl, dataUrlSizeLabel } from "@/lib/image";
import { slugify } from "@/lib/slug";
import type {
  Book,
  BookTag,
  CoverMotif,
} from "@/lib/types";
import type { SaveResult } from "@/lib/book-content";

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

const motifs: CoverMotif[] = ["arch", "circle", "lines", "star", "wave", "grid"];
const tagOptions: { value: BookTag; label: string }[] = [
  { value: "bestseller", label: "Bestseller" },
  { value: "new", label: "New arrival" },
  { value: "viral", label: "Viral" },
  { value: "free-delivery", label: "Free delivery" },
  { value: "up-sale", label: "50% up sale" },
  { value: "trending", label: "Trending now" },
  { value: "sunnah", label: "Sunnah essentials" },
  { value: "international", label: "International" },
  { value: "student", label: "Student books" },
  { value: "audio", label: "Audiobook" },
];

interface FormState {
  title: string;
  subtitle: string;
  author: string;
  authorSlug: string;
  publisher: string;
  publisherSlug: string;
  category: string;
  subcategory: string;
  price: string;
  oldPrice: string;
  rating: string;
  reviewCount: string;
  stock: string;
  pages: string;
  language: string;
  binding: string;
  publishedYear: string;
  description: string;
  longDescription: string;
  highlights: string;
  audioEnabled: boolean;
  audioDuration: string;
  audioNarrator: string;
  motif: CoverMotif;
  from: string;
  to: string;
  accent: string;
  imageSrc?: string;
  tags: BookTag[];
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function initialState(
  defaultCategory: string,
  defaultTags: BookTag[],
  book?: Book,
): FormState {
  return {
    title: book?.title ?? "",
    subtitle: book?.subtitle ?? "",
    author: book?.author ?? "",
    authorSlug: book?.authorSlug ?? "",
    publisher: book?.publisher ?? "TalkNest BD",
    publisherSlug: book?.publisherSlug ?? "talknestbd",
    category: book?.category ?? defaultCategory,
    subcategory: book?.subcategory ?? "",
    price: book ? String(book.price) : "",
    oldPrice: book?.oldPrice ? String(book.oldPrice) : "",
    rating: book ? String(book.rating) : "4.5",
    reviewCount: book ? String(book.reviewCount) : "0",
    stock: book ? String(book.stock) : "10",
    pages: book ? String(book.pages) : "200",
    language: book?.language ?? "Bangla",
    binding: book?.binding ?? "Paperback",
    publishedYear: book ? String(book.publishedYear) : "2026",
    description: book?.description ?? "",
    longDescription: book?.longDescription.join("\n") ?? "",
    highlights: book?.highlights.join("\n") ?? "",
    audioEnabled: Boolean(book?.audio),
    audioDuration: book?.audio?.duration ?? "",
    audioNarrator: book?.audio?.narrator ?? "",
    motif: book?.cover.motif ?? "arch",
    from: book?.cover.from ?? "#0e3b3f",
    to: book?.cover.to ?? "#1d6b62",
    accent: book?.cover.accent ?? "#e6c87c",
    imageSrc: book?.cover.imageSrc,
    tags: Array.from(new Set([...(book?.tags ?? []), ...defaultTags])),
  };
}

export function BookForm({
  book,
  onCancel,
  onSave,
  defaultTags = [],
  showPreview = true,
}: {
  book?: Book;
  onCancel: () => void;
  onSave: (book: Book) => SaveResult;
  defaultTags?: BookTag[];
  showPreview?: boolean;
}) {
  const { content: categoryContent } = useCategoryContent();
  const { saveBook } = useBookContent();
  const categoryOptions = categoryContent.tiles.filter((tile) => !tile.audio);
  const [form, setForm] = useState<FormState>(() =>
    initialState(categoryOptions[0]?.slug ?? "uponnash", defaultTags, book),
  );
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [uploading, setUploading] = useState(false);

  const subcategoryOptions =
    categoryOptions.find((tile) => tile.slug === form.category)?.subcategories ?? [];

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const toggleTag = (tag: BookTag) => {
    if (defaultTags.includes(tag)) return; // shelf tag is required, cannot be removed here
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((item) => item !== tag)
        : [...current.tags, tag],
    }));
    setNotice(null);
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setNotice(null);
    try {
      const imageSrc = await fileToDataUrl(file);
      set("imageSrc", imageSrc);
      setNotice({
        text: `Cover compressed (${dataUrlSizeLabel(imageSrc)}). Save the book to publish it.`,
      });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not read that image.",
      });
    } finally {
      setUploading(false);
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setNotice({ error: true, text: "Title and author are required." });
      return;
    }
    const nextBook: Book = {
      slug: book?.slug ?? slugify(form.title),
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      author: form.author.trim(),
      authorSlug: slugify(form.authorSlug || form.author),
      publisher: form.publisher.trim() || "TalkNest BD",
      publisherSlug: slugify(form.publisherSlug || form.publisher),
      category: form.category,
      subcategory: form.subcategory || undefined,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      rating: Number(form.rating) || 4.5,
      reviewCount: Number(form.reviewCount) || 0,
      stock: Number(form.stock) || 0,
      pages: Number(form.pages) || 200,
      language: form.language.trim() || "Bangla",
      binding: form.binding,
      publishedYear: Number(form.publishedYear) || 2026,
      description: form.description.trim(),
      longDescription: lines(form.longDescription),
      highlights: lines(form.highlights),
      cover: {
        from: form.from,
        to: form.to,
        accent: form.accent,
        motif: form.motif,
        ...(form.imageSrc ? { imageSrc: form.imageSrc } : {}),
      },
      tags: form.tags,
      ...(form.audioEnabled && (form.audioDuration || form.audioNarrator)
        ? {
            audio: {
              duration: form.audioDuration.trim() || "—",
              narrator: form.audioNarrator.trim() || "TalkNest Audio",
            },
          }
        : {}),
    };
    const result = onSave(nextBook) ?? saveBook(nextBook);
    setNotice({ text: result.message, error: !result.ok });
  };

  const previewBook: Book = {
    ...(book ?? ({} as Book)),
    slug: book?.slug ?? slugify(form.title || "book"),
    title: form.title || "Book title",
    subtitle: form.subtitle,
    author: form.author || "Author",
    publisher: form.publisher || "TalkNest BD",
    category: form.category,
    price: Number(form.price) || 0,
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    rating: Number(form.rating) || 4.5,
    reviewCount: Number(form.reviewCount) || 0,
    pages: Number(form.pages) || 200,
    language: form.language || "Bangla",
    binding: form.binding,
    publishedYear: Number(form.publishedYear) || 2026,
    stock: Number(form.stock) || 0,
    description: form.description,
    longDescription: lines(form.longDescription),
    highlights: lines(form.highlights),
    tags: form.tags,
    cover: {
      from: form.from,
      to: form.to,
      accent: form.accent,
      motif: form.motif,
      ...(form.imageSrc ? { imageSrc: form.imageSrc } : {}),
    },
  };

  return (
    <form onSubmit={submit} className="rounded-[10px] border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">
            {book ? `Edit book — ${book.title}` : "Upload new book"}
          </h2>
          <p className="text-[10px] text-muted">
            All fields below appear on the single book detail page used across the site.
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
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Author slug (auto)</span>
              <input
                value={form.authorSlug}
                onChange={(event) => set("authorSlug", event.target.value)}
                placeholder={slugify(form.author || "author")}
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Publisher</span>
              <input
                value={form.publisher}
                onChange={(event) => set("publisher", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Publisher slug</span>
              <input
                value={form.publisherSlug}
                onChange={(event) => set("publisherSlug", event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Stock</span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => set("stock", event.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block">
              <span className={labelClass}>Rating</span>
              <input
                type="number"
                step="0.1"
                min={0}
                max={5}
                value={form.rating}
                onChange={(event) => set("rating", event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Reviews</span>
              <input
                type="number"
                min={0}
                value={form.reviewCount}
                onChange={(event) => set("reviewCount", event.target.value)}
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

          <div className="grid gap-4 sm:grid-cols-3">
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
            <label className="block">
              <span className={labelClass}>Slug (auto from title)</span>
              <input
                value={book?.slug ?? slugify(form.title || "book")}
                readOnly
                className={`${inputClass} bg-canvas text-muted`}
              />
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Short description</span>
            <textarea
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              rows={2}
              placeholder="Shown in the Overview section"
              className={`${inputClass} resize-y`}
            />
          </label>

          <label className="block">
            <span className={labelClass}>
              Long description <span className="font-normal text-muted">(one paragraph per line)</span>
            </span>
            <textarea
              value={form.longDescription}
              onChange={(event) => set("longDescription", event.target.value)}
              rows={3}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </label>

          <label className="block">
            <span className={labelClass}>
              Highlights <span className="font-normal text-muted">(one per line)</span>
            </span>
            <textarea
              value={form.highlights}
              onChange={(event) => set("highlights", event.target.value)}
              rows={3}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </label>

          <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
            <label className="flex items-center gap-2 text-[11px] font-semibold text-ink">
              <input
                type="checkbox"
                checked={form.audioEnabled}
                onChange={(event) => set("audioEnabled", event.target.checked)}
                className="h-3.5 w-3.5 accent-brand-600"
              />
              Audiobook available
            </label>
            {form.audioEnabled && (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  value={form.audioDuration}
                  onChange={(event) => set("audioDuration", event.target.value)}
                  placeholder="Duration (e.g. 7h 12m)"
                  className={inputClass}
                />
                <input
                  value={form.audioNarrator}
                  onChange={(event) => set("audioNarrator", event.target.value)}
                  placeholder="Narrator"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <div>
            <span className={labelClass}>Collections</span>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const active = form.tags.includes(tag.value);
                const locked = defaultTags.includes(tag.value);
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => toggleTag(tag.value)}
                    disabled={locked}
                    title={locked ? "Required for this shelf — cannot be changed here" : undefined}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                      locked
                        ? "cursor-not-allowed border-brand-400 bg-brand-100 text-brand-800"
                        : active
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
              {(
                [
                  ["from", form.from],
                  ["to", form.to],
                  ["accent", form.accent],
                ] as const
              ).map(([key, value]) => (
                <label className="block" key={key}>
                  <span className="mb-1 block text-[9px] text-muted capitalize">{key}</span>
                  <input
                    type="color"
                    value={value}
                    onChange={(event) => set(key, event.target.value)}
                    className="h-[42px] w-full cursor-pointer rounded-[4px] border border-line bg-white p-1"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
            <span className={labelClass}>
              <span className="inline-flex items-center gap-1">
                <UploadCloud size={11} /> Cover image (optional)
              </span>
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
                <ImagePlus size={12} />
                {uploading ? "Compressing…" : "Choose image"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(event) => uploadCover(event.target.files?.[0])}
                />
              </label>
              {form.imageSrc && (
                <button
                  type="button"
                  onClick={() => set("imageSrc", undefined)}
                  className="text-[10px] font-medium text-brand-700 underline"
                >
                  Remove image ({dataUrlSizeLabel(form.imageSrc)})
                </button>
              )}
            </div>
            <span className={hint}>
              Uploaded images are compressed in the browser and saved to this browser only.
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {showPreview && (
            <div className="rounded-[8px] border border-line bg-canvas p-4">
              <p className="mb-3 text-[10px] font-semibold text-ink">Detail page preview</p>
              <div className="mx-auto h-48 w-32">
                <BookCover book={previewBook} size="sm" />
              </div>
            </div>
          )}
          {showPreview && (
            <p className="text-[9px] leading-relaxed text-muted">
              Saving adds this book to the shared catalogue. It appears on the book detail
              page, in its category and (if tagged) a shelf such as Viral Books or 50% Up Sale.
            </p>
          )}
          {notice && (
            <div
              className={`rounded-[8px] border px-3 py-2.5 text-[10px] leading-relaxed ${
                notice.error
                  ? "border-gold-300 bg-gold-300/15 text-ink"
                  : "border-brand-100 bg-brand-50 text-brand-800"
              }`}
            >
              {notice.text}
            </div>
          )}
          {showPreview && (
            <p className="text-[9px] text-muted">
              Demo note: uploads live in this browser only — nothing is sent to a server.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3.5 sm:px-5">
        <button
          type="submit"
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Save size={13} /> {book ? "Save book" : "Upload book"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
