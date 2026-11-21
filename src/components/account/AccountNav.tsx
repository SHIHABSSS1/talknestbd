"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Headphones,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Package,
  PenLine,
  Settings,
  UserRound,
} from "lucide-react";
import { accountFetch } from "@/lib/account-client";
import { authClient } from "@/lib/auth-client";
import type { Profile } from "@/lib/orders";
import { cn, initials } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/account", icon: LayoutDashboard },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "My Reviews", href: "/account/reviews", icon: MessageSquare },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "My Audiobooks", href: "/account/audiobooks", icon: Headphones },
  { label: "My Stories", href: "/account/stories", icon: PenLine },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export function AccountNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    accountFetch<Profile>("/api/account/profile")
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="lg:sticky lg:top-[88px]">
      <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4">
        <div className="flex items-center gap-3 border-b border-forest-900/8 pb-4">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-forest-900 font-display text-sm font-bold text-gold-300">
            {profile ? initials(profile.name) : <UserRound size={18} />}
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-forest-950">
              {profile?.name ?? "Loading…"}
            </p>
            <p className="truncate text-[9px] text-muted">
              {profile?.email ?? "Your account"}
            </p>
          </div>
        </div>

        <nav className="mt-3 space-y-0.5">
          {links.map((link) => {
            const active =
              link.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "bg-forest-900 text-cream-50" : "text-forest-800 hover:bg-cream-100",
                )}
              >
                <Icon size={15} className={active ? "text-gold-300" : "text-forest-600"} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={signOut}
          className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] font-medium text-clay-600 transition-colors hover:bg-cream-100"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
        <p className="text-[11px] font-semibold text-forest-900">Get 50% back after reading</p>
        <p className="mt-1 text-[9px] leading-relaxed text-muted">
          Sell a book you bought from us and get 50% of the purchase price back.
        </p>
        <Link
          href="/sell-used-books"
          className="mt-2 inline-flex text-[10px] font-semibold text-clay-600 hover:text-clay-500"
        >
          Learn more →
        </Link>
      </div>
    </aside>
  );
}
