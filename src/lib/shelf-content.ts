/**
 * Section copy for the tag-based shelves (currently Viral Books).
 * The books themselves live in the unified catalogue (book-content.ts) and are
 * selected by their collection tag — there is no separate shelf book store.
 */

import { getBooksByCollection } from "@/data/books";
import { allBooks } from "@/lib/book-content";
import { sectionDefaults } from "@/lib/section-content";
import type { Book } from "@/lib/types";

export interface ShelfHeading {
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const SHELF_SLUGS = {
  viral: "viral-books",
  upSale: "up-sale",
  newArrivals: "new-arrivals",
  trending: "trending",
  sunnah: "sunnah",
  international: "international",
  studentBooks: "student-books",
} as const;

const STORAGE_PREFIX = "talknestbd-shelf-";

export function shelfStorageKey(slug: string): string {
  return `${STORAGE_PREFIX}${slug}-v1`;
}

export function shelfDefaults(slug: string): ShelfHeading {
  const defaults = sectionDefaults[slug];
  if (defaults) {
    return {
      eyebrow: defaults.eyebrow,
      title: defaults.title,
      description: defaults.description,
      linkLabel: defaults.linkLabel,
    };
  }
  return {
    eyebrow: "Featured",
    title: "Featured books",
    description: "A hand-picked shelf for our readers.",
    linkLabel: "View all",
  };
}

function isHeading(value: unknown): value is ShelfHeading {
  if (!value || typeof value !== "object") return false;
  const heading = value as Record<string, unknown>;
  return (
    typeof heading.eyebrow === "string" &&
    typeof heading.title === "string" &&
    typeof heading.description === "string" &&
    typeof heading.linkLabel === "string"
  );
}

export function readShelfHeading(slug: string): ShelfHeading {
  const defaults = shelfDefaults(slug);
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(shelfStorageKey(slug));
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as unknown;
    return isHeading(parsed) ? parsed : defaults;
  } catch {
    return defaults;
  }
}

export function writeShelfHeading(slug: string, heading: ShelfHeading): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(shelfStorageKey(slug), JSON.stringify(heading));
    return {
      ok: true,
      message: "Section copy saved to this browser — the shelf updated everywhere.",
    };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

/** Live content_blocks key for the Viral Books shelf (heading + books). */
export const VIRAL_SHELF_KEY = "shelf:viral-books";

export interface ViralShelfContent {
  heading: ShelfHeading;
  books: Book[];
}

/**
 * The shipped viral shelf: its original copy plus the demo books that carried
 * the `viral` tag. Used as the seed document and as the fallback when the DB
 * row is missing or invalid.
 */
export function cloneViralShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults(SHELF_SLUGS.viral),
      books: getBooksByCollection("viral"),
    }),
  ) as ViralShelfContent;
}

/** Live content_blocks key for the 50% Up Sale shelf (heading + books). */
export const UP_SALE_SHELF_KEY = "shelf:up-sale";

/** Live content_blocks key for the Student Books shelf (heading + books). */
export const STUDENT_SHELF_KEY = "shelf:student-books";

/** The shipped student shelf: original copy plus the demo student books. */
export function cloneStudentShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults(SHELF_SLUGS.studentBooks),
      books: allBooks().filter((book) => book.tags.includes("student")),
    }),
  ) as ViralShelfContent;
}

/** Live content_blocks key for the International Books shelf (heading + books). */
export const INTERNATIONAL_SHELF_KEY = "shelf:international";

/** The shipped international shelf: original copy plus the demo books. */
export function cloneInternationalShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults(SHELF_SLUGS.international),
      books: allBooks().filter((book) => book.tags.includes("international")),
    }),
  ) as ViralShelfContent;
}

/** Live content_blocks key for the Sunnah Essentials shelf (heading + books). */
export const SUNNAH_SHELF_KEY = "shelf:sunnah";

/** The shipped Sunnah shelf: original copy plus the demo sunnah books. */
export function cloneSunnahShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults("sunnah"),
      books: allBooks().filter((book) => book.tags.includes("sunnah")),
    }),
  ) as ViralShelfContent;
}

/** Live content_blocks key for the Trending Now shelf (heading + books). */
export const TRENDING_SHELF_KEY = "shelf:trending";

/** The shipped trending shelf: original copy plus the demo trending books. */
export function cloneTrendingShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults("trending"),
      books: allBooks().filter((book) => book.tags.includes("trending")),
    }),
  ) as ViralShelfContent;
}

/** Live content_blocks key for the New Arrivals shelf (heading + books). */
export const NEW_ARRIVALS_SHELF_KEY = "shelf:new-arrivals";

/** The shipped new-arrivals shelf: original copy plus the demo new books. */
export function cloneNewArrivalsShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults(SHELF_SLUGS.newArrivals),
      books: allBooks().filter((book) => book.tags.includes("new")),
    }),
  ) as ViralShelfContent;
}

/** The shipped up-sale shelf: original copy plus the demo +50% listings. */
export function cloneUpSaleShelfDefaults(): ViralShelfContent {
  return JSON.parse(
    JSON.stringify({
      heading: shelfDefaults(SHELF_SLUGS.upSale),
      books: allBooks().filter((book) => book.tags.includes("up-sale")),
    }),
  ) as ViralShelfContent;
}

export function clearShelfHeading(slug: string): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(shelfStorageKey(slug));
    return { ok: true, message: "Restored the original section copy." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
