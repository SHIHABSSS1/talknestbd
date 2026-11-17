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
  clearSellContent,
  cloneSellDefaults,
  readSellContent,
  SELL_STORAGE_KEY,
  writeSellContent,
  type SaveResult,
  type SellContent,
} from "@/lib/sell-content";

interface SellContentContextValue {
  content: SellContent;
  hydrated: boolean;
  save: (next: SellContent) => SaveResult;
  reset: () => SaveResult;
}

const SellContentContext = createContext<SellContentContextValue | null>(null);

// Stable first render (server + client) so hydration matches.
const initialContent: SellContent = cloneSellDefaults();

export function SellContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SellContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readSellContent());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === SELL_STORAGE_KEY || event.key === null) {
        setContent(readSellContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: SellContent) => {
    const result = writeSellContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearSellContent();
    if (result.ok) setContent(cloneSellDefaults());
    return result;
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, save, reset }),
    [content, hydrated, save, reset],
  );

  return (
    <SellContentContext.Provider value={value}>
      {children}
    </SellContentContext.Provider>
  );
}

export function useSellContent(): SellContentContextValue {
  const context = useContext(SellContentContext);
  if (!context) {
    throw new Error("useSellContent must be used within a SellContentProvider");
  }
  return context;
}
