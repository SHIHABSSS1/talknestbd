"use client";

import { BookRail } from "@/components/books/BookRail";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useShelfContent } from "@/components/providers/ShelfContentProvider";
import type { BookTag } from "@/lib/types";

/** Generic homepage rail for a tag-based shelf managed in the admin. */
export function ShelfRail({
  slug,
  tag,
  href,
  tone,
}: {
  slug: string;
  tag: BookTag;
  href: string;
  tone?: "default" | "soft";
}) {
  const { books } = useBookContent();
  const { getHeading } = useShelfContent();
  const heading = getHeading(slug);
  const shelfBooks = books.filter((book) => book.tags.includes(tag));

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
