import type { Category, CategorySlug } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "uponnash",
    name: "উপন্যাস",
    englishName: "Novels",
    description: "নতুন আবেশ, পুরনো স্মৃতি আর অচেনা জগতের গল্প — বাছাই করা উপন্যাসের সংগ্রহ।",
    primary: true,
    accent: "#1b5b45",
  },
  {
    slug: "sahitto",
    name: "সাহিত্য",
    englishName: "Literature",
    description: "কবিতা, ছোটগল্প, প্রবন্ধ আর ভালো লাগার নিরন্তর খোঁজ।",
    primary: true,
    accent: "#9a4830",
  },
  {
    slug: "islamic-itihas",
    name: "ইসলামিক ইতিহাস",
    englishName: "Islamic History",
    description: "ইসলামের সোনালি অধ্যায়, সিরাত ও ইতিহাসের বিশ্বস্ত বই।",
    primary: true,
    accent: "#2c6b61",
  },
  {
    slug: "jiboni",
    name: "জীবনী",
    englishName: "Biographies",
    description: "যাদের জীবন আমাদের সাহস দেয় — মনীষী, যোদ্ধা ও স্বপ্নদ্রষ্টাদের কাহিনি।",
    primary: true,
    accent: "#8a6a2f",
  },
  {
    slug: "student",
    name: "স্টুডেন্ট বুকস",
    englishName: "Student Books",
    description: "একাডেমিক গাইড, রেফারেন্স ও দক্ষতা বাড়ানোর বই এক জায়গায়।",
    primary: false,
    accent: "#3b5f8a",
  },
  {
    slug: "international",
    name: "আন্তর্জাতিক",
    englishName: "International",
    description: "বিশ্বজুড়ে পাঠকপ্রিয় বইয়ের বাংলা ও ইংরেজি সংস্করণ।",
    primary: false,
    accent: "#6a4b7a",
  },
];

export const mainCategories = categories.filter((category) => category.primary);

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function categoryLabel(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? "বই";
}
