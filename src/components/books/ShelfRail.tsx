"use client";

import { BookRail } from "@/components/books/BookRail";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useShelfContent } from "@/components/providers/ShelfContentProvider";
import type { ViralShelfContent } from "@/lib/shelf-content";
import type { BookTag } from "@/lib/types";

/**
 * Generic homepage rail for a tag-based shelf. When `content` is supplied the
 * rail is driven by a database-backed shelf document; otherwise it falls back
 * to the legacy local catalogue (used by shelves not yet migrated).
 */
export function ShelfRail({
  slug,
  tag,
  href,
  tone,
  content,
}: {
  slug: string;
  tag: BookTag;
  href: string;
  tone?: "default" | "soft";
  content?: ViralShelfContent;
}) {
  const { books } = useBookContent();
  const { getHeading } = useShelfContent();
  const heading = content?.heading ?? getHeading(slug);
  const shelfBooks = content
    ? content.books
    : books.filter((book) => book.tags.includes(tag));

  if (shelfBooks.length === 0) return null;

  return (
    <BookRail
      books={shelfBooks}
      eyebrow={heading.eyebrow}
      title={heading.title}
      description={heading.description}
      href={href}
      linkLabel={heading.linkLabel}
      tone={tone}
    />
  );
}
