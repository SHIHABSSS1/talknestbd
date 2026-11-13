"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Phone,
  RotateCcw,
  ShoppingBag,
  Store,
  Truck,
  User,
  X,
} from "lucide-react";
import { categoryLinks, mainNav, moreLinks } from "@/lib/navigation";
import { siteConfig, cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Logo } from "./Logo";
import { SearchForm } from "./SearchForm";
import { SocialLinks } from "./SocialLinks";

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [regionHeight, setRegionHeight] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setCollapsed(false);
  }, [pathname]);

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

  /**
   * Keeps the logo row pinned while the search + navigation rows slide away.
   * Scrolling down collapses them, scrolling up brings them back sticky.
   */
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        if (Math.abs(delta) < 4) return;

        const threshold = regionHeight + 8;
        if (y <= threshold) {
          setCollapsed(false);
          return;
        }
        if (delta < 0) {
          setCollapsed(false);
          return;
        }
        // Never collapse while the visitor is typing in the header search.
        const active = document.activeElement as HTMLElement | null;
        if (active && regionRef.current?.contains(active)) return;
        setCollapsed(true);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [regionHeight]);

  // Measure the collapsible region so the collapsed header reclaims its space.
  useEffect(() => {
    const element = regionRef.current;
    if (!element) return;
    const update = () => setRegionHeight(element.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="print-hide relative z-40">
        <div className="border-b border-line bg-white">
          <div className="mx-auto flex h-9 w-full max-w-[1425px] items-center justify-between gap-4 px-4 text-[11px] sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-5 text-body">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-brand-600"
              >
                <Phone size={12} className="text-brand-600" />
                <span className="font-medium">Hotline: {siteConfig.phone}</span>
              </a>
              <span className="hidden items-center gap-1.5 whitespace-nowrap text-muted sm:flex">
                <Truck size={13} className="text-brand-600" />
                Free delivery on orders over ৳{siteConfig.freeDeliveryThreshold}
              </span>
              <span className="hidden items-center gap-1.5 whitespace-nowrap text-muted xl:flex">
                <RotateCcw size={13} className="text-brand-600" />
                50% book buyback
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted sm:gap-5">
              <Link href="/account/orders" className="hidden transition-colors hover:text-brand-600 sm:inline">
                Track Order
              </Link>
              <Link href="/wholesale" className="hidden transition-colors hover:text-brand-600 md:inline">
                Bulk Order
              </Link>
              <Link href="/contact" className="hidden transition-colors hover:text-brand-600 lg:inline">
                Help
              </Link>
              <SocialLinks className="hidden gap-3 lg:flex" iconSize={13} />
              <span className="hidden items-center gap-1 text-muted/80 2xl:flex">
                <MapPin size={11} />
                {siteConfig.address}
              </span>
            </div>
          </div>
        </div>

      </div>

      <header className="print-hide sticky top-0 z-50 border-b border-line bg-white shadow-[0_1px_0_rgba(17,24,39,0.06)]">
        <div className="relative z-20 bg-white">
          <div className="mx-auto w-full max-w-[1425px] px-4 sm:px-6 lg:px-8">
            <div className="flex h-[64px] items-center gap-3 sm:h-[72px] sm:gap-5">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] border border-line text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <Logo />

              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                <Link
                  href="/login"
                  className="hidden items-center gap-1.5 px-2 text-xs font-medium text-body transition-colors hover:text-brand-600 xl:flex"
                >
                  <User size={17} />
                  Login
                </Link>
                <Link
                  href="/account"
                  aria-label="My account"
                  className="grid h-10 w-10 place-items-center rounded-full text-body transition-colors hover:bg-brand-50 hover:text-brand-600 xl:hidden"
                >
                  <User size={19} />
                </Link>
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="relative hidden h-10 w-10 place-items-center rounded-full text-body transition-colors hover:bg-brand-50 hover:text-brand-600 sm:grid"
                >
                  <Heart size={19} />
                  {hydrated && wishlist.length > 0 && (
                    <span className="absolute right-0 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-forest-500 px-1 text-[8px] font-bold text-white">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/cart"
                  aria-label="Cart"
                  className="relative hidden h-10 items-center gap-2 rounded-[4px] bg-brand-600 px-3 text-white transition-colors hover:bg-brand-700 sm:flex sm:px-4"
                >
                  <ShoppingBag size={18} />
                  <span className="hidden text-xs font-medium sm:inline">Cart</span>
                  {hydrated && cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-sale px-1 text-[9px] font-bold text-white ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search + navigation rows: hidden while scrolling down, sticky again on scroll up. */}
        <div
          ref={regionRef}
          className="relative z-10 transition-[transform,margin-bottom] duration-300 ease-out"
          style={{
            transform: collapsed ? "translateY(-100%)" : "translateY(0)",
            marginBottom: collapsed ? -regionHeight : 0,
          }}
        >
          <div className="mx-auto w-full max-w-[1425px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-2xl pb-3">
              <SearchForm />
            </div>
          </div>

          <nav aria-label="Primary navigation" className="hidden lg:block">
            <div className="bg-brand-600">
              <div className="mx-auto flex h-10 w-full max-w-[1425px] items-center gap-1 px-4 text-[13px] font-medium text-white sm:px-6 lg:px-8">
                <div className="group relative h-10">
                  <Link
                    href="/categories"
                    className="inline-flex h-10 items-center gap-2 whitespace-nowrap px-3 transition-colors hover:bg-brand-700"
                  >
                    <Menu size={15} />
                    All Categories
                    <ChevronDown size={13} />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-20 w-72 translate-y-1 border border-line bg-white p-1.5 text-ink opacity-0 shadow-[0_16px_32px_-20px_rgba(17,24,39,0.4)] transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {categoryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-3 py-2.5 transition-colors hover:bg-brand-50"
                      >
                        <span className="block text-[13px] font-medium text-ink">
                          {link.label}
                        </span>
                        <span className="block text-[11px] text-muted">
                          {link.description}
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/categories"
                      className="mt-1 block border-t border-line px-3 pb-2 pt-3 text-[12px] font-medium text-brand-600 hover:text-brand-700"
                    >
                      View all categories →
                    </Link>
                  </div>
                </div>

                <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/25" />

                {mainNav.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex h-10 items-center whitespace-nowrap px-2.5 transition-colors hover:bg-brand-700",
                      index >= 5 && "hidden xl:inline-flex",
                      isActive(link.href) && "bg-brand-700",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="group relative ml-auto h-10">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-1 whitespace-nowrap px-3 transition-colors hover:bg-brand-700"
                  >
                    More
                    <ChevronDown size={13} />
                  </button>
                  <div className="invisible absolute right-0 top-full z-20 w-[30rem] translate-y-1 border border-line bg-white p-2 text-ink opacity-0 shadow-[0_16px_32px_-20px_rgba(17,24,39,0.4)] transition-all duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-1">
                      {moreLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-medium text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
                          >
                            {Icon && <Icon size={15} className="shrink-0 text-brand-600" />}
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/50 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-[4px] border border-line text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SearchForm />

              <div className="mt-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  Shop by category
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {categoryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="border border-line bg-canvas px-3 py-2.5 text-xs font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <nav className="mt-6 space-y-0.5">
                {mainNav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-50 hover:text-brand-700",
                      isActive(link.href) && "bg-brand-50 text-brand-700",
                    )}
                  >
                    {link.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  More from TalkNest
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 border border-line bg-white px-3 py-2.5 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      {link.icon && <link.icon size={14} className="shrink-0 text-brand-600" />}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-brand-600 p-4 text-white">
                <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80">
                  <Store size={12} />
                  Need help choosing a book?
                </p>
                <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-white/90">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  {siteConfig.address}
                </p>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-white"
                >
                  <Phone size={14} />
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
