import { books, getBooksByCollection, getBooksByCategory } from "@/data/books";
import type { Book } from "@/lib/types";
import type { CategorySubcategory, CategoryTile } from "@/lib/category-content";

/** Books belonging to a tile, optionally narrowed to one of its sub-shelves. */
export function booksForTile(tile: CategoryTile, subSlug?: string): Book[] {
  const categoryBooks = tile.audio
    ? getBooksByCollection("audio")
    : getBooksByCategory(tile.slug) ?? books.filter((book) => book.category === tile.slug);
  if (!subSlug) return categoryBooks;
  return categoryBooks.filter((book) => book.subcategory === subSlug);
}

export function subcategoryBooks(tile: CategoryTile, sub: CategorySubcategory): Book[] {
  return booksForTile(tile, sub.slug);
}

/** Total book count for a tile (used by tiles and rails). */
export function tileBookCount(tile: CategoryTile): number {
  return booksForTile(tile).length;
}
