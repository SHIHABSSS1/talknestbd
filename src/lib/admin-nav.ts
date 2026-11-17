import {
  BadgeCheck,
  BadgePercent,
  BookMarked,
  BookOpen,
  Building2,
  Flame,
  Gift,
  Globe2,
  GraduationCap,
  Headphones,
  HeartHandshake,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutGrid,
  LibraryBig,
  LogIn,
  Mic,
  Moon,
  Newspaper,
  PlayCircle,
  Repeat2,
  Settings,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Homepage sections",
    items: [
      { label: "Hero banner", href: "/admin/sections/hero", icon: ImageIcon },
      { label: "Trust strip", href: "/admin/sections/trust-strip", icon: BadgeCheck },
      { label: "Category showcase", href: "/admin/sections/categories", icon: LayoutGrid },
      { label: "Best sellers", href: "/admin/sections/best-sellers", icon: Flame },
      { label: "Sell used books banner", href: "/admin/sections/sell-used-books", icon: Repeat2 },
      { label: "Up sale rail", href: "/admin/sections/up-sale", icon: TrendingUp },
      { label: "Used books banner", href: "/admin/sections/used-books", icon: BookMarked },
      { label: "New arrivals", href: "/admin/sections/new-arrivals", icon: Sparkles },
      { label: "Free order & wholesale", href: "/admin/sections/free-order-wholesale", icon: Gift },
      { label: "Trending now", href: "/admin/sections/trending", icon: BadgePercent },
      { label: "Audiobooks showcase", href: "/admin/sections/audio", icon: Headphones },
      { label: "Sunnah essentials", href: "/admin/sections/sunnah", icon: Moon },
      { label: "International books", href: "/admin/sections/international", icon: Globe2 },
      { label: "Authors spotlight", href: "/admin/sections/authors", icon: Users },
      { label: "Publishers strip", href: "/admin/sections/publishers", icon: Building2 },
      { label: "Student books", href: "/admin/sections/student-books", icon: GraduationCap },
      { label: "Reviews wall", href: "/admin/sections/reviews", icon: HeartHandshake },
      { label: "Video & quiz", href: "/admin/sections/video-quiz", icon: PlayCircle },
      { label: "Story community", href: "/admin/sections/stories", icon: Mic },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Books (upload / edit)", href: "/admin/books", icon: LibraryBig },
      { label: "Blog posts", href: "/admin/blogs", icon: Newspaper },
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Customers", href: "/admin/customers", icon: UsersRound },
      { label: "All books view", href: "/admin/catalog", icon: BookOpen },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Site settings", href: "/admin/settings", icon: Settings },
      { label: "Sign in", href: "/admin/login", icon: LogIn },
    ],
  },
];

export function findAdminNavItem(href: string): AdminNavItem | undefined {
  return adminNavGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === href);
}
