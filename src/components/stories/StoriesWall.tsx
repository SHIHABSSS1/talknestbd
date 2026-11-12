"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  FileText,
  Heart,
  Mic,
  Pause,
  PenLine,
  Play,
  Share2,
  X,
} from "lucide-react";
import type { Story, StoryType } from "@/lib/types";
import { stories } from "@/data/community";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const typeMeta: Record<StoryType, { label: string; icon: typeof Mic; short: string }> = {
  voice: { label: "Voice story", icon: Mic, short: "Voice" },
  text: { label: "Written", icon: PenLine, short: "Written" },
  pdf: { label: "PDF diary", icon: FileText, short: "PDF" },
};

const filters = ["All", "Voice", "Written", "PDF"] as const;

const storyAudio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export function StoriesWall() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<Story | null>(null);
  const [playing, setPlaying] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "All") return stories;
    return stories.filter((story) => typeMeta[story.type].short === filter);
  }, [filter]);

  const toggleLike = (id: string) => {
    setLiked((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Story type
          </p>
          <div className="flex gap-1.5">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors",
                  filter === item
                    ? "border-forest-900 bg-forest-900 text-cream-50"
                    : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <Button href="/stories/share" size="sm">
          <Mic size={13} />
          Share your story
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((story) => {
          const meta = typeMeta[story.type];
          const Icon = meta.icon;
          const isLiked = liked[story.id];
          return (
            <article
              key={story.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-42px_rgba(10,33,24,0.5)]"
            >
              <div className="relative flex items-center justify-between gap-2 border-b border-forest-900/8 bg-cream-100/50 px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-2.5 py-1 text-[8px] font-semibold text-gold-300">
                  <Icon size={10} />
                  {meta.label}
                </span>
                <span className="flex items-center gap-1 text-[8px] text-muted">
                  {story.duration && (
                    <>
                      <Clock3 size={9} />
                      {story.duration}
                      <span className="mx-0.5">·</span>
                    </>
                  )}
                  {story.date}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActive(story);
                  setPlaying(false);
                }}
                className="flex flex-1 flex-col p-4 text-left sm:p-5"
              >
                <h3 className="font-display text-base font-bold leading-snug text-forest-950 transition-colors group-hover:text-clay-600 sm:text-lg">
                  {story.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-muted">
                  {story.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[9px] font-semibold text-clay-600">
                  {story.type === "voice" ? "Listen to this story" : story.type === "pdf" ? "View diary" : "Read story"}
                  <ArrowUpRight size={11} />
                </span>
              </button>

              <div className="flex items-center justify-between gap-2 border-t border-forest-900/8 px-4 py-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold text-cream-50"
                    style={{ backgroundColor: story.avatarColor }}
                  >
                    {story.name.charAt(0)}
                  </span>
                  <span className="truncate text-[9px] font-medium text-forest-900">{story.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleLike(story.id)}
                  aria-pressed={isLiked}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold transition-colors",
                    isLiked ? "bg-clay-500/10 text-clay-600" : "text-muted hover:bg-cream-100 hover:text-clay-600",
                  )}
                >
                  <Heart size={11} className={isLiked ? "fill-clay-500 text-clay-500" : ""} />
                  {toBn(story.likes + (isLiked ? 1 : 0))}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              setActive(null);
              setPlaying(false);
            }}
            className="absolute inset-0 h-full w-full bg-forest-950/80 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream-50 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-forest-900/8 bg-cream-100/50 p-4 sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-xs font-bold text-cream-50"
                  style={{ backgroundColor: active.avatarColor }}
                >
                  {active.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-clay-500">
                    {typeMeta[active.type].label} · {active.date}
                  </p>
                  <h3 className="truncate font-display text-base font-bold text-forest-950">{active.title}</h3>
                  <p className="text-[9px] text-muted">{active.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActive(null);
                  setPlaying(false);
                }}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-forest-900/10 text-forest-800 hover:bg-cream-100"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5">
              {active.type === "voice" && (
                <div className="rounded-2xl bg-forest-950 p-4 text-cream-50">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPlaying((value) => !value)}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-500 text-forest-950"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <Pause size={17} className="fill-forest-950" /> : <Play size={17} className="ml-0.5 fill-forest-950" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold">Voice story · Demo audio</p>
                      <p className="text-[8px] text-cream-100/45">
                        {active.duration ?? "03:48"} · SoundHelix demo track
                      </p>
                      <div className="mt-2 flex h-5 items-center gap-[2px]">
                        {[40, 70, 50, 85, 55, 75, 45, 90, 60, 70, 48, 82, 44, 65, 38, 78].map((height, index) => (
                          <span
                            key={index}
                            className={cn("flex-1 rounded-full", playing ? "animate-pulse bg-gold-400/70" : "bg-gold-400/35")}
                            style={{ height: `${height}%`, animationDelay: `${index * 60}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {playing && (
                    <audio autoPlay controls src={storyAudio} className="mt-3 h-8 w-full">
                      Your browser does not support audio playback.
                    </audio>
                  )}
                </div>
              )}

              {active.type === "pdf" && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-clay-500/20 bg-clay-500/5 px-3 py-2.5 text-[9px] text-clay-600">
                  <FileText size={13} />
                  Demo PDF diary — the text below is the first part of the diary
                </div>
              )}

              <p className="mt-3 text-[12px] leading-[1.9] text-forest-900/75 sm:text-[13px]">
                {active.excerpt}
              </p>
              <p className="mt-2 text-[12px] leading-[1.9] text-forest-900/65">
                The rest of this story is being prepared to share with the reader
                community. Stories published on TalkNest come from readers&apos; own
                experiences — a mix of true events and imagination.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
                <button
                  type="button"
                  onClick={() => toggleLike(active.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-colors",
                    liked[active.id] ? "bg-clay-500/10 text-clay-600" : "bg-cream-100 text-forest-800 hover:text-clay-600",
                  )}
                >
                  <Heart size={12} className={liked[active.id] ? "fill-clay-500 text-clay-500" : ""} />
                  {toBn(active.likes + (liked[active.id] ? 1 : 0))} readers loved this
                </button>
                <Link
                  href="/stories/share"
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-forest-800 hover:text-clay-600"
                >
                  <Share2 size={12} /> Share your story too
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
