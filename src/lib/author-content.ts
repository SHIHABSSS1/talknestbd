/** Editable author content for the homepage spotlight, /authors and detail pages. */

import { authors as staticAuthors } from "@/data/authors";
import { sectionDefaults } from "@/lib/section-content";
import type { Author } from "@/lib/types";

export interface AuthorContent {
  section: { eyebrow: string; title: string; description: string; linkLabel: string };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
    quoteLabel: string;
    quote: string;
    quoteBy: string;
    pillCount: number;
  };
  detail: {
    featuredLabel: string;
    authorLabel: string;
    allAuthorsLabel: string;
    browseBooksLabel: string;
    booksHeadingPrefix: string;
    booksHeading: string;
    emptyNote: string;
  };
  authors: Author[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

/** Live content_blocks key (server-side source of truth). */
export const AUTHOR_CONTENT_KEY = "authors";
/** Legacy browser-only key, used solely by the editor's import action. */
export const AUTHOR_STORAGE_KEY = "talknestbd-authors-v1";

const section = sectionDefaults.authors;

export const authorDefaults: AuthorContent = {
  section: {
    eyebrow: section?.eyebrow ?? "Meet the authors",
    title: section?.title ?? "The voices behind the shelves",
    description: section?.description ?? "",
    linkLabel: section?.linkLabel ?? "All authors",
  },
  listing: {
    eyebrow: "Our Authors",
    title: "The writers who keep stories alive",
    description: "Author profiles, thoughts and book collections — all in one place.",
    quoteLabel: "Writer's Quote",
    quote:
      "A story is a window that lets outside light in — and also lets you see the dark inside.",
    quoteBy: "Rafida Noor",
    pillCount: 9,
  },
  detail: {
    featuredLabel: "Featured author",
    authorLabel: "Author",
    allAuthorsLabel: "All authors",
    browseBooksLabel: "Browse books",
    booksHeadingPrefix: "Books by",
    booksHeading: "Books by this author",
    emptyNote: "This author's books are coming soon.",
  },
  authors: staticAuthors,
};

export function cloneAuthorDefaults(): AuthorContent {
  return JSON.parse(JSON.stringify(authorDefaults)) as AuthorContent;
}

function isAuthor(value: unknown): value is Author {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.title === "string" &&
    typeof item.bio === "string" &&
    Array.isArray(item.longBio) &&
    item.longBio.every((entry) => typeof entry === "string") &&
    (item.image === undefined || typeof item.image === "string") &&
    typeof item.location === "string" &&
    typeof item.quote === "string" &&
    typeof item.featured === "boolean"
  );
}

export function readAuthorContent(): AuthorContent {
  const defaults = cloneAuthorDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(AUTHOR_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<AuthorContent>;
    if (!Array.isArray(parsed.authors) || !parsed.authors.every(isAuthor)) return defaults;
    return {
      section: { ...defaults.section, ...parsed.section },
      listing: { ...defaults.listing, ...parsed.listing },
      detail: { ...defaults.detail, ...parsed.detail },
      authors: parsed.authors,
    };
  } catch {
    return defaults;
  }
}

export function writeAuthorContent(content: AuthorContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — author pages updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearAuthorContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(AUTHOR_STORAGE_KEY);
    return { ok: true, message: "Restored the original author profiles." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
