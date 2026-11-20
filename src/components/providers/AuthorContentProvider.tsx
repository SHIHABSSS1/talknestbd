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
  resetAuthorContent,
  saveAuthorContent,
} from "@/lib/actions/authors";
import {
  cloneAuthorDefaults,
  type AuthorContent,
  type SaveResult,
} from "@/lib/author-content";
import type { Author } from "@/lib/types";

interface AuthorContentContextValue {
  content: AuthorContent;
  /** Always true — the document arrives from the server, not localStorage. */
  hydrated: boolean;
  save: (next: AuthorContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
  getAuthor: (slug: string) => Author | undefined;
}

const AuthorContentContext = createContext<AuthorContentContextValue | null>(null);

/** Database-backed author document, fed once by a cached server query. */
export function AuthorContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: AuthorContent;
}) {
  const [content, setContent] = useState<AuthorContent>(
    initialContent ?? cloneAuthorDefaults(),
  );

  const save = useCallback(async (next: AuthorContent) => {
    try {
      const result = await saveAuthorContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the authors.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetAuthorContent();
      if (result.ok) setContent(cloneAuthorDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the authors.",
      };
    }
  }, []);

  const getAuthor = useCallback(
    (slug: string) => content.authors.find((author) => author.slug === slug),
    [content.authors],
  );

  const value = useMemo(
    () => ({ content, hydrated: true, save, reset, getAuthor }),
    [content, save, reset, getAuthor],
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
