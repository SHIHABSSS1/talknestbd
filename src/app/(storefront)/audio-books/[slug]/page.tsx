import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { AudiobookDetailContent } from "@/components/audio/AudiobookDetailContent";
import {
  getAudiobookBySlug,
  getPublishedAudiobooks,
} from "@/lib/db/queries/audio";

export const instant = false;

export async function generateStaticParams() {
  const books = await getPublishedAudiobooks();
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const book = await getAudiobookBySlug(slug);
  if (!book) return { title: "Audiobook" };
  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: `${book.title} — TalkNest Audio`,
      description: book.description,
      type: "article",
    },
  };
}

export default async function AudiobookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container>
            <p className="text-center text-sm text-muted">Loading audiobook…</p>
          </Container>
        </section>
      }
    >
      <AudiobookDetailContent slug={slug} />
    </Suspense>
  );
}
