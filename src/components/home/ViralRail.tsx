"use client";

import { BookRail } from "@/components/books/BookRail";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useShelfContent } from "@/components/providers/ShelfContentProvider";
import { SHELF_SLUGS } from "@/lib/shelf-content";

/** Viral books shelf on the homepage — driven by the admin shelf editor. */
export function ViralRail() {
  const { books } = useBookContent();
  const { getHeading } = useShelfContent();
  const heading = getHeading(SHELF_SLUGS.viral);
  const viralBooks = books.filter((book) => book.tags.includes("viral"));

  if (viralBooks.length === 0) return null;

  return (
    <BookRail
      books={viralBooks}
      eyebrow={heading.eyebrow}
      title={heading.title}
      description={heading.description}
      href="/viral-books"
      linkLabel={heading.linkLabel}
    />
  );
}
