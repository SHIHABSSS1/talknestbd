import type { Metadata } from "next";
import { Suspense } from "react";
import { books, getBook } from "@/data/books";
import { BookDetailContent } from "@/components/books/BookDetailContent";
import { Container } from "@/components/ui/Container";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Books" };
  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: `${book.title} — ${book.author}`,
      description: book.description,
      type: "article",
    },
  };
}

async function DetailLoader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BookDetailContent slug={slug} />;
}

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container>
            <p className="text-center text-sm text-muted">Loading book…</p>
          </Container>
        </section>
      }
    >
      <DetailLoader params={params} />
    </Suspense>
  );
}
