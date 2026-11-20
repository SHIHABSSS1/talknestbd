import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthorDetailContent } from "@/components/authors/AuthorDetailContent";
import { Container } from "@/components/ui/Container";
import { getAuthorContent } from "@/lib/db/queries/authors";

export async function generateStaticParams() {
  const content = await getAuthorContent();
  return content.authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getAuthorContent();
  const author = content.authors.find((item) => item.slug === slug);
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
