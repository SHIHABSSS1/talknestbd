"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LibraryBig, Search, ShoppingBag } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "হোম", href: "/", icon: Home },
  { label: "বই", href: "/books", icon: LibraryBig },
  { label: "খুঁজুন", href: "/search", icon: Search },
  { label: "উইশলিস্ট", href: "/wishlist", icon: Heart },
  { label: "কার্ট", href: "/cart", icon: ShoppingBag },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, hydrated } = useStore();

  return (
    <nav
      aria-label="মোবাইল নেভিগেশন"
      className="print-hide fixed inset-x-0 bottom-0 z-50 border-t border-forest-900/10 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
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
                active ? "text-forest-900" : "text-muted",
              )}
            >
              <span className="relative">
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-clay-500" : ""}
                />
                {tab.href === "/cart" && hydrated && cartCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay-500 px-1 text-[8px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
