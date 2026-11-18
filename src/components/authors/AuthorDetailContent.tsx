"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Quote } from "lucide-react";
import { useAuthorContent } from "@/components/providers/AuthorContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { toBn } from "@/lib/utils";

export function AuthorDetailContent({ slug }: { slug: string }) {
  const { content, hydrated } = useAuthorContent();
  const { books, hydrated: booksHydrated } = useBookContent();
  const author = content.authors.find((item) => item.slug === slug);

  if (!hydrated || !booksHydrated) {
    return (
      <section className="py-16">
        <Container>
          <p className="text-center text-sm text-muted">Loading author…</p>
        </Container>
      </section>
    );
  }

  if (!author) {
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-8 text-center">
            <h1 className="font-display text-xl font-bold text-ink">Author not found</h1>
            <p className="mt-2 text-sm text-muted">
              This profile may have been added in another browser. Demo author profiles are stored locally.
            </p>
            <Link href="/authors" className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
              <ArrowLeft size={13} /> All authors
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const authorBooks = books.filter((book) => book.authorSlug === author.slug);
  const detail = content.detail;

  return (
    <>
      <section className="border-b border-line bg-cream-100/50 py-8">
        <Container>
          <Breadcrumb items={[{ label: "Authors", href: "/authors" }, { label: author.name }]} className="mb-6" />
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
            <div className="aspect-[3/3.7] overflow-hidden rounded-[2rem] rounded-tl-[5rem] bg-brand-100">
              {author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.image} alt={author.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center font-display text-6xl text-brand-700">{author.name.charAt(0)}</div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-600 px-3 py-1 text-[10px] font-semibold text-white">
                  {author.featured ? detail.featuredLabel : detail.authorLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-white px-3 py-1 text-[10px] text-forest-800">
                  <MapPin size={11} /> {author.location}
                </span>
                <span className="rounded-full border border-forest-900/10 bg-white px-3 py-1 text-[10px] text-forest-800">
                  {toBn(authorBooks.length)} books
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-forest-950 sm:text-4xl">{author.name}</h1>
              <p className="mt-1 text-sm font-medium text-clay-600">{author.title}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-900/75">{author.bio}</p>
              <div className="mt-4 max-w-2xl space-y-2 text-[13px] leading-relaxed text-muted">
                {author.longBio.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
              {author.quote && (
                <blockquote className="mt-5 max-w-2xl rounded-2xl border border-brand-100 bg-white px-5 py-4">
                  <Quote size={15} className="text-brand-600" />
                  <p className="mt-2 text-[13px] italic leading-relaxed text-forest-900/75">“{author.quote}”</p>
                </blockquote>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/authors" className="inline-flex h-9 items-center rounded-[4px] border border-line bg-white px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                  {detail.allAuthorsLabel}
                </Link>
                <Link href="/books" className="inline-flex h-9 items-center rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
                  {detail.browseBooksLabel}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-600">{detail.booksHeadingPrefix}</p>
              <h2 className="font-display text-xl font-bold text-forest-950">{detail.booksHeading}</h2>
            </div>
            <p className="text-xs text-muted">{toBn(authorBooks.length)} books</p>
          </div>
          {authorBooks.length > 0 ? (
            <BookGrid books={authorBooks} columns="four" />
          ) : (
            <p className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">{detail.emptyNote}</p>
          )}
        </Container>
      </section>
    </>
  );
}
