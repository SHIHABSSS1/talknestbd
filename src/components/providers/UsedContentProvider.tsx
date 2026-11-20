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
  resetUsedContent,
  saveUsedContent,
} from "@/lib/actions/used";
import {
  cloneUsedDefaults,
  type SaveResult,
  type UsedContent,
} from "@/lib/used-content";

interface UsedContentContextValue {
  content: UsedContent;
  /** Always true — the document arrives from the server, not localStorage. */
  hydrated: boolean;
  save: (next: UsedContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
}

const UsedContentContext = createContext<UsedContentContextValue | null>(null);

/** Database-backed used-books banner, fed by a cached server query. */
export function UsedContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: UsedContent;
}) {
  const [content, setContent] = useState<UsedContent>(
    initialContent ?? cloneUsedDefaults(),
  );

  const save = useCallback(async (next: UsedContent) => {
    try {
      const result = await saveUsedContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the banner.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetUsedContent();
      if (result.ok) setContent(cloneUsedDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the banner.",
      };
    }
  }, []);

  const value = useMemo(
    () => ({ content, hydrated: true, save, reset }),
    [content, save, reset],
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
