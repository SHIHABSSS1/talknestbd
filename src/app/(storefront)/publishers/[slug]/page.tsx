import type { Metadata } from "next";
import { Suspense } from "react";
import { publishers } from "@/data/publishers";
import { PublisherDetailContent } from "@/components/publishers/PublisherDetailContent";
import { Container } from "@/components/ui/Container";

export function generateStaticParams() {
  return publishers.map((publisher) => ({ slug: publisher.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publisher = publishers.find((item) => item.slug === slug);
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
