"use client";

/**
 * API-driven Reader Story Community manager. Every tab uses Route Handlers;
 * files stay on the server and are previewed through the authorising asset
 * route. Layouts are card-based so all tabs work on a phone.
 */
import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Mic,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useStories } from "@/components/providers/StoriesProvider";
import type { SaveResult, StoryView } from "@/lib/story-api";
import type { StoryCopy } from "@/lib/story-content";
import { cn } from "@/lib/utils";

type Tab = "review" | "stories" | "categories" | "homepage" | "page" | "share";
type Notice = { text: string; ok: boolean } | null;

type CategoryView = {
  id: string;
  name: string;
  slug: string;
  description: string;
  storyCount: number;
};

type FormState = {
  name: string;
  title: string;
  excerpt: string;
  body: string;
  type: "voice" | "text" | "pdf";
  category: string;
  coverUrl: string;
  avatarColor: string;
  duration: string;
  audioKey: string;
  attachmentKey: string;
  attachmentName: string;
  status: "pending" | "published" | "rejected" | "draft";
  featured: boolean;
};

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

function emptyForm(): FormState {
  return {
    name: "", title: "", excerpt: "", body: "", type: "text", category: "Community",
    coverUrl: "", avatarColor: "#1877F2", duration: "", audioKey: "",
    attachmentKey: "", attachmentName: "", status: "published", featured: false,
  };
}

function fromStory(story: StoryView): FormState {
  return {
    name: story.name,
    title: story.title,
    excerpt: story.excerpt,
    body: story.body,
    type: story.type,
    category: story.category,
    coverUrl: story.coverUrl ?? "",
    avatarColor: story.avatarColor,
    duration: story.duration ?? "",
    audioKey: story.hasAudio ? "stored" : "",
    attachmentKey: story.hasPdf ? "stored" : "",
    attachmentName: story.attachmentName ?? "",
    status: (["pending", "published", "rejected", "draft"].includes(story.status)
      ? story.status
      : "published") as FormState["status"],
    featured: story.featured,
  };
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="border-b border-line px-4 py-3.5 sm:px-5">
        <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-[10px] text-muted">{description}</p>}
      </div>
      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </section>
  );
}

function StringList({ label, values, onChange, multiline = false }: { label: string; values: string[]; onChange: (values: string[]) => void; multiline?: boolean }) {
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
          <div key={index} className="flex items-start gap-1.5">
            {multiline ? (
              <textarea rows={2} value={value} onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }} className={cn(fieldClass, "resize-y")} />
            ) : (
              <input value={value} onChange={(event) => {
                const next = [...values];
                next[index] = event.target.value;
                onChange(next);
              }} className={fieldClass} />
            )}
            <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label={`Remove ${label} item ${index + 1}`} className="rounded-[4px] p-2 text-muted hover:text-brand-700">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pager({ offset, limit, total, onChange }: { offset: number; limit: number; total: number; onChange: (next: number) => void }) {
  if (total <= limit) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
      <button type="button" disabled={offset === 0} onClick={() => onChange(Math.max(0, offset - limit))} className="rounded-[4px] border border-line px-3 py-1.5 text-[10px] font-semibold text-ink disabled:opacity-40">Previous</button>
      <span className="text-[9px] text-muted">{offset + 1}–{Math.min(offset + limit, total)} of {total}</span>
      <button type="button" disabled={offset + limit >= total} onClick={() => onChange(offset + limit)} className="rounded-[4px] border border-line px-3 py-1.5 text-[10px] font-semibold text-ink disabled:opacity-40">Next</button>
    </div>
  );
}

