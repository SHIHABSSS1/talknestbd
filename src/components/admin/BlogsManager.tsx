"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Clock3,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import { blogPosts, type BlogPost } from "@/data/blog";

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";

function emptyPost(): BlogPost {
  return {
    slug: "",
    title: "",
    excerpt: "",
    category: "Reader Life",
    date: "17 November 2026",
    readTime: "5 min read",
    author: "",
    authorRole: "",
    image: "",
    imageAlt: "",
    paragraphs: [""],
    quote: "",
    checklistTitle: "",
    checklist: [],
  };
}

export function BlogsManager() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "published" | "drafts">("all");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [notice, setNotice] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesTerm =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term) ||
        post.category.toLowerCase().includes(term);
      const matchesTab = tab !== "drafts";
      return matchesTerm && matchesTab;
    });
  }, [query, tab]);

  const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

  const stats = [
    { label: "Total posts", value: blogPosts.length, icon: FileText, tone: "bg-brand-50 text-brand-700" },
    { label: "Categories", value: categories.length, icon: BookOpen, tone: "bg-mint/25 text-forest-700" },
    { label: "Published", value: blogPosts.length, icon: Check, tone: "bg-lavender/40 text-brand-800" },
    { label: "Drafts", value: 0, icon: Clock3, tone: "bg-gold-500/10 text-gold-600" },
  ];

  const closeEditor = () => {
    setEditing(null);
    setNotice("");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <span>Dashboard</span><span>/</span><span className="font-semibold text-ink">Blog posts</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Blog posts</h1>
          <p className="mt-1 text-[12px] text-muted">Write and manage stories for the reader community.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyPost())}
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus size={14} /> New post
        </button>
      </div>

      <section aria-label="Blog metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[10px] border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted">{stat.label}</p>
                <p className="mt-1.5 font-display text-2xl font-bold text-ink">{stat.value}</p>
              </div>
              <span className={`grid h-9 w-9 place-items-center rounded-[8px] ${stat.tone}`}>
                <stat.icon size={15} />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[10px] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex gap-1.5">
            {(["all", "published", "drafts"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-medium capitalize transition-colors ${
                  tab === value
                    ? "bg-brand-600 text-white"
                    : "bg-canvas text-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="relative ml-auto block w-full max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts…"
              aria-label="Search posts"
              className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink placeholder:text-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/70 text-[9px] uppercase tracking-[0.1em] text-muted">
                <th className="px-4 py-2.5 font-semibold sm:px-5">Post</th>
                <th className="px-2 py-2.5 font-semibold">Category</th>
                <th className="px-2 py-2.5 font-semibold">Author</th>
                <th className="px-2 py-2.5 font-semibold">Date</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((post) => (
                <tr key={post.slug} className="transition-colors hover:bg-brand-50/30">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-[5px] border border-line object-cover"
                      />
                      <div className="min-w-0">
                        <p className="max-w-[260px] truncate text-[11px] font-semibold text-ink">{post.title}</p>
                        <p className="text-[9px] text-muted">{post.readTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <span className="rounded-full bg-brand-50 px-2 py-1 text-[9px] font-medium text-brand-700">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-[10px] text-body">{post.author}</td>
                  <td className="px-2 py-3 text-[10px] text-muted">{post.date}</td>
                  <td className="px-2 py-3">
                    <span className="rounded-full bg-mint/25 px-2 py-1 text-[9px] font-medium text-forest-700">
                      Published
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <div className="inline-flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditing(post)}
                        aria-label={`Edit ${post.title}`}
                        className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted transition-colors hover:border-brand-300 hover:text-brand-700"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotice(`Design preview — opening “${post.title}” on the storefront.`) }
                        aria-label={`View ${post.title}`}
                        className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted transition-colors hover:border-brand-300 hover:text-brand-700"
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <p className="py-12 text-center text-[12px] text-muted">No posts match your filters.</p>
          )}
        </div>

        <div className="border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
          Showing {visible.length} of {blogPosts.length} posts · Design preview — no data is saved
          {notice && <span className="ml-2 text-brand-700">· {notice}</span>}
        </div>
      </section>

      {/* Editor drawer */}
      {editing && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close post editor"
            onClick={closeEditor}
            className="absolute inset-0 bg-ink/40"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                  {editing.slug ? "Edit post" : "New post"}
                </p>
                <h2 className="mt-1 font-display text-base font-bold text-ink">
                  {editing.title || "Untitled post"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNotice("Design preview only — this post is not saved anywhere.");
              }}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5"
            >
              <label className="block">
                <span className={labelClass}>Title</span>
                <input
                  value={editing.title}
                  onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Excerpt</span>
                <textarea
                  rows={3}
                  value={editing.excerpt}
                  onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })}
                  className={`${inputClass} resize-y`}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Category</span>
                  <input
                    value={editing.category}
                    onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Read time</span>
                  <input
                    value={editing.readTime}
                    onChange={(event) => setEditing({ ...editing, readTime: event.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Author</span>
                  <input
                    value={editing.author}
                    onChange={(event) => setEditing({ ...editing, author: event.target.value })}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Author role</span>
                  <input
                    value={editing.authorRole}
                    onChange={(event) => setEditing({ ...editing, authorRole: event.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Image URL</span>
                <input
                  value={editing.image}
                  onChange={(event) => setEditing({ ...editing, image: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className={labelClass}>Body (first paragraph)</span>
                <textarea
                  rows={5}
                  value={editing.paragraphs[0] ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, paragraphs: [event.target.value] })
                  }
                  className={`${inputClass} resize-y`}
                />
              </label>

              {notice && (
                <p className="flex items-center gap-1.5 rounded-[8px] border border-brand-100 bg-brand-50 px-3 py-2.5 text-[10px] text-brand-800">
                  <Check size={12} /> {notice}
                </p>
              )}
              <button
                type="submit"
                className="h-9 w-full rounded-[4px] bg-brand-600 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {editing.slug ? "Save changes" : "Publish post"}
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
