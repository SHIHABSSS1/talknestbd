import type { Book } from "./types";

export const freeAudioSlugs = ["neel-megh", "moner-gohine"];

export function isFreeAudio(slug: string): boolean {
  return freeAudioSlugs.includes(slug);
}

export function audioPrice(book: Book): number {
  return Math.max(99, Math.round(book.price * 0.6));
}

export interface AudioChapter {
  id: string;
  title: string;
  duration: string;
  src: string;
  free: boolean;
}

const demoTracks = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
];

const demoDurations = ["12:40", "18:05", "14:32"];

export function audioChapters(book: Book): AudioChapter[] {
  const fullyFree = isFreeAudio(book.slug);
  return ["Chapter 1", "Chapter 2", "Chapter 3"].map((title, index) => ({
    id: `${book.slug}-${index + 1}`,
    title,
    duration: demoDurations[index],
    src: demoTracks[index % demoTracks.length],
    free: fullyFree || index === 0,
  }));
}
