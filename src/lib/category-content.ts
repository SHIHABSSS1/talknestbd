/**
 * Shared content for the homepage category showcase and the categories page.
 *
 * The live document lives in Postgres (`content_blocks` key "categories"),
 * edited at /admin/sections/categories and read by a cached server query.
 * The localStorage helpers below are kept only so an admin can import tiles
 * saved in this browser before the database existed.
 *
 * Counts are intentionally NOT stored: they are derived from the book data so
 * they stay accurate as the catalogue changes. Routes are generated from the
 * category slug — adding a shelf creates its /category/<slug> route.
 */

import { categoryRoute, slugify } from "@/lib/slug";

export type CategoryIconKey =
  | "book"
  | "feather"
  | "landmark"
  | "users"
  | "graduation"
  | "globe"
  | "headphones"
  | "sparkles";

export interface CategorySubcategory {
  id: string;
  name: string;
  /** Auto-generated from the name; links to books carrying this subcategory. */
  slug: string;
  description?: string;
}

export interface CategoryTile {
  id: string;
  /** Generated from the name; also drives the route and book lookup. */
  slug: string;
  name: string;
  englishName: string;
  description: string;
  /** Derived automatically from slug (audio keeps /audio-books). */
  href: string;
  icon: CategoryIconKey;
  /** Hex accent used by both the homepage (55% alpha) and the category page. */
  accent: string;
  /** Optional image (URL or compressed data URL) shown instead of the icon. */
  src?: string;
  /** Audio tiles show "titles" and count books with audio. */
  audio?: boolean;
  /** Child shelves shown on the category page. */
  subcategories: CategorySubcategory[];
  /** Show a book slider for this category on the homepage. */
  homeBooks: boolean;
}

export interface CategoryHeading {
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
}

