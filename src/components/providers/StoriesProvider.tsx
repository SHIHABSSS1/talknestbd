"use client";

/**
 * Shared, API-backed story catalogue.
 *
 * Copy comes from the server (content_blocks via a cached query); the story
 * list and counts are fetched from /api/stories so the homepage, collection
 * page and admin changes all stay in sync without a browser-only store.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { accountFetch } from "@/lib/account-client";
import type { StoryView } from "@/lib/story-api";
import type { StoryCopy } from "@/lib/story-content";

type StoriesContextValue = {
  copy: StoryCopy;
  content: StoryCopy;
  stories: StoryView[];
  total: number;
  pendingCount: number;
  signedIn: boolean;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  like: (slug: string) => Promise<{ ok: boolean; message: string }>;
};

const StoriesContext = createContext<StoriesContextValue | null>(null);

export function StoriesProvider({
  initialCopy,
  children,
}: {
  initialCopy: StoryCopy;
  children: ReactNode;
}) {
  const [copy, setCopy] = useState(initialCopy);
  const [stories, setStories] = useState<StoryView[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [list, stats] = await Promise.all([
        accountFetch<{ stories: StoryView[]; total: number }>("/api/stories?limit=50"),
        accountFetch<{ pending: number }>("/api/stories/stats").catch(() => ({ pending: 0 })),
      ]);
      setStories(list.stories ?? []);
      setTotal(list.total ?? 0);
      setPendingCount(stats.pending ?? 0);
      const session = await fetch("/api/auth/get-session")
        .then((response) => response.json().catch(() => null))
        .catch(() => null);
      setSignedIn(Boolean((session as { user?: unknown } | null)?.user));
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load stories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setCopy(initialCopy);
  }, [initialCopy]);

  const like = useCallback(
    async (slug: string) => {
      try {
        const result = await accountFetch<{ ok: boolean; message: string }>(
          `/api/stories/${encodeURIComponent(slug)}/like`,
          { method: "POST" },
        );
        if (result.ok) await refresh();
        return result;
      } catch (reason) {
        return {
          ok: false,
          message: reason instanceof Error ? reason.message : "Could not update your like.",
        };
      }
    },
    [refresh],
  );

  const value = useMemo<StoriesContextValue>(
    () => ({
      copy,
      content: copy,
      stories,
      total,
      pendingCount,
      signedIn,
      loading,
      error,
      refresh,
      like,
    }),
    [copy, stories, total, pendingCount, signedIn, loading, error, refresh, like],
  );

  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>;
}

export function useStories(): StoriesContextValue {
  const context = useContext(StoriesContext);
  if (!context) throw new Error("useStories must be used within a StoriesProvider");
  return context;
}
