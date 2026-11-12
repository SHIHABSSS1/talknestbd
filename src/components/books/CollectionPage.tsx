import type { CollectionSlug } from "@/lib/types";
import { collectionMeta, getBooksByCollection } from "@/data/books";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { toBn } from "@/lib/utils";

export function CollectionPage({
  collection,
  title,
  eyebrow,
  description,
}: {
  collection: CollectionSlug;
  title?: string;
  eyebrow?: string;
  description?: string;
}) {
  const books = getBooksByCollection(collection);
  const meta = collectionMeta[collection];

  return (
    <>
      <PageHeader
        eyebrow={eyebrow ?? meta.eyebrow}
        title={title ?? meta.title}
        description={description ?? meta.description}
        crumbs={[{ label: title ?? meta.title }]}
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
