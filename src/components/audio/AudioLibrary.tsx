"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Headphones,
  Lock,
  Pause,
  Play,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { getBooksByCollection } from "@/data/books";
import { useStore } from "@/lib/store";
import {
  audioChapters,
  audioPrice,
  isAudioFreeOrOwned,
  isFreeAudio,
  readUnlockedAudio,
} from "@/lib/audio";
import { cn, formatPrice, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${toBn(String(minutes).padStart(2, "0"))}:${toBn(String(rest).padStart(2, "0"))}`;
}

export function AudioLibrary() {
  const router = useRouter();
  const { addItem, notify } = useStore();
  const audioBooks = useMemo(() => getBooksByCollection("audio"), []);
  const [selectedSlug, setSelectedSlug] = useState(audioBooks[0]?.slug ?? "");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playRequested = useRef(false);

  useEffect(() => {
    setUnlocked(readUnlockedAudio());
  }, []);

  const book = audioBooks.find((entry) => entry.slug === selectedSlug) ?? audioBooks[0];
  const chapters = useMemo(() => (book ? audioChapters(book) : []), [book]);
  const chapter = chapters[chapterIndex] ?? chapters[0];
  const owned = book
    ? isFreeAudio(book.slug) || unlocked.includes(book.slug)
    : false;
  const playable = Boolean(chapter?.free || owned);
  const price = book ? audioPrice(book) : 0;

  useEffect(() => {
    setChapterIndex(0);
    setPlaying(false);
    setProgress(0);
    setDuration(0);
    setAudioError(false);
  }, [selectedSlug]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(0);
    setDuration(0);
    setAudioError(false);
    if (playRequested.current) {
      playRequested.current = false;
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      setPlaying(false);
    }
  }, [chapterIndex, chapter?.src]);

  if (!book || !chapter) return null;

  const togglePlay = () => {
    if (!playable) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  const selectChapter = (index: number) => {
    if (!chapters[index].free && !owned) {
      document.getElementById("audio-unlock")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    playRequested.current = true;
    setChapterIndex(index);
    if (index === chapterIndex) {
      const audio = audioRef.current;
      if (audio) {
        if (playing) {
          audio.pause();
          setPlaying(false);
        } else {
          audio.play().then(() => setPlaying(true), () => setPlaying(false));
        }
      }
    }
  };

  const addAudioToCart = () => {
    addItem({
      slug: book.slug,
      kind: "audio",
      title: book.title,
      price,
      meta: `Audiobook · ${book.audio?.narrator ?? "TalkNest Voices"}`,
    });
  };

  const buyNow = () => {
    addItem({
      slug: book.slug,
      kind: "audio",
      title: book.title,
      price,
      meta: `Audiobook · ${book.audio?.narrator ?? "TalkNest Voices"}`,
    });
    router.push("/checkout");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[330px_1fr] lg:items-start">
      <aside className="rounded-3xl border border-forest-900/8 bg-cream-100/50 p-3 sm:p-4">
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="font-display text-base font-bold text-forest-950">
            Audio Library
          </h2>
          <Badge tone="outline">{toBn(audioBooks.length)} books</Badge>
        </div>
        <div className="space-y-2">
          {audioBooks.map((entry) => {
            const active = entry.slug === book.slug;
            const free = isFreeAudio(entry.slug);
            const isOwned = free || unlocked.includes(entry.slug);
            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => setSelectedSlug(entry.slug)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-all",
                  active
                    ? "border-forest-700 bg-cream-50 shadow-sm ring-1 ring-forest-700/15"
                    : "border-transparent bg-cream-50/60 hover:border-forest-900/10 hover:bg-cream-50",
                )}
              >
                <span className="relative block h-16 w-12 shrink-0 overflow-hidden rounded-md">
                  <BookCover book={entry} size="sm" />
                  {active && playing && (
                    <span className="absolute inset-0 grid place-items-center bg-forest-950/45">
                      <span className="flex h-6 items-end gap-0.5">
                        {[8, 14, 10, 16].map((height, index) => (
                          <span
                            key={index}
                            className="w-0.5 animate-pulse rounded-full bg-gold-300"
                            style={{ height, animationDelay: `${index * 120}ms` }}
                          />
                        ))}
                      </span>
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 font-display text-[13px] font-semibold text-forest-950">
                    {entry.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-[9px] text-muted">
                    {entry.audio?.narrator}
                  </span>
                  <span className="mt-1.5 flex items-center gap-1.5">
                    {free ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-forest-100 px-1.5 py-0.5 text-[8px] font-semibold text-forest-700">
                        <Sparkles size={8} /> Free
                      </span>
                    ) : isOwned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-1.5 py-0.5 text-[8px] font-semibold text-gold-600">
                        <BadgeCheck size={8} /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-1.5 py-0.5 text-[8px] font-semibold text-forest-800/60">
                        <Lock size={8} /> Premium
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[8px] text-muted">
                      <Clock3 size={8} /> {entry.audio?.duration}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 rounded-xl bg-gold-500/8 px-3 py-2.5 text-[9px] leading-relaxed text-forest-800/70">
          <Sparkles size={11} className="mr-1 inline text-gold-600" />
          Two audiobooks are completely free. Every other book has a free first
          chapter — unlock the audiobook to listen in full.
        </p>
      </aside>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-forest-900/10 bg-forest-950 text-cream-50">
          <div className="relative p-5 sm:p-6">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-[0.08]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-gold-400/15"
            />
            <div className="relative flex gap-4 sm:gap-5">
              <div className="w-24 shrink-0 sm:w-32">
                <div className="aspect-[3/4]">
                  <BookCover book={book} size="sm" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-forest-950">
                    TalkNest Audio
                  </span>
                  {isFreeAudio(book.slug) ? (
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[8px] font-semibold text-cream-100/80">
                      Completely free
                    </span>
                  ) : owned ? (
                    <span className="rounded-full border border-forest-400/30 bg-forest-500/20 px-2 py-0.5 text-[8px] font-semibold text-forest-200">
                      In your library
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[8px] font-semibold text-cream-100/80">
                      First chapter free
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold leading-snug sm:text-3xl">
                  {book.title}
                </h2>
                <p className="mt-1 text-[11px] text-cream-100/55">
                  {book.author} · Narrator: {book.audio?.narrator}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-cream-100/45">
                  <span className="flex items-center gap-1.5">
                    <Headphones size={12} className="text-gold-400" />
                    {book.audio?.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock3 size={12} className="text-gold-400" />
                    3 chapters
                  </span>
                  <Link href={`/books/${book.slug}`} className="font-semibold text-gold-300 hover:text-gold-400">
                    Book details →
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 backdrop-blur sm:p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!playable}
                  aria-label={playing ? "Pause" : "Listen"}
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors",
                    playable
                      ? "bg-gold-500 text-forest-950 hover:bg-gold-400"
                      : "cursor-not-allowed bg-white/15 text-cream-100/30",
                  )}
                >
                  {playing ? (
                    <Pause size={17} className="fill-current" />
                  ) : (
                    <Play size={17} className="ml-0.5 fill-current" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-[9px] text-cream-100/55">
                    <span className="truncate">
                      {chapter.title} · {book.audio?.narrator}
                    </span>
                    <span className="shrink-0 tabular-nums">
                      {formatTime(progress)} / {duration > 0 ? formatTime(duration) : chapter.duration}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={progress}
                    onChange={(event) => {
                      const audio = audioRef.current;
                      const value = Number(event.target.value);
                      setProgress(value);
                      if (audio) audio.currentTime = value;
                    }}
                    aria-label="Audio player time"
                    className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-gold-500"
                  />
                </div>
                {!playable && <Lock size={16} className="shrink-0 text-cream-100/40" />}
              </div>
              <audio
                ref={audioRef}
                src={chapter.src}
                preload="metadata"
                onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                onError={() => setAudioError(true)}
              />
              {audioError && (
                <p className="mt-2 text-[9px] text-gold-300/80">
                  The demo audio could not load. Check your internet connection and try again.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-sm font-semibold text-cream-50">
                Chapter list
              </h3>
              <span className="text-[9px] text-cream-100/40">
                {owned ? "All chapters unlocked" : "1 free preview"}
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              {chapters.map((item, index) => {
                const accessible = item.free || owned;
                const active = index === chapterIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectChapter(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                      active
                        ? "border-gold-400/30 bg-gold-500/10"
                        : "border-transparent hover:bg-white/5",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold",
                        active
                          ? "bg-gold-500 text-forest-950"
                          : accessible
                            ? "bg-white/10 text-cream-100/70"
                            : "bg-white/5 text-cream-100/30",
                      )}
                    >
                      {active && playing ? (
                        <Pause size={11} className="fill-current" />
                      ) : accessible ? (
                        <Play size={11} className="ml-0.5 fill-current" />
                      ) : (
                        <Lock size={11} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-[11px] font-medium", accessible ? "text-cream-50" : "text-cream-100/40")}>
                        {item.title}
                      </span>
                      <span className="block text-[9px] text-cream-100/35">
                        {accessible ? item.duration : "Unlocks after purchase"} · Demo audio
                      </span>
                    </span>
                    <span className="shrink-0 text-[9px] text-cream-100/35">
                      {accessible ? (item.free ? "Free" : "Unlocked") : "Locked"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {owned ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-forest-700/15 bg-forest-50 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-forest-600" />
              <div>
                <p className="text-xs font-semibold text-forest-900">
                  {isFreeAudio(book.slug) ? "This audiobook is completely free" : "This audiobook is unlocked"}
                </p>
                <p className="text-[10px] text-muted">Listen to every chapter anytime.</p>
              </div>
            </div>
            <Button href="/books" variant="outline" size="sm">
              Browse more books
            </Button>
          </div>
        ) : (
          <div
            id="audio-unlock"
            className="overflow-hidden rounded-3xl border border-gold-500/25 bg-gradient-to-br from-cream-100 to-cream-200/70"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-2.5 py-1 text-[9px] font-semibold text-gold-300">
                  <Lock size={10} />
                  Unlock the full audiobook
                </p>
                <p className="mt-2 font-display text-lg font-bold text-forest-950">
                  {book.title}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  3 chapters · {book.audio?.duration} · buy once and listen forever
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-forest-950">
                  {formatPrice(price)}{" "}
                  <span className="text-[10px] font-normal text-muted">/ one-time</span>
                </p>

                {/* Availability of the audiobook sits in its own row. */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-2.5 py-1 text-[10px] font-medium text-forest-800">
                    <Headphones size={11} className="text-forest-600" />
                    Instant access after purchase
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-2.5 py-1 text-[10px] font-medium text-forest-800">
                    <CheckCircle2 size={11} className="text-forest-600" />
                    First chapter free
                  </span>
                </div>
              </div>
              {/* Add to cart and buy now always share a single row. */}
              <div className="w-full shrink-0 sm:w-80">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={buyNow}
                    variant="primary"
                    className="w-full"
                  >
                    <ShoppingBag size={15} />
                    Buy &amp; unlock
                  </Button>
                  <Button
                    type="button"
                    onClick={addAudioToCart}
                    variant="outline"
                    className="w-full"
                  >
                    Add to cart
                  </Button>
                </div>
                <p className="mt-2 text-center text-[9px] text-muted">
                  The audiobook unlocks automatically after checkout
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3 text-[9px] leading-relaxed text-muted">
          <strong className="text-forest-800">Demo note:</strong> The audio player
          uses demo files. Before commercial release, real TalkNest narrator audio
          will be added here. Free audio can be listened to without a cart or
          payment.
        </div>
      </div>
    </div>
  );
}
