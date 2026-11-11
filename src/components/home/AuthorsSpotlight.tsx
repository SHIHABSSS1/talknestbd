import Link from "next/link";
import { ArrowUpRight, BookOpen, MapPin } from "lucide-react";
import { featuredAuthors } from "@/data/authors";
import { books } from "@/data/books";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { toBn } from "@/lib/utils";

export function AuthorsSpotlight() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <SectionHeader
          eyebrow="লেখকদের সঙ্গে পরিচয়"
          title="যাদের কলমে জন্ম নেয় নতুন দুনিয়া"
          description="বাংলাদেশের প্রিয় লেখকদের বই, ভাবনা আর গল্পের সঙ্গে আরও কাছাকাছি হোন।"
          href="/authors"
          linkLabel="সব লেখক"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {featuredAuthors.map((author) => {
            const authorBooks = books.filter((book) => book.authorSlug === author.slug);
            return (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-forest-900"
              >
                <div className="aspect-[3/3.9] overflow-hidden">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-forest-800 font-display text-4xl text-gold-300">
                      {author.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
                  <p className="flex items-center gap-1 text-[8px] uppercase tracking-[0.16em] text-gold-300">
                    <BookOpen size={9} />
                    {toBn(authorBooks.length)}টি বই
                  </p>
                  <h3 className="mt-1 font-display text-sm font-semibold leading-tight text-cream-50 sm:text-base">
                    {author.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-[9px] text-cream-100/55">
                    {author.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[8px] text-cream-100/35">
                    <MapPin size={8} />
                    {author.location}
                  </p>
                </div>
                <span className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full bg-cream-50/10 text-cream-50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <ArrowUpRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
