"use client";

import { useCallback, useEffect, useState } from "react";
import { Mic, Search } from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { StoryCard } from "@/components/stories/StoryCard";
import { Button } from "@/components/ui/Button";
import type { StoryView } from "@/lib/story-api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;
const types = ["All", "Voice", "Written", "PDF"] as const;
const sorts = [
  { key: "latest", label: "Latest" },
  { key: "popular", label: "Most loved" },
  { key: "oldest", label: "Oldest" },
] as const;

/** API-driven story collection with server-side search, filters and pagination. */
export function StoriesWall() {
  const [stories, setStories] = useState<StoryView[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [type, setType] = useState<string>("All");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<string>("latest");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    accountFetch<{ categories: string[] }>("/api/stories/categories")
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
        sort,
      });
      if (type !== "All") params.set("type", type === "Written" ? "text" : type.toLowerCase());
      if (category) params.set("category", category);
      if (search) params.set("q", search);
      const data = await accountFetch<{ stories: StoryView[]; total: number }>(`/api/stories?${params}`);
      setStories(data.stories ?? []);
      setTotal(data.total ?? 0);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load stories.");
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [offset, sort, type, category, search]);

  useEffect(() => {
    void load();
  }, [load]);

  // Likes change the "most loved" order; keep both the collection and homepage fresh.
  useEffect(() => {
    const onLiked = () => void load();
    window.addEventListener("talknest:story-liked", onLiked);
    return () => window.removeEventListener("talknest:story-liked", onLiked);
  }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            Story collection
          </p>
          <p className="mt-0.5 text-[11px] text-muted">{total} published {total === 1 ? "story" : "stories"}</p>
        </div>
        <Button href="/stories/share" size="sm">
          <Mic size={13} /> Share your story
        </Button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setOffset(0);
          setSearch(query.trim());
        }}
        className="mt-4 grid gap-2 sm:grid-cols-[1fr_170px_150px]"
      >
        <label className="relative block">
          <span className="sr-only">Search stories</span>
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, author or excerpt…"
            className="h-9 w-full rounded-full border border-line bg-white pl-8 pr-3 text-[11px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none"
          />
        </label>
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(event) => { setCategory(event.target.value); setOffset(0); }}
          className="h-9 rounded-full border border-line bg-white px-3 text-[11px] text-ink"
        >
          <option value="">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select
          aria-label="Sort stories"
          value={sort}
          onChange={(event) => { setSort(event.target.value); setOffset(0); }}
          className="h-9 rounded-full border border-line bg-white px-3 text-[11px] text-ink"
        >
          {sorts.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </form>

      <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {types.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => { setType(item); setOffset(0); }}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors",
              type === item
                ? "border-forest-900 bg-forest-900 text-cream-50"
                : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 rounded-lg bg-clay-500/5 px-3 py-2 text-[11px] text-clay-600">{error}</p>}

      {loading ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-80 animate-pulse rounded-3xl bg-cream-100" />
          ))}
        </div>
      ) : stories.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => <StoryCard key={story.id} story={story} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-forest-900/15 bg-white/60 px-4 py-12 text-center">
          <p className="text-sm font-semibold text-forest-900">No stories found</p>
          <p className="mt-1 text-[11px] text-muted">Try another search or filter — or be the first to share.</p>
          <Button href="/stories/share" size="sm" className="mt-4">Share your story</Button>
        </div>
      )}

      {total > PAGE_SIZE && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={offset === 0}
            onClick={() => setOffset((value) => Math.max(0, value - PAGE_SIZE))}
            className="rounded-full border border-line bg-white px-4 py-2 text-[10px] font-semibold text-ink disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-[10px] text-muted">
            {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </span>
          <button
            type="button"
            disabled={offset + PAGE_SIZE >= total}
            onClick={() => setOffset((value) => value + PAGE_SIZE)}
            className="rounded-full border border-line bg-white px-4 py-2 text-[10px] font-semibold text-ink disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
