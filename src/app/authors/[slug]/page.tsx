import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Quote } from "lucide-react";
import { authors, getAuthor } from "@/data/authors";
import { getBooksByAuthor } from "@/data/books";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { toBn } from "@/lib/utils";

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return { title: "লেখক" };
  return { title: author.name, description: author.bio };
}

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const authorBooks = getBooksByAuthor(author.slug);

  return (
    <>
      <section className="border-b border-forest-900/8 bg-cream-100/50">
        <Container className="py-6 sm:py-10">
          <Breadcrumb
            items={[{ label: "লেখক", href: "/authors" }, { label: author.name }]}
          />
          <div className="mt-6 grid gap-7 md:grid-cols-[240px_1fr] md:items-start lg:grid-cols-[300px_1fr] lg:gap-10">
            <div className="relative mx-auto w-full max-w-[280px] md:mx-0">
              <div className="aspect-[3/3.7] overflow-hidden rounded-[2rem] rounded-tl-[5rem] bg-forest-100">
                {author.image ? (
                  <img
                    src={author.image}
                    alt={author.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-forest-900 font-display text-6xl text-gold-300">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-3 right-4 rounded-full bg-gold-500 px-3 py-1.5 text-[9px] font-semibold text-forest-950 shadow">
                {toBn(authorBooks.length)}টি বই
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="rounded-full bg-forest-900 px-3 py-1 font-semibold text-cream-50">
                  {author.featured ? "ফিচার্ড লেখক" : "লেখক"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1 text-forest-800">
                  <MapPin size={11} />
                  {author.location}
                </span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-forest-950 sm:text-4xl lg:text-5xl">
                {author.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-clay-600">{author.title}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-forest-900/70">
                {author.bio}
              </p>
              <div className="mt-4 max-w-2xl space-y-3 text-[13px] leading-relaxed text-muted">
                {author.longBio.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)}>{paragraph}</p>
                ))}
              </div>
              <blockquote className="mt-5 max-w-2xl rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3.5">
                <Quote size={17} className="text-gold-500/50" />
                <p className="mt-1 font-display text-sm font-medium leading-relaxed text-forest-900">
                  “{author.quote}”
                </p>
              </blockquote>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/authors"
                  className="rounded-full border border-forest-900/15 px-4 py-2 text-[11px] font-semibold text-forest-800 hover:border-forest-900"
                >
                  সব লেখক
                </Link>
                <Link
                  href="/books"
                  className="rounded-full bg-forest-900 px-4 py-2 text-[11px] font-semibold text-cream-50 hover:bg-forest-700"
                >
                  বই ঘুরে দেখুন
                </Link>
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
                Books by {author.name}
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                লেখকের বই
              </h2>
            </div>
            <span className="text-xs text-muted">{toBn(authorBooks.length)}টি বই</span>
          </div>
          {authorBooks.length > 0 ? (
            <BookGrid books={authorBooks} columns="four" />
          ) : (
            <p className="rounded-2xl bg-cream-100 p-8 text-center text-sm text-muted">
              এই লেখকের বই খুব শিগগিরই যোগ হচ্ছে।
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
