import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Home,
  PackageSearch,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for wasn't found — head back to the TalkNest BD book collection.",
};

const links = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BookOpen, label: "All books", href: "/books" },
  { icon: PackageSearch, label: "Search books", href: "/search" },
  { icon: Compass, label: "Categories", href: "/categories" },
];

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-30" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full border border-forest-900/8" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full border border-clay-500/10" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-clay-500">
            <Sparkles size={12} /> Lost in the pages
          </span>
          <p className="mt-4 font-display text-[5rem] font-bold leading-none text-forest-900/12 sm:text-[7rem]">
            404
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-snug text-forest-950 sm:text-4xl">
            Page not found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            It looks like this page has been moved, the address has changed, or
            the link is broken. Don&apos;t worry — start again below.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button href="/" size="sm">
              <Home size={13} /> Back to home
            </Button>
            <Button href="/books" variant="outline" size="sm">
              <BookOpen size={13} /> Browse books
            </Button>
          </div>

          <div className="mt-9 grid gap-2 sm:grid-cols-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-3 text-[10px] font-semibold text-forest-900 transition-colors hover:border-forest-900/25"
              >
                <link.icon size={13} className="text-forest-600" />
                {link.label}
                <ArrowRight size={11} className="text-forest-900/25 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-9 max-w-md rounded-2xl border border-gold-500/20 bg-gold-500/8 px-4 py-3.5 text-left">
            <p className="text-[10px] font-semibold text-forest-950">Need a good book recommendation?</p>
            <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
              Message our team on WhatsApp and we&apos;ll help you pick books to
              suit your taste.
            </p>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-clay-600 hover:text-clay-500"
            >
              Get a recommendation <ArrowRight size={11} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
