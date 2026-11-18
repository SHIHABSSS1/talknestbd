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
  AUTHOR_STORAGE_KEY,
  clearAuthorContent,
  cloneAuthorDefaults,
  readAuthorContent,
  writeAuthorContent,
  type AuthorContent,
  type SaveResult,
} from "@/lib/author-content";
import type { Author } from "@/lib/types";

interface AuthorContentContextValue {
  content: AuthorContent;
  hydrated: boolean;
  save: (next: AuthorContent) => SaveResult;
  reset: () => SaveResult;
  getAuthor: (slug: string) => Author | undefined;
}

const AuthorContentContext = createContext<AuthorContentContextValue | null>(null);
const initialContent: AuthorContent = cloneAuthorDefaults();

export function AuthorContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AuthorContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readAuthorContent());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === AUTHOR_STORAGE_KEY || event.key === null) {
        setContent(readAuthorContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: AuthorContent) => {
    const result = writeAuthorContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearAuthorContent();
    if (result.ok) setContent(cloneAuthorDefaults());
    return result;
  }, []);

  const getAuthor = useCallback(
    (slug: string) => content.authors.find((author) => author.slug === slug),
    [content.authors],
  );

  const value = useMemo(
    () => ({ content, hydrated, save, reset, getAuthor }),
    [content, hydrated, save, reset, getAuthor],
  );

  return (
    <AuthorContentContext.Provider value={value}>
      {children}
    </AuthorContentContext.Provider>
  );
}

export function useAuthorContent(): AuthorContentContextValue {
  const context = useContext(AuthorContentContext);
  if (!context) {
    throw new Error("useAuthorContent must be used within an AuthorContentProvider");
  }
  return context;
}
