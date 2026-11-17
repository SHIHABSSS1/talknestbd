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
  clearShelfHeading,
  readShelfHeading,
  shelfDefaults,
  SHELF_SLUGS,
  writeShelfHeading,
  type SaveResult,
  type ShelfHeading,
} from "@/lib/shelf-content";

interface ShelfContentContextValue {
  getHeading: (slug: string) => ShelfHeading;
  saveHeading: (slug: string, heading: ShelfHeading) => SaveResult;
  resetHeading: (slug: string) => SaveResult;
  hydrated: boolean;
}

const ShelfContentContext = createContext<ShelfContentContextValue | null>(null);

// Stable first render (server + client) so hydration matches.
const initialHeadings: Record<string, ShelfHeading> = {
  [SHELF_SLUGS.viral]: shelfDefaults(SHELF_SLUGS.viral),
  [SHELF_SLUGS.upSale]: shelfDefaults(SHELF_SLUGS.upSale),
  [SHELF_SLUGS.newArrivals]: shelfDefaults(SHELF_SLUGS.newArrivals),
  [SHELF_SLUGS.trending]: shelfDefaults(SHELF_SLUGS.trending),
  [SHELF_SLUGS.sunnah]: shelfDefaults(SHELF_SLUGS.sunnah),
  [SHELF_SLUGS.international]: shelfDefaults(SHELF_SLUGS.international),
  [SHELF_SLUGS.studentBooks]: shelfDefaults(SHELF_SLUGS.studentBooks),
};

export function ShelfContentProvider({ children }: { children: ReactNode }) {
  const [headings, setHeadings] = useState<Record<string, ShelfHeading>>(initialHeadings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHeadings({
      [SHELF_SLUGS.viral]: readShelfHeading(SHELF_SLUGS.viral),
      [SHELF_SLUGS.upSale]: readShelfHeading(SHELF_SLUGS.upSale),
      [SHELF_SLUGS.newArrivals]: readShelfHeading(SHELF_SLUGS.newArrivals),
      [SHELF_SLUGS.trending]: readShelfHeading(SHELF_SLUGS.trending),
      [SHELF_SLUGS.sunnah]: readShelfHeading(SHELF_SLUGS.sunnah),
      [SHELF_SLUGS.international]: readShelfHeading(SHELF_SLUGS.international),
      [SHELF_SLUGS.studentBooks]: readShelfHeading(SHELF_SLUGS.studentBooks),
    });
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key.startsWith("talknestbd-shelf-")) {
        setHeadings({
          [SHELF_SLUGS.viral]: readShelfHeading(SHELF_SLUGS.viral),
          [SHELF_SLUGS.upSale]: readShelfHeading(SHELF_SLUGS.upSale),
          [SHELF_SLUGS.newArrivals]: readShelfHeading(SHELF_SLUGS.newArrivals),
          [SHELF_SLUGS.trending]: readShelfHeading(SHELF_SLUGS.trending),
          [SHELF_SLUGS.sunnah]: readShelfHeading(SHELF_SLUGS.sunnah),
          [SHELF_SLUGS.international]: readShelfHeading(SHELF_SLUGS.international),
          [SHELF_SLUGS.studentBooks]: readShelfHeading(SHELF_SLUGS.studentBooks),
        });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const getHeading = useCallback(
    (slug: string) => headings[slug] ?? readShelfHeading(slug),
    [headings],
  );

  const saveHeading = useCallback((slug: string, heading: ShelfHeading) => {
    const result = writeShelfHeading(slug, heading);
    if (result.ok) setHeadings((current) => ({ ...current, [slug]: heading }));
    return result;
  }, []);

  const resetHeading = useCallback((slug: string) => {
    const result = clearShelfHeading(slug);
    if (result.ok) {
      setHeadings((current) => ({ ...current, [slug]: readShelfHeading(slug) }));
    }
    return result;
  }, []);

  const value = useMemo(
    () => ({ getHeading, saveHeading, resetHeading, hydrated }),
    [getHeading, saveHeading, resetHeading, hydrated],
  );

  return (
    <ShelfContentContext.Provider value={value}>
      {children}
    </ShelfContentContext.Provider>
  );
}

export function useShelfContent(): ShelfContentContextValue {
  const context = useContext(ShelfContentContext);
  if (!context) {
    throw new Error("useShelfContent must be used within a ShelfContentProvider");
  }
  return context;
}
