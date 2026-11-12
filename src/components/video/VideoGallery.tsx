"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Eye,
  Mic2,
  Play,
  Radio,
  X,
} from "lucide-react";
import type { TalkVideo } from "@/lib/types";
import { videos as allVideos } from "@/data/community";
import { siteConfig, cn, toBn } from "@/lib/utils";
import { YouTubeIcon } from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/Button";

export function VideoGallery() {
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<TalkVideo>(
    allVideos.find((video) => video.featured) ?? allVideos[0],
  );
  const [player, setPlayer] = useState<TalkVideo | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(allVideos.map((video) => video.category)))],
    [],
  );
  const filtered = useMemo(
    () =>
      category === "All"
        ? allVideos
        : allVideos.filter((video) => video.category === category),
    [category],
  );

  useEffect(() => {
    if (!player) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPlayer(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [player]);

  const play = (video: TalkVideo) => {
    setActive(video);
    setPlayer(video);
  };

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2rem] bg-forest-950 text-cream-50">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-[0.08]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full border border-gold-400/15"
        />
        <div className="relative grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                <Radio size={11} />
                TalkNest Podcast
              </span>
              <span className="inline-flex items-center gap-1.5 text-[9px] text-cream-100/45">
                <span className="h-1.5 w-1.5 rounded-full bg-clay-400" />
                New episode every Thursday
              </span>
            </div>

            <button
              type="button"
              onClick={() => play(active)}
              className="group relative mt-4 block w-full overflow-hidden rounded-[1.5rem] border border-white/10 text-left"
              aria-label={`Play ${active.title}`}
            >
              <div className="aspect-video w-full">
                <img
                  src={active.thumbnail}
                  alt={active.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/15 to-forest-950/10" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5 sm:p-4">
                <span className="rounded-full bg-forest-950/70 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-gold-300 backdrop-blur">
                  EP {toBn(active.episode)}
                </span>
                <span className="rounded-full bg-cream-50/90 px-2.5 py-1 text-[9px] font-semibold text-forest-950 backdrop-blur">
                  {active.duration}
                </span>
              </div>
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-500 text-forest-950 shadow-2xl transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                <Play size={28} className="ml-1 fill-forest-950" />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-300">
                  {active.category}
                </p>
                <h2 className="mt-1 max-w-2xl font-display text-xl font-bold leading-snug sm:text-2xl lg:text-[1.7rem]">
                  {active.title}
                </h2>
              </div>
            </button>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/20 font-display text-sm font-bold text-gold-300">
                  {active.host.charAt(0)}
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-cream-50">{active.host}</p>
                  <p className="flex items-center gap-2 text-[9px] text-cream-100/40">
                    <span className="flex items-center gap-1">
                      <Eye size={10} /> {active.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={10} /> {active.duration}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => play(active)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold-500 px-4 text-[11px] font-semibold text-forest-950 transition-colors hover:bg-gold-400"
                >
                  <Play size={13} className="fill-forest-950" />
                  Watch on YouTube
                </button>
                <a
                  href={siteConfig.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-[11px] font-semibold text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  <YouTubeIcon size={14} />
                  Subscribe
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-base font-bold text-cream-50">
                Episode queue
              </h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-medium text-cream-100/50">
                {toBn(allVideos.length)} episodes
              </span>
            </div>
            <div className="no-scrollbar mt-3 max-h-[430px] space-y-1.5 overflow-y-auto pr-1">
              {allVideos.map((video) => {
                const isActive = video.id === active.id;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => play(video)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors",
                      isActive
                        ? "border-gold-400/25 bg-gold-500/10"
                        : "border-transparent hover:bg-white/5",
                    )}
                  >
                    <span className="relative block h-12 w-20 shrink-0 overflow-hidden rounded-md">
                      <img
                        src={video.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-forest-950/35">
                        <Play size={12} className="fill-cream-50 text-cream-50" />
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-[10px] font-semibold text-cream-50">
                        {video.title}
                      </span>
                      <span className="mt-0.5 block text-[8px] text-cream-100/40">
                        EP {toBn(video.episode)} · {video.duration}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
              <span className="h-px w-5 bg-clay-500/50" />
              All Episodes
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
              All podcasts & videos
            </h2>
          </div>
          <div className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors",
                  category === item
                    ? "border-forest-900 bg-forest-900 text-cream-50"
                    : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => play(video)}
              className="group overflow-hidden rounded-2xl border border-forest-900/8 bg-cream-50 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-38px_rgba(10,33,24,0.5)]"
            >
              <span className="relative block aspect-video overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-forest-950/65 via-transparent to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream-50/95 text-forest-950 shadow-lg transition-transform group-hover:scale-110">
                  <Play size={16} className="ml-0.5 fill-forest-950" />
                </span>
                <span className="absolute right-2.5 top-2.5 rounded-full bg-forest-950/70 px-2 py-0.5 text-[8px] font-semibold text-cream-50 backdrop-blur">
                  {video.duration}
                </span>
                <span className="absolute bottom-2.5 left-2.5 rounded-full bg-gold-500 px-2 py-0.5 text-[8px] font-semibold text-forest-950">
                  EP {toBn(video.episode)}
                </span>
              </span>
              <span className="block p-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-clay-500">
                  {video.category}
                </span>
                <span className="mt-1 block line-clamp-2 font-display text-sm font-semibold leading-snug text-forest-950 sm:text-base">
                  {video.title}
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 border-t border-forest-900/8 pt-2.5 text-[9px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <Mic2 size={11} />
                    {video.host}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={10} />
                    {video.views}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-5 py-4 sm:flex-row">
          <p className="text-center text-xs text-forest-800/70 sm:text-left">
            Subscribe to our YouTube channel so you never miss a new episode.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={siteConfig.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-clay-500 px-4 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-clay-600"
            >
              <YouTubeIcon size={14} />
              YouTube channel
            </a>
            <Button href="/stories" variant="outline" size="sm">
              Reader stories
              <ArrowUpRight size={13} />
            </Button>
          </div>
        </div>
      </section>

      {player && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setPlayer(null)}
            className="absolute inset-0 h-full w-full bg-forest-950/80 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={player.title}
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-forest-950 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.16em] text-gold-400">
                  TalkNest Podcast · EP {toBn(player.episode)}
                </p>
                <h3 className="truncate font-display text-sm font-semibold text-cream-50">
                  {player.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPlayer(null)}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-cream-50 transition-colors hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${player.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={player.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[9px] text-cream-100/45">
              <span>Host: {player.host} · Demo video, loaded from YouTube</span>
              <Link
                href={siteConfig.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-gold-300 hover:text-gold-400"
              >
                <YouTubeIcon size={12} />
                Watch on YouTube
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
