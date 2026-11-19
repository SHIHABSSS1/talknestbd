import { BadgeCheck, BadgePercent, Bell, BookMarked, BookOpen, Building2, Flame, Gift, Globe2, GraduationCap, Headphones, HeartHandshake, Image as ImageIcon, LayoutDashboard, LayoutGrid, LibraryBig, Mic, Moon, Newspaper, PlayCircle, Repeat2, Settings, ShieldCheck, ShoppingBag, Package, TrendingUp, Users, UsersRound, UserRound, type LucideIcon } from "lucide-react";

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
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Admin profile", href: "/admin/profile", icon: UserRound },
    ],
  },
  {
    label: "Homepage sections",
    items: [
      { label: "Hero banner", href: "/admin/sections/hero", icon: ImageIcon },
      { label: "Trust strip cards", href: "/admin/sections/trust-strip", icon: BadgeCheck },
      { label: "Category showcase", href: "/admin/sections/categories", icon: LayoutGrid },
      { label: "Viral books", href: "/admin/sections/viral-books", icon: Flame },
      { label: "Sell used books banner", href: "/admin/sections/sell-used-books", icon: Repeat2 },
      { label: "50% Up Sale", href: "/admin/sections/up-sale", icon: TrendingUp },
      { label: "Used books banner", href: "/admin/sections/used-books", icon: BookMarked },
      { label: "New Arrivals", href: "/admin/sections/new-arrivals", icon: Package },
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
      { label: "Users & roles", href: "/admin/users", icon: ShieldCheck },
      { label: "Site settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function findAdminNavItem(href: string): AdminNavItem | undefined {
  return adminNavGroups
    .flatMap((group) => group.items)
    .find((item) => item.href === href);
}
