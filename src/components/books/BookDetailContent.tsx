"use client";

import Link from "next/link";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  Globe2,
  Headphones,
  Layers3,
  PenLine,
  RefreshCcw,
  Star,
  Tag,
} from "lucide-react";
import { categoryLabel } from "@/data/categories";
import { getAuthor } from "@/data/authors";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { relatedFromAll } from "@/lib/book-content";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { BookCover } from "@/components/books/BookCover";
import { BookPurchasePanel } from "@/components/books/BookPurchasePanel";
import { BookDetailTabs } from "@/components/books/BookDetailTabs";
import { BookRail } from "@/components/books/BookRail";
import { discountPercent, formatCount, toBn } from "@/lib/utils";

/**
 * The ONE book detail view. Every book — static, uploaded or from the
 * best-seller shelf — resolves through the shared book lookup by slug.
 */
export function BookDetailContent({ slug }: { slug: string }) {
  const { getBook, books, hydrated } = useBookContent();
  const book = getBook(slug);

  if (!hydrated) {
    return (
      <section className="py-16">
        <Container>
          <p className="text-center text-sm text-muted">Loading book…</p>
        </Container>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-lg rounded-[10px] border border-line bg-white p-8 text-center">
            <h1 className="font-display text-xl font-bold text-ink">Book not found</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              This book may have been uploaded in another browser. Demo uploads are stored
              locally — add it again or browse the catalogue.
            </p>
            <Link
              href="/books"
              className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
            >
              Browse all books
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const author = getAuthor(book.authorSlug);
  const related = relatedFromAll(book, books, 6);
  const discount = discountPercent(book.price, book.oldPrice);
  const categoryName = categoryLabel(book.category);
  const subcategoryName = book.subcategory
    ? book.subcategory.replace(/-/g, " ")
    : "";

  return (
    <>
      <section className="border-b border-forest-900/8 bg-cream-100/40">
        <Container className="py-6 sm:py-9">
          <Breadcrumb
            items={[
              { label: "All books", href: "/books" },
              { label: categoryName, href: `/category/${book.category}` },
              { label: book.title },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-[88px] lg:self-start">
              <div className="relative mx-auto max-w-[340px] rounded-3xl bg-cream-200/80 p-5 sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-forest-900/10"
                />
                <div className="relative aspect-[3/4] w-full">
                  <BookCover book={book} size="lg" />
                </div>
                <div className="absolute left-7 top-7 flex flex-wrap gap-1.5">
                  {book.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      tone={tag === "bestseller" ? "gold" : "cream"}
                      className="shadow-sm"
                    >
                      {tag === "bestseller"
                        ? "Bestseller"
                        : tag === "new"
                          ? "New"
                          : tag === "viral"
                            ? "Viral"
                            : "Free delivery"}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-3 max-w-[340px] rounded-2xl border border-dashed border-forest-500/25 bg-forest-50 px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <RefreshCcw size={16} className="mt-0.5 shrink-0 text-forest-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-forest-900">
                      Get 50% back after reading
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-forest-800/65">
                      Sell the book to us and get ৳{toBn(Math.round(book.price * 0.5))} back.
                    </p>
                    <Link
                      href="/sell-used-books"
                      className="mt-1 inline-flex text-[10px] font-semibold text-clay-600 hover:text-clay-500"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="forest">{categoryName}</Badge>
                {subcategoryName && <Badge tone="outline">{subcategoryName}</Badge>}
                <Badge tone="outline">{book.language}</Badge>
                <Badge tone="outline">{book.binding}</Badge>
                {discount && (
                  <span className="rounded-full bg-clay-500 px-2.5 py-1 text-[10px] font-bold leading-none text-cream-50">
                    {toBn(discount)}% off
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-forest-950 sm:text-4xl lg:text-[2.8rem]">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-2 text-sm text-muted sm:text-base">{book.subtitle}</p>
              )}

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Link
                  href={`/authors/${book.authorSlug}`}
                  className="group flex items-center gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 transition-colors hover:border-forest-900/25"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <PenLine size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">
                      Author
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950 group-hover:text-clay-600">
                      {book.author}
                    </span>
                  </span>
                </Link>
                <Link
                  href={`/publishers/${book.publisherSlug}`}
                  className="group flex items-center gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 transition-colors hover:border-forest-900/25"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-600">
                    <Building2 size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">
                      Publisher
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950 group-hover:text-clay-600">
                      {book.publisher}
                    </span>
                  </span>
                </Link>
                <Link
                  href="#book-reviews"
                  className="group flex items-center gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 transition-colors hover:border-forest-900/25"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-clay-500/10 text-clay-600">
                    <Star size={15} className="fill-current" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">
                      Rating
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950 group-hover:text-clay-600">
                      {toBn(book.rating)} · {formatCount(book.reviewCount)} reviews
                    </span>
                  </span>
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Rating value={book.rating} count={book.reviewCount} />
              </div>

              {book.audio && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
                    <Headphones size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-ink">Audiobook available</p>
                    <p className="text-[10px] text-muted">
                      {book.audio.duration} · Narrated by {book.audio.narrator}
                    </p>
                  </div>
                  <Link
                    href="/audio-books"
                    className="ml-auto text-[10px] font-semibold text-brand-700 hover:underline"
                  >
                    Listen →
                  </Link>
                </div>
              )}

              <div className="mt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
                  Overview
                </p>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-forest-900/75 sm:text-[15px]">
                  {book.description}
                </p>
              </div>

              {book.highlights.length > 0 && (
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {book.highlights.slice(0, 4).map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-2 text-[11px] text-forest-800/75"
                    >
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-forest-500" />
                      {highlight}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-7 border-t border-forest-900/10 pt-6">
                <BookPurchasePanel book={book} />
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-forest-900/10 pt-4 text-[10px] text-muted">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} />
                  {toBn(book.pages)} pages
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers3 size={13} />
                  {book.binding}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe2 size={13} />
                  {book.language}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag size={13} />
                  {categoryName}
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCcw size={13} />
                  {toBn(book.publishedYear)}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  {toBn(book.stock)} in stock
                </span>
              </div>

              {author && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                  {author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={author.image}
                      alt={author.name}
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-forest-100 font-display text-lg text-forest-800">
                      {author.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-muted">
                      About the author
                    </p>
                    <Link
                      href={`/authors/${author.slug}`}
                      className="text-sm font-semibold text-forest-950 hover:text-clay-500"
                    >
                      {author.name}
                    </Link>
                    <p className="line-clamp-1 text-[10px] text-muted">{author.title}</p>
                  </div>
                  <Link
                    href={`/authors/${author.slug}`}
                    className="shrink-0 rounded-full border border-forest-900/15 px-3 py-1.5 text-[10px] font-medium text-forest-800 hover:border-forest-900"
                  >
                    View
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <BookDetailTabs book={book} />
        </Container>
      </section>

      {related.length > 0 && (
        <BookRail
          books={related}
          eyebrow="You may also like"
          title="More books like this"
          description="More great books to go with your pick."
          href="/books"
          linkLabel="All books"
        />
      )}
    </>
  );
}
