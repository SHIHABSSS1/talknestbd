/**
 * Shared hero banner types, defaults and image URL helpers.
 *
 * The real document lives in Postgres (`content_blocks` key "hero"), read on the
 * server by src/lib/db/queries/hero.ts and written by src/lib/actions/hero.ts.
 * The only localStorage left here is `readHeroContent`, used once to import
 * slides that were saved in a browser before the database existed.
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

/** Key of the hero document in the `content_blocks` table. */
export const HERO_CONTENT_KEY = "hero";
/** Legacy browser key — read only to import pre-database content. */
export const HERO_STORAGE_KEY = "talknestbd-hero-v1";
export const IMAGE_WIDTHS = [800, 1200, 1600, 2000];
export const MAX_HERO_BANNERS = 12;

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

/** Reads and validates content saved in this browser before the database existed. */
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

/**
 * Drops the legacy browser copy. Called after a successful publish so the
 * editor stops offering to import slides that already live in the database.
 */
export function clearLegacyHeroContent(): void {
  try {
    window.localStorage.removeItem(HERO_STORAGE_KEY);
  } catch {
    // Storage disabled: nothing to clean up.
  }
}
