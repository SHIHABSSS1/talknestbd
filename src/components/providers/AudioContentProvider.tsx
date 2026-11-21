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
  resetAudioCopy,
  saveAudioCopy,
} from "@/lib/actions/audio";
import {
  cloneAudioDefaults,
  type AudioContent,
  type SaveResult,
} from "@/lib/audio-content";
import type { AudioBookView } from "@/lib/audio-api";

interface AudioContentContextValue {
  content: AudioContent;
  audiobooks: AudioBookView[];
  loading: boolean;
  hydrated: boolean;
  refresh: () => Promise<void>;
  save: (next: AudioContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
}

const AudioContentContext = createContext<AudioContentContextValue | null>(null);

/** DB-backed audiobook copy + published catalogue from /api/audiobooks. */
export function AudioContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: AudioContent;
}) {
  const [content, setContent] = useState<AudioContent>(
    initialContent ?? cloneAudioDefaults(),
  );
  const [audiobooks, setAudiobooks] = useState<AudioBookView[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/audiobooks", { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load audiobooks.");
      const data = (await response.json()) as { audiobooks?: AudioBookView[] };
      const books = data.audiobooks ?? [];
      setAudiobooks(books);
      setContent((current) => ({ ...current, books }));
    } catch {
      setAudiobooks([]);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async (next: AudioContent) => {
    try {
      const result = await saveAudioCopy(next);
      if (result.ok) setContent((current) => ({ ...current, ...next, books: current.books }));
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
      const result = await resetAudioCopy();
      if (result.ok) {
        const fresh = cloneAudioDefaults();
        setContent((current) => ({ ...fresh, books: current.books }));
      }
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the copy.",
      };
    }
  }, []);

  const value = useMemo(
    () => ({ content, audiobooks, loading, hydrated, refresh, save, reset }),
    [content, audiobooks, loading, hydrated, refresh, save, reset],
  );

  return (
    <AudioContentContext.Provider value={value}>
      {children}
    </AudioContentContext.Provider>
  );
}

export function useAudioContent(): AudioContentContextValue {
  const context = useContext(AudioContentContext);
  if (!context) {
    throw new Error("useAudioContent must be used within an AudioContentProvider");
  }
  return context;
}
