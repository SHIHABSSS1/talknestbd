import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock3,
  Quote,
} from "lucide-react";
import { blogPosts, getBlogPost, relatedPosts } from "@/data/blog";
import { siteConfig, toBn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { FacebookIcon, WhatsAppIcon } from "@/components/layout/SocialLinks";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const related = relatedPosts(post);
  const shareUrl = `https://talknestbd.com/blogs/${post.slug}`;

  return (
    <>
      <section className="border-b border-forest-900/8 bg-cream-100/50">
        <Container className="max-w-5xl py-6 sm:py-9">
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blogs" },
              { label: post.category },
            ]}
          />
          <div className="mt-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-[9px]">
              <span className="rounded-full bg-forest-900 px-2.5 py-1 font-semibold text-cream-50">
                {post.category}
              </span>
              <span className="text-muted">{post.date}</span>
              <span className="flex items-center gap-1 text-muted">
                <Clock3 size={10} />
                {post.readTime}
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold leading-[1.25] tracking-tight text-forest-950 sm:text-4xl lg:text-[2.9rem]">
              {post.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-[11px] font-bold text-gold-300">
                {post.author.charAt(0)}
              </span>
              <div>
                <p className="text-xs font-semibold text-forest-950">{post.author}</p>
                <p className="text-[9px] text-muted">{post.authorRole}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-6 sm:py-8">
        <Container className="max-w-5xl">
          <div className="overflow-hidden rounded-3xl bg-cream-100">
            <div className="aspect-[16/9] w-full">
              <img
                src={post.image}
                alt={post.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_255px] lg:items-start">
            <article className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-7">
              <div className="space-y-4 text-[13px] leading-[1.9] text-forest-900/75 sm:text-sm">
                {post.paragraphs.slice(0, 2).map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>

              <blockquote className="my-6 rounded-2xl border-l-4 border-gold-500 bg-cream-100/70 px-4 py-4 sm:px-5">
                <Quote size={20} className="text-gold-500/60" />
                <p className="mt-1 font-display text-base font-medium leading-relaxed text-forest-900 sm:text-lg">
                  “{post.quote}”
                </p>
              </blockquote>

              <div className="space-y-4 text-[13px] leading-[1.9] text-forest-900/75 sm:text-sm">
                {post.paragraphs.slice(2).map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-forest-900/8 bg-forest-50/60 p-4">
                <h2 className="flex items-center gap-1.5 font-display text-base font-bold text-forest-950">
                  <CheckCircle2 size={16} className="text-forest-600" />
                  {post.checklistTitle}
                </h2>
                <ul className="mt-2 space-y-1.5">
                  {post.checklist.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] leading-relaxed text-forest-800/80">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-forest-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/8 pt-4">
                <p className="text-[10px] text-muted">
                  If you enjoyed this piece, share it with friends.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-forest-900/10 px-3 text-[9px] font-semibold text-forest-800 hover:border-forest-900/30"
                  >
                    <FacebookIcon size={11} />
                    Facebook
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-forest-900/10 px-3 text-[9px] font-semibold text-forest-800 hover:border-forest-900/30"
                  >
                    <WhatsAppIcon size={11} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>

            <aside className="space-y-3 lg:sticky lg:top-32">
              <div className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-clay-500">
                  Author
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-900 text-[11px] font-bold text-gold-300">
                    {post.author.charAt(0)}
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-forest-950">{post.author}</p>
                    <p className="text-[9px] text-muted">{post.authorRole}</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] leading-relaxed text-muted">
                  Writes regularly about books, reading and community for TalkNest BD.
                </p>
              </div>

              <div className="rounded-2xl bg-forest-950 p-4 text-cream-50">
                <BookOpenText size={20} className="text-gold-400" />
                <p className="mt-2 font-display text-sm font-semibold">
                  Want to read books on this topic?
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-cream-100/50">
                  TalkNest&apos;s collection includes Seerah, history, fiction and audiobooks.
                </p>
                <Link
                  href="/books"
                  className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-gold-500 px-3 text-[9px] font-semibold text-forest-950 hover:bg-gold-400"
                >
                  Browse books
                  <ArrowRight size={11} />
                </Link>
              </div>

              <div className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-clay-500">
                  More to read
                </p>
                <div className="mt-2 space-y-2">
                  {related.slice(0, 3).map((entry) => (
                    <Link
                      key={entry.slug}
                      href={`/blogs/${entry.slug}`}
                      className="group block rounded-lg px-1 py-1"
                    >
                      <span className="line-clamp-2 text-[10px] font-medium leading-snug text-forest-900 group-hover:text-clay-600">
                        {entry.title}
                      </span>
                      <span className="mt-0.5 block text-[8px] text-muted">{entry.category}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3 text-[10px] font-semibold text-forest-900 hover:border-forest-900/20"
              >
                Talk books with us
                <ArrowRight size={13} />
              </a>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-t border-forest-900/8 bg-cream-100/40 py-8 sm:py-10">
        <Container>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                Keep Reading
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-forest-950">
                More stories
              </h2>
            </div>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-800 hover:text-clay-500"
            >
              All stories
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <BlogCard key={entry.slug} post={entry} />
            ))}
          </div>
          <p className="mt-6 text-center text-[9px] text-muted">
            {toBn(blogPosts.length)} stories in total · New stories every week
          </p>
        </Container>
      </section>
    </>
  );
}
