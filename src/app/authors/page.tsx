import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Quote } from "lucide-react";
import { authors, featuredAuthors } from "@/data/authors";
import { books } from "@/data/books";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "লেখক",
  description: "TalkNest BD-এর সঙ্গে যুক্ত বাংলাদেশের প্রিয় লেখকদের পরিচিতি ও বইয়ের সংগ্রহ।",
};

export default function AuthorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Authors"
        title="যাদের কলমে বাঁচে গল্প"
        description="লেখকের পরিচিতি, ভাবনা আর বইয়ের সংগ্রহ — এক জায়গায়।"
        crumbs={[{ label: "লেখক" }]}
      />

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAuthors.map((author) => {
              const authorBooks = books.filter((book) => book.authorSlug === author.slug);
              return (
                <Link
                  key={author.slug}
                  href={`/authors/${author.slug}`}
                  className="group overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-36px_rgba(10,33,24,0.5)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {author.image && (
                      <img
                        src={author.image}
                        alt={author.name}
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/75 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-gold-300">
                        <MapPin size={10} />
                        {author.location}
                      </p>
                      <h2 className="mt-1 font-display text-xl font-semibold text-cream-50">
                        {author.name}
                      </h2>
                      <p className="text-[10px] text-cream-100/60">{author.title}</p>
                    </div>
                    <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-cream-50/10 text-cream-50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                      {author.bio}
                    </p>
                    <p className="mt-3 text-[10px] font-semibold text-forest-700">
                      {toBn(authorBooks.length)}টি বই · লেখক প্রোফাইল
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-3xl bg-forest-950 p-6 text-cream-50 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  Writer&apos;s Quote
                </span>
                <Quote size={28} className="mt-3 text-gold-400/45" />
                <blockquote className="mt-2 font-display text-xl font-medium leading-relaxed sm:text-2xl">
                  “গল্প সেই জানালা, যা দিয়ে বাইরের আলো ঢোকে, আবার ভেতরের অন্ধকারও
                  দেখা যায়।”
                </blockquote>
                <p className="mt-3 text-[11px] text-cream-100/50">— রাফিদা নূর</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {authors.slice(0, 9).map((author) => (
                  <Link
                    key={author.slug}
                    href={`/authors/${author.slug}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] font-medium text-cream-100/75 transition-colors hover:bg-white/10 hover:text-gold-300"
                  >
                    {author.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
