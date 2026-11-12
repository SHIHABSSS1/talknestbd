import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { books } from "@/data/books";
import { categoryLinks } from "@/lib/navigation";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const featuredCovers = ["neel-megh", "atomic-habits", "the-alchemist"]
  .map((slug) => books.find((book) => book.slug === slug))
  .filter((book): book is NonNullable<typeof book> => Boolean(book));

export function Hero() {
  return (
    <section aria-label="Featured books" className="bg-brand-50/60 py-4 sm:py-5">
      <Container>
        <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden overflow-hidden rounded-[8px] border border-line bg-white lg:block">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
              <LayoutGrid size={16} className="text-brand-600" />
              <h2 className="text-[13px] font-bold text-ink">Shop by category</h2>
            </div>
            <nav aria-label="Shop by category" className="py-1">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-[8px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                  <ChevronRight size={12} className="text-muted" />
                </Link>
              ))}
              <Link
                href="/best-sellers"
                className="flex items-center justify-between px-4 py-[8px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                Best Sellers
                <ChevronRight size={12} className="text-muted" />
              </Link>
              <Link
                href="/new-books"
                className="flex items-center justify-between px-4 py-[8px] text-[12px] font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                New Arrivals
                <ChevronRight size={12} className="text-muted" />
              </Link>
            </nav>
            <div className="border-t border-line p-3">
              <Link
                href="/categories"
                className="flex h-9 items-center justify-center gap-1.5 rounded-[4px] bg-brand-50 text-[11px] font-medium text-brand-700 transition-colors hover:bg-brand-100"
              >
                View all categories
                <ArrowRight size={12} />
              </Link>
            </div>
          </aside>

          <div className="hero-mesh relative min-h-[390px] overflow-hidden rounded-[8px] text-white sm:min-h-[430px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-40 right-20 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 paper-texture opacity-[0.12]"
            />

            <div className="relative grid min-h-[390px] gap-6 p-6 sm:min-h-[430px] sm:p-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:p-10 xl:p-12">
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white/85 backdrop-blur">
                  <Sparkles size={11} className="text-brand-200" />
                  The TalkNest Bookstore
                </span>
                <h1 className="mt-4 max-w-[13ch] text-[34px] font-bold leading-[1.08] sm:text-[42px] lg:text-[46px] xl:text-[52px]">
                  Stories that stay <span className="text-brand-200">with you.</span>
                </h1>
                <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/72 sm:text-[15px]">
                  Discover bestsellers, new voices, Islamic history and thoughtful
                  non-fiction — curated for readers in Bangladesh.
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Button href="/books" variant="gold" size="md">
                    Shop all books
                    <ArrowRight size={15} />
                  </Button>
                  <Button href="/categories" variant="light" size="md">
                    Browse categories
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-white/60">
                  <span className="flex items-center gap-1.5">
                    <Truck size={12} />
                    Free delivery over ৳999
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={11} className="fill-sale text-sale" />
                    4.9 reader rating
                  </span>
                </div>
              </div>

              <div className="relative hidden min-h-[300px] lg:block" aria-hidden="true">
                <div className="absolute left-[29%] top-1/2 z-20 w-[39%] -translate-y-1/2 rotate-[-7deg]">
                  {featuredCovers[0] && (
                    <div className="aspect-[3/4]">
                      <BookCover book={featuredCovers[0]} size="sm" />
                    </div>
                  )}
                </div>
                <div className="absolute left-[3%] top-[15%] z-10 w-[31%] rotate-[7deg] opacity-95">
                  {featuredCovers[1] && (
                    <div className="aspect-[3/4]">
                      <BookCover book={featuredCovers[1]} size="sm" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-[7%] right-[5%] z-10 w-[30%] rotate-[6deg] opacity-95">
                  {featuredCovers[2] && (
                    <div className="aspect-[3/4]">
                      <BookCover book={featuredCovers[2]} size="sm" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 left-[17%] z-30 border border-white/20 bg-brand-950/80 px-3.5 py-2.5 backdrop-blur">
                  <p className="text-xl font-bold leading-none text-white">1,200+</p>
                  <p className="mt-1 text-[9px] text-white/60">curated books</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
