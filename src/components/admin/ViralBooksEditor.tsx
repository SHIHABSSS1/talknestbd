"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  ImagePlus,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import { BookCover } from "@/components/books/BookCover";
import { BookForm } from "@/components/admin/BookForm";
import {
  resetUpSaleShelfContent,
  resetViralShelfContent,
  saveUpSaleShelfContent,
  saveViralShelfContent,
} from "@/lib/actions/shelves";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import {
  UP_SALE_SHELF_KEY,
  VIRAL_SHELF_KEY,
  cloneUpSaleShelfDefaults,
  cloneViralShelfDefaults,
  type ShelfHeading,
  type ViralShelfContent,
} from "@/lib/shelf-content";
import { formatPrice } from "@/lib/utils";
import type { Book, BookTag } from "@/lib/types";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

type Notice = { text: string; error?: boolean };
type ShelfVariant = "viral" | "up-sale";

const shelfVariants = {
  viral: {
    key: VIRAL_SHELF_KEY,
    tag: "viral" as BookTag,
    href: "/viral-books",
    tagline: "Books tagged for this shelf appear on the homepage rail and at /viral-books.",
    defaults: cloneViralShelfDefaults,
    save: saveViralShelfContent,
    reset: resetViralShelfContent,
  },
  "up-sale": {
    key: UP_SALE_SHELF_KEY,
    tag: "up-sale" as BookTag,
    href: "/up-sales",
    tagline: "Books on this shelf appear in the 50% up-sale rail and pricing page.",
    defaults: cloneUpSaleShelfDefaults,
    save: saveUpSaleShelfContent,
    reset: resetUpSaleShelfContent,
  },
} as const;

