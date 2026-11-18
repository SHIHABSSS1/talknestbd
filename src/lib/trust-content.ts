/**
 * Shared content for the four cards directly under the homepage hero.
 * Persisted in localStorage (demo only — there is no backend).
 */

export type TrustIconKey =
  | "headphones"
  | "repeat"
  | "mic"
  | "store"
  | "book"
  | "truck"
  | "gift"
  | "shield"
  | "star"
  | "heart"
  | "users"
  | "sparkles"
  | "radio"
  | "play"
  | "clock"
  | "tag"
  | "library"
  | "graduation";

export type TrustTintKey = "brand" | "sale" | "forest" | "gold" | "mint";

export interface TrustCard {
  id: string;
  title: string;
  text: string;
  href: string;
  icon: TrustIconKey;
  tint: TrustTintKey;
  /** Optional image (URL or compressed data URL) shown instead of the icon. */
  src?: string;
}

export interface TrustContent {
  cards: TrustCard[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const TRUST_STORAGE_KEY = "talknestbd-trust-strip-v1";

/** Static class strings (not interpolated) so Tailwind v4 keeps them. */
export const trustTints: Record<TrustTintKey, { label: string; className: string }> = {
  brand: { label: "Blue", className: "bg-brand-50 text-brand-600" },
  sale: { label: "Orange", className: "bg-[#fff5e6] text-sale" },
  forest: { label: "Indigo", className: "bg-forest-100 text-forest-700" },
  gold: { label: "Gold", className: "bg-gold-300/25 text-gold-600" },
  mint: { label: "Green", className: "bg-mint/25 text-forest-700" },
};

export const trustIconKeys: { key: TrustIconKey; label: string }[] = [
  { key: "headphones", label: "Headphones" },
  { key: "repeat", label: "Recycle / exchange" },
  { key: "mic", label: "Microphone / podcast" },
  { key: "store", label: "Store" },
  { key: "book", label: "Book" },
  { key: "truck", label: "Delivery" },
  { key: "gift", label: "Gift" },
  { key: "shield", label: "Shield / trust" },
  { key: "star", label: "Star" },
  { key: "heart", label: "Heart" },
  { key: "users", label: "Community" },
  { key: "sparkles", label: "Highlight" },
  { key: "radio", label: "Radio" },
  { key: "play", label: "Play" },
  { key: "clock", label: "Clock" },
  { key: "tag", label: "Tag / price" },
  { key: "library", label: "Library" },
  { key: "graduation", label: "Education" },
];

export const trustDefaults: TrustContent = {
  cards: [
    {
      id: "audiobooks",
      icon: "headphones",
      title: "Audiobooks",
      text: "Listen on any device",
      href: "/audio-books",
      tint: "brand",
    },
    {
      id: "sell-used",
      icon: "repeat",
      title: "Sell used books",
      text: "Sell a book, get half back",
      href: "/sell-used-books",
      tint: "sale",
    },
    {
      id: "podcast",
      icon: "mic",
      title: "TalkNest Podcast",
      text: "New episode every Thursday",
      href: "/video",
      tint: "brand",
    },
    {
      id: "wholesale",
      icon: "store",
      title: "Wholesale pricing",
      text: "Special rates for libraries",
      href: "/wholesale",
      tint: "brand",
    },
  ],
};

export function cloneTrustDefaults(): TrustContent {
  return JSON.parse(JSON.stringify(trustDefaults)) as TrustContent;
}

const VALID_ICONS = new Set<string>(trustIconKeys.map((item) => item.key));
const VALID_TINTS = new Set<string>(Object.keys(trustTints));

function isCard(value: unknown): value is TrustCard {
  if (!value || typeof value !== "object") return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card.id === "string" &&
    typeof card.title === "string" &&
    typeof card.text === "string" &&
    typeof card.href === "string" &&
    typeof card.icon === "string" &&
    VALID_ICONS.has(card.icon) &&
    typeof card.tint === "string" &&
    VALID_TINTS.has(card.tint) &&
    (card.src === undefined || typeof card.src === "string")
  );
}

export function readTrustContent(): TrustContent {
  if (typeof window === "undefined") return cloneTrustDefaults();
  try {
    const raw = window.localStorage.getItem(TRUST_STORAGE_KEY);
    if (!raw) return cloneTrustDefaults();
    const parsed = JSON.parse(raw) as Partial<TrustContent>;
    if (!Array.isArray(parsed.cards) || !parsed.cards.every(isCard)) {
      return cloneTrustDefaults();
    }
    return {
      cards: parsed.cards.map((card, index) => ({
        ...card,
        id: card.id || `card-${index}`,
      })),
    };
  } catch {
    return cloneTrustDefaults();
  }
}

export function writeTrustContent(content: TrustContent): SaveResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Storage is not available while rendering on the server.",
    };
  }
  try {
    window.localStorage.setItem(TRUST_STORAGE_KEY, JSON.stringify(content));
    return {
      ok: true,
      message: "Saved to this browser — the cards now show on the homepage.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Could not save: browser storage may be full. Try smaller images or fewer cards.",
    };
  }
}

export function clearTrustContent(): SaveResult {
  if (typeof window === "undefined") {
    return {
      ok: false,
      message: "Storage is not available while rendering on the server.",
    };
  }
  try {
    window.localStorage.removeItem(TRUST_STORAGE_KEY);
    return { ok: true, message: "Restored the original four cards." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
