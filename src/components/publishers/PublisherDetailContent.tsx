"use client";

import Link from "next/link";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { usePublisherContent } from "@/components/providers/PublisherContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { toBn } from "@/lib/utils";

export function PublisherDetailContent({ slug }: { slug: string }) {
  const { content, hydrated } = usePublisherContent();
  const { books, hydrated: booksHydrated } = useBookContent();
  const publisher = content.publishers.find((item) => item.slug === slug);

  if (!hydrated || !booksHydrated) {
    return (
      <section className="py-16">
        <Container>
          <p className="text-center text-sm text-muted">Loading publisher…</p>
        </Container>
      </section>
    );
  }

  if (!publisher) {
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-8 text-center">
            <h1 className="font-display text-xl font-bold text-ink">Publisher not found</h1>
            <p className="mt-2 text-sm text-muted">
              This press may have been added in another browser. Publisher profiles are stored in this browser.
            </p>
            <Link href="/publishers" className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
              <ArrowLeft size={13} /> All publishers
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const publisherBooks = books.filter((book) => book.publisherSlug === publisher.slug);
  const detail = content.detail;

  return (
    <>
      <section className="border-b border-line bg-cream-100/50 py-8">
        <Container>
          <Breadcrumb items={[{ label: "Publishers", href: "/publishers" }, { label: publisher.name }]} className="mb-6" />
          <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
            <div
              className="grid h-44 w-44 place-items-center rounded-2xl text-4xl font-bold text-white"
              style={{ background: `linear-gradient(145deg, ${publisher.accent}, ${publisher.accent}cc)` }}
            >
              {publisher.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={publisher.imageSrc} alt="" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                publisher.initials
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-600 px-3 py-1 text-[10px] font-semibold text-white">{detail.label}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-white px-3 py-1 text-[10px] text-forest-800">
                  <Building2 size={11} /> Est. {publisher.established}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-white px-3 py-1 text-[10px] text-forest-800">
                  <MapPin size={11} /> {publisher.location}
                </span>
                <span className="rounded-full border border-forest-900/10 bg-white px-3 py-1 text-[10px] text-forest-800">
                  {toBn(publisherBooks.length)} books
                </span>
                <span className="rounded-full border border-forest-900/10 bg-white px-3 py-1 text-[10px] text-forest-800">
                  {detail.originalLabel}
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-forest-950">{publisher.name}</h1>
              <p className="mt-1 text-sm font-medium" style={{ color: publisher.accent }}>{publisher.tagline}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-900/75">{publisher.description}</p>
              <Link href="/publishers" className="mt-5 inline-flex h-9 items-center rounded-[4px] border border-line bg-white px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                All publishers
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <h2 className="font-display text-xl font-bold text-forest-950">{detail.booksHeadingPrefix} {publisher.name}</h2>
          <p className="mt-1 text-xs text-muted">{toBn(publisherBooks.length)} books</p>
          <div className="mt-5">
            {publisherBooks.length > 0 ? (
              <BookGrid books={publisherBooks} columns="four" />
            ) : (
              <p className="rounded-xl border border-line bg-white p-8 text-center text-sm text-muted">{detail.emptyNote}</p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
