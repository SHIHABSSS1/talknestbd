import type { Metadata } from "next";
import { Suspense } from "react";
import { authors } from "@/data/authors";
import { AuthorDetailContent } from "@/components/authors/AuthorDetailContent";
import { Container } from "@/components/ui/Container";

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authors.find((item) => item.slug === slug);
  return author ? { title: author.name, description: author.bio } : { title: "Author" };
}

async function AuthorLoader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AuthorDetailContent slug={slug} />;
}

export default function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container>
            <p className="text-center text-sm text-muted">Loading author…</p>
          </Container>
        </section>
      }
    >
      <AuthorLoader params={params} />
    </Suspense>
  );
}
