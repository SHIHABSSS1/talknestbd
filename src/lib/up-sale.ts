import type { Book, UpSaleBook } from "./types";

/** Converts a catalogue book into the 50% up-sale pricing model. */
export function toUpSaleBook(book: Book): UpSaleBook {
  const originalPrice = book.oldPrice ?? book.price;
  const sellingPrice = Math.round(originalPrice * 0.5);
  return {
    id: `up-${book.slug}`,
    cartSlug: book.slug,
    bookSlug: book.slug,
    title: book.title,
    author: book.author,
    condition: "Like new",
    originalPrice,
    sellingPrice,
    price: Math.round(sellingPrice * 1.5),
    returnedBy: "A TalkNest reader",
    location: "Bangladesh",
    stock: book.stock,
    cover: book.cover,
  };
}
