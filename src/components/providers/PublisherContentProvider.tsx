"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  resetPublisherContent,
  savePublisherContent,
} from "@/lib/actions/publishers";
import {
  clonePublisherDefaults,
  type PublisherContent,
  type SaveResult,
} from "@/lib/publisher-content";
import type { Publisher } from "@/lib/types";

interface PublisherContentContextValue {
  content: PublisherContent;
  /** Always true — the document arrives from the server, not localStorage. */
  hydrated: boolean;
  save: (next: PublisherContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
  getPublisher: (slug: string) => Publisher | undefined;
}

const PublisherContentContext = createContext<PublisherContentContextValue | null>(null);

/** Database-backed publisher document, fed once by a cached server query. */
export function PublisherContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: PublisherContent;
}) {
  const [content, setContent] = useState<PublisherContent>(
    initialContent ?? clonePublisherDefaults(),
  );

  const save = useCallback(async (next: PublisherContent) => {
    try {
      const result = await savePublisherContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the publishers.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetPublisherContent();
      if (result.ok) setContent(clonePublisherDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the publishers.",
      };
    }
  }, []);

  const getPublisher = useCallback(
    (slug: string) => content.publishers.find((publisher) => publisher.slug === slug),
    [content.publishers],
  );

  const value = useMemo(
    () => ({ content, hydrated: true, save, reset, getPublisher }),
    [content, save, reset, getPublisher],
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
    throw new Error(
      "usePublisherContent must be used within a PublisherContentProvider",
    );
  }
  return context;
}
