import type { Category, CategorySlug } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "uponnash",
    name: "Novels",
    englishName: "Fiction",
    description:
      "New voices, old memories and unfamiliar worlds — a curated shelf of novels worth staying up for.",
    primary: true,
    accent: "#BACDFF",
  },
  {
    slug: "sahitto",
    name: "Literature",
    englishName: "Essays & Poetry",
    description:
      "Poetry, short stories and essays for readers who like to take their time.",
    primary: true,
    accent: "#96DB9D",
  },
  {
    slug: "islamic-itihas",
    name: "Islamic History",
    englishName: "Seerah & History",
    description:
      "Trusted books on the life of the Prophet, Islamic civilisation and the people who shaped it.",
    primary: true,
    accent: "#96CADB",
  },
  {
    slug: "jiboni",
    name: "Biographies",
    englishName: "Real Lives",
    description:
      "Stories of thinkers, athletes and everyday heroes who give us the courage to keep going.",
    primary: true,
    accent: "#E1C0FF",
  },
  {
    slug: "student",
    name: "Student Books",
    englishName: "Study Guides",
    description:
      "Academic guides, references and skill-building books in one place.",
    primary: false,
    accent: "#FF9900",
  },
  {
    slug: "international",
    name: "International",
    englishName: "World Literature",
    description:
      "Global bestsellers and world classics in reader-friendly English editions.",
    primary: false,
    accent: "#37AAF7",
  },
];

export const mainCategories = categories.filter((category) => category.primary);

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function categoryLabel(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? "Books";
}