export function AdminStoriesManager({ label, initialTab = "review", initialCopy }: { label: string; initialTab?: Tab; initialCopy: StoryCopy }) {
  const { refresh: refreshPublic } = useStories();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<StoryView[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState<string>(initialTab === "review" ? "pending" : "");
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<StoryView | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<CategoryView[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [copy, setCopy] = useState<StoryCopy>(initialCopy);

  const show = useCallback((result: SaveResult) => {
    setNotice({ text: result.message, ok: result.ok });
    if (result.ok) void refreshPublic();
  }, [refreshPublic]);

  const load = useCallback(async () => {
    setBusy(true);
    try {
      const params = new URLSearchParams({ limit: "20", offset: String(offset) });
      if (status) params.set("status", status);
      if (type) params.set("type", type);
      if (search) params.set("q", search);
      const data = await accountFetch<{ rows: StoryView[]; total: number }>(`/api/admin/stories?${params}`);
      setRows(data.rows ?? []);
      setTotal(data.total ?? 0);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load stories." });
    } finally {
      setBusy(false);
    }
  }, [offset, status, type, search, show]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await accountFetch<{ categories: CategoryView[] }>("/api/admin/stories/categories");
      setCategories(data.categories ?? []);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not load categories." });
    }
  }, [show]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { void loadCategories(); }, [loadCategories]);

  const openStory = async (story: StoryView) => {
    setSelected(story);
    setForm(fromStory(story));
    try {
      const data = await accountFetch<{ story: StoryView }>(`/api/admin/stories/${story.id}`);
      setSelected(data.story);
      setForm(fromStory(data.story));
    } catch {
      // The list already carries all public fields; editing still works.
    }
  };

  const moderate = async (story: StoryView, nextStatus: FormState["status"]) => {
    setBusy(true);
    try {
      const result = await accountFetch<SaveResult>(`/api/admin/stories/${story.id}/moderate`, {
        method: "POST",
        body: JSON.stringify({ status: nextStatus,
          ...(tab === "review" && nextStatus === "published" ? { featured: false } : {}),
        }),
      });
      show(result);
      if (result.ok) {
        await load();
        setSelected(null);
        setForm(emptyForm());
      }
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not update the story." });
    } finally {
      setBusy(false);
    }
  };

  const updateStory = async () => {
    if (!selected) return;
    if (!form.title.trim() || !form.name.trim()) {
      show({ ok: false, message: "Title and author name are required." });
      return;
    }
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        title: form.title,
        excerpt: form.excerpt,
        body: form.body,
        type: form.type,
        category: form.category,
        coverUrl: form.coverUrl,
        avatarColor: form.avatarColor,
        duration: form.duration,
        audioKey: form.audioKey,
        attachmentKey: form.attachmentKey,
        attachmentName: form.attachmentName,
        status: form.status,
        featured: form.featured,
      };
      const result = await accountFetch<SaveResult>(`/api/admin/stories/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      show(result);
      if (result.ok) {
        await load();
        setSelected(null);
        setForm(emptyForm());
      }
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not update the story." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (story: StoryView) => {
    if (!window.confirm(`Delete "${story.title}" permanently?`)) return;
    try {
      show(await accountFetch<SaveResult>(`/api/admin/stories/${story.id}`, { method: "DELETE" }));
      await load();
      if (selected?.id === story.id) setSelected(null);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not delete the story." });
    }
  };

  const submitCategory = async () => {
    if (!newCategory.name.trim()) return;
    setBusy(true);
    try {
      const result = editingCategory
        ? await accountFetch<SaveResult>(`/api/admin/stories/categories/${editingCategory}`, {
            method: "PATCH",
            body: JSON.stringify(newCategory),
          })
        : await accountFetch<SaveResult>("/api/admin/stories/categories", {
            method: "POST",
            body: JSON.stringify(newCategory),
          });
      show(result);
      if (result.ok) {
        setNewCategory({ name: "", description: "" });
        setEditingCategory(null);
        await loadCategories();
      }
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not save the category." });
    } finally {
      setBusy(false);
    }
  };

  const removeCategory = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      show(await accountFetch<SaveResult>(`/api/admin/stories/categories/${id}`, { method: "DELETE" }));
      await loadCategories();
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not delete the category." });
    }
  };

  const saveCopy = async () => {
    setBusy(true);
    try {
      show(await accountFetch<SaveResult>("/api/admin/stories/copy", { method: "PUT", body: JSON.stringify(copy) }));
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not save the copy." });
    } finally {
      setBusy(false);
    }
  };

  const resetCopy = async () => {
    if (!window.confirm("Restore the original story copy?")) return;
    try {
      show(await accountFetch<SaveResult>("/api/admin/stories/copy", { method: "DELETE" }));
      const data = await accountFetch<{ content: StoryCopy }>("/api/admin/stories/copy");
      setCopy(data.content);
    } catch (reason) {
      show({ ok: false, message: reason instanceof Error ? reason.message : "Could not reset the copy." });
    }
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "review", label: "Submissions" },
    { key: "stories", label: "All stories", count: total },
    { key: "categories", label: "Categories" },
    { key: "homepage", label: "Homepage" },
    { key: "page", label: "/stories page" },
    { key: "share", label: "/share page" },
  ];

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="hover:text-brand-700">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">Review submissions, publish stories and manage the community.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/stories" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300"><Eye size={13} /> View stories</Link>
          <Link href="/stories/share" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300"><Pencil size={13} /> Share page</Link>
          <Link href="/admin" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300"><ArrowLeft size={13} /> Dashboard</Link>
        </div>
      </div>

      <nav aria-label="Story management sections" className="no-scrollbar flex gap-1 overflow-x-auto rounded-[8px] border border-line bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => { setTab(item.key); setNotice(null); setStatus(item.key === "review" ? "pending" : ""); setOffset(0); }}
            aria-current={tab === item.key ? "page" : undefined}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
              tab === item.key ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[9px]", tab === item.key ? "bg-white/20" : "bg-brand-50 text-brand-700")}>{item.count}</span>
            )}
          </button>
        ))}
      </nav>

      {notice && (
        <div role="status" className={cn("flex items-start gap-2 rounded-[6px] border px-4 py-3 text-[11px]", notice.ok ? "border-forest-600/20 bg-forest-50 text-forest-800" : "border-clay-500/25 bg-clay-500/5 text-clay-700")}>
          {notice.ok ? <Check size={14} className="mt-0.5 shrink-0" /> : <AlertCircle size={14} className="mt-0.5 shrink-0" />}
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {(tab === "review" || tab === "stories") && (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <div className="space-y-4">
            <Section
              title={tab === "review" ? "Pending submissions" : "All stories"}
              description="Search, filter and review every submission. Publishing updates the storefront immediately."
            >
              <form onSubmit={(event) => { event.preventDefault(); setOffset(0); setSearch(q.trim()); }} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search title, author or excerpt…" aria-label="Search stories" className={fieldClass} />
                <button type="submit" className="h-10 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">Search</button>
              </form>
              <div className="grid gap-2 sm:grid-cols-3">
                <select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setOffset(0); }} className={fieldClass}>
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
                <select aria-label="Filter by type" value={type} onChange={(event) => { setType(event.target.value); setOffset(0); }} className={fieldClass}>
                  <option value="">All types</option>
                  <option value="text">Written</option>
                  <option value="voice">Voice</option>
                  <option value="pdf">PDF</option>
                </select>
                <select aria-label="Filter by category" value="" onChange={() => {}} className={fieldClass} disabled>
                  <option>All categories</option>
                </select>
              </div>

              {busy && !rows.length ? (
                <div className="space-y-2" aria-hidden="true">{[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse rounded-[8px] bg-canvas" />)}</div>
              ) : rows.length === 0 ? (
                <p className="py-8 text-center text-[11px] text-muted">No stories match these filters.</p>
              ) : (
                <div className="grid gap-2.5">
                  {rows.map((story) => (
                    <div key={story.id} className="min-w-0 rounded-[8px] border border-line bg-canvas/40 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <button type="button" onClick={() => void openStory(story)} className="line-clamp-2 text-left text-[12px] font-semibold text-ink hover:text-brand-700">{story.title}</button>
                          <p className="mt-0.5 text-[9px] text-muted">
                            {story.name} · {story.type} · {new Date(story.createdAt).toLocaleDateString("en-BD")}
                          </p>
                        </div>
                        <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize",
                          story.status === "published" ? "bg-forest-100 text-forest-800"
                            : story.status === "rejected" ? "bg-clay-500/10 text-clay-700"
                              : "bg-gold-500/15 text-gold-700")}>
                          {story.status}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 break-words text-[10px] leading-relaxed text-body">{story.body || story.excerpt}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] text-muted">
                        <span>{story.likes} likes</span>
                        {story.hasPdf && <span className="inline-flex items-center gap-1"><FileText size={10} /> PDF</span>}
                        {story.hasAudio && <span className="inline-flex items-center gap-1"><Mic size={10} /> Audio</span>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                        <button type="button" onClick={() => void openStory(story)} className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300"><Eye size={11} /> Review</button>
                        {story.status !== "published" && (
                          <button type="button" disabled={busy} onClick={() => void moderate(story, "published")} className="inline-flex items-center gap-1 rounded-[4px] border border-forest-600/30 bg-forest-50 px-2.5 py-1.5 text-[10px] font-semibold text-forest-800 hover:bg-forest-100"><CheckCircle2 size={11} /> Accept & publish</button>
                        )}
                        {story.status !== "rejected" && (
                          <button type="button" disabled={busy} onClick={() => void moderate(story, "rejected")} className="inline-flex items-center gap-1 rounded-[4px] border border-clay-500/25 px-2.5 py-1.5 text-[10px] font-semibold text-clay-700 hover:bg-clay-500/5"><XCircle size={11} /> Reject</button>
                        )}
                        {story.status === "published" && (
                          <button type="button" disabled={busy} onClick={() => void moderate(story, "draft")} className="rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-ink hover:border-brand-300">Unpublish</button>
                        )}
                        <button type="button" onClick={() => void remove(story)} className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-clay-600 hover:border-clay-400"><Trash2 size={11} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Pager offset={offset} limit={20} total={total} onChange={setOffset} />
            </Section>
          </div>

          <Section
            title={selected ? `Review · ${selected.title}` : "Story review"}
            description="Preview the full submission, attached files and author details."
          >
            {!selected ? (
              <p className="py-10 text-center text-[11px] text-muted">Choose a story from the list to review it.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="font-semibold text-ink">{selected.name}</span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">{selected.category}</span>
                  <span className="text-muted">{selected.likes} likes</span>
                  {selected.authorId && <span className="text-muted">Author id: {selected.authorId.slice(0, 8)}…</span>}
                </div>

                {selected.hasPdf && (
                  <div className="overflow-hidden rounded-[8px] border border-line">
                    <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-ink"><FileText size={12} /> {selected.attachmentName || "Story PDF"}</span>
                      <a href={`/api/stories/${selected.slug}/asset?kind=pdf`} target="_blank" rel="noopener noreferrer" className="text-[9px] font-semibold text-brand-700 hover:underline">Open PDF</a>
                    </div>
                    <iframe
                      src={`/api/stories/${selected.slug}/asset?kind=pdf#toolbar=1`}
                      title={`PDF preview: ${selected.title}`}
                      className="h-72 w-full bg-white sm:h-96"
                    />
                  </div>
                )}
                {selected.hasAudio && (
                  <audio controls preload="metadata" src={`/api/stories/${selected.slug}/asset?kind=audio`} className="w-full">
                    Your browser does not support audio playback.
                  </audio>
                )}

                <div>
                  <p className="mb-1 text-[10px] font-semibold text-ink">Submitted content</p>
                  <p className="max-h-56 overflow-y-auto whitespace-pre-line break-words rounded-[6px] bg-canvas/60 p-3 text-[11px] leading-relaxed text-body">
                    {form.body || form.excerpt}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label><span className={subLabel}>Author name</span><input className={fieldClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                  <label><span className={subLabel}>Title</span><input className={fieldClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
                  <label className="sm:col-span-2"><span className={subLabel}>Excerpt</span><textarea rows={2} className={fieldClass} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} /></label>
                  <label className="sm:col-span-2"><span className={subLabel}>Full story</span><textarea rows={5} className={fieldClass} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /></label>
                  <label><span className={subLabel}>Type</span><select className={fieldClass} value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as FormState["type"] })}><option value="text">Written</option><option value="voice">Voice</option><option value="pdf">PDF</option></select></label>
                  <label><span className={subLabel}>Category</span><select className={fieldClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{Array.from(new Set([form.category, ...categories.map((item) => item.name)])).map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label><span className={subLabel}>Status</span><select className={fieldClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState["status"] })}><option value="pending">Pending</option><option value="published">Published</option><option value="rejected">Rejected</option><option value="draft">Draft</option></select></label>
                  <label><span className={subLabel}>Duration</span><input className={fieldClass} value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} /></label>
                  <label className="sm:col-span-2"><span className={subLabel}>Cover URL</span><input className={fieldClass} value={form.coverUrl} onChange={(event) => setForm({ ...form, coverUrl: event.target.value })} /></label>
                  <label className="flex items-center gap-2 text-[11px] text-ink sm:col-span-2"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-3.5 w-3.5 accent-brand-600" /> Feature this story</label>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                  <button type="button" disabled={busy} onClick={() => void updateStory()} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
                    {busy ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save changes
                  </button>
                  <button type="button" onClick={() => { setSelected(null); setForm(emptyForm()); }} className="h-10 rounded-[4px] border border-line px-4 text-[11px] font-semibold text-ink">Close</button>
                </div>
              </div>
            )}
          </Section>
        </div>
      )}

      {tab === "categories" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <Section title="Categories" description="Categories shown in the story submission form and filters.">
            <div className="grid gap-2">
              {categories.length === 0 && <p className="py-6 text-center text-[11px] text-muted">No categories yet.</p>}
              {categories.map((category) => (
                <div key={category.id} className="flex flex-wrap items-center gap-2 rounded-[8px] border border-line bg-canvas/40 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-ink">{category.name}</p>
                    <p className="text-[9px] text-muted">{category.storyCount} stories · /{category.slug}</p>
                  </div>
                  <button type="button" onClick={() => { setEditingCategory(category.id); setNewCategory({ name: category.name, description: category.description }); }} className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-ink"><Pencil size={11} /> Edit</button>
                  <button type="button" onClick={() => void removeCategory(category.id)} className="inline-flex items-center gap-1 rounded-[4px] border border-line bg-white px-2.5 py-1.5 text-[10px] font-medium text-clay-600"><Trash2 size={11} /> Delete</button>
                </div>
              ))}
            </div>
          </Section>
          <Section title={editingCategory ? "Edit category" : "New category"}>
            <label><span className={subLabel}>Name</span><input className={fieldClass} value={newCategory.name} onChange={(event) => setNewCategory({ ...newCategory, name: event.target.value })} /></label>
            <label><span className={subLabel}>Description</span><textarea rows={2} className={fieldClass} value={newCategory.description} onChange={(event) => setNewCategory({ ...newCategory, description: event.target.value })} /></label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => void submitCategory()} disabled={busy || !newCategory.name.trim()} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white disabled:opacity-60"><Save size={13} /> Save category</button>
              {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setNewCategory({ name: "", description: "" }); }} className="h-10 rounded-[4px] border border-line px-4 text-[11px] font-semibold text-ink">Cancel</button>}
            </div>
          </Section>
        </div>
      )}

      {(tab === "homepage" || tab === "page" || tab === "share") && (
        <Section
          title={tab === "homepage" ? "Homepage section" : tab === "page" ? "/stories page" : "/stories/share page"}
          description="Copy is saved through the admin API and reflected on the storefront immediately."
        >
          {tab === "homepage" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(copy.section) as (keyof typeof copy.section)[]).map((key) => (
                <div key={key} className={key === "description" ? "sm:col-span-2" : ""}>
                  <label className={subLabel} htmlFor={`story-section-${key}`}>{key}</label>
                  <input id={`story-section-${key}`} className={fieldClass} value={copy.section[key]} onChange={(event) => setCopy({ ...copy, section: { ...copy.section, [key]: event.target.value } })} />
                </div>
              ))}
              <div className="sm:col-span-2"><StringList label="bullets" values={copy.home.bullets} onChange={(values) => setCopy({ ...copy, home: { ...copy.home, bullets: values } })} /></div>
              {(["primaryLabel", "secondaryLabel", "notice"] as const).map((key) => (
                <div key={key} className={key === "notice" ? "sm:col-span-2" : ""}>
                  <label className={subLabel} htmlFor={`story-home-${key}`}>{key}</label>
                  <input id={`story-home-${key}`} className={fieldClass} value={copy.home[key]} onChange={(event) => setCopy({ ...copy, home: { ...copy.home, [key]: event.target.value } })} />
                </div>
              ))}
            </div>
          )}
          {tab === "page" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(copy.page) as (keyof typeof copy.page)[]).map((key) => {
                const value = copy.page[key];
                if (key === "stats") {
                  const stats = copy.page.stats;
                  return (
                    <div key={key} className="sm:col-span-2">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-ink">stats</span>
                        <button type="button" onClick={() => setCopy({ ...copy, page: { ...copy.page, stats: [...stats, { value: "", label: "" }] } })} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700"><Plus size={11} /> Add</button>
                      </div>
                      {stats.map((stat, index) => (
                        <div key={index} className="mb-1.5 flex flex-wrap gap-1.5">
                          <input className={cn(fieldClass, "max-w-[140px]")} placeholder="Value" value={stat.value} onChange={(event) => setCopy({ ...copy, page: { ...copy.page, stats: copy.page.stats.map((item, i) => i === index ? { ...item, value: event.target.value } : item) } })} />
                          <input className={fieldClass} placeholder="Label" value={stat.label} onChange={(event) => setCopy({ ...copy, page: { ...copy.page, stats: copy.page.stats.map((item, i) => i === index ? { ...item, label: event.target.value } : item) } })} />
                          <button type="button" onClick={() => setCopy({ ...copy, page: { ...copy.page, stats: copy.page.stats.filter((_, i) => i !== index) } })} aria-label="Remove stat" className="rounded p-2 text-muted hover:text-brand-700"><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  );
                }
                if (key === "rules") {
                  return <div key={key} className="sm:col-span-2"><StringList label="rules" values={copy.page.rules} multiline onChange={(values) => setCopy({ ...copy, page: { ...copy.page, rules: values } })} /></div>;
                }
                return (
                  <div key={key} className={["description", "ctaText", "footerNote"].includes(key) ? "sm:col-span-2" : ""}>
                    <label className={subLabel} htmlFor={`story-page-${key}`}>{key}</label>
                    <input id={`story-page-${key}`} className={fieldClass} value={String(value)} onChange={(event) => setCopy({ ...copy, page: { ...copy.page, [key]: event.target.value } })} />
                  </div>
                );
              })}
            </div>
          )}
          {tab === "share" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(copy.share) as (keyof typeof copy.share)[]).map((key) => {
                const value = copy.share[key];
                if (key === "tips") {
                  return <div key={key} className="sm:col-span-2"><StringList label="tips" values={copy.share.tips} multiline onChange={(values) => setCopy({ ...copy, share: { ...copy.share, tips: values } })} /></div>;
                }
                return (
                  <div key={key} className={["description", "successText", "reviewText"].includes(key) ? "sm:col-span-2" : ""}>
                    <label className={subLabel} htmlFor={`story-share-${key}`}>{key}</label>
                    <input id={`story-share-${key}`} className={fieldClass} value={String(value)} onChange={(event) => setCopy({ ...copy, share: { ...copy.share, [key]: event.target.value } })} />
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            <button type="button" onClick={() => void saveCopy()} disabled={busy} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-60"><Save size={13} /> Save copy</button>
            <button type="button" onClick={() => void resetCopy()} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-semibold text-ink hover:border-brand-300"><RotateCcw size={12} /> Restore default</button>
          </div>
        </Section>
      )}
    </div>
  );
}
