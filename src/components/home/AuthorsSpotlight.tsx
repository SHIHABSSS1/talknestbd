"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useAuthorContent } from "@/components/providers/AuthorContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { formatCount, initials } from "@/lib/utils";

export function AuthorsSpotlight() {
  const { content } = useAuthorContent();
  const { books } = useBookContent();
  const featured = content.authors.filter((author) => author.featured);

  if (featured.length === 0) return null;

  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={content.section.eyebrow}
          title={content.section.title}
          description={content.section.description}
          href="/authors"
          linkLabel={content.section.linkLabel}
          className="mb-6"
        />

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {featured.map((author) => {
            const authorBooks = books.filter((book) => book.authorSlug === author.slug);
            return (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="flex flex-col items-center rounded-xl border border-forest-900/8 bg-cream-50 px-2 py-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand-300"
              >
                <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-brand-100 font-display text-lg text-brand-700 sm:h-16 sm:w-16">
                  {author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={author.image} alt={author.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    initials(author.name)
                  )}
                </span>
                <span className="mt-3 block text-[11px] font-semibold text-forest-950">{author.name}</span>
                <span className="mt-0.5 block text-[9px] text-muted">{author.title}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] text-brand-700">
                  <BookOpen size={10} /> {formatCount(authorBooks.length)} books
                </span>
              </Link>
            );
          })}
        </div>

        <ViewAllRow href="/authors" label={content.section.linkLabel} count={`${featured.length} featured`} />
      </Container>
    </section>
  );
}
