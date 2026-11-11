import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  Globe2,
  Layers3,
  PenLine,
  RefreshCcw,
  Star,
  Tag,
} from "lucide-react";
import { books, getBook, relatedBooks } from "@/data/books";
import { categoryLabel } from "@/data/categories";
import { getAuthor } from "@/data/authors";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { BookCover } from "@/components/books/BookCover";
import { BookPurchasePanel } from "@/components/books/BookPurchasePanel";
import { BookDetailTabs } from "@/components/books/BookDetailTabs";
import { BookReviews } from "@/components/books/BookReviews";
import { BookRail } from "@/components/books/BookRail";
import { discountPercent, toBn } from "@/lib/utils";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "বই" };
  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: `${book.title} — ${book.author}`,
      description: book.description,
      type: "article",
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const author = getAuthor(book.authorSlug);
  const related = relatedBooks(book, 6);
  const discount = discountPercent(book.price, book.oldPrice);

  return (
    <>
      <section className="border-b border-forest-900/8 bg-cream-100/40">
        <Container className="py-6 sm:py-9">
          <Breadcrumb
            items={[
              { label: "সব বই", href: "/books" },
              {
                label: categoryLabel(book.category),
                href: `/category/${book.category}`,
              },
              { label: book.title },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
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
                        ? "বেস্ট সেলার"
                        : tag === "new"
                          ? "নতুন"
                          : tag === "viral"
                            ? "ভাইরাল"
                            : "ফ্রি ডেলিভারি"}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-3 max-w-[340px] rounded-2xl border border-dashed border-forest-500/25 bg-forest-50 px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <RefreshCcw size={16} className="mt-0.5 shrink-0 text-forest-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-forest-900">
                      পড়া শেষে ৫০% ফেরত
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-forest-800/65">
                      বইটি আমাদের কাছেই ফেরত দিলে পাবেন{" "}
                      {toBn(Math.round(book.price * 0.5))} টাকা।
                    </p>
                    <Link
                      href="/buyback"
                      className="mt-1 inline-flex text-[10px] font-semibold text-clay-600 hover:text-clay-500"
                    >
                      বিস্তারিত →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="forest">{categoryLabel(book.category)}</Badge>
                <Badge tone="outline">{book.language}</Badge>
                <Badge tone="outline">{book.binding}</Badge>
                {discount && (
                  <span className="rounded-full bg-clay-500 px-2.5 py-1 text-[10px] font-bold leading-none text-cream-50">
                    {toBn(discount)}% ছাড়
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
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">লেখক</span>
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
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">প্রকাশনী</span>
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
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">রেটিং</span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950 group-hover:text-clay-600">
                      {toBn(book.rating)} · {toBn(book.reviewCount)} রিভিউ
                    </span>
                  </span>
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Rating value={book.rating} count={book.reviewCount} />
                <span className="text-[10px] text-muted">
                  {toBn(book.stock)} কপি স্টকে আছে
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
                  সংক্ষিপ্ত বিবরণ
                </p>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-forest-900/75 sm:text-[15px]">
                  {book.description}
                </p>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {book.highlights.slice(0, 4).map((highlight) => (
                  <div key={highlight} className="flex items-start gap-2 text-[11px] text-forest-800/75">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-forest-500" />
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-forest-900/10 pt-6">
                <BookPurchasePanel book={book} />
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-forest-900/10 pt-4 text-[10px] text-muted">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} />
                  {toBn(book.pages)} পৃষ্ঠা
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
                  {categoryLabel(book.category)}
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCcw size={13} />
                  ৫০% বাইব্যাক সুবিধা
                </span>
              </div>

              {author && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                  {author.image ? (
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
                      লেখক পরিচিতি
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
                    দেখুন
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
          <div className="mt-10">
            <BookReviews book={book} />
          </div>
        </Container>
      </section>

      <BookRail
        books={related}
        eyebrow="You may also like"
        title="একই ধরনের আরও বই"
        description="আপনার পছন্দের বইটির সঙ্গে আরও কিছু সুন্দর বই।"
        href="/books"
        linkLabel="সব বই"
      />
    </>
  );
}
