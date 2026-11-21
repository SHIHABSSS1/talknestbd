"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  resetReviewContent,
  saveReviewContent,
} from "@/lib/actions/reviews";
import { useSession } from "@/lib/auth-client";
import {
  cloneReviewDefaults,
  type ReviewContent,
  type SaveResult,
} from "@/lib/review-content";
import type { Review } from "@/lib/types";

interface ReviewsContextValue {
  content: ReviewContent;
  reviews: Review[];
  pinned: Review[];
  total: number;
  loading: boolean;
  hydrated: boolean;
  isLoggedIn: boolean;
  /** Re-fetch published reviews (e.g. after an admin publishes/approves). */
  refresh: () => Promise<void>;
  save: (next: ReviewContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
  submit: (input: {
    rating: number;
    title: string;
    text: string;
    bookSlug: string;
    bookTitle: string;
    kind: "book" | "audio";
  }) => Promise<SaveResult>;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

/** DB-backed review copy + published reviews from /api/reviews. */
export function ReviewsProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: ReviewContent;
}) {
  const [content, setContent] = useState<ReviewContent>(
    initialContent ?? cloneReviewDefaults(),
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pinned, setPinned] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const { data: session } = useSession();

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/reviews?pageSize=50", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Could not load reviews.");
      const data = (await response.json()) as {
        reviews?: Review[];
        pinned?: Review[];
        total?: number;
      };
      setReviews(data.reviews ?? []);
      setPinned(data.pinned ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setReviews([]);
      setPinned([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (next: ReviewContent) => {
    try {
      const result = await saveReviewContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the copy.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetReviewContent();
      if (result.ok) setContent(cloneReviewDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the copy.",
      };
    }
  }, []);

  const submit = useCallback(
    async (input: {
      rating: number;
      title: string;
      text: string;
      bookSlug: string;
      bookTitle: string;
      kind: "book" | "audio";
    }) => {
      try {
        const response = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        if (!response.ok) {
          return { ok: false, message: data?.error ?? "Could not submit the review." };
        }
        await refresh();
        return { ok: true, message: "Review submitted for moderation." };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Could not submit the review.",
        };
      }
    },
    [refresh],
  );

  const value = useMemo(
    () => ({
      content,
      reviews,
      pinned,
      total,
      loading,
      hydrated,
      isLoggedIn: Boolean(session?.user),
      refresh,
      save,
      reset,
      submit,
    }),
    [content, reviews, pinned, total, loading, hydrated, session, refresh, save, reset, submit],
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): ReviewsContextValue {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
