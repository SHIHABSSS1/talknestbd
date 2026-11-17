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
  clearUsedContent,
  cloneUsedDefaults,
  readUsedContent,
  USED_STORAGE_KEY,
  writeUsedContent,
  type SaveResult,
  type UsedContent,
} from "@/lib/used-content";

interface UsedContentContextValue {
  content: UsedContent;
  hydrated: boolean;
  save: (next: UsedContent) => SaveResult;
  reset: () => SaveResult;
}

const UsedContentContext = createContext<UsedContentContextValue | null>(null);

// Stable first render (server + client) so hydration matches.
const initialContent: UsedContent = cloneUsedDefaults();

export function UsedContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<UsedContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readUsedContent());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === USED_STORAGE_KEY || event.key === null) {
        setContent(readUsedContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: UsedContent) => {
    const result = writeUsedContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearUsedContent();
    if (result.ok) setContent(cloneUsedDefaults());
    return result;
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, save, reset }),
    [content, hydrated, save, reset],
  );

  return (
    <UsedContentContext.Provider value={value}>
      {children}
    </UsedContentContext.Provider>
  );
}

export function useUsedContent(): UsedContentContextValue {
  const context = useContext(UsedContentContext);
  if (!context) {
    throw new Error("useUsedContent must be used within a UsedContentProvider");
  }
  return context;
}
