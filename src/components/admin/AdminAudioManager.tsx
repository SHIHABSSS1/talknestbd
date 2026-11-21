"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  FileAudio,
  ImagePlus,
  Music2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { useAudioContent } from "@/components/providers/AudioContentProvider";
import { BookCover } from "@/components/books/BookCover";
import { cn, formatPrice } from "@/lib/utils";
import { slugify } from "@/lib/slug";
import type { AudioBookView } from "@/lib/audio-api";
import type { AudioContent } from "@/lib/audio-content";

type ChapterDraft = {
  id: string;
  title: string;
  duration: string;
  src: string;
  free: boolean;
};

type FormState = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  authorSlug: string;
  publisher: string;
  publisherSlug: string;
  narrator: string;
  source: string;
  category: string;
  subcategory: string;
  duration: string;
  description: string;
  longDescription: string;
  highlights: string;
  price: string;
  oldPrice: string;
  free: boolean;
  status: "draft" | "published";
  featured: boolean;
  cover: { from: string; to: string; accent: string; motif: string; imageSrc?: string };
  rating: string;
  reviewCount: string;
  pages: string;
  language: string;
  binding: string;
  publishedYear: string;
  stock: string;
  isbn: string;
  chapters: ChapterDraft[];
};

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const motifs = ["arch", "circle", "lines", "star", "wave", "grid"];

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    subtitle: "",
    author: "",
    authorSlug: "",
    publisher: "TalkNest Audio",
    publisherSlug: "talknestaudio",
    narrator: "TalkNest Voices",
    source: "",
    category: "uponnash",
    subcategory: "",
    duration: "—",
    description: "",
    longDescription: "",
    highlights: "",
    price: "199",
    oldPrice: "",
    free: false,
    status: "published",
    featured: false,
    cover: { from: "#0e3b3f", to: "#1d6b62", accent: "#e6c87c", motif: "arch" },
    rating: "4.8",
    reviewCount: "0",
    pages: "0",
    language: "Bangla",
    binding: "Audiobook",
    publishedYear: "2026",
    stock: "999",
    isbn: "",
    chapters: [
      {
        id: `ch-${Date.now()}`,
        title: "Chapter 1",
        duration: "12:00",
        src: "",
        free: true,
      },
    ],
  };
}

function fromView(view: AudioBookView): FormState {
  return {
    id: view.id,
    slug: view.slug,
    title: view.title,
    subtitle: view.subtitle ?? "",
    author: view.author,
    authorSlug: view.authorSlug,
    publisher: view.publisher,
    publisherSlug: view.publisherSlug,
    narrator: view.narrator,
    source: view.source,
    category: view.category,
    subcategory: view.subcategory ?? "",
    duration: view.duration,
    description: view.description,
    longDescription: view.longDescription.join("\n"),
    highlights: view.highlights.join("\n"),
    price: String(view.price),
    oldPrice: view.oldPrice ? String(view.oldPrice) : "",
    free: view.free,
    status: "published",
    featured: view.featured,
    cover: { ...view.cover } as FormState["cover"],
    rating: String(view.rating),
    reviewCount: String(view.reviewCount),
    pages: String(view.pages),
    language: view.language,
    binding: view.binding,
    publishedYear: String(view.publishedYear),
    stock: String(view.stock),
    isbn: view.isbn ?? "",
    chapters: view.chapters.map((chapter) => ({ ...chapter })),
  };
}

