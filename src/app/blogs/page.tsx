import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3, PenLine } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export const metadata: Metadata = {
  title: "ব্লগ",
  description:
    "বই পড়ার অভ্যাস, ইসলামিক ইতিহাস, অডিও বুক, লেখক সাক্ষাৎকার ও পরিবারের পাঠচর্চা — TalkNest BD ব্লগ।",
};

export default function BlogsPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHeader
        eyebrow="TalkNest Blog"
        title="বই, লেখক আর পাঠের গল্প"
        description="পাঠক জীবন, বইয়ের তালিকা, লেখক সাক্ষাৎকার আর TalkNest সেবার খুঁটিনাটি — নিয়মিত পড়ুন আমাদের ব্লগে।"
        crumbs={[{ label: "ব্লগ" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            {blogPosts.length}টি লেখা
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            সপ্তাহে নতুন লেখা
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            লেখক ও পাঠকের আড্ডা
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <article className="group grid overflow-hidden rounded-[2rem] border border-forest-900/8 bg-cream-50 lg:grid-cols-[1.1fr_0.9fr]">
            <Link
              href={`/blogs/${featured.slug}`}
              className="relative block min-h-[280px] overflow-hidden lg:min-h-[420px]"
            >
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-forest-950">
                <BookOpenText size={11} />
                Featured Story
              </span>
            </Link>
            <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-9">
              <div className="flex flex-wrap items-center gap-2 text-[9px]">
                <span className="rounded-full bg-forest-100 px-2.5 py-1 font-semibold text-forest-700">
                  {featured.category}
                </span>
                <span className="text-muted">{featured.date}</span>
                <span className="flex items-center gap-1 text-muted">
                  <Clock3 size={10} />
                  {featured.readTime}
                </span>
              </div>
              <Link href={`/blogs/${featured.slug}`}>
                <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-forest-950 transition-colors group-hover:text-clay-600 sm:text-3xl">
                  {featured.title}
                </h2>
              </Link>
              <p className="mt-3 text-[12px] leading-relaxed text-muted sm:text-[13px]">
                {featured.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-gold-300">
                  {featured.author.charAt(0)}
                </span>
                <span>
                  <span className="block text-[11px] font-semibold text-forest-900">
                    {featured.author}
                  </span>
                  <span className="block text-[9px] text-muted">{featured.authorRole}</span>
                </span>
              </div>
              <Link
                href={`/blogs/${featured.slug}`}
                className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-forest-900 px-4 py-2 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
              >
                লেখাটি পড়ুন
                <ArrowRight size={13} />
              </Link>
            </div>
          </article>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                <span className="h-px w-5 bg-clay-500/50" />
                More Stories
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                আরও পাঠচর্চা
              </h2>
            </div>
            <Link
              href="/stories"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-800 hover:text-clay-500"
            >
              পাঠকের গল্প পড়ুন
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-forest-950 p-6 text-cream-50 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-[0.1]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-gold-400/15"
            />
            <div className="relative grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  <PenLine size={11} />
                  Newsletter
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                  নতুন লেখা সবার আগে পড়ুন
                </h2>
                <p className="mt-2 max-w-md text-[11px] leading-relaxed text-cream-100/55">
                  সপ্তাহে একবার — নতুন বই, ব্লগ, লেখক সাক্ষাৎকার আর পাঠক কমিউনিটির
                  খবর সরাসরি আপনার ইনবক্সে।
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
