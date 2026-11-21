"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, Eye, Mic2, Play } from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { CommentThread } from "@/components/community/CommentThread";
import { Container } from "@/components/ui/Container";
import type { VideoView } from "@/lib/video-quiz-api";
import { youtubeWatchUrl } from "@/lib/youtube";
import { toBn } from "@/lib/utils";

export function VideoDetailContent({ slug }: { slug: string }) {
  const [video, setVideo] = useState<VideoView | null>(null);
  const [related, setRelated] = useState<VideoView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      accountFetch<{ video: VideoView }>(`/api/videos/${encodeURIComponent(slug)}`),
      accountFetch<{ videos: VideoView[] }>("/api/videos"),
    ])
      .then(([detail, list]) => {
        if (!active) return;
        setVideo(detail.video);
        setRelated(list.videos.filter((item) => item.id !== detail.video.id).slice(0, 3));
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Could not load this episode.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="py-12">
        <Container>
          <div className="h-96 animate-pulse rounded-[10px] bg-white" aria-hidden="true" />
        </Container>
      </section>
    );
  }

  if (error || !video) {
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg rounded-[10px] border border-line bg-white p-8 text-center">
            <h1 className="font-display text-xl font-bold text-ink">Episode not found</h1>
            <p className="mt-1 text-[12px] text-muted">{error || "This episode may have been unpublished."}</p>
            <Link href="/video" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-700 hover:underline">
              <ArrowLeft size={13} /> Back to all videos
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-line bg-forest-950 py-8 text-cream-50 sm:py-10">
        <Container>
          <Link href="/video" className="inline-flex items-center gap-1.5 text-[10px] font-medium text-cream-100/60 hover:text-gold-300">
            <ArrowLeft size={13} /> All episodes
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-gold-300">
            <span>{video.category}</span>
            <span className="text-cream-100/30">·</span>
            <span>Episode {toBn(video.episode)}</span>
          </div>
          <h1 className="mt-2 max-w-3xl font-display text-2xl font-bold leading-snug sm:text-4xl">
            {video.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-cream-100/60">
            <span className="inline-flex items-center gap-1.5"><Mic2 size={12} /> {video.host}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={12} /> {video.duration}</span>
            <span className="inline-flex items-center gap-1.5"><Eye size={12} /> {video.views} views</span>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-[10px] border border-line bg-black shadow-[0_24px_60px_-56px_rgba(8,42,82,0.55)]">
                <div className="aspect-video w-full"><VideoPlayer video={video} autoplay={false} /></div>
              </div>
              <div className="rounded-[10px] border border-line bg-white p-5">
                <h2 className="font-display text-lg font-bold text-ink">About this episode</h2>
                <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-body">
                  {video.description || "No description has been added for this episode yet."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {video.youtubeId && (
                    <a
                      href={youtubeWatchUrl(video.youtubeId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[10px] font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
                    >
                      <Play size={12} /> Watch on YouTube
                    </a>
                  )}
                  <Link href="/quiz?tab=watch" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-600 px-4 text-[10px] font-semibold text-white hover:bg-brand-700">
                    Take the quiz <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
              <CommentThread target="video" targetId={video.id} title={`Discussion · ${video.title}`} />
            </div>

            <aside className="space-y-3 lg:sticky lg:top-[88px]">
              <div className="rounded-[10px] border border-line bg-white p-4">
                <h2 className="font-display text-sm font-bold text-ink">More episodes</h2>
                <div className="mt-3 space-y-2">
                  {related.length ? (
                    related.map((item) => (
                      <Link key={item.id} href={`/videos/${item.slug}`} className="flex items-center gap-2.5 rounded-lg border border-line/70 p-2 hover:border-brand-300">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded bg-forest-900">
                          {item.thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-[10px] font-semibold text-ink">{item.title}</span>
                          <span className="mt-0.5 block text-[8px] text-muted">EP {toBn(item.episode)} · {item.duration}</span>
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-[10px] text-muted">No other episodes yet.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
