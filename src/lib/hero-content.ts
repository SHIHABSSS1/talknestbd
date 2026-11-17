/**
 * Shared hero banner content for the admin editor and the storefront hero.
 * Persisted in localStorage (demo only — there is no backend).
 */

export type HeroBanner = {
  id: string;
  /** Unsplash photo id used to build responsive URLs for the built-in slides. */
  imageId?: string;
  /** Full image URL or a compressed data URL for custom / uploaded slides. */
  src?: string;
  /** Accessible description of the image. */
  alt: string;
  /** CSS object-position, e.g. "50% 45%". */
  position?: string;
};

export type HeroContent = {
  banners: HeroBanner[];
};

export type SaveResult = { ok: boolean; message: string };

export const HERO_STORAGE_KEY = "talknestbd-hero-v1";
export const IMAGE_WIDTHS = [800, 1200, 1600, 2000];

/** Shown when a slide has neither an Unsplash id nor a custom source. */
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='560'%3E%3Crect width='100%25' height='100%25' fill='%23e7e5e4'/%3E%3C/svg%3E";

export const heroDefaults: HeroContent = {
  banners: [
    {
      id: "library",
      imageId: "1481627834876-b7833e8f5570",
      alt: "A warm, softly lit aisle of bookshelves in a library",
    },
    {
      id: "open-book",
      imageId: "1532012197267-da84d127e765",
      alt: "An open book glowing at the end of a bookshop aisle",
      position: "50% 45%",
    },
    {
      id: "readers",
      imageId: "1523240795612-9a054b0db644",
      alt: "Students laughing together over books in a library",
      position: "55% 45%",
    },
    {
      id: "audiobooks",
      imageId: "1546435770-a3e426bf472b",
      alt: "Headphones resting on a light desk beside a keyboard",
    },
  ],
};

export function cloneHeroDefaults(): HeroContent {
  return JSON.parse(JSON.stringify(heroDefaults)) as HeroContent;
}

/** Full image URL for a banner at a given width. */
export function bannerSrc(banner: HeroBanner, width: number): string {
  if (banner.src) return banner.src;
  if (banner.imageId) {
    const height = Math.round(width * 0.35);
    return `https://images.unsplash.com/photo-${banner.imageId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
  }
  return PLACEHOLDER;
}

/** Responsive srcSet for Unsplash-backed slides; custom/data URLs use one source. */
export function bannerSrcSet(banner: HeroBanner): string | undefined {
  if (!banner.imageId || banner.src) return undefined;
  return IMAGE_WIDTHS.map((width) => `${bannerSrc(banner, width)} ${width}w`).join(", ");
}

function isBanner(value: unknown): value is HeroBanner {
  if (!value || typeof value !== "object") return false;
  const banner = value as Record<string, unknown>;
  return (
    typeof banner.id === "string" &&
    typeof banner.alt === "string" &&
    (banner.imageId === undefined || typeof banner.imageId === "string") &&
    (banner.src === undefined || typeof banner.src === "string") &&
    (banner.position === undefined || typeof banner.position === "string")
  );
}

/** Reads and validates stored content, falling back to the sample hero. */
export function readHeroContent(): HeroContent {
  if (typeof window === "undefined") return cloneHeroDefaults();
  try {
    const raw = window.localStorage.getItem(HERO_STORAGE_KEY);
    if (!raw) return cloneHeroDefaults();
    const parsed = JSON.parse(raw) as Partial<HeroContent>;
    if (!Array.isArray(parsed.banners) || !parsed.banners.every(isBanner)) {
      return cloneHeroDefaults();
    }
    return {
      banners: parsed.banners.map((banner, index) => ({
        ...banner,
        id: banner.id || `banner-${index}`,
      })),
    };
  } catch {
    return cloneHeroDefaults();
  }
}

/** Writes content to localStorage, reporting quota/availability failures. */
export function writeHeroContent(content: HeroContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(content));
    return {
      ok: true,
      message: "Saved to this browser — the homepage hero now uses these banners.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Could not save: browser storage may be full. Try fewer slides or smaller images.",
    };
  }
}

/** Removes the stored override so the sample hero is used again. */
export function clearHeroContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(HERO_STORAGE_KEY);
    return { ok: true, message: "Restored the original sample hero." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
