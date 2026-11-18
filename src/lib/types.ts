export type CategorySlug =
  | "uponnash"
  | "sahitto"
  | "islamic-itihas"
  | "jiboni"
  | "student"
  | "international";

export type BookTag =
  | "bestseller"
  | "new"
  | "viral"
  | "free-delivery"
  | "up-sale"
  | "trending"
  | "sunnah"
  | "international"
  | "student"
  | "audio";

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
  /** Optional uploaded cover image (compressed data URL). */
  imageSrc?: string;
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
  category: string;
  /** Optional sub-shelf inside the category (slug from the admin category editor). */
  subcategory?: string;
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
  /** Optional uploaded logo/image (compressed data URL). */
  imageSrc?: string;
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
  /** Optional admin reply shown under the review on the storefront. */
  reply?: string;
  replyDate?: string;
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
  category: string;
  stock: number;
  highlights: string[];
  specs: { label: string; value: string }[];
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

/**
 * A copy sold to TalkNest through the 50% used-book programme and now listed in
 * the 50% up sale: the reader was paid half the new price, and the copy is
 * priced 50% above that payout when it returns to the shelf.
 */
export interface UpSaleBook {
  id: string;
  cartSlug: string;
  bookSlug: string;
  title: string;
  author: string;
  condition: string;
  /** Current price of a brand-new copy. */
  originalPrice: number;
  /** What TalkNest paid the reader for the used book (50% of new). */
  sellingPrice: number;
  /** Selling price + 50% — what the next reader pays. */
  price: number;
  returnedBy: string;
  location: string;
  stock: number;
  cover: BookCoverTheme;
}
