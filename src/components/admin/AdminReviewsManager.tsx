"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  MessageSquareReply,
  Pin,
  Plus,
  RotateCcw,
  Save,
  Search,
  Star,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useReviews } from "@/components/providers/ReviewsProvider";
import { cloneReviewDefaults, type ReviewContent } from "@/lib/review-content";
import { cn } from "@/lib/utils";
import type { Review, ReviewStatus } from "@/lib/types";

type Tab = "list" | "create" | "content";
type ListResponse = { reviews: Review[]; total: number; page: number; pageSize: number };

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const PAGE_SIZE = 10;

function statusClass(status: ReviewStatus): string {
  if (status === "approved") return "bg-mint/25 text-forest-700";
  if (status === "rejected") return "bg-gold-300/25 text-gold-600";
  return "bg-brand-50 text-brand-700";
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-gold-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={11} className={index < rating ? "fill-sale text-sale" : ""} />
      ))}
    </span>
  );
}

/** API-driven review moderation, custom reviews and section copy. */
export function AdminReviewsManager({ label }: { label: string }) {
  const { content, save: saveCopy, reset: resetCopy } = useReviews();
  const [tab, setTab] = useState<Tab>("list");
  const [rows, setRows] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [kind, setKind] = useState("");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [active, setActive] = useState<Review | null>(null);
  const [pending, startTransition] = useTransition();

  const [draftCopy, setDraftCopy] = useState<ReviewContent>(content);
  const [custom, setCustom] = useState({
    name: "",
    location: "Dhaka",
    rating: 5,
    title: "",
    text: "",
    bookSlug: "",
    bookTitle: "",
    kind: "book" as "book" | "audio",
    status: "approved" as "approved" | "pending",
    pinned: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (source) params.set("source", source);
      if (kind) params.set("kind", kind);
      if (pinnedOnly) params.set("pinned", "true");
      const data = await accountFetch<ListResponse>(`/api/admin/reviews?${params}`);
      setRows(data.reviews);
      setTotal(data.total);
    } catch (error) {
      setNotice({
        ok: false,
        text: error instanceof Error ? error.message : "Could not load reviews.",
      });
    } finally {
      setLoading(false);
    }
  }, [page, q, status, source, kind, pinnedOnly]);

  useEffect(() => {
    if (tab === "list") void load();
  }, [tab, load]);

  useEffect(() => {
    setDraftCopy(content);
  }, [content]);

  const mutate = async (url: string, init: RequestInit, message: string) => {
    setNotice(null);
    try {
      await accountFetch(url, init);
      setNotice({ ok: true, text: message });
      await load();
      setActive(null);
    } catch (error) {
      setNotice({
        ok: false,
        text: error instanceof Error ? error.message : "Could not update the review.",
      });
    }
  };

  const setReviewStatus = (review: Review, next: ReviewStatus) =>
    mutate(`/api/admin/reviews/${encodeURIComponent(review.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next, ...(next !== "approved" ? { pinned: false } : {}) }),
    }, `Review marked ${next}.`);

  const togglePin = (review: Review) =>
    mutate(`/api/admin/reviews/${encodeURIComponent(review.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ pinned: !review.pinned }),
    }, review.pinned ? "Review unpinned." : "Review pinned and featured on the storefront.");

  const removeReview = (review: Review) =>
    mutate(`/api/admin/reviews/${encodeURIComponent(review.id)}`, { method: "DELETE" }, "Review deleted.");

  const createCustom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        await accountFetch("/api/admin/reviews", {
          method: "POST",
          body: JSON.stringify(custom),
        });
        setNotice({ ok: true, text: "Custom review created." });
        setCustom({
          name: "", location: "Dhaka", rating: 5, title: "", text: "",
          bookSlug: "", bookTitle: "", kind: "book", status: "approved", pinned: false,
        });
        setTab("list");
        void load();
      } catch (error) {
        setNotice({
          ok: false,
          text: error instanceof Error ? error.message : "Could not create the review.",
        });
      }
    });
  };

  const saveCopyChanges = () => {
    startTransition(async () => {
      const result = await saveCopy(draftCopy);
      setNotice({ ok: result.ok, text: result.message });
    });
  };

  const resetCopyChanges = () => {
    startTransition(async () => {
      const result = await resetCopy();
      if (result.ok) setDraftCopy(cloneReviewDefaults());
      setNotice({ ok: result.ok, text: result.message });
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
            <Link href="/admin" className="hover:text-brand-700">Dashboard</Link>
            <span>/</span>
            <span>Homepage sections</span>
            <span>/</span>
            <span className="font-semibold text-ink">{label}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">
            Moderate reader reviews, pin featured ones and manage admin-created reviews.
          </p>
        </div>
        <Link
          href="/reviews"
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
        >
          <Eye size={13} /> View storefront
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 rounded-[8px] border border-line bg-white p-1">
        {([
          { key: "list", label: "All reviews", count: total },
          { key: "create", label: "Add custom review" },
          { key: "content", label: "Section copy" },
        ] as { key: Tab; label: string; count?: number }[]).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
              tab === item.key
                ? "bg-brand-600 text-white"
                : "text-muted hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[9px]", tab === item.key ? "bg-white/20" : "bg-brand-50 text-brand-700")}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {notice && (
        <div
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-[8px] border px-3 py-2.5 text-[10px]",
            notice.ok
              ? "border-brand-100 bg-brand-50 text-brand-800"
              : "border-gold-300 bg-gold-300/15 text-ink",
          )}
        >
          {notice.ok ? <Check size={13} className="mt-0.5 shrink-0" /> : <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" />}
          {notice.text}
        </div>
      )}

      {tab === "list" && (
        <section className="overflow-hidden rounded-[10px] border border-line bg-white">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
            <label className="relative block min-w-[180px] flex-1 sm:max-w-xs">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={q}
                onChange={(event) => { setQ(event.target.value); setPage(1); }}
                placeholder="Search name, title, book…"
                aria-label="Search reviews"
                className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink"
              />
            </label>
            <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter by status" className="h-9 rounded-[4px] border border-line bg-white px-2 text-[11px]">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={source} onChange={(event) => { setSource(event.target.value); setPage(1); }} aria-label="Filter by source" className="h-9 rounded-[4px] border border-line bg-white px-2 text-[11px]">
              <option value="">All sources</option>
              <option value="user">Readers</option>
              <option value="admin">Admin-created</option>
            </select>
            <select value={kind} onChange={(event) => { setKind(event.target.value); setPage(1); }} aria-label="Filter by kind" className="h-9 rounded-[4px] border border-line bg-white px-2 text-[11px]">
              <option value="">Books & audio</option>
              <option value="book">Books</option>
              <option value="audio">Audiobooks</option>
            </select>
            <label className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-2.5 text-[10px] font-medium text-ink">
              <input type="checkbox" checked={pinnedOnly} onChange={(event) => { setPinnedOnly(event.target.checked); setPage(1); }} />
              Pinned only
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-line bg-canvas/70 text-[9px] uppercase tracking-[0.1em] text-muted">
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Reviewer</th>
                  <th className="px-2 py-2.5 font-semibold">Book</th>
                  <th className="px-2 py-2.5 font-semibold">Rating</th>
                  <th className="px-2 py-2.5 font-semibold">Status</th>
                  <th className="px-2 py-2.5 font-semibold">Pinned</th>
                  <th className="px-2 py-2.5 font-semibold">Date</th>
                  <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((review) => (
                  <tr key={review.id} className="hover:bg-brand-50/30">
                    <td className="px-4 py-3 sm:px-5">
                      <p className="text-[11px] font-semibold text-ink">{review.name}</p>
                      <p className="text-[9px] text-muted">
                        {review.source === "admin" ? "Admin-created" : "Reader"}
                        {review.reply ? " · Replied" : ""}
                      </p>
                    </td>
                    <td className="px-2 py-3">
                      <p className="max-w-[180px] truncate text-[11px] text-ink">{review.title}</p>
                      <p className="max-w-[180px] truncate text-[9px] text-muted">
                        {review.bookTitle} · {review.kind === "audio" ? "Audio" : "Book"}
                      </p>
                    </td>
                    <td className="px-2 py-3"><Stars rating={review.rating} /></td>
                    <td className="px-2 py-3">
                      <span className={cn("rounded-full px-2 py-1 text-[9px] font-medium", statusClass(review.status))}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      {review.pinned ? <Pin size={13} className="text-gold-600" /> : <span className="text-[10px] text-muted">—</span>}
                    </td>
                    <td className="px-2 py-3 text-[10px] text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <div className="flex flex-wrap justify-end gap-1">
                        <button type="button" onClick={() => setActive(review)} aria-label={`Open ${review.title}`} className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-brand-700">
                          <Eye size={13} />
                        </button>
                        {review.status !== "approved" && (
                          <button type="button" onClick={() => setReviewStatus(review, "approved")} aria-label="Approve review" className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-forest-600 hover:bg-mint/25">
                            <CheckCircle2 size={13} />
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button type="button" onClick={() => setReviewStatus(review, "rejected")} aria-label="Reject review" className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-gold-600 hover:bg-gold-300/15">
                            <XCircle size={13} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => togglePin(review)}
                          disabled={review.status !== "approved" || pending}
                          title={review.status !== "approved" ? "Only approved reviews can be pinned" : undefined}
                          aria-label={review.pinned ? "Unpin review" : "Pin review"}
                          className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-brand-700 disabled:opacity-30"
                        >
                          <Pin size={13} />
                        </button>
                        <button type="button" onClick={() => removeReview(review)} aria-label="Delete review" className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-gold-600">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <p className="py-10 text-center text-[11px] text-muted">Loading reviews…</p>}
            {!loading && rows.length === 0 && (
              <p className="py-10 text-center text-[11px] text-muted">No reviews match these filters.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
            <span>{total} reviews · Page {page} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-[4px] border border-line px-2.5 py-1 disabled:opacity-40">Previous</button>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-[4px] border border-line px-2.5 py-1 disabled:opacity-40">Next</button>
            </div>
          </div>
        </section>
      )}

      {tab === "create" && (
        <form onSubmit={createCustom} className="space-y-4 rounded-[10px] border border-line bg-white p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className={subLabel}>Reviewer name</span>
              <input required minLength={2} value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} className={fieldClass} placeholder="e.g. TalkNest Team" />
            </label>
            <label className="block">
              <span className={subLabel}>Location</span>
              <input value={custom.location} onChange={(e) => setCustom({ ...custom, location: e.target.value })} className={fieldClass} />
            </label>
            <label className="block">
              <span className={subLabel}>Book / audiobook title</span>
              <input required value={custom.bookTitle} onChange={(e) => setCustom({ ...custom, bookTitle: e.target.value })} className={fieldClass} />
            </label>
            <label className="block">
              <span className={subLabel}>Book slug</span>
              <input required value={custom.bookSlug} onChange={(e) => setCustom({ ...custom, bookSlug: e.target.value })} className={fieldClass} placeholder="neel-megh" />
            </label>
            <label className="block">
              <span className={subLabel}>Type</span>
              <select value={custom.kind} onChange={(e) => setCustom({ ...custom, kind: e.target.value as "book" | "audio" })} className={fieldClass}>
                <option value="book">Book</option>
                <option value="audio">Audiobook</option>
              </select>
            </label>
            <label className="block">
              <span className={subLabel}>Rating</span>
              <select value={custom.rating} onChange={(e) => setCustom({ ...custom, rating: Number(e.target.value) })} className={fieldClass}>
                {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
              </select>
            </label>
          </div>
          <label className="block">
            <span className={subLabel}>Review title</span>
            <input required minLength={2} value={custom.title} onChange={(e) => setCustom({ ...custom, title: e.target.value })} className={fieldClass} />
          </label>
          <label className="block">
            <span className={subLabel}>Review text</span>
            <textarea required minLength={10} rows={4} value={custom.text} onChange={(e) => setCustom({ ...custom, text: e.target.value })} className={fieldClass} />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-[11px] text-ink">
              <input type="checkbox" checked={custom.status === "approved"} onChange={(e) => setCustom({ ...custom, status: e.target.checked ? "approved" : "pending", pinned: e.target.checked ? custom.pinned : false })} />
              Publish immediately
            </label>
            <label className="inline-flex items-center gap-2 text-[11px] text-ink">
              <input type="checkbox" checked={custom.pinned} disabled={custom.status !== "approved"} onChange={(e) => setCustom({ ...custom, pinned: e.target.checked })} />
              Pin as featured (approved only)
            </label>
          </div>
          <button type="submit" disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            <Plus size={13} /> {pending ? "Creating…" : "Create custom review"}
          </button>
        </form>
      )}

      {tab === "content" && (
        <section className="space-y-4 rounded-[10px] border border-line bg-white p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(draftCopy.section) as (keyof ReviewContent["section"])[]).map((key) => (
              <label key={key} className="block">
                <span className={subLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <input value={draftCopy.section[key]} onChange={(e) => setDraftCopy({ ...draftCopy, section: { ...draftCopy.section, [key]: e.target.value } })} className={fieldClass} />
              </label>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(draftCopy.page) as (keyof ReviewContent["page"])[]).map((key) => {
              const value = draftCopy.page[key];
              if (Array.isArray(value)) {
                return (
                  <label key={key} className="block sm:col-span-2">
                    <span className={subLabel}>{key}</span>
                    <input value={value.join(", ")} onChange={(e) => setDraftCopy({ ...draftCopy, page: { ...draftCopy.page, [key]: e.target.value.split(",").map((part) => part.trim()) } })} className={fieldClass} />
                  </label>
                );
              }
              return (
                <label key={key} className="block">
                  <span className={subLabel}>{key}</span>
                  <input value={value} onChange={(e) => setDraftCopy({ ...draftCopy, page: { ...draftCopy.page, [key]: e.target.value } })} className={fieldClass} />
                </label>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={saveCopyChanges} disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
              <Save size={13} /> {pending ? "Saving…" : "Save copy"}
            </button>
            <button type="button" onClick={resetCopyChanges} disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300 disabled:opacity-50">
              <RotateCcw size={13} /> Restore default
            </button>
          </div>
        </section>
      )}

      {active && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" aria-label="Close review details" onClick={() => setActive(null)} className="absolute inset-0 bg-ink/40" />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-600">Review details</p>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">{active.title}</h2>
                <p className="text-[10px] text-muted">
                  {active.name} · {active.source === "admin" ? "Admin-created" : "Reader"} · {new Date(active.createdAt).toLocaleString()}
                </p>
              </div>
              <button type="button" onClick={() => setActive(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-ink">
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                <Stars rating={active.rating} />
                <p className="mt-2 text-[11px] leading-relaxed text-ink">{active.text}</p>
                <p className="mt-2 text-[10px] text-muted">{active.bookTitle} · {active.kind === "audio" ? "Audiobook" : "Book"} · {active.location}</p>
              </div>
              <div>
                <p className={subLabel}>Status</p>
                <select
                  value={active.status}
                  onChange={(e) => setActive({ ...active, status: e.target.value as ReviewStatus })}
                  className={fieldClass}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <p className={subLabel}>Admin reply</p>
                <textarea
                  rows={4}
                  value={active.reply ?? ""}
                  onChange={(e) => setActive({ ...active, reply: e.target.value })}
                  placeholder="Write a helpful reply shown on the storefront"
                  className={fieldClass}
                />
              </div>
              <label className="inline-flex items-center gap-2 text-[11px] text-ink">
                <input
                  type="checkbox"
                  checked={active.pinned}
                  disabled={active.status !== "approved"}
                  onChange={(e) => setActive({ ...active, pinned: e.target.checked })}
                />
                Featured (pinned on the storefront) — approved reviews only
              </label>
              {active.source === "admin" && (
                <div className="space-y-3 border-t border-line pt-4">
                  <p className="text-[10px] font-semibold text-ink">Edit custom review</p>
                  <input value={active.name} onChange={(e) => setActive({ ...active, name: e.target.value })} className={fieldClass} aria-label="Reviewer name" />
                  <input value={active.title} onChange={(e) => setActive({ ...active, title: e.target.value })} className={fieldClass} aria-label="Review title" />
                  <select value={active.rating} onChange={(e) => setActive({ ...active, rating: Number(e.target.value) })} className={fieldClass} aria-label="Rating">
                    {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}
                  </select>
                  <textarea value={active.text} onChange={(e) => setActive({ ...active, text: e.target.value })} rows={4} className={fieldClass} aria-label="Review text" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  mutate(`/api/admin/reviews/${encodeURIComponent(active.id)}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                      status: active.status,
                      pinned: active.status === "approved" ? active.pinned : false,
                      reply: active.reply?.trim() || null,
                      ...(active.source === "admin"
                        ? { name: active.name, title: active.title, rating: active.rating, text: active.text }
                        : {}),
                    }),
                  }, "Review saved.")
                }
                disabled={pending}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                <Save size={13} /> Save changes
              </button>
              <button type="button" onClick={() => removeReview(active)} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:text-gold-600">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
