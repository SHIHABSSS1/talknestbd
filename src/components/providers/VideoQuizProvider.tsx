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
  clearVideoQuizContent,
  cloneVideoQuizDefaults,
  readVideoQuizContent,
  VIDEO_QUIZ_STORAGE_KEY,
  writeVideoQuizContent,
  type VideoComment,
  type VideoQuizContent,
  type SaveResult,
} from "@/lib/video-quiz-content";

interface VideoQuizContextValue {
  content: VideoQuizContent;
  hydrated: boolean;
  save: (next: VideoQuizContent) => SaveResult;
  reset: () => SaveResult;
  addComment: (comment: VideoComment) => void;
  removeComment: (id: string) => void;
}

const VideoQuizContext = createContext<VideoQuizContextValue | null>(null);
const initialContent: VideoQuizContent = cloneVideoQuizDefaults();

export function VideoQuizProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<VideoQuizContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readVideoQuizContent());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === VIDEO_QUIZ_STORAGE_KEY || event.key === null) {
        setContent(readVideoQuizContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: VideoQuizContent) => {
    const result = writeVideoQuizContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const save = useCallback((next: VideoQuizContent) => persist(next), [persist]);

  const reset = useCallback(() => {
    const result = clearVideoQuizContent();
    if (result.ok) setContent(cloneVideoQuizDefaults());
    return result;
  }, []);

  const addComment = useCallback(
    (comment: VideoComment) => {
      persist({ ...content, comments: [comment, ...content.comments] });
    },
    [content, persist],
  );

  const removeComment = useCallback(
    (id: string) => {
      persist({
        ...content,
        comments: content.comments.filter((item) => item.id !== id),
      });
    },
    [content, persist],
  );

  const value = useMemo(
    () => ({ content, hydrated, save, reset, addComment, removeComment }),
    [content, hydrated, save, reset, addComment, removeComment],
  );

  return <VideoQuizContext.Provider value={value}>{children}</VideoQuizContext.Provider>;
}

export function useVideoQuiz(): VideoQuizContextValue {
  const context = useContext(VideoQuizContext);
  if (!context) {
    throw new Error("useVideoQuiz must be used within a VideoQuizProvider");
  }
  return context;
}
