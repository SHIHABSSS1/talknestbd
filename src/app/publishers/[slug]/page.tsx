import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, MapPin } from "lucide-react";
import { getPublisher, publishers } from "@/data/publishers";
import { getBooksByPublisher } from "@/data/books";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { toBn } from "@/lib/utils";

export function generateStaticParams() {
  return publishers.map((publisher) => ({ slug: publisher.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publisher = getPublisher(slug);
  if (!publisher) return { title: "Publishers" };
  return { title: publisher.name, description: publisher.description };
}

export default async function PublisherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publisher = getPublisher(slug);
  if (!publisher) notFound();
  const publisherBooks = getBooksByPublisher(publisher.slug);

  return (
    <>
      <section className="border-b border-forest-900/8 bg-cream-100/50">
        <Container className="py-6 sm:py-10">
          <Breadcrumb
            items={[
              { label: "Publishers", href: "/publishers" },
              { label: publisher.name },
            ]}
          />
          <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr] md:items-start lg:grid-cols-[220px_1fr]">
            <div
              className="grid aspect-square w-full max-w-[200px] place-items-center rounded-[2rem] font-display text-6xl font-bold text-cream-50 shadow-lg"
              style={{
                background: `linear-gradient(145deg, ${publisher.accent}, ${publisher.accent}cc)`,
              }}
            >
              {publisher.initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="rounded-full bg-forest-900 px-3 py-1 font-semibold text-cream-50">
                  Publisher
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1 text-forest-800">
                  <Building2 size={11} />
                  Est. {publisher.established}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1 text-forest-800">
                  <MapPin size={11} />
                  {publisher.location}
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-forest-950 sm:text-4xl lg:text-5xl">
                {publisher.name}
              </h1>
              <p className="mt-1 text-sm font-medium" style={{ color: publisher.accent }}>
                {publisher.tagline}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-900/70">
                {publisher.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-semibold text-forest-800">
                  {toBn(publisherBooks.length)} books
                </span>
                <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-semibold text-forest-800">
                  100% original
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                Books by {publisher.name}
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                Books from this publisher
              </h2>
            </div>
            <span className="text-xs text-muted">{toBn(publisherBooks.length)} books</span>
          </div>
          {publisherBooks.length > 0 ? (
            <BookGrid books={publisherBooks} columns="four" />
          ) : (
            <p className="rounded-2xl bg-cream-100 p-8 text-center text-sm text-muted">
              This publisher&apos;s books are coming soon.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
