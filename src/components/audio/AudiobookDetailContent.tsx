"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Gift,
  Headphones,
  Lock,
  Pause,
  Play,
  ShoppingBag,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useStore } from "@/lib/store";
import { useAudioContent } from "@/components/providers/AudioContentProvider";
import { BookCover } from "@/components/books/BookCover";
import { BookReviews } from "@/components/books/BookReviews";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn, formatPrice } from "@/lib/utils";
import { toBookFromAudio, type AudioBookView } from "@/lib/audio-api";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function AudiobookDetailContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { addItem } = useStore();
  const { refresh } = useAudioContent();
  const [book, setBook] = useState<AudioBookView | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [playRequested, setPlayRequested] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      accountFetch<{ audiobook: AudioBookView }>(
        `/api/audiobooks/${encodeURIComponent(slug)}`,
      ).catch(() => null),
      accountFetch<string[]>("/api/account/audio").catch(() => [] as string[]),
    ]).then(([detail, unlocks]) => {
      if (!alive) return;
      setBook(detail?.audiobook ?? null);
      setUnlocked(Boolean(unlocks.includes(slug)));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  const chapter = book?.chapters[chapterIndex] ?? book?.chapters[0];
  const owned = Boolean(book?.free || unlocked);
  const playable = Boolean(chapter?.free || owned);
  const unifiedBook = book ? toBookFromAudio(book) : null;

  useEffect(() => {
    const audio = audioRef;
    if (!audio) return;
    setProgress(0);
    setDuration(0);
    if (playRequested) {
      setPlayRequested(false);
      audio.play().then(() => setPlaying(true), () => setPlaying(false));
    } else {
      setPlaying(false);
    }
  }, [chapterIndex, chapter?.src, audioRef, playRequested]);

  if (loading) {
    return (
      <Container className="py-16">
        <p className="text-center text-sm text-muted">Loading audiobook…</p>
      </Container>
    );
  }
  if (!book || !unifiedBook || !chapter) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-[10px] border border-line bg-white p-8 text-center">
          <h1 className="font-display text-xl font-bold text-ink">Audiobook not found</h1>
          <p className="mt-2 text-sm text-muted">
            This title may have been removed. Browse the library for more audiobooks.
          </p>
          <Link href="/audio-books" className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[11px] font-semibold text-white">
            Browse audiobooks <ArrowRight size={13} />
          </Link>
        </div>
      </Container>
    );
  }

  const addToCart = () => {
    addItem({
      slug: book.slug,
      kind: "audio",
      title: book.title,
      price: book.price,
      meta: `Audiobook · ${book.narrator}`,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Audiobook"
        title={book.title}
        description={book.description}
        crumbs={[
          { label: "Audiobooks", href: "/audio-books" },
          { label: book.title },
        ]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                <BookCover book={unifiedBook} size="md" />
              </div>
              <div className="rounded-2xl border border-line bg-white p-4 text-[11px]">
                <p className="flex items-center gap-2 text-muted"><Headphones size={13} /> Narrated by {book.narrator}</p>
                <p className="mt-1 flex items-center gap-2 text-muted"><Clock3 size={13} /> Length: {book.duration}</p>
                {book.source && <p className="mt-1 text-muted">Source: {book.source}</p>}
                <p className="mt-1 text-muted">{book.chapters.length} chapters</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{book.free ? "Free" : formatPrice(book.price)}</Badge>
                  {book.isbn && <Badge tone="outline">ISBN {book.isbn}</Badge>}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-forest-900/10 bg-forest-950 p-5 text-cream-50 sm:p-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={!playable}
                    onClick={() => {
                      const audio = audioRef;
                      if (!audio) return;
                      if (playing) {
                        audio.pause();
                        setPlaying(false);
                      } else {
                        audio.play().then(() => setPlaying(true), () => setPlaying(false));
                      }
                    }}
                    aria-label={playing ? "Pause" : "Play"}
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-full",
                      playable ? "bg-gold-500 text-forest-950" : "cursor-not-allowed bg-white/15 text-cream-100/30",
                    )}
                  >
                    {playing ? <Pause size={17} className="fill-current" /> : <Play size={17} className="ml-0.5 fill-current" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold">{chapter.title}</p>
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={progress}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        setProgress(value);
                        if (audioRef) audioRef.currentTime = value;
                      }}
                      aria-label="Audio progress"
                      className="mt-2 h-1 w-full accent-gold-500"
                    />
                    <p className="mt-1 text-[9px] text-cream-100/50">
                      {formatTime(progress)} / {duration > 0 ? formatTime(duration) : chapter.duration}
                    </p>
                  </div>
                  {!playable && <Lock size={16} className="text-cream-100/40" />}
                </div>
                <audio
                  ref={setAudioRef}
                  src={chapter.src}
                  preload="metadata"
                  onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                />
              </div>

              <div className="rounded-2xl border border-line bg-white p-4">
                <h2 className="text-[13px] font-semibold text-ink">Chapters</h2>
                <div className="mt-3 space-y-1.5">
                  {book.chapters.map((item, index) => {
                    const accessible = Boolean(item.free || owned);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (!accessible) return;
                          setPlayRequested(true);
                          setChapterIndex(index);
                          if (index === chapterIndex && audioRef) {
                            audioRef.play().then(() => setPlaying(true), () => setPlaying(false));
                          }
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-[11px]",
                          index === chapterIndex ? "border-brand-300 bg-brand-50" : "border-line hover:bg-canvas",
                        )}
                      >
                        <span className={cn("grid h-7 w-7 place-items-center rounded-full text-[10px]", accessible ? "bg-brand-600 text-white" : "bg-canvas text-muted")}>
                          {accessible ? <Play size={11} className="ml-0.5 fill-current" /> : <Lock size={11} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-ink">{item.title}</span>
                          <span className="block text-[9px] text-muted">{accessible ? item.duration : "Unlocks after purchase"}</span>
                        </span>
                        {item.free && <Gift size={12} className="text-brand-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {owned ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mint bg-mint/20 px-5 py-4">
                  <p className="flex items-center gap-2 text-[11px] font-semibold text-forest-800">
                    <CheckCircle2 size={16} /> {book.free ? "Free audiobook" : "Unlocked — listen anytime"}
                  </p>
                  <Button href="/account/audiobooks" variant="outline" size="sm">My audiobooks</Button>
                </div>
              ) : (
                <div className="rounded-2xl border border-gold-300 bg-gold-300/10 p-5">
                  <p className="text-[13px] font-semibold text-ink">Unlock the full audiobook</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {book.chapters.length} chapters · {book.duration} · buy once and listen forever.
                  </p>
                  <p className="mt-3 font-display text-2xl font-bold text-ink">{formatPrice(book.price)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      onClick={() => {
                        addToCart();
                        router.push("/checkout");
                      }}
                      size="sm"
                    >
                      <ShoppingBag size={13} /> Buy &amp; unlock
                    </Button>
                    <Button onClick={addToCart} variant="outline" size="sm">Add to cart</Button>
                  </div>
                  <p className="mt-2 text-[9px] text-muted">Unlocked automatically after checkout.</p>
                </div>
              )}

              {book.longDescription.length > 0 && (
                <div className="space-y-2 rounded-2xl border border-line bg-white p-5 text-[11px] leading-relaxed text-muted">
                  <h2 className="text-[13px] font-semibold text-ink">About this audiobook</h2>
                  {book.longDescription.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
              )}
              {book.highlights.length > 0 && (
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h2 className="text-[13px] font-semibold text-ink">Highlights</h2>
                  <ul className="mt-2 space-y-1 text-[11px] text-muted">
                    {book.highlights.map((highlight, index) => <li key={index}>• {highlight}</li>)}
                  </ul>
                </div>
              )}

              <div className="border-t border-line pt-4">
                <BookReviews book={unifiedBook} />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
