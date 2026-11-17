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
  clearHeroContent,
  cloneHeroDefaults,
  HERO_STORAGE_KEY,
  readHeroContent,
  writeHeroContent,
  type HeroContent,
  type SaveResult,
} from "@/lib/hero-content";

interface HeroContentContextValue {
  content: HeroContent;
  hydrated: boolean;
  save: (next: HeroContent) => SaveResult;
  reset: () => SaveResult;
}

const HeroContentContext = createContext<HeroContentContextValue | null>(null);

// Stable object for the first render (server + client) so hydration matches.
const initialContent: HeroContent = cloneHeroDefaults();

/**
 * Single source of truth for the homepage hero. Mounted once in the root layout
 * so the admin editor and the storefront banner always read the same content.
 */
export function HeroContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<HeroContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readHeroContent());
    setHydrated(true);

    // Keep other open tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key === HERO_STORAGE_KEY || event.key === null) {
        setContent(readHeroContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: HeroContent) => {
    const result = writeHeroContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearHeroContent();
    if (result.ok) setContent(cloneHeroDefaults());
    return result;
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, save, reset }),
    [content, hydrated, save, reset],
  );

  return (
    <HeroContentContext.Provider value={value}>{children}</HeroContentContext.Provider>
  );
}

export function useHeroContent(): HeroContentContextValue {
  const context = useContext(HeroContentContext);
  if (!context) {
    throw new Error("useHeroContent must be used within a HeroContentProvider");
  }
  return context;
}
