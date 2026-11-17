"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Play,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import type { TalkVideo } from "@/lib/types";
import { quizQuestions, videos } from "@/data/community";
import { cn, toBn } from "@/lib/utils";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { QuizGame } from "@/components/quiz/QuizGame";
import { CommentThread } from "@/components/community/CommentThread";

const WATCHED_KEY = "talknestbd-watched-videos-v1";

export function WatchQuiz({ mode = "home" }: { mode?: "home" | "page" }) {
  const [watched, setWatched] = useState<string[]>([]);
  const [player, setPlayer] = useState<TalkVideo | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const fullPage = mode === "page";

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(WATCHED_KEY) ?? "[]");
      if (Array.isArray(stored)) {
        setWatched(
          stored.filter(
            (id): id is string =>
              typeof id === "string" && videos.some((video) => video.id === id),
          ),
        );
      }
    } catch {
      // A malformed demo key should never block the section.
    }
  }, []);

  useEffect(() => {
    if (watched.length === 0) return;
    try {
      window.localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
    } catch {
      // Storage can be unavailable in private browsing.
    }
  }, [watched]);

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

  const openVideo = (video: TalkVideo) => {
    setPlayer(video);
    setWatched((previous) =>
      previous.includes(video.id) ? previous : [...previous, video.id],
    );
  };

  const takeQuiz = () => {
    setPlayer(null);
    window.setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const progress = Math.round((watched.length / videos.length) * 100);
  const allWatched = watched.length === videos.length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle
          eyebrow="Watch & Quiz"
          title={
            fullPage
              ? "Watch an episode, then take the quiz."
              : "Many videos. One quiz waiting below."
          }
          description={
            fullPage
              ? "Pick an episode from the shelf, watch it without leaving this page, then scroll down to the quiz. Six conversations, six questions — a tea-break challenge for readers."
              : "Pick an episode from the shelf, watch it without leaving the page, then scroll down to the quiz. Six conversations, six questions — a tea-break challenge for readers."
          }
        />
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[10px] font-semibold text-brand-700">
            <CheckCircle2 size={12} />
            {toBn(watched.length)} of {toBn(videos.length)} episodes watched
          </span>
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-brand-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3">
        {videos.map((video) => {
          const isWatched = watched.includes(video.id);
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => openVideo(video)}
              className="group flex flex-col overflow-hidden rounded-[8px] border border-line bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-shadow"
              aria-label={`Watch ${video.title}`}
            >
              <span className="relative block aspect-video overflow-hidden bg-brand-950">
                <img
                  src={video.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent" />
                <span className="absolute left-2 top-2 rounded-full bg-brand-950/70 px-2 py-0.5 text-[8px] font-semibold tracking-wide text-gold-300 backdrop-blur">
                  EP {toBn(video.episode)}
                </span>
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[8px] font-semibold text-ink backdrop-blur">
                  <Clock3 size={9} />
                  {video.duration}
                </span>
                <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand-700 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11">
                  <Play size={16} className="ml-0.5 fill-current" />
                </span>
                {isWatched && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-forest-900/90 px-2 py-0.5 text-[8px] font-semibold text-white backdrop-blur">
                    <CheckCircle2 size={9} className="text-gold-300" />
                    Watched
                  </span>
                )}
              </span>
              <span className="flex flex-1 flex-col p-2.5">
                <span className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-clay-500">
                  {video.category}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[11.5px] font-semibold leading-snug text-ink transition-colors group-hover:text-brand-700 sm:text-[12.5px]">
                  {video.title}
                </span>
                <span className="mt-1.5 flex items-center gap-1 text-[9px] text-muted">
                  <Play size={8} className="fill-current" />
                  {video.host} · {video.views} views
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={quizRef}
        id="watch-quiz"
        className={cn(
          "mt-7 scroll-mt-[88px] rounded-[8px] border border-brand-100 bg-brand-50/70 p-3.5 sm:p-5",
          fullPage && "mt-6",
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-700">
              <Trophy size={10} className="text-sale" />
              The quiz below the videos
            </span>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
              Now that you have watched, how much stuck?
            </h3>
            <p className="mt-1 max-w-xl text-[11.5px] leading-relaxed text-muted sm:text-xs">
              Every answer comes with a short explanation, so a wrong guess still
              teaches you something. The quiz stays open to everyone — watching first
              just makes it more fun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-2.5 py-1.5 text-[9.5px] font-medium text-body">
              <CircleHelp size={11} className="text-brand-600" />
              {toBn(quizQuestions.length)} questions
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-2.5 py-1.5 text-[9.5px] font-medium text-body">
              <Clock3 size={11} className="text-brand-600" />
              2 minutes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-2.5 py-1.5 text-[9.5px] font-medium text-body">
              <Trophy size={11} className="text-gold-600" />
              Score + title
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[6px] border border-brand-100 bg-white/80 px-3 py-2">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink">
            <Sparkles size={12} className="text-gold-500" />
            {allWatched
              ? "Shelf complete — you have watched every episode."
              : `${toBn(watched.length)}/${toBn(videos.length)} episodes watched so far`}
          </span>
          <Link
            href={fullPage ? "/quiz?tab=book" : "/quiz?tab=watch"}
            className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:text-brand-800"
          >
            {fullPage ? "Open Book Quiz" : "Full quiz page"}
            <ArrowUpRight size={11} />
          </Link>
        </div>

        <div className="mt-3 rounded-[8px] border border-line bg-white p-3 shadow-[0_18px_46px_-40px_rgba(8,42,82,0.55)] sm:p-5">
          <QuizGame label="Episode quiz" />
        </div>

        <div className="mt-3">
          <CommentThread target="quiz" title="Quiz discussion" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[9px] text-muted">
          Demo videos play from YouTube. Watching is tracked only in this browser.
        </p>
        <Button href="/video" variant="ghost" size="sm">
          Browse the full episode library
          <ArrowRight size={13} />
        </Button>
      </div>

      {player && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <button
            type="button"
            aria-label="Close video"
            onClick={() => setPlayer(null)}
            className="absolute inset-0 h-full w-full bg-brand-950/85 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={player.title}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[8px] bg-brand-950 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
              <div className="min-w-0">
                <p className="text-[8.5px] uppercase tracking-[0.16em] text-gold-400">
                  TalkNest Video · EP {toBn(player.episode)}
                </p>
                <h3 className="truncate font-display text-sm font-semibold sm:text-base">
                  {player.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPlayer(null)}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
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

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="text-[9px] text-white/45">
                Host: {player.host} · Demo video, loaded from YouTube
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${player.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[10px] font-semibold text-white/75 transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  Watch on YouTube
                  <ArrowUpRight size={11} />
                </a>
                <button
                  type="button"
                  onClick={takeQuiz}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-full bg-gold-500 px-3.5",
                    "text-[10px] font-semibold text-forest-950 transition-colors hover:bg-gold-400",
                  )}
                >
                  Take the quiz below
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>

            <div className="px-3 pb-3 sm:px-4">
              <CommentThread
                target="video"
                title={`Comments · ${player.title}`}
                compact
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
