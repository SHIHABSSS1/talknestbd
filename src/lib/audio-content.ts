/**
 * Audio-book catalogue for the homepage showcase, /audio-books library and
 * the admin editor. Persisted in localStorage (demo only — no backend).
 * Each audiobook is also written to the unified book catalogue so it has a
 * /books/<slug> detail page.
 */

import { sectionDefaults } from "@/lib/section-content";
import { books as staticBooks } from "@/data/books";
import type { BookCoverTheme } from "@/lib/types";

export interface AudioChapterData {
  id: string;
  title: string;
  duration: string;
  /** Direct MP3/audio URL. SoundHelix demo tracks are used by default. */
  src: string;
  free: boolean;
}

export interface AudioBookEntry {
  id: string;
  slug: string;
  title: string;
  author: string;
  narrator: string;
  duration: string;
  description: string;
  free: boolean;
  price: number;
  cover: BookCoverTheme;
  chapters: AudioChapterData[];
}

export interface AudioContent {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    linkLabel: string;
    featuredSlug: string;
  };
  library: {
    eyebrow: string;
    title: string;
    description: string;
    badges: string[];
    freeNote: string;
    previewNote: string;
  };
  pricing: {
    minPrice: number;
    unlockNote: string;
    ownedLabel: string;
    freeLabel: string;
    paidLabel: string;
  };
  books: AudioBookEntry[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const AUDIO_STORAGE_KEY = "talknestbd-audio-content-v1";

const demoTracks = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
];

const base = sectionDefaults.audio;

function chaptersFor(slug: string, free: boolean): AudioChapterData[] {
  return ["Chapter 1", "Chapter 2", "Chapter 3"].map((title, index) => ({
    id: `${slug}-ch-${index + 1}`,
    title,
    duration: ["12:40", "18:05", "14:32"][index],
    src: demoTracks[index % demoTracks.length],
    free: free || index === 0,
  }));
}

function entryFromBook(
  book: (typeof staticBooks)[number],
  index: number,
): AudioBookEntry {
  const free = index < 2;
  return {
    id: `audio-${book.slug}`,
    slug: book.slug,
    title: book.title,
    author: book.author,
    narrator: book.audio?.narrator ?? "TalkNest Voices",
    duration: book.audio?.duration ?? "—",
    description: book.description,
    free,
    price: free ? 0 : Math.max(99, Math.round(book.price * 0.6)),
    cover: book.cover,
    chapters: chaptersFor(book.slug, free),
  };
}

const audioSourceBooks = staticBooks.filter((book) => Boolean(book.audio)).slice(0, 6);

export const audioDefaults: AudioContent = {
  section: {
    eyebrow: base?.eyebrow ?? "TalkNest Audio",
    title: base?.title ?? "A good story for every commute",
    description:
      base?.description ??
      "Listen while you travel, cook or wind down for the night.",
    linkLabel: base?.linkLabel ?? "All audiobooks",
    featuredSlug: audioSourceBooks[0]?.slug ?? "",
  },
  library: {
    eyebrow: "TalkNest Audio",
    title: "Let your eyes rest, listen to the story",
    description:
      "Some audiobooks are completely free. Every premium title includes a free first-chapter preview — unlock it to listen all the way through.",
    badges: ["Free titles", "Free first-chapter preview", "Buy once, listen forever"],
    freeNote: "Free titles play without a cart — no payment needed in this demo.",
    previewNote: "Premium titles include one free chapter preview.",
  },
  pricing: {
    minPrice: 99,
    unlockNote: "The audiobook unlocks automatically after checkout.",
    ownedLabel: "In your library",
    freeLabel: "Completely free",
    paidLabel: "Premium",
  },
  books: audioSourceBooks.map(entryFromBook),
};

export function cloneAudioDefaults(): AudioContent {
  return JSON.parse(JSON.stringify(audioDefaults)) as AudioContent;
}

function isCover(value: unknown): value is BookCoverTheme {
  if (!value || typeof value !== "object") return false;
  const cover = value as Record<string, unknown>;
  return (
    typeof cover.from === "string" &&
    typeof cover.to === "string" &&
    typeof cover.accent === "string" &&
    typeof cover.motif === "string" &&
    (cover.imageSrc === undefined || typeof cover.imageSrc === "string")
  );
}

function isChapter(value: unknown): value is AudioChapterData {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.duration === "string" &&
    typeof item.src === "string" &&
    typeof item.free === "boolean"
  );
}

function isEntry(value: unknown): value is AudioBookEntry {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.author === "string" &&
    typeof item.narrator === "string" &&
    typeof item.duration === "string" &&
    typeof item.description === "string" &&
    typeof item.free === "boolean" &&
    typeof item.price === "number" &&
    isCover(item.cover) &&
    Array.isArray(item.chapters) &&
    item.chapters.every(isChapter)
  );
}

export function readAudioContent(): AudioContent {
  const defaults = cloneAudioDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<AudioContent>;
    if (!Array.isArray(parsed.books) || !parsed.books.every(isEntry)) return defaults;
    return {
      section: { ...defaults.section, ...parsed.section },
      library: {
        ...defaults.library,
        ...parsed.library,
        badges: Array.isArray(parsed.library?.badges)
          ? parsed.library.badges
          : defaults.library.badges,
      },
      pricing: { ...defaults.pricing, ...parsed.pricing },
      books: parsed.books,
    };
  } catch {
    return defaults;
  }
}

export function writeAudioContent(content: AudioContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — the audio shelves updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearAudioContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(AUDIO_STORAGE_KEY);
    return { ok: true, message: "Restored the original audiobook collection." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
