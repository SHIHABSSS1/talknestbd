"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  RotateCcw,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";
import { categoryLinks, mainNav, moreLinks } from "@/lib/navigation";
import { siteConfig, cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";
import { SocialLinks, WhatsAppIcon } from "./SocialLinks";

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="print-hide relative z-40">
        <div className="bg-forest-950 text-cream-100/75">
          <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-4 px-4 text-[10px] sm:px-6 sm:text-[11px] lg:px-8">
            <div className="flex min-w-0 items-center gap-5">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <Truck size={13} className="text-gold-400" />
                <span className="truncate">
                  ৳{siteConfig.freeDeliveryThreshold}+ অর্ডারে ফ্রি ডেলিভারি
                </span>
              </span>
              <span className="hidden items-center gap-1.5 whitespace-nowrap sm:flex">
                <RotateCcw size={13} className="text-gold-400" />
                বই ফেরত দিলে ৫০% ফেরত
              </span>
            </div>
            <div className="flex items-center gap-3.5 sm:gap-5">
              <Link
                href="/wholesale"
                className="hidden text-cream-100/80 transition-colors hover:text-gold-300 sm:inline"
              >
                পাইকারি অর্ডার
              </Link>
              <SocialLinks className="gap-3" iconSize={14} />
              <span className="hidden items-center gap-1 text-cream-100/50 lg:flex">
                <MapPin size={12} />
                {siteConfig.address}
              </span>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-50 border-b border-forest-900/8 bg-cream-50/95 shadow-[0_8px_30px_-24px_rgba(10,33,24,0.5)] backdrop-blur-xl">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-[66px] items-center gap-3 sm:h-[72px] sm:gap-5">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="মেনু খুলুন"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-forest-900/10 text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50 md:hidden"
              >
                <Menu size={20} />
              </button>

              <Logo />

              <div className="mx-auto hidden w-full max-w-md md:block lg:max-w-lg">
                <SearchForm />
              </div>

              <div className="ml-auto flex items-center gap-1 sm:gap-1.5 md:ml-0">
                <Link
                  href="/wishlist"
                  aria-label="উইশলিস্ট"
                  className="relative hidden h-10 w-10 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-100 sm:grid"
                >
                  <Heart size={20} />
                  {hydrated && wishlist.length > 0 && (
                    <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay-500 px-1 text-[8px] font-bold text-white">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account"
                  aria-label="আমার অ্যাকাউন্ট"
                  className="hidden h-10 w-10 place-items-center rounded-full text-forest-800 transition-colors hover:bg-forest-100 sm:grid"
                >
                  <User size={20} />
                </Link>
                <Link
                  href="/cart"
                  aria-label="কার্ট"
                  className="relative grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-cream-50 transition-colors hover:bg-forest-700"
                >
                  <ShoppingBag size={18} />
                  {hydrated && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-gold-500 px-1 text-[8px] font-bold text-forest-950 ring-2 ring-cream-50">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            <div className="pb-3 md:hidden">
              <SearchForm />
            </div>
          </div>

          <nav
            aria-label="প্রধান নেভিগেশন"
            className="hidden border-t border-forest-900/5 md:block"
          >
            <div className="mx-auto flex h-11 w-full max-w-7xl items-center gap-4 px-4 text-xs font-medium text-forest-900/80 sm:px-6 lg:gap-6 lg:text-[13px] lg:px-8">
              <div className="group relative">
                <Link
                  href="/categories"
                  className={cn(
                    "inline-flex h-11 items-center gap-1 whitespace-nowrap transition-colors hover:text-clay-500",
                    pathname.startsWith("/categor") && "text-clay-500",
                  )}
                >
                  ক্যাটাগরি
                  <ChevronDown size={13} />
                </Link>
                <div className="invisible absolute left-0 top-full w-72 translate-y-2 rounded-2xl border border-forest-900/10 bg-cream-50 p-2 opacity-0 shadow-xl transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {categoryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-cream-100"
                    >
                      <span className="block text-[13px] font-semibold text-forest-950">
                        {link.label}
                      </span>
                      <span className="block text-[11px] text-muted">
                        {link.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {mainNav.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex h-11 items-center whitespace-nowrap transition-colors hover:text-clay-500",
                    index >= 5 && "hidden xl:inline-flex",
                    isActive(link.href) && "text-clay-500",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="group relative ml-auto">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-1 whitespace-nowrap transition-colors hover:text-clay-500"
                >
                  আরও
                  <ChevronDown size={13} />
                </button>
                <div className="invisible absolute right-0 top-full w-[30rem] translate-y-2 rounded-2xl border border-forest-900/10 bg-cream-50 p-3 opacity-0 shadow-xl transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1">
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-medium text-forest-900 transition-colors hover:bg-cream-100"
                        >
                          {Icon && (
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forest-100 text-forest-700">
                              <Icon size={15} />
                            </span>
                          )}
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label="মেনু বন্ধ করুন"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-forest-950/55 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-cream-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-forest-900/10 px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="মেনু বন্ধ করুন"
                className="grid h-9 w-9 place-items-center rounded-full border border-forest-900/10 text-forest-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SearchForm />

              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  ক্যাটাগরি
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {categoryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl border border-forest-900/8 bg-white/60 px-3 py-2.5 text-xs font-semibold text-forest-900"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <nav className="mt-6 space-y-1">
                {mainNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-forest-900 transition-colors hover:bg-cream-100",
                      isActive(link.href) && "bg-cream-100 text-clay-500",
                    )}
                  >
                    {link.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 border-t border-forest-900/10 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  আরও সেবা
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-white/60 px-3 py-2.5 text-[11px] font-medium text-forest-900"
                    >
                      {link.icon && <link.icon size={14} className="shrink-0 text-clay-500" />}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-forest-950 p-4 text-cream-100/75">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                  হেড অফিস
                </p>
                <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gold-400" />
                  {siteConfig.address}
                </p>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-cream-50"
                >
                  <WhatsAppIcon size={15} />
                  {siteConfig.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
