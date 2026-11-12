import Link from "next/link";
import { ArrowUpRight, Clock3, Headphones, Play } from "lucide-react";
import { getBooksByCollection } from "@/data/books";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookCover } from "@/components/books/BookCover";

const waveform = [30, 62, 42, 84, 52, 72, 36, 90, 58, 74, 44, 66, 34, 78, 48, 86, 40, 60];

export function AudioShowcase() {
  const audioBooks = getBooksByCollection("audio");
  const featured = audioBooks[0];
  if (!featured) return null;

  return (
    <section className="relative overflow-hidden bg-brand-950 py-10 text-white sm:py-14">
      <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.08]" />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-600/20 blur-3xl"
      />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div>
            <SectionHeader
              light
              eyebrow="TalkNest Audio"
              title="A good story for every commute"
              description="Listen while you travel, cook or wind down for the night. Bestselling novels, thoughtful non-fiction and the Seerah, narrated by voices worth spending time with."
              href="/audio-books"
              linkLabel="All audiobooks"
              className="mb-5"
            />

            <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-3.5 sm:p-4">
              <div className="flex gap-3.5">
                <Link
                  href={`/books/${featured.slug}`}
                  className="w-20 shrink-0 sm:w-24"
                >
                  <div className="aspect-[3/4]">
                    <BookCover book={featured} size="sm" />
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-brand-200/80">
                    Featured audiobook
                  </p>
                  <Link
                    href={`/books/${featured.slug}`}
                    className="mt-1 block truncate text-base font-bold text-white transition-colors hover:text-brand-200 sm:text-lg"
                  >
                    {featured.title}
                  </Link>
                  <p className="mt-0.5 truncate text-[11px] text-white/55">
                    Narrated by {featured.audio?.narrator}
                  </p>
                  <div className="mt-3 flex items-center gap-2.5">
                    <Link
                      href="/audio-books"
                      aria-label={`Play ${featured.title} audiobook`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-brand-700 transition-colors hover:bg-brand-50"
                    >
                      <Play size={14} className="ml-0.5 fill-current" />
                    </Link>
                    <div className="flex h-7 flex-1 items-center gap-[3px]" aria-hidden="true">
                      {waveform.map((height, index) => (
                        <span
                          key={index}
                          className="flex-1 rounded-full bg-brand-200/50"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-[10px] text-white/55">
                      <Clock3 size={11} />
                      {featured.audio?.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button href="/audio-books" variant="white" className="mt-4">
              <Headphones size={15} />
              Browse all audiobooks
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {audioBooks.slice(0, 4).map((book) => (
              <Link
                key={book.slug}
                href="/audio-books"
                className="group flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-white/25 hover:bg-white/[0.08]"
              >
                <div className="w-12 shrink-0 sm:w-14">
                  <div className="aspect-[3/4]">
                    <BookCover book={book} size="sm" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[13px] font-medium text-white">
                    {book.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-white/45">
                    {book.author}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1 text-[9px] text-brand-200/80">
                    <Headphones size={10} />
                    {book.audio?.duration}
                  </p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-white/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-200"
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
