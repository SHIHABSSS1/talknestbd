/**
 * Unified book catalogue.
 *
 * Static demo books (src/data/books.ts), books managed in the best-seller
 * shelf, and books uploaded in the admin editor are merged into ONE lookup so
 * every book resolves at the same /books/[slug] detail page.
 *
 * Uploaded/edited books are persisted in localStorage (demo only).
 */

import { books as staticBooks } from "@/data/books";
import { upSaleBooks } from "@/data/community";
import type { Book, BookCoverTheme, BookTag, UpSaleBook } from "@/lib/types";

export const BOOK_STORAGE_KEY = "talknestbd-books-v1";

export interface SaveResult {
  ok: boolean;
  message: string;
}

function isCoverTheme(value: unknown): value is BookCoverTheme {
  if (!value || typeof value !== "object") return false;
  const cover = value as Record<string, unknown>;
  return (
    typeof cover.from === "string" &&
    typeof cover.to === "string" &&
    typeof cover.accent === "string" &&
    typeof cover.motif === "string" &&
    (cover.imageSrc === undefined || typeof cover.imageSrc === "string")
  );
}

function isBook(value: unknown): value is Book {
  if (!value || typeof value !== "object") return false;
  const book = value as Record<string, unknown>;
  return (
    typeof book.slug === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.category === "string" &&
    typeof book.price === "number" &&
    typeof book.rating === "number" &&
    typeof book.reviewCount === "number" &&
    typeof book.pages === "number" &&
    typeof book.language === "string" &&
    typeof book.binding === "string" &&
    typeof book.publishedYear === "number" &&
    typeof book.stock === "number" &&
    typeof book.description === "string" &&
    Array.isArray(book.longDescription) &&
    Array.isArray(book.highlights) &&
    Array.isArray(book.tags) &&
    isCoverTheme(book.cover)
  );
}

export function readUploadedBooks(): Book[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.every(isBook)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function writeUploadedBooks(books: Book[]): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
    return {
      ok: true,
      message: "Saved to this browser — the book now appears across the storefront.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not save: browser storage may be full. Try a smaller cover image.",
    };
  }
}

export function clearUploadedBooks(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(BOOK_STORAGE_KEY);
    return { ok: true, message: "Removed locally uploaded books." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}

/**
 * Merges book lists by slug. Later lists win, so admin uploads override static
 * demo books and best-seller edits override older copies.
 */
export function mergeBooks(...lists: Book[][]): Book[] {
  const bySlug = new Map<string, Book>();
  for (const list of lists) {
    for (const book of list) {
      if (book.slug) bySlug.set(book.slug, book);
    }
  }
  return Array.from(bySlug.values());
}

/** Existing 50% up-sale copies represented as catalogue books. */
function upSaleToBook(item: UpSaleBook): Book {
  return {
    slug: item.cartSlug,
    title: item.title,
    author: item.author,
    authorSlug: item.author.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    publisher: "TalkNest Used Books",
    publisherSlug: "talknestbd",
    category: "used",
    price: item.price,
    oldPrice: item.originalPrice,
    rating: 4.5,
    reviewCount: 0,
    stock: item.stock,
    pages: 200,
    language: "Bangla",
    binding: "Paperback",
    publishedYear: 2026,
    description: `Checked used copy — ${item.condition}. Sold to us by ${item.returnedBy} in ${item.location}.`,
    longDescription: [],
    highlights: [],
    cover: item.cover,
    tags: ["up-sale"],
  };
}

/**
 * Seed shelf tags on the demo catalogue so the Trending, Sunnah and
 * International shelves have content before anything is uploaded.
 */
function seedShelfTags(book: Book): Book {
  const extra: BookTag[] = [];
  if (book.tags.includes("viral")) extra.push("trending");
  if (book.category === "islamic-itihas") extra.push("sunnah");
  if (book.category === "international") extra.push("international");
  if (book.category === "student") extra.push("student");
  if (extra.length === 0) return book;
  return { ...book, tags: Array.from(new Set([...book.tags, ...extra])) };
}

/** Single source of truth: static catalogue + up-sale copies + admin uploads. */
export function allBooks(uploads: Book[] = []): Book[] {
  return mergeBooks(
    staticBooks.map(seedShelfTags),
    upSaleBooks.map(upSaleToBook),
    uploads,
  );
}

export function findBook(slug: string, source: Book[]): Book | undefined {
  return source.find((book) => book.slug === slug);
}

/** Related books from the unified catalogue (same category first). */
export function relatedFromAll(book: Book, source: Book[], count = 6): Book[] {
  const others = source.filter((item) => item.slug !== book.slug);
  const sameCategory = others.filter((item) => item.category === book.category);
  const rest = others.filter((item) => item.category !== book.category);
  return [...sameCategory, ...rest].slice(0, count);
}
