"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Quote } from "lucide-react";
import { useAuthorContent } from "@/components/providers/AuthorContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { toBn } from "@/lib/utils";

export function AuthorsPageContent() {
  const { content } = useAuthorContent();
  const { books } = useBookContent();
  const { listing, authors } = content;
  const cards = authors.filter((author) => author.featured);
  const pills = authors.slice(0, listing.pillCount);
  const quoteAuthor = authors.find((author) => author.name === listing.quoteBy);

  return (
    <>
      <PageHeader
        eyebrow={listing.eyebrow}
        title={listing.title}
        description={listing.description}
        crumbs={[{ label: "Authors" }]}
      />

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((author) => {
              const authorBooks = books.filter((book) => book.authorSlug === author.slug);
              return (
                <Link
                  key={author.slug}
                  href={`/authors/${author.slug}`}
                  className="group rounded-2xl border border-forest-900/8 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-100">
                    {author.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={author.image} alt={author.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center font-display text-4xl text-brand-700">{author.name.charAt(0)}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/45 to-transparent" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-medium text-brand-900">
                      <MapPin size={10} /> {author.location}
                    </span>
                    <ArrowUpRight size={16} className="absolute right-3 top-3 text-white/80 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h2 className="mt-3 text-[15px] font-bold text-forest-950">{author.name}</h2>
                  <p className="text-[10px] text-clay-600">{author.title}</p>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">{author.bio}</p>
                  <p className="mt-3 text-[10px] text-brand-700">{toBn(authorBooks.length)} books · Author profile</p>
                </Link>
              );
            })}
          </div>

          <section className="mt-8 overflow-hidden rounded-2xl bg-forest-950 px-6 py-8 text-cream-50 sm:px-10">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-300">
              <Quote size={13} /> {listing.quoteLabel}
            </p>
            <blockquote className="mt-3 max-w-3xl font-display text-xl leading-relaxed sm:text-2xl">
              “{listing.quote}”
            </blockquote>
            <p className="mt-3 text-[11px] text-cream-100/60">— {listing.quoteBy}</p>
            {quoteAuthor && (
              <Link href={`/authors/${quoteAuthor.slug}`} className="mt-4 inline-flex text-[11px] font-semibold text-gold-300 hover:underline">
                Read {quoteAuthor.name}&apos;s profile →
              </Link>
            )}
          </section>

          <section className="mt-8">
            <h2 className="font-display text-lg font-bold text-forest-950">All authors</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {pills.map((author) => (
                <Link
                  key={author.slug}
                  href={`/authors/${author.slug}`}
                  className="rounded-full border border-forest-900/10 bg-cream-50 px-3.5 py-1.5 text-[11px] font-medium text-forest-800 hover:border-brand-300 hover:text-brand-700"
                >
                  {author.name}
                </Link>
              ))}
            </div>
          </section>
        </Container>
      </section>
    </>
  );
}
