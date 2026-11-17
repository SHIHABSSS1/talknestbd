import { books as staticBooks, getBooksByCollection, getBooksByCategory } from "@/data/books";
import type { Book } from "@/lib/types";
import type { CategorySubcategory, CategoryTile } from "@/lib/category-content";

/** Deduplicates a list of books by slug (first entry wins). */
function dedupe(books: Book[]): Book[] {
  const seen = new Set<string>();
  return books.filter((book) => {
    if (seen.has(book.slug)) return false;
    seen.add(book.slug);
    return true;
  });
}

/**
 * Books belonging to a tile, optionally narrowed to one of its sub-shelves.
 * Extra books (e.g. admin-uploaded catalogue books) are merged in and deduped.
 */
export function booksForTile(
  tile: CategoryTile,
  subSlug?: string,
  extraBooks: Book[] = [],
): Book[] {
  const staticForTile = tile.audio
    ? getBooksByCollection("audio")
    : getBooksByCategory(tile.slug) ??
      staticBooks.filter((book) => book.category === tile.slug);
  const all = dedupe([...staticForTile, ...extraBooks]);
  if (!subSlug) return all;
  return all.filter((book) => book.subcategory === subSlug);
}

export function subcategoryBooks(
  tile: CategoryTile,
  sub: CategorySubcategory,
  extraBooks: Book[] = [],
): Book[] {
  return booksForTile(tile, sub.slug, extraBooks);
}

/** Total book count for a tile (used by tiles and rails). */
export function tileBookCount(tile: CategoryTile, extraBooks: Book[] = []): number {
  return booksForTile(tile, undefined, extraBooks).length;
}
