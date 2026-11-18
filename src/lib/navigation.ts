import { BadgePercent, BookOpen, BookMarked, Bookmark, Building2, CircleHelp, FileText, Feather, Flame, Gift, Globe2, GraduationCap, Headphones, HeartHandshake, Landmark, LibraryBig, Mic, Moon, Newspaper, PackageSearch, PlayCircle, Repeat2, Package, Store, TrendingUp, Users, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export const mainNav: NavLink[] = [
  { label: "All Books", href: "/books", icon: BookOpen },
  { label: "Best Sellers", href: "/best-sellers", icon: Flame },
  { label: "New Arrivals", href: "/new-books", icon: Package },
  { label: "Buy Used Books", href: "/used-books", icon: BookMarked },
  { label: "Audiobooks", href: "/audio-books", icon: Headphones },
  { label: "Sunnah Essentials", href: "/sunnah-items", icon: Moon },
  { label: "Authors", href: "/authors", icon: Users },
  { label: "Publishers", href: "/publishers", icon: Building2 },
];

export const categoryLinks: NavLink[] = [
  {
    label: "Novels",
    href: "/category/uponnash",
    description: "New voices and modern classics",
    icon: BookOpen,
  },
  {
    label: "Literature",
    href: "/category/sahitto",
    description: "Poetry, stories and essays",
    icon: Feather,
  },
  {
    label: "Islamic History",
    href: "/category/islamic-itihas",
    description: "Seerah, civilisation and history",
    icon: Landmark,
  },
  {
    label: "Biographies",
    href: "/category/jiboni",
    description: "Real lives, real inspiration",
    icon: Users,
  },
  {
    label: "Student Books",
    href: "/category/student",
    description: "Study guides and exam prep",
    icon: GraduationCap,
  },
  {
    label: "International",
    href: "/category/international",
    description: "World literature and translations",
    icon: Globe2,
  },
  {
    label: "Audiobooks",
    href: "/audio-books",
    description: "Listen to stories wherever you are",
    icon: Headphones,
  },
];

export const moreLinks: NavLink[] = [
  { label: "Wholesale Orders", href: "/wholesale", icon: Store },
  { label: "Free Delivery", href: "/free-order", icon: Gift },
  { label: "Sell Used Books", href: "/sell-used-books", icon: Repeat2 },
  { label: "50% Up Sale", href: "/up-sales", icon: TrendingUp },
  { label: "Viral Books", href: "/viral-books", icon: BadgePercent },
  { label: "Videos", href: "/video", icon: Video },
  { label: "Watch & Quiz", href: "/quiz?tab=watch", icon: PlayCircle },
  { label: "Book Quiz", href: "/quiz?tab=book", icon: CircleHelp },
  { label: "Reader Stories", href: "/stories", icon: Mic },
  { label: "Customer Reviews", href: "/reviews", icon: HeartHandshake },
  { label: "Blog", href: "/blogs", icon: Newspaper },
  { label: "About Us", href: "/about", icon: LibraryBig },
  { label: "Contact", href: "/contact", icon: Newspaper },
];

export const footerLinks = {
  shop: [
    { label: "All Books", href: "/books" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "New Arrivals", href: "/new-books" },
    { label: "Viral Books", href: "/viral-books" },
    { label: "Student Books", href: "/student-books" },
    { label: "International Books", href: "/international-books" },
  ],
  services: [
    { label: "Wholesale Orders", href: "/wholesale" },
    { label: "Free Delivery", href: "/free-order" },
    { label: "Sell Used Books", href: "/sell-used-books" },
    { label: "50% Up Sale", href: "/up-sales" },
    { label: "Buy Used Books", href: "/used-books" },
    { label: "Audiobooks", href: "/audio-books" },
    { label: "Sunnah Essentials", href: "/sunnah-items" },
  ],
  community: [
    { label: "Authors", href: "/authors" },
    { label: "Publishers", href: "/publishers" },
    { label: "TalkNest Videos", href: "/video" },
    { label: "Watch & Quiz", href: "/quiz?tab=watch" },
    { label: "Book Quiz", href: "/quiz?tab=book" },
    { label: "Reader Stories", href: "/stories" },
    { label: "Customer Reviews", href: "/reviews" },
    { label: "Blog", href: "/blogs" },
  ],
};

export const mobileTabLinks = [
  { label: "Home", href: "/", icon: BookOpen },
  { label: "Books", href: "/books", icon: Bookmark },
  { label: "Search", href: "/search", icon: PackageSearch },
  { label: "Wishlist", href: "/wishlist", icon: Users },
  { label: "Cart", href: "/cart", icon: FileText },
];

export const footerIcons = { Headphones, Building2 };
