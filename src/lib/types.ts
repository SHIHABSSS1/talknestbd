export type CategorySlug =
  | "uponnash"
  | "sahitto"
  | "islamic-itihas"
  | "jiboni"
  | "student"
  | "international";

export type BookTag = "bestseller" | "new" | "viral" | "free-delivery";

export type CollectionSlug =
  | "bestseller"
  | "new"
  | "viral"
  | "international"
  | "student"
  | "audio";

export type CoverMotif = "arch" | "circle" | "lines" | "star" | "wave" | "grid";

export interface BookCoverTheme {
  from: string;
  to: string;
  accent: string;
  motif: CoverMotif;
}

export interface AudioInfo {
  duration: string;
  narrator: string;
}

export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  authorSlug: string;
  publisher: string;
  publisherSlug: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  pages: number;
  language: string;
  binding: string;
  publishedYear: number;
  stock: number;
  description: string;
  longDescription: string[];
  highlights: string[];
  cover: BookCoverTheme;
  tags: BookTag[];
  audio?: AudioInfo;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  englishName: string;
  description: string;
  primary: boolean;
  accent: string;
}

export interface Author {
  slug: string;
  name: string;
  title: string;
  bio: string;
  longBio: string[];
  image?: string;
  location: string;
  quote: string;
  featured: boolean;
}

export interface Publisher {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  established: string;
  location: string;
  initials: string;
  accent: string;
  featured: boolean;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  bookTitle: string;
  bookSlug: string;
  date: string;
  avatarColor: string;
  verified: boolean;
}

export type SunnahIcon =
  | "sparkles"
  | "circle-dot"
  | "droplets"
  | "moon"
  | "notebook-pen"
  | "gem"
  | "gift"
  | "sun";

export interface SunnahItem {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  oldPrice?: number;
  description: string;
  icon: SunnahIcon;
  badge?: string;
  accent: string;
}

export type StoryType = "voice" | "text" | "pdf";

export interface Story {
  id: string;
  name: string;
  title: string;
  excerpt: string;
  type: StoryType;
  duration?: string;
  likes: number;
  date: string;
  avatarColor: string;
}

export interface TalkVideo {
  id: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  thumbnail: string;
  youtubeId: string;
  host: string;
  episode: number;
  featured?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface UsedBook {
  id: string;
  title: string;
  author: string;
  condition: string;
  price: number;
  originalPrice: number;
  seller: string;
  location: string;
  cover: BookCoverTheme;
}
