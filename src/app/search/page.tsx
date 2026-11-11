import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Clock3,
  FileText,
  PackageSearch,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";
import { books } from "@/data/books";
import { authors } from "@/data/authors";
import { publishers } from "@/data/publishers";
import { blogPosts } from "@/data/blog";
import { categoryLabel } from "@/data/categories";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/Button";
import { cn, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "বই খুঁজুন",
  description:
    "TalkNest BD-এর সম্পূর্ণ সংগ্রহে বই, লেখক, প্রকাশনী ও ব্লগ খুঁজুন — নাম, বিষয় বা প্রকাশনী দিয়ে দ্রুত সার্চ।",
};

const suggestions = ["উপন্যাস", "ইসলামিক ইতিহাস", "রাফিদা নূর", "অন্যধারা", "অডিও বুক", "স্টুডেন্ট"];

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

function SearchFallback() {
  return (
    <>
      <PageHeader
        eyebrow="Search TalkNest"
        title="আপনার পরের বইটি খুঁজুন"
        description="বইয়ের নাম, লেখক, প্রকাশনী বা বিষয় লিখে খুঁজুন। TalkNest-এর সংগ্রহে থাকা সব বই এক জায়গায়।"
        crumbs={[{ label: "সার্চ" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="h-12 w-full animate-pulse rounded-full bg-cream-200" />
            <div className="mt-3 flex justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="h-5 w-16 animate-pulse rounded-full bg-cream-100" />
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-cream-100" />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const needle = query.toLowerCase();

  const matchedBooks = needle
    ? books.filter((book) =>
        [book.title, book.subtitle ?? "", book.author, book.publisher, book.description, categoryLabel(book.category), ...book.tags]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : [];
  const matchedAuthors = needle
    ? authors.filter((author) => [author.name, author.title, author.bio].join(" ").toLowerCase().includes(needle))
    : [];
  const matchedPublishers = needle
    ? publishers.filter((publisher) => [publisher.name, publisher.tagline, publisher.description].join(" ").toLowerCase().includes(needle))
    : [];
  const matchedPosts = needle
    ? blogPosts.filter((post) => [post.title, post.excerpt, post.category].join(" ").toLowerCase().includes(needle))
    : [];

  const total = matchedBooks.length + matchedAuthors.length + matchedPublishers.length + matchedPosts.length;

  return (
    <>
      <PageHeader
        eyebrow="Search TalkNest"
        title={query ? `“${query}” এর ফলাফল` : "আপনার পরের বইটি খুঁজুন"}
        description={
          query
            ? `বই, লেখক, প্রকাশনী ও ব্লগ মিলিয়ে ${toBn(total)}টি ফলাফল পাওয়া গেছে।`
            : "বইয়ের নাম, লেখক, প্রকাশনী বা বিষয় লিখে খুঁজুন। TalkNest-এর সংগ্রহে থাকা সব বই এক জায়গায়।"
        }
        crumbs={[{ label: "সার্চ" }]}
      />

      <section className="py-8 sm:py-10">
        <Container>
          <div className="mx-auto max-w-2xl">
            <form action="/search" method="get" role="search" className="relative">
              <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-700/50" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="বই, লেখক বা প্রকাশনী খুঁজুন..."
                aria-label="বই খুঁজুন"
                className="h-12 w-full rounded-full border border-forest-900/12 bg-cream-50 pl-12 pr-28 text-[13px] text-forest-950 placeholder:text-muted/60 focus:border-forest-700/35 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-forest-900 px-5 text-[11px] font-semibold text-cream-50 hover:bg-forest-700"
              >
                খুঁজুন
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[9px] text-muted">জনপ্রিয়:</span>
              {suggestions.map((item) => (
                <Link
                  key={item}
                  href={`/search?q=${encodeURIComponent(item)}`}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[9px] font-medium transition-colors",
                    query === item
                      ? "border-forest-900 bg-forest-900 text-cream-50"
                      : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {!query && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BookOpen, title: "সব বই", text: "ক্যাটাগরি ও কালেকশন ঘুরে দেখুন", href: "/books" },
                { icon: PenLine, title: "লেখক", text: "প্রিয় লেখকের সব বই এক জায়গায়", href: "/authors" },
                { icon: Building2, title: "প্রকাশনী", text: "প্রকাশনী অনুযায়ী বই খুঁজুন", href: "/publishers" },
                { icon: FileText, title: "ব্লগ", text: "পাঠ অভ্যাস ও বইয়ের তালিকা পড়ুন", href: "/blogs" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-forest-900/8 bg-cream-50 p-4 transition-colors hover:border-forest-900/20"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <item.icon size={17} />
                  </span>
                  <h2 className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-forest-950">
                    {item.title}
                    <ArrowRight size={12} className="text-forest-900/30 transition-transform group-hover:translate-x-0.5" />
                  </h2>
                  <p className="mt-0.5 text-[10px] text-muted">{item.text}</p>
                </Link>
              ))}
            </div>
          )}

          {query && total === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/40 px-6 py-14 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream-200 text-forest-900/40">
                <PackageSearch size={24} />
              </span>
              <h2 className="mt-3 font-display text-xl font-bold text-forest-950">
                “{query}” খুঁজে কিছু পাওয়া যায়নি
              </h2>
              <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-muted">
                বানান বদলে দেখুন, শুধু বইয়ের নাম বা লেখকের নাম লিখুন, অথবা
                জনপ্রিয় বিষয়গুলো থেকে বেছে নিন।
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button href="/books" size="sm">সব বই দেখুন</Button>
                <Button href="/categories" variant="outline" size="sm">ক্যাটাগরি</Button>
              </div>
            </div>
          )}

          {query && matchedBooks.length > 0 && (
            <section className="mt-9">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                    Books
                  </span>
                  <h2 className="mt-0.5 font-display text-2xl font-bold text-forest-950">
                    বই ({toBn(matchedBooks.length)})
                  </h2>
                </div>
                <Link href="/books" className="text-[10px] font-semibold text-clay-600 hover:text-clay-500">
                  সব বই →
                </Link>
              </div>
              <BookGrid books={matchedBooks.slice(0, 12)} columns="four" />
            </section>
          )}

          {query && (matchedAuthors.length > 0 || matchedPublishers.length > 0) && (
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {matchedAuthors.length > 0 && (
                <section>
                  <h2 className="font-display text-lg font-bold text-forest-950">
                    লেখক ({toBn(matchedAuthors.length)})
                  </h2>
                  <div className="mt-2.5 space-y-2">
                    {matchedAuthors.map((author) => (
                      <Link
                        key={author.slug}
                        href={`/authors/${author.slug}`}
                        className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 transition-colors hover:border-forest-900/20"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 font-display text-xs font-bold text-gold-300">
                          {author.name.charAt(0)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-semibold text-forest-950">{author.name}</span>
                          <span className="block truncate text-[9px] text-muted">{author.title}</span>
                        </span>
                        <ArrowRight size={12} className="shrink-0 text-forest-900/30" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {matchedPublishers.length > 0 && (
                <section>
                  <h2 className="font-display text-lg font-bold text-forest-950">
                    প্রকাশনী ({toBn(matchedPublishers.length)})
                  </h2>
                  <div className="mt-2.5 space-y-2">
                    {matchedPublishers.map((publisher) => (
                      <Link
                        key={publisher.slug}
                        href={`/publishers/${publisher.slug}`}
                        className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 transition-colors hover:border-forest-900/20"
                      >
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-xs font-bold text-cream-50"
                          style={{ backgroundColor: publisher.accent }}
                        >
                          {publisher.initials}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-semibold text-forest-950">{publisher.name}</span>
                          <span className="block truncate text-[9px] text-muted">{publisher.tagline}</span>
                        </span>
                        <ArrowRight size={12} className="shrink-0 text-forest-900/30" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {query && matchedPosts.length > 0 && (
            <section className="mt-9">
              <h2 className="font-display text-lg font-bold text-forest-950">
                ব্লগ ({toBn(matchedPosts.length)})
              </h2>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {matchedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blogs/${post.slug}`}
                    className="group rounded-2xl border border-forest-900/8 bg-cream-50 p-4 transition-colors hover:border-forest-900/20"
                  >
                    <span className="flex items-center gap-2 text-[8px] text-muted">
                      <Sparkles size={10} className="text-clay-500" />
                      {post.category}
                      <span className="ml-auto flex items-center gap-1">
                        <Clock3 size={9} /> {post.readTime}
                      </span>
                    </span>
                    <h3 className="mt-1.5 line-clamp-2 font-display text-sm font-semibold leading-snug text-forest-950 group-hover:text-clay-600">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-muted">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </Container>
      </section>
    </>
  );
}
