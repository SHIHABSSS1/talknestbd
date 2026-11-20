import type { Metadata } from "next";
import { Suspense } from "react";
import { PublisherDetailContent } from "@/components/publishers/PublisherDetailContent";
import { Container } from "@/components/ui/Container";
import { getPublisherContent } from "@/lib/db/queries/publishers";

export async function generateStaticParams() {
  const content = await getPublisherContent();
  return content.publishers.map((publisher) => ({ slug: publisher.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPublisherContent();
  const publisher = content.publishers.find((item) => item.slug === slug);
  return publisher
    ? { title: publisher.name, description: publisher.description }
    : { title: "Publisher" };
}

async function PublisherLoader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublisherDetailContent slug={slug} />;
}

export default function PublisherPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container>
            <p className="text-center text-sm text-muted">Loading publisher…</p>
          </Container>
        </section>
      }
    >
      <PublisherLoader params={params} />
    </Suspense>
  );
}
