"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { resetCategoryContent, saveCategoryContent } from "@/lib/actions/categories";
import {
  cloneCategoryDefaults,
  type SaveResult,
  type CategoryContent,
} from "@/lib/category-content";

interface CategoryContentContextValue {
  content: CategoryContent;
  /** Always true: the initial document arrives from the server, not localStorage. */
  hydrated: boolean;
  save: (next: CategoryContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
}

const CategoryContentContext = createContext<CategoryContentContextValue | null>(null);

/**
 * Shares the database-backed category document with the client surfaces that
 * need it (the category pages, homepage rails, and the admin forms that offer
 * a subcategory picker). The document is read once by a cached server query in
 * the root layout and passed down here as a prop — there is no localStorage
 * flash and no per-component fetch.
 */
export function CategoryContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: CategoryContent;
}) {
  const [content, setContent] = useState<CategoryContent>(
    initialContent ?? cloneCategoryDefaults(),
  );

  const save = useCallback(async (next: CategoryContent) => {
    try {
      const result = await saveCategoryContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the categories.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetCategoryContent();
      if (result.ok) setContent(cloneCategoryDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the categories.",
      };
    }
  }, []);

  const value = useMemo(
    () => ({ content, hydrated: true, save, reset }),
    [content, save, reset],
  );

  return (
    <CategoryContentContext.Provider value={value}>
      {children}
    </CategoryContentContext.Provider>
  );
}

export function useCategoryContent(): CategoryContentContextValue {
  const context = useContext(CategoryContentContext);
  if (!context) {
    throw new Error(
      "useCategoryContent must be used within a CategoryContentProvider",
    );
  }
  return context;
}
