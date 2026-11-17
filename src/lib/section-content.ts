/**
 * Static sample copy mirroring the current storefront sections.
 * Design-only editor: no persistence or database wiring yet.
 */
export interface SectionContent {
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
}

export const sectionDefaults: Record<string, SectionContent> = {
  hero: {
    eyebrow: "Featured collections",
    title: "TalkNest BD — books, audiobooks and a reader community in Bangladesh",
    description:
      "Hand-picked campaigns and collections, refreshed regularly for our readers.",
    linkLabel: "Explore collection",
  },
  "trust-strip": {
    eyebrow: "Why readers choose us",
    title: "A little more than books",
    description:
      "Audiobooks, used books, a weekly podcast and wholesale pricing — all in one place.",
    linkLabel: "Learn more",
  },
  categories: {
    eyebrow: "Browse the shelves",
    title: "Shop by category",
    description:
      "Find your next read by mood, subject or the season of life you are in.",
    linkLabel: "All categories",
  },
  "viral-books": {
    eyebrow: "Viral Books",
    title: "Books everyone is talking about",
    description:
      "The titles moving through reading groups, social feeds and dinner conversations.",
    linkLabel: "All viral books",
  },
  "sell-used-books": {
    eyebrow: "Sell Used Books",
    title: "Finished a book? Sell it to us and get 50% back.",
    description:
      "Buy any book from TalkNest, read it at your own pace, then sell it to us in readable condition. We will pay half the purchase price — simple, transparent and hassle-free.",
    linkLabel: "Sell your books",
  },
  "up-sale": {
    eyebrow: "Buy used books",
    title: "50% Up Sale",
    description:
      "Readers sell us the books they have finished, and those checked copies come back at a friendly price. Every copy here is 25% below a new one — a second life for the book, a saving for the next reader.",
    linkLabel: "All up-sale books",
  },
  "used-books": {
    eyebrow: "Pre-loved books",
    title: "A book's second life, at half the price.",
    description:
      "Sell the books you have finished and buy another reader's favourites for less. Every exchange keeps a good story in circulation.",
    linkLabel: "Buy used books",
  },
  "new-arrivals": {
    eyebrow: "New Arrivals",
    title: "Fresh off the press",
    description:
      "Newly published and newly added — the latest books on our shelves.",
    linkLabel: "All new arrivals",
  },
  "free-order-wholesale": {
    eyebrow: "Books for organisations",
    title: "Build a better library for less",
    description:
      "Simple ordering and better prices for schools, libraries, offices, bookshops and reading clubs.",
    linkLabel: "Request a quote",
  },
  trending: {
    eyebrow: "Trending Now",
    title: "Trending right now",
    description:
      "The books picking up momentum this week — liked, shared and talked about by readers.",
    linkLabel: "All trending books",
  },
  audio: {
    eyebrow: "TalkNest Audio",
    title: "A good story for every commute",
    description:
      "Listen while you travel, cook or wind down for the night. Bestselling novels, thoughtful non-fiction and the Seerah, narrated by voices worth spending time with.",
    linkLabel: "All audiobooks",
  },
  sunnah: {
    eyebrow: "Sunnah essentials",
    title: "Small Sunnah, every day",
    description:
      "Miswak, attar, tasbih and prayer mats — a considered collection for daily practice.",
    linkLabel: "All essentials",
  },
  international: {
    eyebrow: "International",
    title: "World literature, within reach",
    description:
      "Global bestsellers, modern classics and translations for curious readers.",
    linkLabel: "All world literature",
  },
  authors: {
    eyebrow: "Meet the authors",
    title: "The voices behind the shelves",
    description:
      "Get closer to the writers, thinkers and storytellers shaping what Bangladesh reads.",
    linkLabel: "All authors",
  },
  publishers: {
    eyebrow: "Our publishers",
    title: "Independent voices, trusted presses",
    description:
      "Explore hand-picked titles from publishers known for careful editing and lasting books.",
    linkLabel: "All publishers",
  },
  "student-books": {
    eyebrow: "Student Books",
    title: "Books for every study day",
    description:
      "Study guides, reference books and skill-builders for exams and beyond.",
    linkLabel: "All student books",
  },
  reviews: {
    eyebrow: "Reader reviews",
    title: "What readers are saying",
    description:
      "A book, a delivery or a used-book sale — the reader experience is the only review that matters.",
    linkLabel: "All reviews",
  },
  "video-quiz": {
    eyebrow: "Watch & learn",
    title: "Videos and quizzes for curious readers",
    description:
      "Short talks, book discussions and quick quizzes — learn something new between chapters.",
    linkLabel: "Explore videos",
  },
  stories: {
    eyebrow: "Reader stories",
    title: "Your story belongs here",
    description:
      "Share a memory, a turning point or a small everyday joy — write it, record it in your voice or upload a PDF diary.",
    linkLabel: "All stories",
  },
};

export function isKnownSection(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(sectionDefaults, slug);
}
