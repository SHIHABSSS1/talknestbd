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
  resetSellContent,
  saveSellContent,
} from "@/lib/actions/sell";
import {
  cloneSellDefaults,
  type SaveResult,
  type SellContent,
} from "@/lib/sell-content";

interface SellContentContextValue {
  content: SellContent;
  /** Always true — the document arrives from the server, not localStorage. */
  hydrated: boolean;
  save: (next: SellContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
}

const SellContentContext = createContext<SellContentContextValue | null>(null);

/** Database-backed sell-used-books document, fed by a cached server query. */
export function SellContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: SellContent;
}) {
  const [content, setContent] = useState<SellContent>(
    initialContent ?? cloneSellDefaults(),
  );

  const save = useCallback(async (next: SellContent) => {
    try {
      const result = await saveSellContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the content.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetSellContent();
      if (result.ok) setContent(cloneSellDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the content.",
      };
    }
  }, []);

  const value = useMemo(
    () => ({ content, hydrated: true, save, reset }),
    [content, save, reset],
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
