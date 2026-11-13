"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Package,
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

/**
 * Net scroll distance the header reacts to. Both directions share the same
 * distance so the header cannot flicker between the two states while the
 * visitor scrolls slowly.
 */
const COLLAPSE_DISTANCE = 40;
const EXPAND_DISTANCE = 40;

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, hydrated } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [regionHeight, setRegionHeight] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef(false);

  // Keeps the ref in sync so the scroll handler can skip redundant updates.
  const setHeaderCollapsed = useCallback((value: boolean) => {
    if (collapsedRef.current === value) return;
    collapsedRef.current = value;
    setCollapsed(value);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setHeaderCollapsed(false);
  }, [pathname, setHeaderCollapsed]);

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
   *
   * The direction is measured against an anchor that only moves when the
   * header changes state, so the header needs a deliberate scroll before it
   * reacts. Without that band, slow scrolling and rubber-banding flip the
   * header on and off over and over.
   */
  useEffect(() => {
    let frame = 0;
    let anchorY = window.scrollY;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        // Collapsing the header shortens the page. Near the bottom the
        // browser then clamps the scroll position, which is a layout artefact
        // rather than an upward scroll and must not re-open the header.
        if (y >= maxScroll - 2 && y < anchorY) {
          anchorY = y;
          return;
        }

        if (y <= regionHeight + 8) {
          // Close to the top of the page the whole header stays visible.
          anchorY = y;
          setHeaderCollapsed(false);
          return;
        }

        const distance = y - anchorY;
        if (distance >= COLLAPSE_DISTANCE) {
          anchorY = y;
          // Never collapse while the visitor is typing in the header search.
          const active = document.activeElement as HTMLElement | null;
          if (active && regionRef.current?.contains(active)) return;
          setHeaderCollapsed(true);
        } else if (distance <= -EXPAND_DISTANCE) {
          anchorY = y;
          setHeaderCollapsed(false);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [regionHeight, setHeaderCollapsed]);

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
                        className="group/item flex items-center gap-3 rounded-[6px] px-2 py-2 transition-colors hover:bg-brand-50"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] bg-brand-50 text-brand-600 transition-colors group-hover/item:bg-brand-600 group-hover/item:text-white">
                          {link.icon && <link.icon size={15} strokeWidth={1.8} />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-medium text-ink">
                            {link.label}
                          </span>
                          <span className="block truncate text-[11px] text-muted">
                            {link.description}
                          </span>
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
          <aside className="absolute inset-y-0 left-0 flex w-[90%] max-w-sm flex-col bg-white shadow-2xl">
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

              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { label: "Login", href: "/login", icon: User },
                  { label: "Orders", href: "/account/orders", icon: Package },
                  { label: "Wishlist", href: "/wishlist", icon: Heart },
                  { label: "Cart", href: "/cart", icon: ShoppingBag },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex flex-col items-center gap-1.5 rounded-[10px] border border-line bg-canvas py-2.5 text-[10px] font-medium text-body transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-white text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        <Icon size={15} />
                        {item.href === "/cart" && hydrated && cartCount > 0 && (
                          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[8px] font-bold text-white">
                            {cartCount}
                          </span>
                        )}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-brand-500" />
                  Shop by category
                </p>
                <div className="mt-3 space-y-2">
                  {categoryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-[10px] border border-line bg-white px-3 py-2.5 transition-colors hover:border-brand-300 hover:bg-brand-50/70"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        {link.icon && <link.icon size={16} strokeWidth={1.8} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-semibold leading-snug text-ink">
                          {link.label}
                        </span>
                        {link.description && (
                          <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted">
                            {link.description}
                          </span>
                        )}
                      </span>
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-muted/50 transition-colors group-hover:text-brand-600"
                      />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2.5 flex h-10 items-center justify-center gap-1.5 rounded-[8px] bg-brand-50 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  View all categories
                  <ChevronRight size={13} />
                </Link>
              </div>

              <nav className="mt-6" aria-label="Browse">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-brand-500" />
                  Browse
                </p>
                <div className="mt-3 space-y-1">
                  {mainNav.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-colors",
                          active
                            ? "bg-brand-600 text-white"
                            : "text-ink hover:bg-brand-50 hover:text-brand-700",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-[8px]",
                            active
                              ? "bg-white/15 text-white"
                              : "bg-brand-50 text-brand-600",
                          )}
                        >
                          {Icon && <Icon size={15} strokeWidth={1.9} />}
                        </span>
                        {link.label}
                        <ChevronRight
                          size={15}
                          className={cn(
                            "ml-auto shrink-0",
                            active ? "text-white/70" : "text-muted/50",
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="mt-6 border-t border-line pt-5">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  <span aria-hidden="true" className="h-[3px] w-4 rounded-full bg-brand-500" />
                  More from TalkNest
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center gap-2 rounded-[10px] border border-line bg-canvas px-2.5 py-2.5 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      {link.icon && (
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-white text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                          <link.icon size={13} />
                        </span>
                      )}
                      <span className="min-w-0 truncate">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[10px] bg-brand-600 p-4 text-white">
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

              <p className="mt-4 flex items-center gap-1.5 text-[10px] text-muted">
                <Truck size={12} className="text-brand-600" />
                Free delivery on orders over ৳{siteConfig.freeDeliveryThreshold}
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
