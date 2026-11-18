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
  clearReviewContent,
  cloneReviewDefaults,
  readReviewContent,
  REVIEW_STORAGE_KEY,
  writeReviewContent,
  type ReviewContent,
  type SaveResult,
} from "@/lib/review-content";
import {
  addReviewRequest,
  readReviewRequests,
  REVIEW_REQUESTS_KEY,
  removeReviewRequest,
  updateReviewRequest,
  type ReviewRequest,
} from "@/lib/review-requests";
import type { Review } from "@/lib/types";

interface ReviewsContextValue {
  content: ReviewContent;
  hydrated: boolean;
  save: (next: ReviewContent) => SaveResult;
  reset: () => SaveResult;
  requests: ReviewRequest[];
  addRequest: (request: ReviewRequest) => void;
  setRequestStatus: (id: string, status: ReviewRequest["status"]) => void;
  removeRequest: (id: string) => void;
  approve: (request: ReviewRequest) => void;
}

const ReviewsContext = createContext<ReviewsContextValue | null>(null);
const initialContent: ReviewContent = cloneReviewDefaults();

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReviewContent>(initialContent);
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readReviewContent());
    setRequests(readReviewRequests());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (
        !event.key ||
        event.key === REVIEW_STORAGE_KEY ||
        event.key === REVIEW_REQUESTS_KEY
      ) {
        setContent(readReviewContent());
        setRequests(readReviewRequests());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: ReviewContent) => {
    const result = writeReviewContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearReviewContent();
    if (result.ok) setContent(cloneReviewDefaults());
    return result;
  }, []);

  const refreshRequests = useCallback(() => setRequests(readReviewRequests()), []);

  const addRequest = useCallback(
    (request: ReviewRequest) => {
      addReviewRequest(request);
      refreshRequests();
    },
    [refreshRequests],
  );

  const setRequestStatus = useCallback(
    (id: string, status: ReviewRequest["status"]) => {
      updateReviewRequest(id, { status });
      refreshRequests();
    },
    [refreshRequests],
  );

  const removeRequest = useCallback(
    (id: string) => {
      removeReviewRequest(id);
      refreshRequests();
    },
    [refreshRequests],
  );

  const approve = useCallback(
    (request: ReviewRequest) => {
      const review: Review = {
        id: `r-${request.id}`,
        name: request.name,
        location: request.location,
        rating: request.rating,
        text: request.text,
        bookTitle: request.bookTitle,
        bookSlug: request.bookSlug,
        date: "Just now",
        avatarColor: "#1877F2",
        verified: true,
      };
      const nextContent: ReviewContent = {
        ...content,
        reviews: [review, ...content.reviews.filter((item) => item.id !== review.id)],
      };
      const result = writeReviewContent(nextContent);
      if (result.ok) setContent(nextContent);
      updateReviewRequest(request.id, { status: "Approved" });
      refreshRequests();
    },
    [content, refreshRequests],
  );

  const value = useMemo(
    () => ({
      content,
      hydrated,
      save,
      reset,
      requests,
      addRequest,
      setRequestStatus,
      removeRequest,
      approve,
    }),
    [content, hydrated, save, reset, requests, addRequest, setRequestStatus, removeRequest, approve],
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
