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
  CATEGORY_STORAGE_KEY,
  clearCategoryContent,
  cloneCategoryDefaults,
  readCategoryContent,
  writeCategoryContent,
  type CategoryContent,
  type SaveResult,
} from "@/lib/category-content";

interface CategoryContentContextValue {
  content: CategoryContent;
  hydrated: boolean;
  save: (next: CategoryContent) => SaveResult;
  reset: () => SaveResult;
}

const CategoryContentContext = createContext<CategoryContentContextValue | null>(null);

// Stable object for the first render (server + client) so hydration matches.
const initialContent: CategoryContent = cloneCategoryDefaults();

/** Single source of truth for the homepage showcase and the categories page. */
export function CategoryContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CategoryContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readCategoryContent());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === CATEGORY_STORAGE_KEY || event.key === null) {
        setContent(readCategoryContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: CategoryContent) => {
    const result = writeCategoryContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearCategoryContent();
    if (result.ok) setContent(cloneCategoryDefaults());
    return result;
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, save, reset }),
    [content, hydrated, save, reset],
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
