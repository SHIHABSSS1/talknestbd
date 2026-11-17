"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useBookContent } from "@/components/providers/BookContentProvider";
import type { Book, UpSaleBook } from "@/lib/types";

interface UpSaleBooksContextValue {
  books: UpSaleBook[];
  getByCartSlug: (slug: string) => UpSaleBook | undefined;
}

const UpSaleBooksContext = createContext<UpSaleBooksContextValue | null>(null);

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

export function UpSaleBooksProvider({ children }: { children: ReactNode }) {
  const { books } = useBookContent();

  const booksForShelf = useMemo(
    () => books.filter((book) => book.tags.includes("up-sale")).map(toUpSaleBook),
    [books],
  );

  const value = useMemo(
    () => ({
      books: booksForShelf,
      getByCartSlug: (slug: string) =>
        booksForShelf.find((book) => book.cartSlug === slug),
    }),
    [booksForShelf],
  );

  return (
    <UpSaleBooksContext.Provider value={value}>
      {children}
    </UpSaleBooksContext.Provider>
  );
}

export function useUpSaleBooks(): UpSaleBooksContextValue {
  const context = useContext(UpSaleBooksContext);
  if (!context) {
    throw new Error("useUpSaleBooks must be used within an UpSaleBooksProvider");
  }
  return context;
}
