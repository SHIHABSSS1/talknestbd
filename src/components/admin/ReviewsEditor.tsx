"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import { useReviews } from "@/components/providers/ReviewsProvider";
import { cloneReviewDefaults, type ReviewContent } from "@/lib/review-content";
import type { Review } from "@/lib/types";
import type { ReviewRequest } from "@/lib/review-requests";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "reviews" | "add" | "requests" | "homepage" | "page";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="border-b border-line px-4 py-3.5 sm:px-5">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
        {description && <p className="text-[10px] text-muted">{description}</p>}
      </div>
      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </section>
  );
}

function StringList({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink">{label}</span>
        <button type="button" onClick={() => onChange([...values, ""])} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline">
          <Plus size={11} /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <input
              value={value}
              onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }}
              className={fieldClass}
            />
            <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="rounded-[4px] p-2 text-muted hover:text-brand-700">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function newReview(): Review {
  return {
    id: `r-${Date.now()}`,
    name: "",
    location: "Dhaka",
    rating: 5,
    text: "",
    bookTitle: "",
    bookSlug: "",
    date: "Just now",
    avatarColor: "#1877F2",
    verified: true,
  };
}

export function ReviewsEditor({ label }: { label: string }) {
  const {
    content,
    save,
    reset,
    requests,
    hydrated,
    setRequestStatus,
    removeRequest,
    approve,
  } = useReviews();
  const [draft, setDraft] = useState<ReviewContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("reviews");
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<Review>(newReview);

  useEffect(() => setDraft(content), [content]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);
  const pending = requests.filter((item) => item.status === "Pending");

  const updateReview = (id: string, patch: Partial<Review>) => {
    setDraft((current) => ({
      ...current,
      reviews: current.reviews.map((review) => (review.id === id ? { ...review, ...patch } : review)),
    }));
    setNotice(null);
  };

  const removeReview = (id: string) => {
    setDraft((current) => ({
      ...current,
      reviews: current.reviews.filter((review) => review.id !== id),
    }));
    setNotice(null);
  };

  const startAdd = () => {
    setForm(newReview());
    setTab("add");
    setNotice(null);
  };

  const saveForm = () => {
    if (!form.name.trim() || !form.text.trim()) {
      setNotice({ error: true, text: "Name and review text are required." });
      return;
    }
    const final: Review = {
      ...form,
      name: form.name.trim(),
      text: form.text.trim(),
      bookTitle: form.bookTitle.trim() || "General experience",
      bookSlug: form.bookSlug || "books",
    };
    setDraft((current) => ({
      ...current,
      reviews: current.reviews.some((item) => item.id === final.id)
        ? current.reviews.map((item) => (item.id === final.id ? final : item))
        : [final, ...current.reviews],
    }));
    setEditing(null);
    setForm(newReview());
    setTab("reviews");
    setNotice({ text: "Review saved. Click Save all changes to publish." });
  };

  const setSection = <K extends keyof ReviewContent["section"]>(key: K, value: ReviewContent["section"][K]) => {
    setDraft((current) => ({ ...current, section: { ...current.section, [key]: value } }));
    setNotice(null);
  };

  const setPage = <K extends keyof ReviewContent["page"]>(key: K, value: ReviewContent["page"][K]) => {
    setDraft((current) => ({ ...current, page: { ...current.page, [key]: value } }));
    setNotice(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneReviewDefaults());
    setEditing(null);
    setNotice({ text: result.message, error: !result.ok });
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "reviews", label: "Reviews", count: draft.reviews.length },
    { key: "add", label: "Add review" },
    { key: "requests", label: "Requests", count: pending.length },
    { key: "homepage", label: "Homepage" },
    { key: "page", label: "/reviews page" },
  ];

  const renderForm = (value: Review, onChange: (review: Review) => void, title: string) => (
    <Section title={title}>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className={subLabel}>Reader name</span>
          <input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} className={fieldClass} />
        </label>
        <label className="block">
          <span className={subLabel}>Location</span>
          <input value={value.location} onChange={(event) => onChange({ ...value, location: event.target.value })} className={fieldClass} />
        </label>
        <label className="block">
          <span className={subLabel}>Book title</span>
          <input value={value.bookTitle} onChange={(event) => onChange({ ...value, bookTitle: event.target.value })} className={fieldClass} />
        </label>
        <label className="block">
          <span className={subLabel}>Book slug</span>
          <input value={value.bookSlug} onChange={(event) => onChange({ ...value, bookSlug: event.target.value })} className={fieldClass} />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className={subLabel}>Rating (1–5)</span>
          <input type="number" min={1} max={5} value={value.rating} onChange={(event) => onChange({ ...value, rating: Number(event.target.value) })} className={fieldClass} />
        </label>
        <label className="block">
          <span className={subLabel}>Avatar color</span>
          <input type="color" value={value.avatarColor} onChange={(event) => onChange({ ...value, avatarColor: event.target.value })} className="h-[42px] w-full cursor-pointer rounded-[4px] border border-line bg-white p-1" />
        </label>
      </div>
      <label className="block">
        <span className={subLabel}>Review text</span>
        <textarea value={value.text} onChange={(event) => onChange({ ...value, text: event.target.value })} rows={4} className={`${fieldClass} resize-y`} />
      </label>
      <label className="block">
        <span className={subLabel}>Admin reply (optional)</span>
        <textarea
          value={value.reply ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              reply: event.target.value,
              replyDate: event.target.value ? new Date().toISOString() : undefined,
            })
          }
          rows={2}
          placeholder="Reply to this reader — shown on the storefront"
          className={`${fieldClass} resize-y`}
        />
      </label>
      <label className="flex items-center gap-2 text-[11px] font-semibold text-ink">
        <input type="checkbox" checked={value.verified} onChange={(event) => onChange({ ...value, verified: event.target.checked })} className="h-3.5 w-3.5 accent-brand-600" />
        Verified review
      </label>
    </Section>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="hover:text-brand-700">Dashboard</Link>
        <span>/</span>
        <span>Homepage sections</span>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">
            Manage published reviews, moderate reader submissions and edit both review pages.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/reviews" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <Eye size={13} /> View reviews
          </Link>
          <Link href="/admin" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 overflow-x-auto rounded-[8px] border border-line bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              if (item.key === "add" && !editing) startAdd();
              setTab(item.key);
            }}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
              tab === item.key ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50 hover:text-brand-700",
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

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {tab === "reviews" && (
            <Section title="Published reviews" description="These appear on the homepage, /reviews and book detail pages.">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-muted">{draft.reviews.length} reviews</p>
                <button type="button" onClick={startAdd} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                  <Plus size={12} /> Add review
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Reader</th>
                      <th className="px-2 py-2 font-semibold">Book</th>
                      <th className="px-2 py-2 font-semibold">Rating</th>
                      <th className="px-2 py-2 font-semibold">Reply</th>
                      <th className="px-2 py-2 font-semibold">Verified</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.reviews.map((review) => (
                      <tr key={review.id} className="border-b border-line/70 last:border-0">
                        <td className="px-2 py-2">
                          <p className="text-[11px] font-semibold text-ink">{review.name}</p>
                          <p className="max-w-[180px] truncate text-[9px] text-muted">{review.text}</p>
                        </td>
                        <td className="px-2 py-2 text-[10px] text-muted">{review.bookTitle}</td>
                        <td className="px-2 py-2 text-[10px] text-gold-600">{"★".repeat(review.rating)}</td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              const text = window.prompt("Admin reply", review.reply ?? "");
                              if (text !== null) {
                                updateReview(review.id, {
                                  reply: text,
                                  replyDate: text ? new Date().toISOString() : undefined,
                                });
                              }
                            }}
                            className={cn(
                              "text-[9px] font-semibold",
                              review.reply ? "text-brand-700" : "text-muted hover:text-brand-700",
                            )}
                          >
                            {review.reply ? "View / edit" : "+ Reply"}
                          </button>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="checkbox"
                            checked={review.verified}
                            onChange={(event) => updateReview(review.id, { verified: event.target.checked })}
                            className="h-3.5 w-3.5 accent-brand-600"
                          />
                        </td>
                        <td className="px-2 py-2 text-right">
                          <div className="inline-flex gap-1">
                            <button type="button" onClick={() => { setEditing(review); setTab("reviews"); }} className="rounded-[4px] border border-line px-2 py-1.5 text-[9px] font-medium text-ink hover:border-brand-300">Edit</button>
                            <button type="button" onClick={() => removeReview(review.id)} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700" title="Delete review">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {editing && tab === "reviews" && (
            <>
              {renderForm(editing, setEditing, "Edit review")}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const exists = draft.reviews.some((item) => item.id === editing.id);
                    setDraft((current) => ({
                      ...current,
                      reviews: exists
                        ? current.reviews.map((item) => (item.id === editing.id ? editing : item))
                        : [editing, ...current.reviews],
                    }));
                    setEditing(null);
                    setNotice({ text: "Review updated. Save all changes to publish." });
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
                >
                  <Save size={13} /> Save review
                </button>
                <button type="button" onClick={() => setEditing(null)} className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                  Cancel
                </button>
              </div>
            </>
          )}

          {tab === "add" && (
            <>
              {renderForm(form, setForm, "Add review")}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={saveForm} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
                  <Save size={13} /> Add review
                </button>
                <button type="button" onClick={() => setForm(newReview())} className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                  Clear
                </button>
              </div>
            </>
          )}

          {tab === "requests" && (
            <Section title="Review requests" description="Reader submissions — approve to publish, or reject.">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "All", value: requests.length },
                  { label: "Pending", value: pending.length },
                  { label: "Approved", value: requests.filter((item) => item.status === "Approved").length },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[8px] border border-line bg-white p-3">
                    <p className="text-[9px] text-muted">{stat.label}</p>
                    <p className="mt-1 font-display text-xl font-bold text-ink">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Reader</th>
                      <th className="px-2 py-2 font-semibold">Review</th>
                      <th className="px-2 py-2 font-semibold">Book</th>
                      <th className="px-2 py-2 font-semibold">Status</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="border-b border-line/70 last:border-0 align-top">
                        <td className="px-2 py-2.5">
                          <p className="text-[11px] font-semibold text-ink">{request.name}</p>
                          <p className="text-[9px] text-muted">{request.location}</p>
                          <p className="text-[9px] text-gold-600">{"★".repeat(request.rating)}</p>
                          <p className="text-[9px] text-muted">{new Date(request.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="max-w-[260px] px-2 py-2.5 text-[10px] leading-relaxed text-muted">{request.text}</td>
                        <td className="px-2 py-2.5 text-[10px] text-muted">{request.bookTitle}</td>
                        <td className="px-2 py-2.5">
                          <select
                            value={request.status}
                            onChange={(event) => setRequestStatus(request.id, event.target.value as ReviewRequest["status"])}
                            className="rounded-[4px] border border-line bg-white px-2 py-1.5 text-[10px] text-ink"
                          >
                            {(["Pending", "Approved", "Rejected"] as const).map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => { approve(request); setNotice({ text: `${request.name}'s review is now published.` }); }}
                              className="inline-flex h-7 items-center gap-1 rounded-[4px] bg-mint/30 px-2 text-[9px] font-semibold text-forest-700 hover:bg-mint/50"
                            >
                              <CheckCircle2 size={11} /> Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => { setRequestStatus(request.id, "Rejected"); setNotice({ text: "Request rejected." }); }}
                              className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-line px-2 text-[9px] font-semibold text-muted hover:text-brand-700"
                            >
                              <XCircle size={11} /> Reject
                            </button>
                            <button type="button" onClick={() => removeRequest(request.id)} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700" title="Delete request">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-2 py-8 text-center text-[11px] text-muted">
                          {hydrated ? "No review requests yet." : "Loading requests…"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {tab === "homepage" && (
            <Section title="Homepage reviews section">
              {(["eyebrow", "title", "description", "linkLabel"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <input value={draft.section[key]} onChange={(event) => setSection(key, event.target.value)} className={fieldClass} />
                </label>
              ))}
            </Section>
          )}

          {tab === "page" && (
            <Section title="/reviews page">
              {(["eyebrow", "title", "description", "ratingValue", "reviewCount", "loveLabel", "loveTitle", "loveText", "heading", "headingDescription", "moderationNote", "successTitle", "successText"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.page[key]}
                    onChange={(event) => setPage(key, event.target.value)}
                    rows={key === "description" || key === "loveText" || key === "moderationNote" || key === "successText" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
              <StringList label="Rating pills" values={draft.page.pills} onChange={(values) => setPage("pills", values)} />
              <StringList label="Reader love pills" values={draft.page.lovePills} onChange={(values) => setPage("lovePills", values)} />
            </Section>
          )}

          {notice && (
            <div className={cn("flex items-start gap-2 rounded-[8px] border px-3 py-2.5", notice.error ? "border-gold-300 bg-gold-300/15" : "border-brand-100 bg-brand-50")}>
              {notice.error ? <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" /> : <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          {tab !== "requests" && tab !== "add" && (
            <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
              <button type="button" onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
                <Save size={13} /> Save all changes
              </button>
              <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                <RotateCcw size={13} /> Restore default
              </button>
              {dirty && <span className="ml-auto text-[10px] font-semibold text-gold-600">Unsaved changes</span>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">
                {tab === "requests" ? "Latest request" : "Homepage wall"}
              </span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              {tab === "requests" ? (
                requests.length > 0 ? (
                  <div className="space-y-2">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="rounded-[6px] border border-line bg-white p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold text-ink">{request.name}</span>
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[8px] font-semibold text-brand-700">{request.status}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-[9px] text-muted">{request.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted">No requests yet.</p>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">{draft.section.eyebrow}</p>
                  <h3 className="font-display text-base font-bold text-ink">{draft.section.title}</h3>
                  <p className="text-[10px] leading-relaxed text-muted">{draft.section.description}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {draft.reviews.slice(0, 4).map((review) => (
                      <div key={review.id} className="rounded-[6px] border border-line bg-white p-2.5">
                        <p className="text-[9px] text-gold-600">{"★".repeat(review.rating)}</p>
                        <p className="mt-1 line-clamp-2 text-[9px] text-ink">“{review.text}”</p>
                        <p className="mt-1 text-[8px] text-muted">{review.name} · {review.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          <p className="text-[10px] leading-relaxed text-muted">
            Demo note: reviews and requests are stored in this browser only — nothing reaches a server.
          </p>
        </div>
      </div>
    </div>
  );
}
