import type { Publisher } from "@/lib/types";

export const publishers: Publisher[] = [
  {
    slug: "onnodhara",
    name: "অন্যধারা প্রকাশন",
    tagline: "নতুন ভাষার খোঁজে, নতুন গল্পের পাশে",
    description:
      "সমকালীন বাংলা সাহিত্যের নতুন কণ্ঠস্বরদের তুলে আনতে কাজ করছে অন্যধারা। উপন্যাস ও কবিতার বাছাই করা সংস্করণের জন্য পাঠকপ্রিয়।",
    established: "২০১৭",
    location: "ঢাকা",
    initials: "অ",
    accent: "#1b5b45",
    featured: true,
  },
  {
    slug: "pathshala",
    name: "পাঠশালা পাবলিশিং",
    tagline: "পাঠের আনন্দ সবার ঘরে",
    description:
      "সাহিত্য, প্রবন্ধ ও সমসাময়িক বিষয়ের বই প্রকাশ করে পাঠশালা। পাঠকের সঙ্গে দীর্ঘমেয়াদি সম্পর্কই তাদের সবচেয়ে বড় সম্পদ।",
    established: "২০১২",
    location: "ঢাকা",
    initials: "পা",
    accent: "#9a4830",
    featured: true,
  },
  {
    slug: "maktabatul-furqan",
    name: "মাকতাবাতুল ফুরকান",
    tagline: "নির্ভরযোগ্য ইসলামিক পাঠ",
    description:
      "সিরাত, হাদিস, ইসলামি ইতিহাস ও সুন্নাহর বইয়ের জন্য বিশ্বস্ত প্রকাশনী। প্রতিটি বইয়ের তথ্যসূত্র যাচাই করে প্রকাশ করা হয়।",
    established: "২০০৯",
    location: "ঢাকা",
    initials: "মা",
    accent: "#215f50",
    featured: true,
  },
  {
    slug: "shomoy",
    name: "সময় প্রকাশন",
    tagline: "সময়ের মূল্য রাখে যেসব বই",
    description:
      "জীবনী, মুক্তিযুদ্ধ ও ইতিহাসভিত্তিক বাস্তবধর্মী বইয়ের প্রকাশক। গবেষণাধর্মী কাজের জন্য পরিচিত।",
    established: "২০১৪",
    location: "ঢাকা",
    initials: "স",
    accent: "#87642b",
    featured: true,
  },
  {
    slug: "students-library",
    name: "স্টুডেন্টস লাইব্রেরি",
    tagline: "শিক্ষার্থীর সবচেয়ে কাছের ঠিকানা",
    description:
      "একাডেমিক গাইড, রেফারেন্স বই ও প্রতিযোগিতামূলক পরীক্ষার চর্চার বইয়ের নির্ভরযোগ্য উৎস।",
    established: "১৯৯৮",
    location: "ঢাকা",
    initials: "স্টু",
    accent: "#365f8e",
    featured: true,
  },
  {
    slug: "neelima",
    name: "নীলিমা প্রকাশ",
    tagline: "বিশ্বসাহিত্য বাংলা ভাষায়",
    description:
      "বিশ্বসাহিত্যের নির্বাচিত বইয়ের বাংলা অনুবাদ ও আন্তর্জাতিক নন-ফিকশন প্রকাশে বিশেষ আগ্রহী একটি তরুণ প্রকাশনী।",
    established: "২০২১",
    location: "চট্টগ্রাম",
    initials: "নী",
    accent: "#6b4b7a",
    featured: true,
  },
];

export function getPublisher(slug: string): Publisher | undefined {
  return publishers.find((publisher) => publisher.slug === slug);
}
