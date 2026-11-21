"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Heart,
  Mic,
  PenLine,
  Share2,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useStories } from "@/components/providers/StoriesProvider";
import { StoryCard } from "@/components/stories/StoryCard";
import { Container } from "@/components/ui/Container";
import type { StoryView } from "@/lib/story-api";
import { cn, formatCount } from "@/lib/utils";

const typeLabels = {
  voice: { label: "Voice story", icon: Mic },
  text: { label: "Written story", icon: PenLine },
  pdf: { label: "PDF diary", icon: FileText },
} as const;

function formatDate(value: string | null) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function StoryDetailContent({ slug }: { slug: string }) {
  const { like, signedIn } = useStories();
  const [story, setStory] = useState<StoryView | null>(null);
  const [related, setRelated] = useState<StoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [slug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      accountFetch<{ story: StoryView }>(`/api/stories/${encodeURIComponent(slug)}`),
      accountFetch<{ stories: StoryView[] }>("/api/stories?limit=4").catch(() => ({ stories: [] })),
    ])
      .then(([detail, list]) => {
        if (!active) return;
        setStory(detail.story);
        setRelated(list.stories.filter((item) => item.id !== detail.story.id).slice(0, 3));
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Could not load this story.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice("Could not copy the link — copy it from the address bar.");
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <Container>
          <div className="mx-auto h-96 max-w-4xl animate-pulse rounded-[10px] bg-white" aria-hidden="true" />
        </Container>
      </section>
    );
  }

  if (error || !story) {
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg rounded-[10px] border border-line bg-white p-8 text-center">
            <h1 className="font-display text-xl font-bold text-ink">Story not found</h1>
            <p className="mt-1 text-[12px] text-muted">{error || "This story is not published or may have been removed."}</p>
            <Link href="/stories" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-700 hover:underline">
              <ArrowLeft size={13} /> Back to all stories
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const meta = typeLabels[story.type];
  const TypeIcon = meta.icon;
  const assetBase = `/api/stories/${encodeURIComponent(story.slug)}/asset`;

  return (
    <>
      <section className="border-b border-line bg-forest-950 py-8 text-cream-50 sm:py-12">
        <Container>
          <Link href="/stories" className="inline-flex items-center gap-1.5 text-[10px] font-medium text-cream-100/60 hover:text-gold-300">
            <ArrowLeft size={13} /> All stories
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                <TypeIcon size={11} /> {meta.label}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{story.title}</h1>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-cream-100/70">{story.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px] text-cream-100/60">
                <span className="flex items-center gap-2">
                  {story.authorImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.authorImage} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-cream-50" style={{ backgroundColor: story.avatarColor }}>
                      {story.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="font-semibold text-cream-50">{story.name}</span>
                </span>
                <span>{formatDate(story.publishedAt)}</span>
                <span>{story.category}</span>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-forest-900">
              {story.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(135deg, ${story.avatarColor}, #0e3b3f)` }}>
                  <TypeIcon size={48} className="text-cream-50/60" />
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1fr_290px] lg:items-start">
            <div className="min-w-0 space-y-5">
              {story.hasAudio && (
                <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-forest-950">
                    <Mic size={14} className="text-clay-500" /> Listen to this story
                  </p>
                  <audio
                    controls
                    preload="metadata"
                    src={`${assetBase}?kind=audio`}
                    className="mt-3 w-full"
                  >
                    Your browser does not support audio playback.
                  </audio>
                  {story.duration && <p className="mt-1 flex items-center gap-1 text-[9px] text-muted"><Clock3 size={10} /> {story.duration}</p>}
                </div>
              )}

              {story.hasPdf && (
                <div className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
                  <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
                    <FileText size={15} className="text-clay-600" />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-forest-950">
                      {story.attachmentName || "Story PDF"}
                    </span>
                    <a
                      href={`${assetBase}?kind=pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1.5 text-[9px] font-semibold text-ink hover:border-brand-300"
                    >
                      <ExternalLink size={11} /> Open
                    </a>
                    <a
                      href={`${assetBase}?kind=pdf`}
                      download={story.attachmentName || "story.pdf"}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1.5 text-[9px] font-semibold text-ink hover:border-brand-300"
                    >
                      <Download size={11} /> Download
                    </a>
                  </div>
                  <iframe
                    src={`${assetBase}?kind=pdf#toolbar=1&navpanes=0`}
                    title={`PDF reader: ${story.title}`}
                    className="h-[70vh] w-full bg-white sm:h-[75vh]"
                  />
                  <p className="border-t border-line px-4 py-2 text-[9px] text-muted">
                    Use the viewer toolbar to move between pages and zoom. The document opens inline — no download needed.
                  </p>
                </div>
              )}

              <article className="rounded-3xl border border-forest-900/8 bg-white p-5 sm:p-7">
                <h2 className="font-display text-lg font-bold text-forest-950">The story</h2>
                <p className="mt-3 whitespace-pre-line text-[13px] leading-[1.9] text-forest-900/80 sm:text-[14px]">
                  {story.body || story.excerpt}
                </p>
                <p className="mt-5 border-t border-line pt-4 text-[10px] leading-relaxed text-muted">
                  Stories published on TalkNest come from readers&apos; own experiences — a mix of
                  true events and imagination. Every story belongs to its author.
                </p>
              </article>
            </div>

            <aside className="space-y-3 lg:sticky lg:top-[88px]">
              <div className="rounded-3xl border border-line bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-clay-500">
                  Enjoyed this story?
                </p>
                {signedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      void like(story.slug).then((result) => setNotice(result.message));
                    }}
                    aria-pressed={story.likedByMe}
                    className={cn(
                      "mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-[11px] font-semibold transition-colors",
                      story.likedByMe
                        ? "bg-clay-500/12 text-clay-700"
                        : "bg-forest-900 text-gold-300 hover:bg-forest-800",
                    )}
                  >
                    <Heart size={14} className={story.likedByMe ? "fill-clay-500 text-clay-600" : ""} />
                    {formatCount(story.likes)} {story.likedByMe ? "liked" : "likes"} this story
                  </button>
                ) : (
                  <Link
                    href={`/login?callbackUrl=/stories/${story.slug}`}
                    className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-forest-900 text-[11px] font-semibold text-gold-300"
                  >
                    <Heart size={14} /> Sign in to like · {formatCount(story.likes)}
                  </Link>
                )}
                <p aria-live="polite" className="mt-2 min-h-3 text-center text-[9px] text-brand-700">{notice}</p>

                <div className="mt-4 border-t border-line pt-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold text-forest-950">
                    <Share2 size={12} /> Share this story
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void copyLink()}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[9px] font-semibold text-ink hover:border-brand-300"
                    >
                      {copied ? <Check size={11} className="text-forest-600" /> : <Copy size={11} />}
                      {copied ? "Copied" : "Copy link"}
                    </button>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[9px] font-semibold text-ink hover:border-brand-300"
                    >
                      Facebook <ArrowUpRight size={10} />
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${story.title} — ${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[9px] font-semibold text-ink hover:border-brand-300"
                    >
                      WhatsApp <ArrowUpRight size={10} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-forest-950 p-4 text-cream-50">
                <PenLine size={17} className="text-gold-400" />
                <h2 className="mt-1.5 font-display text-base font-bold">Have a story of your own?</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-cream-100/60">
                  Write it, record it or upload a PDF. Signed-in readers can share with our community.
                </p>
                <Link href="/stories/share" className="mt-3 inline-flex h-8 items-center rounded-full bg-gold-500 px-3.5 text-[9px] font-semibold text-forest-950 hover:bg-gold-400">
                  Share your story
                </Link>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="font-display text-xl font-bold text-forest-950">More reader stories</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => <StoryCard key={item.id} story={item} compact />)}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
