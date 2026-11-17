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
  AUDIO_STORAGE_KEY,
  clearAudioContent,
  cloneAudioDefaults,
  readAudioContent,
  writeAudioContent,
  type AudioBookEntry,
  type AudioContent,
  type SaveResult,
} from "@/lib/audio-content";

interface AudioContentContextValue {
  content: AudioContent;
  hydrated: boolean;
  save: (next: AudioContent) => SaveResult;
  reset: () => SaveResult;
  getEntry: (slug: string) => AudioBookEntry | undefined;
}

const AudioContentContext = createContext<AudioContentContextValue | null>(null);

// Stable first render (server + client) so hydration matches.
const initialContent: AudioContent = cloneAudioDefaults();

export function AudioContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AudioContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readAudioContent());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === AUDIO_STORAGE_KEY || event.key === null) {
        setContent(readAudioContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: AudioContent) => {
    const result = writeAudioContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearAudioContent();
    if (result.ok) setContent(cloneAudioDefaults());
    return result;
  }, []);

  const getEntry = useCallback(
    (slug: string) => content.books.find((book) => book.slug === slug),
    [content.books],
  );

  const value = useMemo(
    () => ({ content, hydrated, save, reset, getEntry }),
    [content, hydrated, save, reset, getEntry],
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
