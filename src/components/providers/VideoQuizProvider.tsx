"use client";

/**
 * Shared, API-backed video/quiz catalogue.
 *
 * Page copy arrives from the server (content_blocks via a cached query).
 * Episodes, quizzes and questions are fetched from /api/videos and /api/quizzes
 * so every storefront surface — homepage, /video and /quiz — sees the same
 * live data after an admin publishes a change.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { accountFetch } from "@/lib/account-client";
import type { QuizView, VideoView } from "@/lib/video-quiz-api";
import type { VideoQuizCopy } from "@/lib/video-quiz-content";

type VideoQuizContextValue = {
  copy: VideoQuizCopy;
  videos: VideoView[];
  quizzes: QuizView[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /** Published quiz of a given type, or null. */
  quizOfType: (type: "book" | "watch") => QuizView | null;
};

const VideoQuizContext = createContext<VideoQuizContextValue | null>(null);

export function VideoQuizProvider({
  initialCopy,
  children,
}: {
  initialCopy: VideoQuizCopy;
  children: React.ReactNode;
}) {
  const [copy, setCopy] = useState(initialCopy);
  const [videos, setVideos] = useState<VideoView[]>([]);
  const [quizzes, setQuizzes] = useState<QuizView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [videoData, quizData] = await Promise.all([
        accountFetch<{ videos: VideoView[] }>("/api/videos"),
        accountFetch<{ quizzes: QuizView[] }>("/api/quizzes"),
      ]);
      setVideos(videoData.videos ?? []);
      setQuizzes(quizData.quizzes ?? []);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load videos and quizzes.");
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

  const value = useMemo<VideoQuizContextValue>(
    () => ({
      copy,
      videos,
      quizzes,
      loading,
      error,
      refresh,
      quizOfType: (type) =>
        quizzes.find((quiz) => quiz.type === type) ??
        quizzes.find((quiz) => quiz.featured) ??
        quizzes[0] ??
        null,
    }),
    [copy, videos, quizzes, loading, error, refresh],
  );

  return <VideoQuizContext.Provider value={value}>{children}</VideoQuizContext.Provider>;
}

export function useVideoQuiz(): VideoQuizContextValue {
  const value = useContext(VideoQuizContext);
  if (!value) throw new Error("useVideoQuiz must be used inside VideoQuizProvider.");
  return value;
}
