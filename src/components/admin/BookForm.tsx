"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, ImagePlus, Plus, Save, UploadCloud, X } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { PersonPickerDialog } from "@/components/admin/PersonPickerDialog";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useAuthorContent } from "@/components/providers/AuthorContentProvider";
import { usePublisherContent } from "@/components/providers/PublisherContentProvider";
import { fileToDataUrl, dataUrlSizeLabel } from "@/lib/image";
import { slugify, uniqueSlug } from "@/lib/slug";
import type {
  Author,
  Book,
  BookTag,
  CoverMotif,
  Publisher,
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
  isbn: string;
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

/** Stores a compressed cover on disk so only a /media URL reaches the DB. */
async function postCoverDataUrl(src: string): Promise<string> {
  const response = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ src, folder: "books" }),
  });
  const result = (await response.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;
  if (!response.ok || !result?.url) {
    throw new Error(result?.error ?? "The cover could not be uploaded.");
  }
  return result.url;
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
    isbn: book?.isbn ?? "",
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
  defaultCategory,
  defaultSubcategory,
}: {
  book?: Book;
  onCancel: () => void;
  onSave: (book: Book) => SaveResult | Promise<SaveResult>;
  defaultTags?: BookTag[];
  showPreview?: boolean;
  defaultCategory?: string;
  defaultSubcategory?: string;
}) {
  const { content: categoryContent } = useCategoryContent();
  const { saveBook } = useBookContent();
  const { content: authorContent, save: saveAuthorContent } = useAuthorContent();
  const { content: publisherContent, save: savePublisherContent } = usePublisherContent();
  const categoryOptions = categoryContent.tiles.filter((tile) => !tile.audio);
  const [form, setForm] = useState<FormState>(() =>
    initialState(
      defaultCategory ?? categoryOptions[0]?.slug ?? "uponnash",
      defaultTags,
      book,
    ),
  );
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState<"author" | "publisher" | null>(null);
  const [pending, startTransition] = useTransition();

  // A category "Add book" action preselects the shelf and its subcategory.
  useEffect(() => {
    if (defaultSubcategory) {
      setForm((current) => ({ ...current, category: defaultCategory ?? current.category, subcategory: defaultSubcategory }));
    }
  }, [defaultCategory, defaultSubcategory]);

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
      const dataUrl = await fileToDataUrl(file);
      const size = dataUrlSizeLabel(dataUrl);
      const url = await postCoverDataUrl(dataUrl);
      set("imageSrc", url);
      setNotice({
        text: `Cover stored on the server (${size}). Save the book to publish it.`,
      });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not store that cover.",
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
    setNotice(null);
    startTransition(async () => {
      try {
        const coverSrc = form.imageSrc?.startsWith("data:")
          ? await postCoverDataUrl(form.imageSrc)
          : form.imageSrc;
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
          isbn: form.isbn.trim() || undefined,
          description: form.description.trim(),
          longDescription: lines(form.longDescription),
          highlights: lines(form.highlights),
          cover: {
            from: form.from,
            to: form.to,
            accent: form.accent,
            motif: form.motif,
            ...(coverSrc ? { imageSrc: coverSrc } : {}),
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
        const result = (await onSave(nextBook)) ?? saveBook(nextBook);
        setNotice({ text: result.message, error: !result.ok });
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not save this book.",
        });
      }
    });
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
    <>
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
            <div className="block">
              <span className={labelClass}>Author</span>
              <div className="flex gap-2">
                <select
                  value={form.authorSlug || "__custom"}
                  onChange={(event) => {
                    const selected = authorContent.authors.find(
                      (item) => item.slug === event.target.value,
                    );
                    setForm((current) => ({
                      ...current,
                      author: selected?.name ?? current.author,
                      authorSlug: selected?.slug ?? "",
                    }));
                  }}
                  className={inputClass}
                  aria-label="Choose an author"
                >
                  <option value="__custom">Custom author…</option>
                  {authorContent.authors.map((author) => (
                    <option key={author.slug} value={author.slug}>
                      {author.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setPicker("author")}
                  title="Add a new author"
                  aria-label="Add a new author"
                  className="grid h-[42px] w-10 shrink-0 place-items-center rounded-[4px] border border-brand-200 bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <label className="block">
              <span className={labelClass}>Author name / slug (auto)</span>
              <input
                value={form.author}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    author: event.target.value,
                    authorSlug: slugify(event.target.value),
                  }))
                }
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="block">
              <span className={labelClass}>Publisher</span>
              <div className="flex gap-2">
                <select
                  value={form.publisherSlug || "__custom"}
                  onChange={(event) => {
                    const selected = publisherContent.publishers.find(
                      (item) => item.slug === event.target.value,
                    );
                    setForm((current) => ({
                      ...current,
                      publisher: selected?.name ?? current.publisher,
                      publisherSlug: selected?.slug ?? "",
                    }));
                  }}
                  className={inputClass}
                  aria-label="Choose a publisher"
                >
                  <option value="__custom">Custom publisher…</option>
                  {publisherContent.publishers.map((publisher) => (
                    <option key={publisher.slug} value={publisher.slug}>
                      {publisher.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setPicker("publisher")}
                  title="Add a new publisher"
                  aria-label="Add a new publisher"
                  className="grid h-[42px] w-10 shrink-0 place-items-center rounded-[4px] border border-brand-200 bg-brand-50 text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <label className="block">
              <span className={labelClass}>Publisher name / slug (auto)</span>
              <input
                value={form.publisher}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    publisher: event.target.value,
                    publisherSlug: slugify(event.target.value),
                  }))
                }
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <span className={labelClass}>ISBN (optional)</span>
              <input
                value={form.isbn}
                onChange={(event) => set("isbn", event.target.value)}
                placeholder="978-984-0000-00-0"
                maxLength={40}
                className={inputClass}
              />
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
              Covers are compressed in the browser and stored on the server when you save.
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
              Storage note: books saved from a database-backed shelf or category are published for everyone; other uploads stay in this browser.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3.5 sm:px-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          <Save size={13} /> {pending ? "Saving…" : book ? "Save book" : "Upload book"}
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

    {picker && (
      <PersonPickerDialog
        kind={picker}
        slugs={
          picker === "author"
            ? authorContent.authors.map((item) => item.slug)
            : publisherContent.publishers.map((item) => item.slug)
        }
        onSave={async (entry) =>
          picker === "author"
            ? saveAuthorContent({
                ...authorContent,
                authors: [...authorContent.authors, entry as Author],
              })
            : savePublisherContent({
                ...publisherContent,
                publishers: [...publisherContent.publishers, entry as Publisher],
              })
        }
        onCreated={(entry) => {
          setForm((current) =>
            picker === "author"
              ? { ...current, author: entry.name, authorSlug: entry.slug }
              : { ...current, publisher: entry.name, publisherSlug: entry.slug },
          );
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
    )}
    </>
  );
}
