/**
 * YouTube URL parsing shared by the admin form (instant validation) and the
 * server (authoritative validation). Only a normalised 11-character id is ever
 * stored; the browser never supplies an embed URL or raw HTML.
 */

const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/** Returns the video id for a supported YouTube URL, or null. */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  let candidate: string | null = null;

  if (hostname === "youtu.be") {
    candidate = parts[0] ?? null;
  } else if (
    hostname === "youtube.com" ||
    hostname === "m.youtube.com" ||
    hostname === "youtube-nocookie.com" ||
    hostname === "www.youtube-nocookie.com"
  ) {
    if (parts[0] === "watch") candidate = url.searchParams.get("v");
    else if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) candidate = parts[1] ?? null;
  }

  return candidate && ID_PATTERN.test(candidate) ? candidate : null;
}

/** Privacy-enhanced embed URL built from a validated id. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

export function youtubeThumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}
