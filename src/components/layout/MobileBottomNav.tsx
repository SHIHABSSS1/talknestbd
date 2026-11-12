"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LibraryBig, Search, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Books", href: "/books", icon: LibraryBig },
  { label: "Search", href: "/search", icon: Search },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, hydrated } = useStore();

  return (
    <nav
      aria-label="Mobile navigation"
      className="print-hide fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
    >
      <div className="grid h-15 grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-brand-600" : "text-muted",
              )}
            >
              <span className="relative">
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-brand-600" : ""}
                />
                {tab.href === "/cart" && hydrated && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[8px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              {tab.label}
              {active && (
                <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-brand-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
