"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  allBooks,
  BOOK_STORAGE_KEY,
  clearUploadedBooks,
  findBook,
  readUploadedBooks,
  writeUploadedBooks,
  type SaveResult,
} from "@/lib/book-content";
import type { Book } from "@/lib/types";

interface BookContentContextValue {
  /** Admin-uploaded/edited books only. */
  uploads: Book[];
  /** Static + best-seller + uploads, deduped by slug. */
  books: Book[];
  hydrated: boolean;
  saveBook: (book: Book) => SaveResult;
  removeBook: (slug: string) => SaveResult;
  resetUploads: () => SaveResult;
  getBook: (slug: string) => Book | undefined;
}

const BookContentContext = createContext<BookContentContextValue | null>(null);

/** Single source of truth for every book on the storefront and in the admin. */
export function BookContentProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<Book[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUploads(readUploadedBooks());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === BOOK_STORAGE_KEY || event.key === null) {
        setUploads(readUploadedBooks());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const books = useMemo(() => allBooks(uploads), [uploads]);

  const saveBook = useCallback((book: Book) => {
    const next = [...uploads.filter((item) => item.slug !== book.slug), book];
    const result = writeUploadedBooks(next);
    if (result.ok) setUploads(next);
    return result;
  }, [uploads]);

  const removeBook = useCallback((slug: string) => {
    const next = uploads.filter((item) => item.slug !== slug);
    const result = writeUploadedBooks(next);
    if (result.ok) setUploads(next);
    return result;
  }, [uploads]);

  const resetUploads = useCallback(() => {
    const result = clearUploadedBooks();
    if (result.ok) setUploads([]);
    return result;
  }, []);

  const getBook = useCallback(
    (slug: string) => findBook(slug, books),
    [books],
  );

  const value = useMemo(
    () => ({ uploads, books, hydrated, saveBook, removeBook, resetUploads, getBook }),
    [uploads, books, hydrated, saveBook, removeBook, resetUploads, getBook],
  );

  return (
    <BookContentContext.Provider value={value}>
      {children}
    </BookContentContext.Provider>
  );
}

export function useBookContent(): BookContentContextValue {
  const context = useContext(BookContentContext);
  if (!context) {
    throw new Error("useBookContent must be used within a BookContentProvider");
  }
  return context;
}