async function uploadCover(src: string): Promise<string> {
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

/** Only /media URLs (never base64) reach the content block. */
async function normaliseBooks(books: Book[]): Promise<Book[]> {
  const result: Book[] = [];
  for (const book of books) {
    const imageSrc = book.cover.imageSrc;
    result.push(
      imageSrc?.startsWith("data:")
        ? { ...book, cover: { ...book.cover, imageSrc: await uploadCover(imageSrc) } }
        : book,
    );
  }
  return result;
}

/**
 * Admin editor for the Viral Books shelf.
 *
 * The heading and the shelf's books are one database document
 * (`content_blocks['shelf:viral-books']`), so a save publishes the shelf to
 * every storefront visitor, not just this browser.
 */
export function ViralBooksEditor({
  label,
  initialContent,
  variant = "viral",
}: {
  label: string;
  initialContent: ViralShelfContent;
  variant?: ShelfVariant;
}) {
  const config = shelfVariants[variant];
  const [saved, setSaved] = useState<ViralShelfContent>(initialContent);
  const [draft, setDraft] = useState<ViralShelfContent>(initialContent);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [editing, setEditing] = useState<Book | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setDraft(saved), [saved]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const visibleBooks = draft.books.filter((book) => {
    const term = query.trim().toLowerCase();
    return (
      !term ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  });

  const updateHeading = (key: keyof ShelfHeading, value: string) => {
    setDraft((current) => ({
      ...current,
      heading: { ...current.heading, [key]: value },
    }));
    setNotice(null);
  };

  const handleBookSaved = (book: Book) => {
    setDraft((current) => ({
      ...current,
      books: [
        book,
        ...current.books.filter((item) => item.slug !== book.slug),
      ],
    }));
    setEditing(null);
    setNotice({
      text: `${book.title} added to the shelf draft. Click Save changes to publish it.`,
    });
    return { ok: true, message: `${book.title} added to the shelf draft.` };
  };

  const removeBook = (book: Book) => {
    setDraft((current) => ({
      ...current,
      books: current.books.filter((item) => item.slug !== book.slug),
    }));
    setNotice({
      text: `${book.title} removed from the draft. Save changes to unpublish it.`,
    });
  };

  const handleSave = () => {
    setNotice(null);
    startTransition(async () => {
      try {
        const normalised = {
          heading: draft.heading,
          books: await normaliseBooks(draft.books),
        };
        const result = await config.save(normalised);
        setNotice({ text: result.message, error: !result.ok });
        if (result.ok) {
          setDraft(normalised);
          setSaved(normalised);
        }
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not save the shelf.",
        });
      }
    });
  };

  const handleReset = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await config.reset();
      if (result.ok) {
        const fresh = config.defaults();
        setDraft(fresh);
        setSaved(fresh);
        setEditing(null);
      }
      setNotice({ text: result.message, error: !result.ok });
    });
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
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
            <span className="rounded-full bg-mint/25 px-2.5 py-1 text-[9px] font-semibold text-forest-700">
              Published
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">{config.tagline}</p>
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

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 space-y-4">
          {editing ? (
            <BookForm
              book={editing === "new" ? undefined : editing}
              defaultTags={[config.tag]}
              showPreview={false}
              onCancel={() => setEditing(null)}
              onSave={handleBookSaved}
            />
          ) : (
            <section className="rounded-[10px] border border-line bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
                <div>
                  <h2 className="text-[13px] font-semibold text-ink">Shelf books</h2>
                  <p className="text-[10px] text-muted">
                    {draft.books.length} book{draft.books.length === 1 ? "" : "s"} · published together with the copy
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing("new")}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                  >
                    <Plus size={12} /> Add book
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={pending}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line px-2.5 text-[10px] font-medium text-ink hover:border-brand-300 disabled:opacity-50"
                  >
                    <RotateCcw size={12} /> Restore sample
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search shelf books…"
                  aria-label="Search shelf books"
                  className={fieldClass}
                />

                {visibleBooks.length === 0 && (
                  <p className="rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[11px] text-muted">
                    No books here yet. Add one to publish it on the viral shelves.
                  </p>
                )}

                <ul className="space-y-2">
                  {visibleBooks.map((book) => (
                    <li
                      key={book.slug}
                      className="flex flex-wrap items-center gap-3 rounded-[8px] border border-line bg-white p-3"
                    >
                      <div className="h-14 w-10 shrink-0">
                        <BookCover book={book} size="sm" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/books/${book.slug}`}
                          className="block truncate text-[12px] font-semibold text-ink hover:text-brand-700"
                        >
                          {book.title}
                        </Link>
                        <p className="truncate text-[10px] text-muted">
                          {book.author} · {book.category} · {formatPrice(book.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(book)}
                          aria-label={`Edit ${book.title}`}
                          className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:border-brand-300 hover:text-brand-700"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBook(book)}
                          aria-label={`Remove ${book.title} from shelf`}
                          className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:border-gold-300 hover:text-gold-600"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Section copy</h2>
                <p className="text-[10px] text-muted">Shown above the shelf on both storefront pages.</p>
              </div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              {(Object.keys(draft.heading) as (keyof ShelfHeading)[]).map((key) => (
                <label key={key} className="block">
                  <span className={subLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <input
                    value={draft.heading[key]}
                    onChange={(event) => updateHeading(key, event.target.value)}
                    className={fieldClass}
                  />
                </label>
              ))}
            </div>
          </section>

          {notice && (
            <div
              role="status"
              className={`flex items-start gap-2 rounded-[8px] border px-3 py-2.5 ${
                notice.error
                  ? "border-gold-300 bg-gold-300/15"
                  : "border-brand-100 bg-brand-50"
              }`}
            >
              {notice.error ? (
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" />
              ) : (
                <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />
              )}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <Save size={13} /> {pending ? "Saving…" : "Save changes"}
            </button>
            {dirty && (
              <span className="text-[10px] font-semibold text-gold-600">
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Homepage rail</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                {draft.heading.eyebrow}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">
                {draft.heading.title}
              </h3>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">
                {draft.heading.description}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {draft.books.slice(0, 6).map((book) => (
                  <div key={book.slug} className="h-20">
                    <BookCover book={book} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Storage note:</span> the shelf lives in
              the Neon database (content_blocks, key <code>{config.key}</code>) and cover
              images are written to local disk under <code>uploads/books</code>, served at{" "}
              <code>/media</code>. Saved changes appear for every visitor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
