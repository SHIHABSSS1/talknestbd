"use client";

import Link from "next/link";
import { Headphones, PlayCircle } from "lucide-react";
import { useAudioContent } from "@/components/providers/AudioContentProvider";
import { toBookFromAudio } from "@/lib/audio-api";
import { BookCover } from "@/components/books/BookCover";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const waveform = [30, 62, 42, 84, 52, 72, 36, 90, 58, 74, 44, 66, 34, 78, 48, 86, 40, 60];

export function AudioShowcase() {
  const { content, audiobooks } = useAudioContent();
  const audioBooks = audiobooks.map((item) => toBookFromAudio(item));
  const featured =
    audioBooks.find((book) => book.slug === content.section.featuredSlug) ??
    audioBooks[0];

  if (!featured) return null;

  const featuredEntry = content.books.find((book) => book.slug === featured.slug);

  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={content.section.eyebrow}
          title={content.section.title}
          description={content.section.description}
          href="/audio-books"
          linkLabel={content.section.linkLabel}
          className="mb-6"
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-3xl bg-forest-950 p-6 text-cream-50 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold-400/20"
            />
            <div className="relative flex gap-5">
              <Link
                href={`/audio-books/${featured.slug}`}
                className="h-40 w-28 shrink-0 overflow-hidden rounded-xl sm:h-48 sm:w-32"
              >
                <BookCover book={featured} size="md" />
              </Link>
              <div className="min-w-0">
                <span className="rounded-full border border-gold-400/25 bg-gold-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-gold-300">
                  Featured audiobook
                </span>
                <h3 className="mt-3 font-display text-xl font-bold sm:text-2xl">
                  {featured.title}
                </h3>
                <p className="mt-1 text-[11px] text-cream-100/60">
                  {featured.author} · Narrated by {featured.audio?.narrator}
                </p>
                <p className="mt-2 text-[10px] text-cream-100/50">
                  {featured.audio?.duration} · {featuredEntry?.chapters.length ?? 3} chapters ·{" "}
                  {featuredEntry?.free
                    ? content.pricing.freeLabel
                    : formatPrice(featuredEntry?.price ?? featured.price)}
                </p>
                <div className="mt-4 flex h-8 items-end gap-0.5">
                  {waveform.map((height, index) => (
                    <span
                      key={index}
                      className="w-1 rounded-full bg-gold-400/60"
                      style={{ height: `${height / 3}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="/audio-books" variant="gold" size="sm">
                    <PlayCircle size={13} /> Listen now
                  </Button>
                  <Link
                    href={`/audio-books/${featured.slug}`}
                    className="inline-flex h-9 items-center px-2 text-[11px] font-medium text-cream-100/70 hover:text-white"
                  >
                    Book details →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {audioBooks.slice(0, 6).map((book) => (
                <Link
                  key={book.slug}
                  href="/audio-books"
                  className="group rounded-xl border border-forest-900/8 bg-cream-50 p-2.5 transition-colors hover:border-brand-300"
                >
                  <span className="block aspect-[3/4] overflow-hidden rounded-lg bg-cream-100">
                    <BookCover book={book} size="sm" />
                  </span>
                  <span className="mt-2 block line-clamp-1 text-[10px] font-semibold text-forest-900">
                    {book.title}
                  </span>
                  <span className="block text-[9px] text-muted">
                    {book.audio?.duration}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2.5 text-[10px] text-brand-800">
              <Headphones size={14} className="shrink-0" />
              {content.library.previewNote}
            </div>
          </div>
        </div>

        <ViewAllRow
          href="/audio-books"
          label="Browse all audiobooks"
          count={`${audioBooks.length} titles`}
        />
      </Container>
    </section>
  );
}
