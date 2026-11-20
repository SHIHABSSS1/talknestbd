"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useShelfContent } from "@/components/providers/ShelfContentProvider";
import { toBn } from "@/lib/utils";
import type { ViralShelfContent } from "@/lib/shelf-content";
import type { BookTag } from "@/lib/types";

/** Generic collection page; `content` makes it DB-backed when provided. */
export function ShelfPageContent({
  slug,
  tag,
  crumb,
  content,
}: {
  slug: string;
  tag: BookTag;
  crumb: string;
  content?: ViralShelfContent;
}) {
  const { books } = useBookContent();
  const { getHeading } = useShelfContent();
  const heading = content?.heading ?? getHeading(slug);
  const shelfBooks = content
    ? content.books
    : books.filter((book) => book.tags.includes(tag));

  return (
    <>
      <PageHeader
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        crumbs={[{ label: crumb }]}
      >
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            Total {toBn(shelfBooks.length)} books
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            Free delivery on orders over ৳999
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            50% back after you read
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-12">
        <Container>
          <BookGrid books={shelfBooks} columns="five" />
        </Container>
      </section>
    </>
  );
}
