"use client";

import Link from "next/link";
import { Clock3, FileText, Heart, Mic, PenLine } from "lucide-react";

import { useStories } from "@/components/providers/StoriesProvider";
import type { StoryView } from "@/lib/story-api";
import { cn, formatCount } from "@/lib/utils";

const typeMeta = {
  voice: { label: "Voice story", short: "Voice", icon: Mic },
  text: { label: "Written", short: "Written", icon: PenLine },
  pdf: { label: "PDF diary", short: "PDF", icon: FileText },
} as const;

function publishedDate(value: string | null): string {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en-BD", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function StoryCard({ story, compact = false }: { story: StoryView; compact?: boolean }) {
  const { like, signedIn } = useStories();
  const meta = typeMeta[story.type];
  const Icon = meta.icon;

  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 transition-all duration-300",
        !compact && "hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-42px_rgba(10,33,24,0.5)]",
      )}
    >
      <Link href={`/stories/${story.slug}`} className="block">
        <span className="relative block aspect-[16/9] overflow-hidden bg-forest-900">
          {story.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={story.coverUrl} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${story.avatarColor}, #0e3b3f)` }}
            >
              <Icon size={30} className="text-cream-50/70" />
            </span>
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-forest-950/75 px-2.5 py-1 text-[8px] font-semibold text-gold-300 backdrop-blur">
            <Icon size={10} /> {meta.label}
          </span>
          {story.duration && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[8px] font-semibold text-ink backdrop-blur">
              <Clock3 size={9} /> {story.duration}
            </span>
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={`/stories/${story.slug}`}>
          <h3 className="font-display text-base font-bold leading-snug text-forest-950 transition-colors group-hover:text-clay-600 sm:text-lg">
            {story.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-muted">
          {story.excerpt}
        </p>
        <span className="mt-3 text-[9px] text-muted">{publishedDate(story.publishedAt)} · {story.category}</span>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
          <span className="flex min-w-0 items-center gap-2">
            {story.authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={story.authorImage} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
            ) : (
              <span
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold text-cream-50"
                style={{ backgroundColor: story.avatarColor }}
              >
                {story.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="truncate text-[9px] font-medium text-forest-900">{story.name}</span>
          </span>
          {signedIn ? (
            <button
              type="button"
              onClick={() => {
                void like(story.slug).then((result) => {
                  if (result.ok) window.dispatchEvent(new Event("talknest:story-liked"));
                });
              }}
              aria-pressed={story.likedByMe}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold transition-colors",
                story.likedByMe ? "bg-clay-500/10 text-clay-600" : "text-muted hover:bg-cream-100 hover:text-clay-600",
              )}
            >
              <Heart size={11} className={story.likedByMe ? "fill-clay-500 text-clay-500" : ""} />
              {formatCount(story.likes)}
            </button>
          ) : (
            <Link
              href={`/login?callbackUrl=/stories/${story.slug}`}
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold text-muted hover:text-clay-600"
              title="Sign in to like stories"
            >
              <Heart size={11} /> {formatCount(story.likes)}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
