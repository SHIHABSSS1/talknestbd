"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import type { ViralShelfContent } from "@/lib/shelf-content";
import { toBn } from "@/lib/utils";

export function ViralPageContent({ content }: { content: ViralShelfContent }) {
  const { heading, books } = content;

  return (
    <>
      <PageHeader
        eyebrow={heading.eyebrow}
        title={heading.title}
        description={heading.description}
        crumbs={[{ label: heading.title }]}
      >
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            Total {toBn(books.length)} books
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
          <BookGrid books={books} columns="five" />
        </Container>
      </section>
    </>
  );
}
