import Link from "next/link";
import { BookOpen } from "lucide-react";
import { featuredAuthors } from "@/data/authors";
import { books } from "@/data/books";
import { formatCount, initials } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AuthorsSpotlight() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow="Meet the authors"
          title="The voices behind the shelves"
          description="Get closer to the writers, thinkers and storytellers shaping what Bangladesh reads."
          href="/authors"
          linkLabel="All authors"
        />

        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {featuredAuthors.map((author) => {
            const authorBooks = books.filter(
              (book) => book.authorSlug === author.slug,
            );
            return (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="group flex flex-col items-center rounded-[8px] border border-line bg-white p-3 text-center transition-colors hover:border-brand-300 sm:p-4"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-brand-50 sm:h-24 sm:w-24">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-xl font-bold text-brand-700">
                      {initials(author.name)}
                    </span>
                  )}
                </div>
                <h3 className="mt-2.5 line-clamp-1 text-[11px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-700 sm:text-[12px]">
                  {author.name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[9px] text-muted sm:text-[10px]">
                  {author.title}
                </p>
                <p className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-brand-600">
                  <BookOpen size={9} />
                  {formatCount(authorBooks.length)} books
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
