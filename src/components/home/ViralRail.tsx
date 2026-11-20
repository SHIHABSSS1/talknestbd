"use client";

import { BookRail } from "@/components/books/BookRail";
import type { ViralShelfContent } from "@/lib/shelf-content";

/**
 * Viral books shelf on the homepage. The heading and books arrive from the
 * cached `shelf:viral-books` document, so an admin save publishes the rail for
 * every visitor.
 */
export function ViralRail({ content }: { content: ViralShelfContent }) {
  if (content.books.length === 0) return null;

  return (
    <BookRail
      books={content.books}
      eyebrow={content.heading.eyebrow}
      title={content.heading.title}
      description={content.heading.description}
      href="/viral-books"
      linkLabel={content.heading.linkLabel}
    />
  );
}
