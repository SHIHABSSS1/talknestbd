import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { BlogPost } from "@/data/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-42px_rgba(10,33,24,0.5)]">
      <Link href={`/blogs/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={post.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-cream-50/90 px-2.5 py-1 text-[9px] font-semibold text-forest-950 backdrop-blur">
            {post.category}
          </span>
        </div>
      </Link>
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-3 text-[9px] text-muted">
          <span>{post.date}</span>
          <span className="flex items-center gap-1">
            <Clock3 size={10} />
            {post.readTime}
          </span>
        </div>
        <Link href={`/blogs/${post.slug}`} className="mt-2 block">
          <h2 className="line-clamp-2 font-display text-lg font-bold leading-snug text-forest-950 transition-colors group-hover:text-clay-600">
            {post.title}
          </h2>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
          <span className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-forest-900 text-[9px] font-bold text-gold-300">
              {post.author.charAt(0)}
            </span>
            <span className="text-[9px] font-medium text-forest-900">{post.author}</span>
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-cream-100 text-forest-800 transition-colors group-hover:bg-forest-900 group-hover:text-cream-50">
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}
