import {
  BadgePercent,
  BookOpen,
  Bookmark,
  Building2,
  CircleHelp,
  FileText,
  Gift,
  Headphones,
  HeartHandshake,
  LibraryBig,
  Mic,
  Newspaper,
  PackageSearch,
  Repeat2,
  Store,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export const mainNav: NavLink[] = [
  { label: "সব বই", href: "/books" },
  { label: "বেস্ট সেলার", href: "/best-sellers" },
  { label: "নতুন বই", href: "/new-books" },
  { label: "অডিও বুক", href: "/audio-books" },
  { label: "সুন্নাহ সামগ্রী", href: "/sunnah-items" },
  { label: "লেখক", href: "/authors" },
  { label: "প্রকাশনী", href: "/publishers" },
];

export const categoryLinks: NavLink[] = [
  { label: "উপন্যাস", href: "/category/uponnash", description: "নতুন ও ক্লাসিক উপন্যাস" },
  { label: "সাহিত্য", href: "/category/sahitto", description: "কবিতা, গল্প ও প্রবন্ধ" },
  { label: "ইসলামিক ইতিহাস", href: "/category/islamic-itihas", description: "সিরাত ও ইতিহাস" },
  { label: "জীবনী", href: "/category/jiboni", description: "অনুপ্রেরণার বাস্তব গল্প" },
  { label: "স্টুডেন্ট বুকস", href: "/category/student", description: "পড়াশোনা ও প্রস্তুতি" },
  { label: "আন্তর্জাতিক", href: "/category/international", description: "বিশ্বসাহিত্য ও অনুবাদ" },
];

export const moreLinks: NavLink[] = [
  { label: "পাইকারি অর্ডার", href: "/wholesale", icon: Store },
  { label: "ফ্রি ডেলিভারি", href: "/free-order", icon: Gift },
  { label: "৫০% বই ফেরত", href: "/buyback", icon: Repeat2 },
  { label: "পুরাতন বই (৫০% আপ)", href: "/used-books", icon: Bookmark },
  { label: "ভাইরাল বই", href: "/viral-books", icon: BadgePercent },
  { label: "ভিডিও", href: "/video", icon: Video },
  { label: "কুইজ", href: "/quiz", icon: CircleHelp },
  { label: "হৃদয়ের গল্প", href: "/stories", icon: Mic },
  { label: "কাস্টমার রিভিউ", href: "/reviews", icon: HeartHandshake },
  { label: "ব্লগ", href: "/blogs", icon: Newspaper },
  { label: "আমাদের সম্পর্কে", href: "/about", icon: LibraryBig },
  { label: "যোগাযোগ", href: "/contact", icon: Newspaper },
];

export const footerLinks = {
  shop: [
    { label: "সব বই", href: "/books" },
    { label: "বেস্ট সেলার", href: "/best-sellers" },
    { label: "নতুন বই", href: "/new-books" },
    { label: "ভাইরাল বই", href: "/viral-books" },
    { label: "স্টুডেন্ট বুকস", href: "/student-books" },
    { label: "আন্তর্জাতিক বই", href: "/international-books" },
  ],
  services: [
    { label: "পাইকারি অর্ডার", href: "/wholesale" },
    { label: "ফ্রি ডেলিভারি", href: "/free-order" },
    { label: "৫০% বই ফেরত", href: "/buyback" },
    { label: "পুরাতন বই কিনুন", href: "/used-books" },
    { label: "অডিও বুক", href: "/audio-books" },
    { label: "সুন্নাহ সামগ্রী", href: "/sunnah-items" },
  ],
  community: [
    { label: "লেখক", href: "/authors" },
    { label: "প্রকাশনী", href: "/publishers" },
    { label: "TalkNest ভিডিও", href: "/video" },
    { label: "TalkNest কুইজ", href: "/quiz" },
    { label: "হৃদয়ের গল্প", href: "/stories" },
    { label: "কাস্টমার রিভিউ", href: "/reviews" },
    { label: "ব্লগ", href: "/blogs" },
  ],
};

export const mobileTabLinks = [
  { label: "হোম", href: "/", icon: BookOpen },
  { label: "বই", href: "/books", icon: Bookmark },
  { label: "খুঁজুন", href: "/search", icon: PackageSearch },
  { label: "উইশলিস্ট", href: "/wishlist", icon: Users },
  { label: "কার্ট", href: "/cart", icon: FileText },
];

export const footerIcons = { Headphones, Building2 };
