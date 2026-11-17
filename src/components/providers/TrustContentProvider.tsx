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
  clearTrustContent,
  cloneTrustDefaults,
  readTrustContent,
  TRUST_STORAGE_KEY,
  writeTrustContent,
  type SaveResult,
  type TrustContent,
} from "@/lib/trust-content";

interface TrustContentContextValue {
  content: TrustContent;
  hydrated: boolean;
  save: (next: TrustContent) => SaveResult;
  reset: () => SaveResult;
}

const TrustContentContext = createContext<TrustContentContextValue | null>(null);

// Stable object for the first render (server + client) so hydration matches.
const initialContent: TrustContent = cloneTrustDefaults();

/** Single source of truth for the four cards below the homepage hero. */
export function TrustContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<TrustContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readTrustContent());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === TRUST_STORAGE_KEY || event.key === null) {
        setContent(readTrustContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: TrustContent) => {
    const result = writeTrustContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearTrustContent();
    if (result.ok) setContent(cloneTrustDefaults());
    return result;
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, save, reset }),
    [content, hydrated, save, reset],
  );

  return (
    <TrustContentContext.Provider value={value}>
      {children}
    </TrustContentContext.Provider>
  );
}

export function useTrustContent(): TrustContentContextValue {
  const context = useContext(TrustContentContext);
  if (!context) {
    throw new Error("useTrustContent must be used within a TrustContentProvider");
  }
  return context;
}
