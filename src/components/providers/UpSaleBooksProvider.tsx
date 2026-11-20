"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { toUpSaleBook } from "@/lib/up-sale";
import type { Book, UpSaleBook } from "@/lib/types";

export { toUpSaleBook };

interface UpSaleBooksContextValue {
  books: UpSaleBook[];
  getByCartSlug: (slug: string) => UpSaleBook | undefined;
}

const UpSaleBooksContext = createContext<UpSaleBooksContextValue | null>(null);

export function UpSaleBooksProvider({
  children,
  initialBooks,
}: {
  children: ReactNode;
  /** Books from the DB-backed `shelf:up-sale` document. */
  initialBooks?: Book[];
}) {
  const { books } = useBookContent();

  const booksForShelf = useMemo(
    () =>
      (initialBooks ?? books.filter((book) => book.tags.includes("up-sale"))).map(
        toUpSaleBook,
      ),
    [initialBooks, books],
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
