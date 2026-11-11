import Link from "next/link";
import { ArrowUpRight, Clock3, Headphones, Play } from "lucide-react";
import { getBooksByCollection } from "@/data/books";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BookCover } from "@/components/books/BookCover";

const waveform = [30, 62, 42, 84, 52, 72, 36, 90, 58, 74, 44, 66, 34, 78, 48, 86, 40, 60];

export function AudioShowcase() {
  const audioBooks = getBooksByCollection("audio");
  const featured = audioBooks[0];
  if (!featured) return null;

  return (
    <section className="relative overflow-hidden bg-forest-950 py-11 text-cream-50 sm:py-16">
      <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.1]" />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-forest-600/20 blur-3xl"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400">
              <span className="h-px w-6 bg-gold-400/70" />
              TalkNest Audio
            </span>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-bold leading-snug sm:text-4xl">
              চোখ ব্যস্ত থাকুক,
              <br />
              <span className="text-gold-300">গল্প শুনুন কানে।</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-100/60">
              ভ্রমণে, রান্নাঘরে বা ঘুমের আগে — দেশের জনপ্রিয় বাচকদের কণ্ঠে
              শুনে নিন আপনার প্রিয় বই। অডিওর জন্য আলাদা সাবস্ক্রিপশন নেই।
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex gap-4">
                <Link
                  href={`/books/${featured.slug}`}
                  className="w-20 shrink-0 sm:w-24"
                >
                  <div className="aspect-[3/4]">
                    <BookCover book={featured} size="sm" />
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-gold-400/80">
                    Featured audio book
                  </p>
                  <Link
                    href={`/books/${featured.slug}`}
                    className="mt-1 block truncate font-display text-base font-semibold text-cream-50 hover:text-gold-300 sm:text-lg"
                  >
                    {featured.title}
                  </Link>
                  <p className="mt-0.5 text-[11px] text-cream-100/50">
                    {featured.audio?.narrator}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      href="/audio-books"
                      aria-label="অডিও বুক প্লে করুন"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-500 text-forest-950 transition-colors hover:bg-gold-400"
                    >
                      <Play size={15} className="fill-forest-950" />
                    </Link>
                    <div className="flex h-8 flex-1 items-center gap-[3px]" aria-hidden="true">
                      {waveform.map((height, index) => (
                        <span
                          key={index}
                          className="flex-1 rounded-full bg-gold-400/45"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <span className="flex shrink-0 items-center gap-1 text-[10px] text-cream-100/50">
                      <Clock3 size={11} />
                      {featured.audio?.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button href="/audio-books" variant="gold" className="mt-5">
              <Headphones size={16} />
              সব অডিও বুক
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {audioBooks.slice(0, 4).map((book) => (
              <Link
                key={book.slug}
                href="/audio-books"
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08]"
              >
                <div className="w-12 shrink-0 sm:w-14">
                  <div className="aspect-[3/4]">
                    <BookCover book={book} size="sm" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-display text-sm font-semibold text-cream-50">
                    {book.title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-cream-100/40">
                    {book.author}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1 text-[9px] text-gold-400/80">
                    <Headphones size={10} />
                    {book.audio?.duration}
                  </p>
                </div>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-cream-100/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
