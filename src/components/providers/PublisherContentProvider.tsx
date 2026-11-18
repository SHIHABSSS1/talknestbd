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
  clonePublisherDefaults,
  PUBLISHER_STORAGE_KEY,
  readPublisherContent,
  writePublisherContent,
  clearPublisherContent,
  type PublisherContent,
  type SaveResult,
} from "@/lib/publisher-content";
import type { Publisher } from "@/lib/types";

interface PublisherContentContextValue {
  content: PublisherContent;
  hydrated: boolean;
  save: (next: PublisherContent) => SaveResult;
  reset: () => SaveResult;
  getPublisher: (slug: string) => Publisher | undefined;
}

const PublisherContentContext = createContext<PublisherContentContextValue | null>(null);
const initialContent: PublisherContent = clonePublisherDefaults();

export function PublisherContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PublisherContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readPublisherContent());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === PUBLISHER_STORAGE_KEY || event.key === null) {
        setContent(readPublisherContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: PublisherContent) => {
    const result = writePublisherContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearPublisherContent();
    if (result.ok) setContent(clonePublisherDefaults());
    return result;
  }, []);

  const getPublisher = useCallback(
    (slug: string) => content.publishers.find((publisher) => publisher.slug === slug),
    [content.publishers],
  );

  const value = useMemo(
    () => ({ content, hydrated, save, reset, getPublisher }),
    [content, hydrated, save, reset, getPublisher],
  );

  return (
    <PublisherContentContext.Provider value={value}>
      {children}
    </PublisherContentContext.Provider>
  );
}

export function usePublisherContent(): PublisherContentContextValue {
  const context = useContext(PublisherContentContext);
  if (!context) {
    throw new Error("usePublisherContent must be used within a PublisherContentProvider");
  }
  return context;
}
