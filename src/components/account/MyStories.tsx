"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, FileText, Mic, PenLine, Trash2 } from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import type { StoryView } from "@/lib/story-api";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "bg-gold-500/15 text-gold-700",
  published: "bg-forest-100 text-forest-800",
  rejected: "bg-clay-500/10 text-clay-700",
  draft: "bg-cream-200 text-muted",
};

export function MyStories() {
  const [stories, setStories] = useState<StoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = () => {
    setLoading(true);
    accountFetch<{ stories: StoryView[] }>("/api/stories/mine")
      .then((data) => setStories(data.stories ?? []))
      .catch((reason) => setNotice(reason instanceof Error ? reason.message : "Could not load your stories."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const withdraw = async (slug: string) => {
    if (!window.confirm("Withdraw this submission?")) return;
    try {
      const result = await accountFetch<{ ok: boolean; message: string }>(
        `/api/stories/${encodeURIComponent(slug)}`,
        { method: "DELETE" },
      );
      setNotice(result.message);
      if (result.ok) load();
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : "Could not withdraw the story.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">My stories</h1>
          <p className="mt-1 text-[12px] text-muted">Track your submissions and read published stories.</p>
        </div>
        <Link href="/stories/share" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
          <PenLine size={13} /> Share a story
        </Link>
      </div>

      {notice && <p role="status" className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-[11px] text-brand-800">{notice}</p>}

      {loading ? (
        <div className="space-y-2" aria-hidden="true">
          {[0, 1].map((item) => <div key={item} className="h-20 animate-pulse rounded-[10px] bg-white" />)}
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-line bg-white p-8 text-center">
          <p className="text-[12px] font-semibold text-ink">You have not shared a story yet.</p>
          <p className="mt-1 text-[11px] text-muted">Your memories, voice and diaries are welcome here.</p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {stories.map((story) => {
            const Icon = story.type === "voice" ? Mic : story.type === "pdf" ? FileText : PenLine;
            return (
              <div key={story.id} className="flex flex-wrap items-center gap-3 rounded-[10px] border border-line bg-white p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[12px] font-semibold text-ink">{story.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-muted">{story.excerpt}</p>
                  <p className="mt-1 flex items-center gap-1 text-[9px] text-muted">
                    <Clock3 size={9} /> {new Date(story.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-[9px] font-semibold capitalize", statusStyles[story.status] ?? statusStyles.draft)}>
                  {story.status}
                </span>
                <div className="flex items-center gap-2">
                  {story.status === "published" && (
                    <Link href={`/stories/${story.slug}`} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline">
                      Read <ArrowUpRight size={11} />
                    </Link>
                  )}
                  {story.status !== "published" && (
                    <button type="button" onClick={() => void withdraw(story.slug)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-clay-600 hover:underline">
                      <Trash2 size={11} /> Withdraw
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
