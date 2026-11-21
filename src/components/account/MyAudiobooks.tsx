"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Headphones } from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { BookCover } from "@/components/books/BookCover";
import { toBookFromAudio, type AudioBookView } from "@/lib/audio-api";

/** Purchased/unlocked audiobooks for the signed-in reader. */
export function MyAudiobooks() {
  const [rows, setRows] = useState<AudioBookView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    accountFetch<{ audiobooks: AudioBookView[] }>("/api/account/audiobooks")
      .then((data) => {
        if (alive) setRows(data.audiobooks ?? []);
      })
      .catch((reason: unknown) => {
        if (alive) {
          setError(reason instanceof Error ? reason.message : "Could not load your audiobooks.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-ink">My audiobooks</h2>
        <p className="mt-1 text-[12px] text-muted">
          Every title you purchased — listen anytime from your library.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-clay-500/30 bg-clay-500/10 p-3 text-[11px] text-clay-600">
          {error}
        </p>
      )}
      {loading && (
        <p className="rounded-xl border border-line bg-white p-8 text-center text-[11px] text-muted">
          Loading your audiobooks…
        </p>
      )}
      {!loading && !error && rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <Headphones size={22} className="mx-auto text-muted/50" />
          <p className="mt-2 text-sm font-semibold text-ink">No audiobooks yet</p>
          <p className="mt-1 text-[11px] text-muted">
            Unlocked titles appear here right after checkout.
          </p>
          <Link href="/audio-books" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[11px] font-semibold text-white">
            Browse audiobooks <ArrowRight size={13} />
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <Link
            key={row.id}
            href={`/audio-books/${row.slug}`}
            className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 transition-colors hover:border-brand-300"
          >
            <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md">
              <BookCover book={toBookFromAudio(row)} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-ink">{row.title}</p>
              <p className="truncate text-[10px] text-muted">{row.author} · {row.narrator}</p>
              <p className="mt-1 flex items-center gap-1 text-[9px] text-forest-700">
                <CheckCircle2 size={10} /> Unlocked · {row.chapters.length} chapters
              </p>
            </div>
            <ArrowRight size={14} className="shrink-0 text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
