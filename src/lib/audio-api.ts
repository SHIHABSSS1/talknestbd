import type { AudioChapterRow, AudiobookRow } from "@/lib/db/schema";

/** Storefront-safe audiobook document (no internal ids or draft rows). */
export type AudioBookView = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  authorSlug: string;
  publisher: string;
  publisherSlug: string;
  narrator: string;
  source: string;
  duration: string;
  description: string;
  longDescription: string[];
  highlights: string[];
  category: string;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  free: boolean;
  featured: boolean;
  cover: AudiobookRow["cover"];
  rating: number;
  reviewCount: number;
  pages: number;
  language: string;
  binding: string;
  publishedYear: number;
  stock: number;
  isbn?: string;
  createdAt: string;
  chapters: {
    id: string;
    title: string;
    duration: string;
    src: string;
    free: boolean;
  }[];
};

export type AudioChapterView = AudioBookView["chapters"][number];

export function toAudioBookView(
  row: AudiobookRow,
  chapters: AudioChapterRow[],
): AudioBookView {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    ...(row.subtitle ? { subtitle: row.subtitle } : {}),
    author: row.author,
    authorSlug: row.authorSlug,
    publisher: row.publisher,
    publisherSlug: row.publisherSlug,
    narrator: row.narrator,
    source: row.source,
    duration: row.duration,
    description: row.description,
    longDescription: Array.isArray(row.longDescription) ? row.longDescription : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    category: row.category,
    ...(row.subcategory ? { subcategory: row.subcategory } : {}),
    price: Number(row.price),
    ...(row.oldPrice ? { oldPrice: Number(row.oldPrice) } : {}),
    free: row.free,
    featured: row.featured,
    cover: row.cover,
    rating: Number(row.rating),
    reviewCount: row.reviewCount,
    pages: row.pages,
    language: row.language,
    binding: row.binding,
    publishedYear: row.publishedYear,
    stock: row.stock,
    ...(row.isbn ? { isbn: row.isbn } : {}),
    createdAt: row.createdAt.toISOString(),
    chapters: [...chapters]
      .sort((a, b) => a.position - b.position)
      .map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        duration: chapter.duration,
        src: chapter.src,
        free: chapter.free,
      })),
  };
}

/** Converts a DB audiobook into the unified Book shape for cart/detail surfaces. */
export function toBookFromAudio(book: AudioBookView) {
  return {
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    authorSlug: book.authorSlug,
    publisher: book.publisher,
    publisherSlug: book.publisherSlug,
    category: book.category,
    subcategory: book.subcategory,
    price: book.price,
    oldPrice: book.oldPrice,
    rating: book.rating,
    reviewCount: book.reviewCount,
    pages: book.pages,
    language: book.language,
    binding: book.binding,
    publishedYear: book.publishedYear,
    stock: book.stock,
    description: book.description,
    longDescription: book.longDescription,
    highlights: book.highlights,
    cover: book.cover,
    tags: ["audio" as const],
    audio: { duration: book.duration, narrator: book.narrator },
    isbn: book.isbn,
  };
}