function lines(value: string): string[] {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export function AdminAudioManager({
  label,
}: {
  label: string;
  initialContent?: AudioContent;
}) {
  const { content, save: saveCopy, reset: resetCopy, refresh } = useAudioContent();
  const [tab, setTab] = useState<"books" | "homepage" | "library" | "pricing">("books");
  const [rows, setRows] = useState<AudioBookView[]>([]);
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [copy, setCopy] = useState<AudioContent>(content);
  const [pending, startTransition] = useTransition();
  const [busyUpload, setBusyUpload] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await accountFetch<{ audiobooks: AudioBookView[] }>(
        "/api/admin/audiobooks",
      );
      setRows(data.audiobooks ?? []);
    } catch (reason) {
      setNotice({
        ok: false,
        text: reason instanceof Error ? reason.message : "Could not load audiobooks.",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setCopy(content);
  }, [content]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    setBusyUpload("cover");
    try {
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read the image."));
        reader.readAsDataURL(blob);
      });
      const response = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ src: dataUrl, folder: "audiobooks" }),
      });
      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? "Cover upload failed.");
      }
      setForm((current) => ({
        ...current,
        cover: { ...current.cover, imageSrc: data.url },
      }));
      setNotice({ ok: true, text: "Cover stored on the server." });
    } catch (error) {
      setNotice({
        ok: false,
        text: error instanceof Error ? error.message : "Could not store the cover.",
      });
    } finally {
      setBusyUpload("");
    }
  };

  const uploadAudio = async (chapterId: string, file: File | undefined) => {
    if (!file) return;
    setBusyUpload(chapterId);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/audio-upload", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!response.ok || !data?.url) {
        throw new Error(data?.error ?? "Audio upload failed.");
      }
      setForm((current) => ({
        ...current,
        chapters: current.chapters.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, src: data.url! } : chapter,
        ),
      }));
      setNotice({ ok: true, text: `Stored ${file.name} in uploads/audio-book.` });
    } catch (error) {
      setNotice({
        ok: false,
        text: error instanceof Error ? error.message : "Could not store the audio.",
      });
    } finally {
      setBusyUpload("");
    }
  };

  const updateChapter = (id: string, patch: Partial<ChapterDraft>) => {
    setForm((current) => ({
      ...current,
      chapters: current.chapters.map((chapter) =>
        chapter.id === id ? { ...chapter, ...patch } : chapter,
      ),
    }));
  };

  const saveAudiobook = () => {
    if (!form.title.trim() || !form.author.trim()) {
      setNotice({ ok: false, text: "Title and author are required." });
      return;
    }
    if (form.chapters.some((chapter) => !chapter.src)) {
      setNotice({ ok: false, text: "Every chapter needs an audio URL or upload." });
      return;
    }
    const payload = {
      ...(editingId ? { id: editingId } : {}),
      slug: form.slug || slugify(form.title),
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      author: form.author.trim(),
      authorSlug: form.authorSlug || slugify(form.author),
      publisher: form.publisher.trim(),
      publisherSlug: form.publisherSlug || slugify(form.publisher),
      narrator: form.narrator.trim(),
      source: form.source.trim(),
      category: form.category,
      subcategory: form.subcategory || undefined,
      duration: form.duration.trim(),
      description: form.description.trim(),
      longDescription: lines(form.longDescription),
      highlights: lines(form.highlights),
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      free: form.free,
      status: form.status,
      featured: form.featured,
      cover: form.cover,
      rating: Number(form.rating) || 4.8,
      reviewCount: Number(form.reviewCount) || 0,
      pages: Number(form.pages) || 0,
      language: form.language,
      binding: form.binding,
      publishedYear: Number(form.publishedYear) || 2026,
      stock: Number(form.stock) || 999,
      isbn: form.isbn.trim() || undefined,
      chapters: form.chapters.map((chapter, position) => ({ ...chapter, position })),
    };

    startTransition(async () => {
      try {
        const result = await accountFetch<{ ok: boolean; message: string }>(
          "/api/admin/audiobooks",
          {
            method: editingId ? "PATCH" : "POST",
            body: JSON.stringify(payload),
          },
        );
        setNotice({ ok: result.ok, text: result.message });
        if (result.ok) {
          setForm(emptyForm());
          setEditingId(null);
          void load();
          void refresh();
        }
      } catch (error) {
        setNotice({
          ok: false,
          text: error instanceof Error ? error.message : "Could not save the audiobook.",
        });
      }
    });
  };

  const removeAudiobook = (row: AudioBookView) => {
    startTransition(async () => {
      try {
        const result = await accountFetch<{ ok: boolean; message: string }>(
          "/api/admin/audiobooks",
          { method: "DELETE", body: JSON.stringify({ id: row.id }) },
        );
        setNotice({ ok: result.ok, text: result.message });
        if (result.ok) {
          void load();
          void refresh();
        }
      } catch (error) {
        setNotice({
          ok: false,
          text: error instanceof Error ? error.message : "Could not delete the audiobook.",
        });
      }
    });
  };

  const saveCopyChanges = () => {
    startTransition(async () => {
      const result = await saveCopy(copy);
      setNotice({ ok: result.ok, text: result.message });
    });
  };

  const resetCopyChanges = () => {
    startTransition(async () => {
      const result = await resetCopy();
      if (result.ok) {
        void refresh();
      }
      setNotice({ ok: result.ok, text: result.message });
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">
            Manage audiobooks, chapters and audio files — all stored in the database and local media.
          </p>
        </div>
        <Link
          href="/audio-books"
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300"
        >
          <Eye size={13} /> View storefront
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 rounded-[8px] border border-line bg-white p-1">
        {([
          { key: "books", label: "Audiobooks", count: rows.length },
          { key: "homepage", label: "Homepage" },
          { key: "library", label: "Audio page" },
          { key: "pricing", label: "Pricing" },
        ] as { key: "books" | "homepage" | "library" | "pricing"; label: string; count?: number }[]).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold",
              tab === item.key ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[9px]">{item.count}</span>
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
          {notice.ok ? <Check size={13} className="mt-0.5" /> : <AlertCircle size={13} className="mt-0.5 text-gold-600" />}
          {notice.text}
        </div>
      )}

      {tab === "books" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-line bg-white px-4 py-3">
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Audiobook catalogue</h2>
                <p className="text-[10px] text-muted">{rows.length} titles</p>
              </div>
              <button
                type="button"
                onClick={() => { setForm(emptyForm()); setEditingId(null); }}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700"
              >
                <Plus size={12} /> New audiobook
              </button>
            </div>

            <div className="overflow-hidden rounded-[10px] border border-line bg-white">
              <div className="max-h-[560px] overflow-y-auto">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center gap-3 border-b border-line px-3 py-2.5 last:border-b-0"
                  >
                    <div className="h-12 w-9 shrink-0 overflow-hidden rounded">
                      <BookCover
                        book={{
                          title: row.title,
                          author: row.author,
                          publisher: row.publisher,
                          cover: row.cover,
                        }}
                        size="sm"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-ink">{row.title}</p>
                      <p className="truncate text-[9px] text-muted">
                        {row.author} · {row.narrator} · {row.chapters.length} chapters
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9px] font-semibold text-brand-700">
                      {row.free ? "Free" : formatPrice(row.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setForm(fromView(row)); setEditingId(row.id); }}
                      aria-label={`Edit ${row.title}`}
                      className="rounded-[4px] border border-line px-2 py-1 text-[10px] text-ink hover:border-brand-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAudiobook(row)}
                      aria-label={`Delete ${row.title}`}
                      className="rounded-[4px] border border-line p-1.5 text-muted hover:text-gold-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {rows.length === 0 && (
                  <p className="px-3 py-8 text-center text-[11px] text-muted">No audiobooks yet.</p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-[10px] border border-line bg-white p-4">
            <h2 className="text-[13px] font-semibold text-ink">
              {editingId ? `Edit — ${form.title}` : "Add an audiobook"}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className={subLabel}>Title</span>
                <input
                  value={form.title}
                  onChange={(event) => {
                    setField("title", event.target.value);
                    if (!editingId && (!form.slug || form.slug === slugify(form.title))) {
                      setField("slug", slugify(event.target.value));
                    }
                  }}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Subtitle</span>
                <input value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Slug</span>
                <input value={form.slug} onChange={(e) => setField("slug", slugify(e.target.value))} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Author</span>
                <input value={form.author} onChange={(e) => {
                  setField("author", e.target.value);
                  setField("authorSlug", slugify(e.target.value));
                }} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Publisher</span>
                <input value={form.publisher} onChange={(e) => {
                  setField("publisher", e.target.value);
                  setField("publisherSlug", slugify(e.target.value));
                }} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Narrator</span>
                <input value={form.narrator} onChange={(e) => setField("narrator", e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Source</span>
                <input value={form.source} onChange={(e) => setField("source", e.target.value)} placeholder="e.g. Original narration" className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Category</span>
                <input value={form.category} onChange={(e) => setField("category", slugify(e.target.value))} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Subcategory</span>
                <input value={form.subcategory} onChange={(e) => setField("subcategory", slugify(e.target.value))} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Length / duration</span>
                <input value={form.duration} onChange={(e) => setField("duration", e.target.value)} placeholder="7h 12m" className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Price (BDT)</span>
                <input type="number" min={0} disabled={form.free} value={form.price} onChange={(e) => setField("price", e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Old price</span>
                <input type="number" min={0} value={form.oldPrice} onChange={(e) => setField("oldPrice", e.target.value)} className={fieldClass} />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-[11px] text-ink">
                <input type="checkbox" checked={form.free} onChange={(e) => setField("free", e.target.checked)} />
                Completely free
              </label>
              <label className="inline-flex items-center gap-2 text-[11px] text-ink">
                <input type="checkbox" checked={form.featured} onChange={(e) => setField("featured", e.target.checked)} />
                Featured on homepage
              </label>
              <label className="inline-flex items-center gap-2 text-[11px] text-ink">
                <input type="checkbox" checked={form.status === "draft"} onChange={(e) => setField("status", e.target.checked ? "draft" : "published")} />
                Draft
              </label>
            </div>

            <label className="block">
              <span className={subLabel}>Short description</span>
              <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={2} className={fieldClass} />
            </label>
            <label className="block">
              <span className={subLabel}>Long description (one paragraph per line)</span>
              <textarea value={form.longDescription} onChange={(e) => setField("longDescription", e.target.value)} rows={4} className={fieldClass} />
            </label>
            <label className="block">
              <span className={subLabel}>Highlights (one per line)</span>
              <textarea value={form.highlights} onChange={(e) => setField("highlights", e.target.value)} rows={2} className={fieldClass} />
            </label>

            <div className="grid gap-3 sm:grid-cols-4">
              <label className="block">
                <span className={subLabel}>Rating</span>
                <input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => setField("rating", e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Pages</span>
                <input type="number" min={0} value={form.pages} onChange={(e) => setField("pages", e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>Language</span>
                <input value={form.language} onChange={(e) => setField("language", e.target.value)} className={fieldClass} />
              </label>
              <label className="block">
                <span className={subLabel}>ISBN</span>
                <input value={form.isbn} onChange={(e) => setField("isbn", e.target.value)} className={fieldClass} />
              </label>
            </div>

            <div>
              <span className={subLabel}>Cover</span>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line px-2.5 text-[10px]">
                  <ImagePlus size={12} /> {busyUpload === "cover" ? "Uploading…" : "Choose cover"}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => uploadCover(e.target.files?.[0])} />
                </label>
                {(["from", "to", "accent"] as const).map((key) => (
                  <input
                    key={key}
                    type="color"
                    value={form.cover[key] ?? "#000000"}
                    onChange={(e) => setField("cover", { ...form.cover, [key]: e.target.value })}
                    className="h-8 w-10 rounded border border-line p-0.5"
                    aria-label={`Cover ${key}`}
                  />
                ))}
                <select
                  value={form.cover.motif}
                  onChange={(e) => setField("cover", { ...form.cover, motif: e.target.value })}
                  className="h-8 rounded-[4px] border border-line px-2 text-[10px]"
                  aria-label="Cover motif"
                >
                  {motifs.map((motif) => <option key={motif} value={motif}>{motif}</option>)}
                </select>
              </div>
              {form.cover.imageSrc && (
                <p className="mt-1 text-[9px] text-forest-600">Cover: {form.cover.imageSrc}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className={subLabel}>Chapters & audio files</span>
                <button
                  type="button"
                  onClick={() =>
                    setField("chapters", [
                      ...form.chapters,
                      {
                        id: `ch-${Date.now()}`,
                        title: `Chapter ${form.chapters.length + 1}`,
                        duration: "12:00",
                        src: "",
                        free: form.free,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700"
                >
                  <Plus size={11} /> Add chapter
                </button>
              </div>
              <div className="space-y-2">
                {form.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="rounded-[8px] border border-line p-2.5">
                    <div className="flex gap-2">
                      <input value={chapter.title} onChange={(e) => updateChapter(chapter.id, { title: e.target.value })} placeholder={`Chapter ${index + 1}`} className={fieldClass} />
                      <input value={chapter.duration} onChange={(e) => updateChapter(chapter.id, { duration: e.target.value })} placeholder="12:00" className={`${fieldClass} w-24`} />
                      <button type="button" onClick={() => setField("chapters", form.chapters.filter((c) => c.id !== chapter.id))} aria-label="Remove chapter" className="rounded-[4px] border border-line p-2 text-muted hover:text-gold-600">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <input value={chapter.src.startsWith("data:") ? "" : chapter.src} onChange={(e) => updateChapter(chapter.id, { src: e.target.value })} placeholder="/media/audio-book/….mp3 or hosted URL" className={fieldClass} />
                      <label className="inline-flex h-[42px] cursor-pointer items-center gap-1.5 rounded-[4px] border border-line px-2.5 text-[10px]">
                        <FileAudio size={12} /> {busyUpload === chapter.id ? "Uploading…" : "Upload MP3"}
                        <input type="file" accept="audio/mpeg,.mp3" className="sr-only" onChange={(e) => uploadAudio(chapter.id, e.target.files?.[0])} />
                      </label>
                      <label className="inline-flex h-[42px] items-center gap-1.5 text-[10px]">
                        <input type="checkbox" checked={chapter.free} onChange={(e) => updateChapter(chapter.id, { free: e.target.checked })} />
                        Free
                      </label>
                    </div>
                    {chapter.src.startsWith("data:") && (
                      <p className="mt-1 text-[9px] text-gold-600">Legacy embedded audio — re-upload to store it on the server.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveAudiobook}
                disabled={pending}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                <Save size={13} /> {pending ? "Saving…" : editingId ? "Update audiobook" : "Create audiobook"}
              </button>
              <button
                type="button"
                onClick={() => { setForm(emptyForm()); setEditingId(null); }}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink"
              >
                <RotateCcw size={13} /> Clear
              </button>
            </div>
          </section>
        </div>
      )}

      {tab !== "books" && (
        <section className="space-y-4 rounded-[10px] border border-line bg-white p-4 sm:p-5">
          {tab === "homepage" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(copy.section) as (keyof AudioContent["section"])[]).map((key) => (
                <label key={key} className="block">
                  <span className={subLabel}>{key}</span>
                  <input
                    value={copy.section[key]}
                    onChange={(e) => setCopy({ ...copy, section: { ...copy.section, [key]: e.target.value } })}
                    className={fieldClass}
                  />
                </label>
              ))}
            </div>
          )}
          {tab === "library" && (
            <div className="space-y-3">
              {(Object.keys(copy.library) as (keyof AudioContent["library"])[]).map((key) => {
                const value = copy.library[key];
                if (Array.isArray(value)) {
                  return (
                    <label key={key} className="block">
                      <span className={subLabel}>{key} (comma separated)</span>
                      <input value={value.join(", ")} onChange={(e) => setCopy({ ...copy, library: { ...copy.library, [key]: e.target.value.split(",").map((s) => s.trim()) } })} className={fieldClass} />
                    </label>
                  );
                }
                return (
                  <label key={key} className="block">
                    <span className={subLabel}>{key}</span>
                    <input value={value} onChange={(e) => setCopy({ ...copy, library: { ...copy.library, [key]: e.target.value } })} className={fieldClass} />
                  </label>
                );
              })}
            </div>
          )}
          {tab === "pricing" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(copy.pricing) as (keyof AudioContent["pricing"])[]).map((key) => (
                <label key={key} className="block">
                  <span className={subLabel}>{key}</span>
                  <input
                    type={key === "minPrice" ? "number" : "text"}
                    value={copy.pricing[key]}
                    onChange={(e) => setCopy({
                      ...copy,
                      pricing: {
                        ...copy.pricing,
                        [key]: key === "minPrice" ? Number(e.target.value) : e.target.value,
                      },
                    })}
                    className={fieldClass}
                  />
                </label>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={saveCopyChanges} disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white disabled:opacity-50">
              <Save size={13} /> Save copy
            </button>
            <button type="button" onClick={resetCopyChanges} disabled={pending} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink">
              <RotateCcw size={13} /> Restore default
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
