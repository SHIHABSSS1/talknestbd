"use client";

import { BookRail } from "@/components/books/BookRail";
import type { ViralShelfContent } from "@/lib/shelf-content";

/** DB-backed New Arrivals rail on the homepage. */
export function NewArrivalsRail({ content }: { content: ViralShelfContent }) {
  if (content.books.length === 0) return null;

  return (
    <BookRail
      books={content.books}
      eyebrow={content.heading.eyebrow}
      title={content.heading.title}
      description={content.heading.description}
      href="/new-books"
      linkLabel={content.heading.linkLabel}
      tone="soft"
    />
  );
}