export interface CategoryContent {
  heading: CategoryHeading;
  tiles: CategoryTile[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

/** Live content_blocks key (server-side source of truth). */
export const CATEGORY_CONTENT_KEY = "categories";
/** Legacy browser-only key, used solely by the editor's import action. */
export const CATEGORY_STORAGE_KEY = "talknestbd-categories-v1";
/** Hard caps enforced by the server action, not just the editor UI. */
export const MAX_CATEGORY_TILES = 24;
export const MAX_CATEGORY_SUBCATEGORIES = 30;

export const categoryIconKeys: { key: CategoryIconKey; label: string }[] = [
  { key: "book", label: "Book" },
  { key: "feather", label: "Feather" },
  { key: "landmark", label: "Landmark" },
  { key: "users", label: "People" },
  { key: "graduation", label: "Graduation cap" },
  { key: "globe", label: "Globe" },
  { key: "headphones", label: "Headphones" },
  { key: "sparkles", label: "Highlight" },
];

export const categoryAccentPresets = [
  { label: "Blue", value: "#BACDFF" },
  { label: "Green", value: "#96DB9D" },
  { label: "Sky", value: "#96CADB" },
  { label: "Purple", value: "#E1C0FF" },
  { label: "Orange", value: "#FF9900" },
  { label: "Bright blue", value: "#37AAF7" },
];

export function createSubcategory(name: string, used: string[]): CategorySubcategory {
  const base = slugify(name || "subcategory");
  let slug = base;
  let index = 2;
  while (used.includes(slug)) slug = `${base}-${index++}`;
  return {
    id: `sub-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
    name,
    slug,
  };
}

export const categoryDefaults: CategoryContent = {
  heading: {
    eyebrow: "Browse the shelves",
    title: "Shop by category",
    description:
      "Find your next read by mood, subject or the season of life you are in.",
    linkLabel: "All categories",
  },
  tiles: [
    {
      id: "cat-uponnash",
      slug: "uponnash",
      name: "Novels",
      englishName: "Fiction",
      description:
        "New voices, old memories and unfamiliar worlds — a curated shelf of novels worth staying up for.",
      href: "/category/uponnash",
      icon: "book",
      accent: "#BACDFF",
      homeBooks: true,
      subcategories: [
        { id: "sub-bangla", name: "Bangla Novels", slug: "bangla-novels" },
        { id: "sub-translations", name: "Translations", slug: "translations" },
      ],
    },
    {
      id: "cat-sahitto",
      slug: "sahitto",
      name: "Literature",
      englishName: "Essays & Poetry",
      description:
        "Poetry, short stories and essays for readers who like to take their time.",
      href: "/category/sahitto",
      icon: "feather",
      accent: "#96DB9D",
      homeBooks: true,
      subcategories: [
        { id: "sub-poetry", name: "Poetry", slug: "poetry" },
        { id: "sub-stories", name: "Short Stories", slug: "short-stories" },
        { id: "sub-essays", name: "Essays", slug: "essays" },
      ],
    },
    {
      id: "cat-islamic-itihas",
      slug: "islamic-itihas",
      name: "Islamic History",
      englishName: "Seerah & History",
      description:
        "Trusted books on the life of the Prophet, Islamic civilisation and the people who shaped it.",
      href: "/category/islamic-itihas",
      icon: "landmark",
      accent: "#96CADB",
      homeBooks: true,
      subcategories: [
        { id: "sub-islamic-history", name: "Islamic History", slug: "islamic-history" },
        { id: "sub-sunnah", name: "Sunnah", slug: "sunnah" },
      ],
    },
    {
      id: "cat-jiboni",
      slug: "jiboni",
      name: "Biographies",
      englishName: "Real Lives",
      description:
        "Stories of thinkers, athletes and everyday heroes who give us the courage to keep going.",
      href: "/category/jiboni",
      icon: "users",
      accent: "#E1C0FF",
      homeBooks: true,
      subcategories: [
        { id: "sub-seerah", name: "Seerah & Biography", slug: "seerah-biography" },
        { id: "sub-autobiography", name: "Autobiography", slug: "autobiography" },
        { id: "sub-history", name: "History", slug: "history" },
      ],
    },
    {
      id: "cat-student",
      slug: "student",
      name: "Student Books",
      englishName: "Study Guides",
      description:
        "Academic guides, references and skill-building books in one place.",
      href: "/category/student",
      icon: "graduation",
      accent: "#FF9900",
      homeBooks: true,
      subcategories: [
        { id: "sub-exam", name: "Exam Guides", slug: "exam-guides" },
        { id: "sub-language", name: "Language", slug: "language" },
        { id: "sub-self-help", name: "Self Help", slug: "self-help" },
      ],
    },
    {
      id: "cat-international",
      slug: "international",
      name: "International",
      englishName: "World Literature",
      description:
        "Global bestsellers and world classics in reader-friendly English editions.",
      href: "/category/international",
      icon: "globe",
      accent: "#37AAF7",
      homeBooks: true,
      subcategories: [
        { id: "sub-fiction", name: "Fiction", slug: "fiction" },
        { id: "sub-international-self-help", name: "Self Help", slug: "self-help" },
        { id: "sub-development", name: "Personal Development", slug: "personal-development" },
      ],
    },
    {
      id: "cat-audio-books",
      slug: "audio-books",
      name: "Audiobooks",
      englishName: "Listen anywhere",
      description:
        "Narrated stories, thoughtful non-fiction and free first-chapter previews.",
      href: "/audio-books",
      icon: "headphones",
      accent: "#37AAF7",
      audio: true,
      homeBooks: false,
      subcategories: [],
    },
  ],
};

export function cloneCategoryDefaults(): CategoryContent {
  return JSON.parse(JSON.stringify(categoryDefaults)) as CategoryContent;
}

const VALID_ICONS = new Set<string>(categoryIconKeys.map((item) => item.key));
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

function isHeading(value: unknown): value is CategoryHeading {
  if (!value || typeof value !== "object") return false;
  const heading = value as Record<string, unknown>;
  return (
    typeof heading.eyebrow === "string" &&
    typeof heading.title === "string" &&
    typeof heading.description === "string" &&
    typeof heading.linkLabel === "string"
  );
}

function isSubcategory(value: unknown): value is CategorySubcategory {
  if (!value || typeof value !== "object") return false;
  const sub = value as Record<string, unknown>;
  return (
    typeof sub.id === "string" &&
    typeof sub.name === "string" &&
    typeof sub.slug === "string" &&
    (sub.description === undefined || typeof sub.description === "string")
  );
}

function isTile(value: unknown): value is CategoryTile {
  if (!value || typeof value !== "object") return false;
  const tile = value as Record<string, unknown>;
  return (
    typeof tile.id === "string" &&
    typeof tile.slug === "string" &&
    typeof tile.name === "string" &&
    typeof tile.englishName === "string" &&
    typeof tile.description === "string" &&
    typeof tile.href === "string" &&
    typeof tile.icon === "string" &&
    VALID_ICONS.has(tile.icon) &&
    typeof tile.accent === "string" &&
    HEX_COLOR.test(tile.accent) &&
    (tile.src === undefined || typeof tile.src === "string") &&
    (tile.audio === undefined || typeof tile.audio === "boolean") &&
    (tile.subcategories === undefined ||
      (Array.isArray(tile.subcategories) && tile.subcategories.every(isSubcategory))) &&
    (tile.homeBooks === undefined || typeof tile.homeBooks === "boolean")
  );
}

export function readCategoryContent(): CategoryContent {
  if (typeof window === "undefined") return cloneCategoryDefaults();
  try {
    const raw = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) return cloneCategoryDefaults();
    const parsed = JSON.parse(raw) as Partial<CategoryContent>;
    if (
      !parsed.heading ||
      !isHeading(parsed.heading) ||
      !Array.isArray(parsed.tiles) ||
      !parsed.tiles.every(isTile)
    ) {
      return cloneCategoryDefaults();
    }
    return {
      heading: parsed.heading,
      tiles: parsed.tiles.map((tile, index) => {
        const slug = slugify(tile.slug || tile.name || `category-${index}`);
        return {
          ...tile,
          id: tile.id || `category-${index}`,
          slug,
          href: tile.audio ? "/audio-books" : categoryRoute(slug),
          subcategories: tile.subcategories ?? [],
          homeBooks: tile.homeBooks ?? true,
        };
      }),
    };
  } catch {
    return cloneCategoryDefaults();
  }
}

export function writeCategoryContent(content: CategoryContent): SaveResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Storage is not available while rendering on the server.",
    };
  }
  try {
    window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(content));
    return {
      ok: true,
      message: "Saved to this browser — the category tiles now match on both pages.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Could not save: browser storage may be full. Try smaller images or fewer tiles.",
    };
  }
}

export function clearCategoryContent(): SaveResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Storage is not available while rendering on the server.",
    };
  }
  try {
    window.localStorage.removeItem(CATEGORY_STORAGE_KEY);
    return { ok: true, message: "Restored the original category shelves." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
