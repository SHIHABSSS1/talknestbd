"use client";

import { BookRail } from "@/components/books/BookRail";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useShelfContent } from "@/components/providers/ShelfContentProvider";
import { SHELF_SLUGS } from "@/lib/shelf-content";

/** New Arrivals shelf on the homepage — driven by the admin shelf editor. */
export function NewArrivalsRail() {
  const { books } = useBookContent();
  const { getHeading } = useShelfContent();
  const heading = getHeading(SHELF_SLUGS.newArrivals);
  const newBooks = books.filter((book) => book.tags.includes("new"));

  if (newBooks.length === 0) return null;

  return (
    <BookRail
      books={newBooks}
      eyebrow={heading.eyebrow}
      title={heading.title}
      description={heading.description}
      href="/new-books"
      linkLabel={heading.linkLabel}
      tone="soft"
    />
  );
}
