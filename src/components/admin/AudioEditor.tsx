"use client";

import Link from "next/link";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  FileAudio,
  Headphones,
  ImagePlus,
  Music2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useAudioContent } from "@/components/providers/AudioContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { BookCover } from "@/components/books/BookCover";
import {
  cloneAudioDefaults,
  type AudioBookEntry,
  type AudioChapterData,
  type AudioContent,
} from "@/lib/audio-content";
import type { Book, BookCoverTheme } from "@/lib/types";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import { slugify } from "@/lib/slug";
import { cn, formatPrice, toBn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "upload" | "homepage" | "library" | "books" | "chapters" | "pricing";

const motifs: BookCoverTheme["motif"][] = [
  "arch",
  "circle",
  "lines",
  "star",
  "wave",
  "grid",
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
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

function StringList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline"
        >
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
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="rounded-[4px] p-2 text-muted hover:text-brand-700"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function newEntry(slug: string): AudioBookEntry {
  return {
    id: `audio-${Date.now()}`,
    slug,
    title: "New audiobook",
    author: "",
    narrator: "TalkNest Voices",
    duration: "—",
    description: "",
    free: false,
    price: 199,
    cover: { from: "#0e3b3f", to: "#1d6b62", accent: "#e6c87c", motif: "arch" },
    chapters: [
      {
        id: `ch-${Date.now()}-1`,
        title: "Chapter 1",
        duration: "12:00",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        free: true,
      },
    ],
  };
}

export function AudioEditor({ label }: { label: string }) {
  const { content, save, reset } = useAudioContent();
  const { saveBook } = useBookContent();
  const [draft, setDraft] = useState<AudioContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("upload");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState<AudioBookEntry>(() =>
    newEntry("new-audiobook"),
  );
  const [expandedBooks, setExpandedBooks] = useState<string[]>([]);

  useEffect(() => setDraft(content), [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);
  const editing = draft.books.find((book) => book.id === editingId) ?? null;

  const setSection = (key: keyof AudioContent["section"], value: string) => {
    setDraft((current) => ({ ...current, section: { ...current.section, [key]: value } }));
    setNotice(null);
  };

  const setLibrary = <K extends keyof AudioContent["library"]>(
    key: K,
    value: AudioContent["library"][K],
  ) => {
    setDraft((current) => ({ ...current, library: { ...current.library, [key]: value } }));
    setNotice(null);
  };

  const setPricing = <K extends keyof AudioContent["pricing"]>(
    key: K,
    value: AudioContent["pricing"][K],
  ) => {
    setDraft((current) => ({ ...current, pricing: { ...current.pricing, [key]: value } }));
    setNotice(null);
  };

  const updateEntry = (id: string, patch: Partial<AudioBookEntry>) => {
    setDraft((current) => ({
      ...current,
      books: current.books.map((book) => (book.id === id ? { ...book, ...patch } : book)),
    }));
    setNotice(null);
  };

  const addEntry = () => {
    const entry = newEntry(slugify("new-audiobook"));
    setDraft((current) => ({ ...current, books: [...current.books, entry] }));
    setEditingId(entry.id);
    setNotice(null);
  };

  const updateChapter = (bookId: string, chapterId: string, patch: Partial<AudioChapterData>) => {
    const book = draft.books.find((item) => item.id === bookId);
    if (!book) return;
    updateEntry(bookId, {
      chapters: book.chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, ...patch } : chapter,
      ),
    });
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file || !editing) return;
    setUploadingCover(true);
    setNotice(null);
    try {
      const imageSrc = await fileToDataUrl(file);
      updateEntry(editing.id, {
        cover: { ...editing.cover, imageSrc },
      });
      setNotice({ text: `Cover compressed (${dataUrlSizeLabel(imageSrc)}).` });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not read that image.",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadAudio = (
    bookId: string,
    chapterId: string,
    file: File | undefined,
    isUploadForm = false,
  ) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setNotice({
        error: true,
        text: `${file.name} is too large for browser storage. Paste a hosted audio URL instead.`,
      });
      return;
    }
    setUploadingAudio(chapterId);
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      if (isUploadForm) {
        setUploadForm((current) => ({
          ...current,
          chapters: current.chapters.map((chapter) =>
            chapter.id === chapterId ? { ...chapter, src } : chapter,
          ),
        }));
      } else {
        updateChapter(bookId, chapterId, { src });
      }
      setNotice({
        text: `${file.name} embedded (${dataUrlSizeLabel(String(reader.result))}). Save the audiobook to publish.`,
      });
      setUploadingAudio(null);
    };
    reader.onerror = () => {
      setNotice({ error: true, text: "Could not read that audio file." });
      setUploadingAudio(null);
    };
    reader.readAsDataURL(file);
  };

  const setUploadField = <K extends keyof AudioBookEntry>(
    key: K,
    value: AudioBookEntry[K],
  ) => {
    setUploadForm((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const commitUpload = () => {
    const slug = slugify(uploadForm.slug || uploadForm.title);
    const entry: AudioBookEntry = {
      ...uploadForm,
      id: `audio-${Date.now()}`,
      slug,
      title: uploadForm.title.trim() || "Untitled audiobook",
    };
    setDraft((current) => ({
      ...current,
      books: [...current.books, entry],
      section: {
        ...current.section,
        featuredSlug: current.section.featuredSlug || slug,
      },
    }));
    commitEntry(entry);
    setUploadForm(newEntry("new-audiobook"));
  };

  /** Save the audiobook and mirror it into the unified catalogue. */
  const commitEntry = (book: AudioBookEntry) => {
    const slug = slugify(book.slug || book.title);
    const catalogueBook: Book = {
      slug,
      title: book.title,
      author: book.author,
      authorSlug: slugify(book.author),
      publisher: "TalkNest Audio",
      publisherSlug: "talknestaudio",
      category: "uponnash",
      price: book.price || 0,
      rating: 4.8,
      reviewCount: 0,
      pages: 0,
      language: "Bangla",
      binding: "Audiobook",
      publishedYear: 2026,
      stock: 999,
      description: book.description,
      longDescription: [book.description],
      highlights: [],
      cover: book.cover,
      tags: ["audio"],
      audio: { duration: book.duration, narrator: book.narrator },
    };
    const result = saveBook(catalogueBook);
    setNotice({
      text: result.ok
        ? `${book.title} saved — detail page and chapters are live.`
        : result.message,
      error: !result.ok,
    });
    setEditingId(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneAudioDefaults());
    setEditingId(null);
    setNotice({ text: result.message, error: !result.ok });
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "upload", label: "Upload" },
    { key: "books", label: "Audiobooks", count: draft.books.length },
    { key: "chapters", label: "Chapters" },
    { key: "homepage", label: "Homepage" },
    { key: "library", label: "Library" },
    { key: "pricing", label: "Pricing" },
  ];

  const previewBook = draft.books.find((book) => book.slug === draft.section.featuredSlug) ?? draft.books[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="transition-colors hover:text-brand-700">
          Dashboard
        </Link>
        <span>/</span>
        <span>Homepage sections</span>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
          <p className="mt-1 text-[12px] text-muted">
            Manage the audiobook catalogue, chapters, free/paid access, and the storefront copy.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/audio-books"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
          >
            <Eye size={13} /> View library
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 overflow-x-auto rounded-[8px] border border-line bg-white p-1">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
              tab === item.key
                ? "bg-brand-600 text-white"
                : "text-muted hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px]",
                  tab === item.key ? "bg-white/20" : "bg-brand-50 text-brand-700",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {tab === "upload" && (
            <Section
              title="Upload audiobook"
              description="Add a cover image and chapter audio together. Hosted URLs work best for larger files."
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input
                    value={uploadForm.title}
                    onChange={(event) =>
                      setUploadForm((current) => ({
                        ...current,
                        title: event.target.value,
                        slug:
                          current.slug === "new-audiobook"
                            ? slugify(event.target.value)
                            : current.slug,
                      }))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Slug (auto)</span>
                  <input
                    value={uploadForm.slug}
                    onChange={(event) => setUploadField("slug", slugify(event.target.value))}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Author</span>
                  <input
                    value={uploadForm.author}
                    onChange={(event) => setUploadField("author", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Narrator</span>
                  <input
                    value={uploadForm.narrator}
                    onChange={(event) => setUploadField("narrator", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Duration</span>
                  <input
                    value={uploadForm.duration}
                    onChange={(event) => setUploadField("duration", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="flex items-center gap-2 pt-6 text-[11px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={uploadForm.free}
                    onChange={(event) => setUploadField("free", event.target.checked)}
                    className="h-3.5 w-3.5 accent-brand-600"
                  />
                  Completely free
                </label>
              </div>

              {!uploadForm.free && (
                <label className="block">
                  <span className={subLabel}>Price (BDT)</span>
                  <input
                    type="number"
                    min={0}
                    value={uploadForm.price}
                    onChange={(event) => setUploadField("price", Number(event.target.value))}
                    className={fieldClass}
                  />
                </label>
              )}

              <label className="block">
                <span className={subLabel}>Description</span>
                <textarea
                  value={uploadForm.description}
                  onChange={(event) => setUploadField("description", event.target.value)}
                  rows={2}
                  className={`${fieldClass} resize-y`}
                />
              </label>

              <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-ink">Cover image</span>
                  <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink hover:border-brand-300">
                    <ImagePlus size={12} />
                    Upload image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        try {
                          const imageSrc = await fileToDataUrl(file);
                          setUploadField("cover", { ...uploadForm.cover, imageSrc });
                          setNotice({
                            text: `Cover compressed (${dataUrlSizeLabel(imageSrc)}).`,
                          });
                        } catch (error) {
                          setNotice({
                            error: true,
                            text: error instanceof Error ? error.message : "Could not read image.",
                          });
                        }
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-20 w-14 shrink-0 overflow-hidden rounded-[3px]">
                    <BookCover
                      book={{ ...uploadForm, publisher: "TalkNest Audio" }}
                      size="sm"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      {(["from", "to", "accent"] as const).map((key) => (
                        <label key={key} className="block">
                          <span className="mb-1 block text-[9px] text-muted capitalize">{key}</span>
                          <input
                            type="color"
                            value={uploadForm.cover[key]}
                            onChange={(event) =>
                              setUploadField("cover", {
                                ...uploadForm.cover,
                                [key]: event.target.value,
                              })
                            }
                            className="h-8 w-10 cursor-pointer rounded border border-line bg-white p-0.5"
                          />
                        </label>
                      ))}
                    </div>
                    {uploadForm.cover.imageSrc && (
                      <p className="mt-1 text-[9px] text-muted">
                        Image ready · {dataUrlSizeLabel(uploadForm.cover.imageSrc)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink">Chapter audio</span>
                  <button
                    type="button"
                    onClick={() =>
                      setUploadField("chapters", [
                        ...uploadForm.chapters,
                        {
                          id: `ch-${Date.now()}`,
                          title: `Chapter ${uploadForm.chapters.length + 1}`,
                          duration: "12:00",
                          src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                          free: uploadForm.free,
                        },
                      ])
                    }
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline"
                  >
                    <Plus size={11} /> Add chapter
                  </button>
                </div>
                <div className="space-y-2">
                  {uploadForm.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="rounded-[6px] border border-line bg-white p-2">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-ink">
                          {index + 1}. {chapter.title}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setUploadField(
                              "chapters",
                              uploadForm.chapters.filter((item) => item.id !== chapter.id),
                            )
                          }
                          className="text-muted hover:text-brand-700"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          value={chapter.title}
                          onChange={(event) =>
                            setUploadField(
                              "chapters",
                              uploadForm.chapters.map((item) =>
                                item.id === chapter.id
                                  ? { ...item, title: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          className={fieldClass}
                        />
                        <input
                          value={chapter.duration}
                          onChange={(event) =>
                            setUploadField(
                              "chapters",
                              uploadForm.chapters.map((item) =>
                                item.id === chapter.id
                                  ? { ...item, duration: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          className={fieldClass}
                        />
                      </div>
                      <input
                        value={chapter.src.startsWith("data:") ? "Uploaded audio file" : chapter.src}
                        onChange={(event) =>
                          setUploadField(
                            "chapters",
                            uploadForm.chapters.map((item) =>
                              item.id === chapter.id ? { ...item, src: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder="Audio URL (MP3)"
                        className={`${fieldClass} mt-2`}
                      />
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 text-[9px] text-ink">
                          <input
                            type="checkbox"
                            checked={chapter.free}
                            onChange={(event) =>
                              setUploadField(
                                "chapters",
                                uploadForm.chapters.map((item) =>
                                  item.id === chapter.id
                                    ? { ...item, free: event.target.checked }
                                    : item,
                                ),
                              )
                            }
                            className="h-3 w-3 accent-brand-600"
                          />
                          Free to play
                        </label>
                        <label className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-[4px] border border-line bg-white px-2 text-[9px] font-medium text-ink hover:border-brand-300">
                          <FileAudio size={11} />
                          {uploadingAudio === chapter.id ? "Reading…" : "Upload audio"}
                          <input
                            type="file"
                            accept="audio/*"
                            className="sr-only"
                            onChange={(event) => {
                              uploadAudio(
                                uploadForm.id,
                                chapter.id,
                                event.target.files?.[0],
                                true,
                              );
                              event.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={commitUpload}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
                >
                  <Save size={13} /> Upload audiobook
                </button>
                <button
                  type="button"
                  onClick={() => setUploadForm(newEntry("new-audiobook"))}
                  className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
                >
                  Clear
                </button>
              </div>
            </Section>
          )}

          {tab === "books" && (
            <>
              <section className="rounded-[10px] border border-line bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
                  <div>
                    <h2 className="text-[13px] font-semibold text-ink">Audiobook catalogue</h2>
                    <p className="text-[10px] text-muted">
                      Each title gets a /books/&lt;slug&gt; detail page and its own chapter list.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addEntry}
                    className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                  >
                    <Plus size={12} /> Add audiobook
                  </button>
                </div>
                <div className="divide-y divide-line/70">
                  {draft.books.map((book) => (
                    <button
                      key={book.id}
                      type="button"
                      onClick={() => setEditingId(book.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-50/50 sm:px-5"
                    >
                      <span className="h-12 w-9 shrink-0 overflow-hidden rounded-[3px]">
                        <BookCover book={{ ...book, publisher: "TalkNest Audio" }} size="sm" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-semibold text-ink">
                          {book.title}
                        </span>
                        <span className="block text-[9px] text-muted">
                          {book.narrator} · {book.duration} · {book.chapters.length} chapters
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold",
                          book.free
                            ? "bg-mint/25 text-forest-700"
                            : "bg-sale/15 text-clay-600",
                        )}
                      >
                        {book.free ? content.pricing.freeLabel : formatPrice(book.price)}
                      </span>
                    </button>
                  ))}
                  {draft.books.length === 0 && (
                    <p className="px-4 py-8 text-center text-[11px] text-muted">
                      No audiobooks yet.
                    </p>
                  )}
                </div>
              </section>

              {editing && (
                <Section
                  title={draft.books.some((book) => book.id === editing.id) ? "Edit audiobook" : "New audiobook"}
                  description="All fields below appear on the storefront and detail page."
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className={subLabel}>Title</span>
                      <input
                        value={editing.title}
                        onChange={(event) =>
                          updateEntry(editing.id, {
                            title: event.target.value,
                            slug: editing.slug || slugify(event.target.value),
                          })
                        }
                        className={fieldClass}
                      />
                    </label>
                    <label className="block">
                      <span className={subLabel}>Slug (auto)</span>
                      <input
                        value={editing.slug}
                        onChange={(event) =>
                          updateEntry(editing.id, { slug: slugify(event.target.value) })
                        }
                        className={fieldClass}
                      />
                    </label>
                    <label className="block">
                      <span className={subLabel}>Author</span>
                      <input
                        value={editing.author}
                        onChange={(event) => updateEntry(editing.id, { author: event.target.value })}
                        className={fieldClass}
                      />
                    </label>
                    <label className="block">
                      <span className={subLabel}>Narrator</span>
                      <input
                        value={editing.narrator}
                        onChange={(event) => updateEntry(editing.id, { narrator: event.target.value })}
                        className={fieldClass}
                      />
                    </label>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className={subLabel}>Duration</span>
                      <input
                        value={editing.duration}
                        onChange={(event) => updateEntry(editing.id, { duration: event.target.value })}
                        className={fieldClass}
                      />
                    </label>
                    <label className="flex items-center gap-2 pt-6 text-[11px] font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={editing.free}
                        onChange={(event) => updateEntry(editing.id, { free: event.target.checked })}
                        className="h-3.5 w-3.5 accent-brand-600"
                      />
                      Completely free audiobook
                    </label>
                  </div>
                  {!editing.free && (
                    <label className="block">
                      <span className={subLabel}>Price (BDT)</span>
                      <input
                        type="number"
                        min={0}
                        value={editing.price}
                        onChange={(event) =>
                          updateEntry(editing.id, { price: Number(event.target.value) })
                        }
                        className={fieldClass}
                      />
                    </label>
                  )}
                  <label className="block">
                    <span className={subLabel}>Description</span>
                    <textarea
                      value={editing.description}
                      onChange={(event) =>
                        updateEntry(editing.id, { description: event.target.value })
                      }
                      rows={2}
                      className={`${fieldClass} resize-y`}
                    />
                  </label>

                  <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-ink">Cover</span>
                      <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink hover:border-brand-300">
                        <ImagePlus size={12} />
                        {uploadingCover ? "Compressing…" : "Upload image"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          disabled={uploadingCover}
                          onChange={(event) => uploadCover(event.target.files?.[0])}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {(["from", "to", "accent"] as const).map((key) => (
                        <label className="block" key={key}>
                          <span className="mb-1 block text-[9px] text-muted capitalize">{key}</span>
                          <input
                            type="color"
                            value={editing.cover[key]}
                            onChange={(event) =>
                              updateEntry(editing.id, {
                                cover: { ...editing.cover, [key]: event.target.value },
                              })
                            }
                            className="h-9 w-full cursor-pointer rounded border border-line bg-white p-1"
                          />
                        </label>
                      ))}
                      <label className="block">
                        <span className="mb-1 block text-[9px] text-muted">Motif</span>
                        <select
                          value={editing.cover.motif}
                          onChange={(event) =>
                            updateEntry(editing.id, {
                              cover: {
                                ...editing.cover,
                                motif: event.target.value as BookCoverTheme["motif"],
                              },
                            })
                          }
                          className={fieldClass}
                        >
                          {motifs.map((motif) => (
                            <option key={motif} value={motif}>
                              {motif}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                    <button
                      type="button"
                      onClick={() => commitEntry(editing)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
                    >
                      <Save size={13} /> Save audiobook
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
                    >
                      Cancel
                    </button>
                  </div>
                </Section>
              )}
            </>
          )}

          {tab === "chapters" && (
            <Section
              title="Chapters"
              description="Pick an audiobook to see and edit its chapters."
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Audiobook</th>
                      <th className="px-2 py-2 font-semibold">Chapters</th>
                      <th className="px-2 py-2 font-semibold">Access</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.books.map((book) => {
                      const expanded = expandedBooks.includes(book.id);
                      return (
                        <Fragment key={book.id}>
                          <tr
                            className={cn(
                              "border-b border-line/70",
                              expanded ? "bg-brand-50/40" : "",
                            )}
                          >
                            <td className="px-2 py-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedBooks((current) =>
                                    expanded
                                      ? current.filter((id) => id !== book.id)
                                      : [...current, book.id],
                                  )
                                }
                                className="flex items-center gap-2 text-left"
                              >
                                {expanded ? (
                                  <ChevronDown size={14} className="text-brand-700" />
                                ) : (
                                  <ChevronRight size={14} className="text-muted" />
                                )}
                                <span className="text-[11px] font-semibold text-ink">
                                  {book.title}
                                </span>
                              </button>
                            </td>
                            <td className="px-2 py-2.5 text-[10px] text-muted">
                              {toBn(book.chapters.length)}
                            </td>
                            <td className="px-2 py-2.5">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[9px] font-semibold",
                                  book.free
                                    ? "bg-mint/25 text-forest-700"
                                    : "bg-sale/15 text-clay-600",
                                )}
                              >
                                {book.free ? content.pricing.freeLabel : content.pricing.paidLabel}
                              </span>
                            </td>
                            <td className="px-2 py-2.5 text-right">
                              <div className="inline-flex flex-wrap justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedBooks((current) =>
                                      expanded
                                        ? current.filter((id) => id !== book.id)
                                        : [...current, book.id],
                                    )
                                  }
                                  className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-line bg-white px-2 text-[9px] font-semibold text-ink hover:border-brand-300 hover:text-brand-700"
                                >
                                  {expanded ? <ChevronDown size={11} /> : <Eye size={11} />}
                                  {expanded ? "Hide chapters" : "Show all chapters"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateEntry(book.id, {
                                      chapters: [
                                        ...book.chapters,
                                        {
                                          id: `ch-${Date.now()}`,
                                          title: `Chapter ${book.chapters.length + 1}`,
                                          duration: "12:00",
                                          src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                                          free: book.free,
                                        },
                                      ],
                                    });
                                    if (!expanded) setExpandedBooks((current) => [...current, book.id]);
                                  }}
                                  className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-brand-200 bg-brand-50 px-2 text-[9px] font-semibold text-brand-700 hover:bg-brand-100"
                                >
                                  <Plus size={11} /> Add chapter
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expanded && (
                            <tr>
                              <td colSpan={4} className="border-b border-line/70 bg-canvas/50 px-3 py-3">
                                <div className="overflow-x-auto">
                                  <table className="w-full min-w-[620px] border-collapse text-left">
                                    <thead>
                                      <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                                        <th className="px-2 py-1.5 font-semibold">#</th>
                                        <th className="px-2 py-1.5 font-semibold">Chapter title</th>
                                        <th className="px-2 py-1.5 font-semibold">Duration</th>
                                        <th className="px-2 py-1.5 font-semibold">Audio source</th>
                                        <th className="px-2 py-1.5 font-semibold">Free</th>
                                        <th className="px-2 py-1.5 text-right font-semibold">Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {book.chapters.map((chapter, index) => (
                                        <tr key={chapter.id} className="border-b border-line/60 last:border-0">
                                          <td className="px-2 py-2 text-[10px] text-muted">{index + 1}</td>
                                          <td className="px-2 py-2">
                                            <input
                                              value={chapter.title}
                                              onChange={(event) =>
                                                updateChapter(book.id, chapter.id, { title: event.target.value })
                                              }
                                              className={`${fieldClass} min-w-[130px] py-1.5`}
                                            />
                                          </td>
                                          <td className="px-2 py-2">
                                            <input
                                              value={chapter.duration}
                                              onChange={(event) =>
                                                updateChapter(book.id, chapter.id, { duration: event.target.value })
                                              }
                                              className={`${fieldClass} w-20 py-1.5`}
                                            />
                                          </td>
                                          <td className="px-2 py-2">
                                            <input
                                              value={chapter.src.startsWith("data:") ? "Uploaded audio" : chapter.src}
                                              onChange={(event) =>
                                                updateChapter(book.id, chapter.id, { src: event.target.value })
                                              }
                                              placeholder="MP3 URL"
                                              className={`${fieldClass} min-w-[180px] py-1.5`}
                                            />
                                            <label className="mt-1 inline-flex h-7 cursor-pointer items-center gap-1 rounded-[4px] border border-line bg-white px-2 text-[9px] font-medium text-ink hover:border-brand-300">
                                              <FileAudio size={11} />
                                              {uploadingAudio === chapter.id ? "Reading…" : "Upload audio"}
                                              <input
                                                type="file"
                                                accept="audio/*"
                                                className="sr-only"
                                                onChange={(event) => {
                                                  uploadAudio(book.id, chapter.id, event.target.files?.[0]);
                                                  event.target.value = "";
                                                }}
                                              />
                                            </label>
                                          </td>
                                          <td className="px-2 py-2">
                                            <input
                                              type="checkbox"
                                              checked={chapter.free}
                                              onChange={(event) =>
                                                updateChapter(book.id, chapter.id, { free: event.target.checked })
                                              }
                                              className="h-3.5 w-3.5 accent-brand-600"
                                            />
                                          </td>
                                          <td className="px-2 py-2 text-right">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                updateEntry(book.id, {
                                                  chapters: book.chapters.filter((item) => item.id !== chapter.id),
                                                })
                                              }
                                              className="rounded-[4px] p-1.5 text-muted hover:text-brand-700"
                                              title="Delete chapter"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                      {book.chapters.length === 0 && (
                                        <tr>
                                          <td colSpan={6} className="px-2 py-4 text-center text-[10px] text-muted">
                                            No chapters yet — use "Add chapter".
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                    {draft.books.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-2 py-8 text-center text-[11px] text-muted">
                          No audiobooks yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {tab === "homepage" && (
            <Section title="Homepage audio section">
              <label className="block">
                <span className={subLabel}>Eyebrow</span>
                <input
                  value={draft.section.eyebrow}
                  onChange={(event) => setSection("eyebrow", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Title</span>
                <input
                  value={draft.section.title}
                  onChange={(event) => setSection("title", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Description</span>
                <textarea
                  value={draft.section.description}
                  onChange={(event) => setSection("description", event.target.value)}
                  rows={3}
                  className={`${fieldClass} resize-y`}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Link label</span>
                <input
                  value={draft.section.linkLabel}
                  onChange={(event) => setSection("linkLabel", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Featured audiobook</span>
                <select
                  value={draft.section.featuredSlug}
                  onChange={(event) => setSection("featuredSlug", event.target.value)}
                  className={fieldClass}
                >
                  {draft.books.map((book) => (
                    <option key={book.id} value={book.slug}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </label>
            </Section>
          )}

          {tab === "library" && (
            <Section title="/audio-books page">
              <label className="block">
                <span className={subLabel}>Eyebrow</span>
                <input
                  value={draft.library.eyebrow}
                  onChange={(event) => setLibrary("eyebrow", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Title</span>
                <input
                  value={draft.library.title}
                  onChange={(event) => setLibrary("title", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Description</span>
                <textarea
                  value={draft.library.description}
                  onChange={(event) => setLibrary("description", event.target.value)}
                  rows={3}
                  className={`${fieldClass} resize-y`}
                />
              </label>
              <StringList
                label="Badge chips"
                values={draft.library.badges}
                onChange={(values) => setLibrary("badges", values)}
              />
              <label className="block">
                <span className={subLabel}>Free-list note</span>
                <input
                  value={draft.library.freeNote}
                  onChange={(event) => setLibrary("freeNote", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Preview note</span>
                <input
                  value={draft.library.previewNote}
                  onChange={(event) => setLibrary("previewNote", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </Section>
          )}

          {tab === "pricing" && (
            <Section
              title="Free & paid settings"
              description="Labels and minimum price used across the audio library."
            >
              <label className="block">
                <span className={subLabel}>Minimum paid price (BDT)</span>
                <input
                  type="number"
                  min={0}
                  value={draft.pricing.minPrice}
                  onChange={(event) => setPricing("minPrice", Number(event.target.value))}
                  className={fieldClass}
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                <label className="block">
                  <span className={subLabel}>Free label</span>
                  <input
                    value={draft.pricing.freeLabel}
                    onChange={(event) => setPricing("freeLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Paid label</span>
                  <input
                    value={draft.pricing.paidLabel}
                    onChange={(event) => setPricing("paidLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Owned label</span>
                  <input
                    value={draft.pricing.ownedLabel}
                    onChange={(event) => setPricing("ownedLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={subLabel}>Unlock note</span>
                <input
                  value={draft.pricing.unlockNote}
                  onChange={(event) => setPricing("unlockNote", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </Section>
          )}

          {notice && (
            <div
              className={cn(
                "flex items-start gap-2 rounded-[8px] border px-3 py-2.5",
                notice.error
                  ? "border-gold-300 bg-gold-300/15"
                  : "border-brand-100 bg-brand-50",
              )}
            >
              {notice.error ? (
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" />
              ) : (
                <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />
              )}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
            >
              <Save size={13} /> Save all changes
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
            >
              <RotateCcw size={13} /> Restore default
            </button>
            {dirty && (
              <span className="ml-auto text-[10px] font-semibold text-gold-600">
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Storefront</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              {tab === "homepage" || tab === "books" || tab === "upload" ? (
                <div className="rounded-[8px] bg-brand-900 p-4 text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-200">
                    {draft.section.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-base font-bold">{draft.section.title}</h3>
                  <p className="mt-1 text-[10px] text-white/70">{draft.section.description}</p>
                  {previewBook && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="h-16 w-12 shrink-0 overflow-hidden rounded-[3px]">
                        <BookCover book={{ ...previewBook, publisher: "TalkNest Audio" }} size="sm" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-semibold">
                          {previewBook.title}
                        </span>
                        <span className="block text-[9px] text-white/60">
                          {previewBook.narrator} · {previewBook.chapters.length} chapters
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                    {draft.library.eyebrow}
                  </p>
                  <h3 className="font-display text-base font-bold text-ink">
                    {draft.library.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-muted">
                    {draft.library.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {draft.library.badges.map((badge, index) => (
                      <span key={index} className="rounded-full bg-brand-50 px-2 py-0.5 text-[8px] text-brand-700">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="pt-1 text-[9px] text-muted">
                    {draft.books.length} titles · {draft.books.filter((book) => book.free).length} free
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="flex items-start gap-2 text-[10px] leading-relaxed text-muted">
              <Headphones size={13} className="mt-0.5 shrink-0 text-brand-700" />
              Storage note: audio files use hosted URLs (SoundHelix samples by default). Uploads and
              player settings are stored in this browser only — no real payments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
