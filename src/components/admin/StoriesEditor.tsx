"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  FileAudio,
  FileText,
  Info,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import { useStories } from "@/components/providers/StoriesProvider";
import { cloneStoryDefaults, type StoryContent } from "@/lib/story-content";
import { storyRequestStatuses, type StoryRequest } from "@/lib/story-requests";
import { dataUrlSizeLabel } from "@/lib/image";
import type { Story } from "@/lib/types";
import { cn, toBn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "stories" | "add" | "requests" | "homepage" | "page" | "share";

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
              <textarea
                value={value}
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                rows={2}
                className={`${fieldClass} resize-y`}
              />
            ) : (
              <input
                value={value}
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                className={fieldClass}
              />
            )}
            <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label={`Remove ${label} item ${index + 1}`} className="rounded-[4px] p-2 text-muted hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
              <Trash2 size={12} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Reads a small file into a data URL with a clear size guard for localStorage. */
function readSmallFile(file: File, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`That file is larger than ${Math.round(maxBytes / 1024 / 1024)} MB. Use a hosted link instead.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function newStory(): Story {
  return {
    id: `s-${Date.now()}`,
    name: "",
    title: "",
    excerpt: "",
    type: "text",
    likes: 0,
    date: "Just now",
    avatarColor: "#1877F2",
    body: "",
    status: "Published",
  };
}

export function StoriesEditor({ label }: { label: string }) {
  const { content, save, reset, requests, setRequestStatus, removeRequest, approve } = useStories();
  const [draft, setDraft] = useState<StoryContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("stories");
  const [editing, setEditing] = useState<Story | null>(null);
  const [form, setForm] = useState<Story>(newStory());
  const [uploading, setUploading] = useState<"pdf" | "audio" | null>(null);
  const pending = requests.filter((item) => item.status === "Pending");

  useEffect(() => setDraft(content), [content]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const updateStory = (id: string, patch: Partial<Story>) => {
    setDraft((current) => ({
      ...current,
      stories: current.stories.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
    setNotice(null);
  };

  const removeStory = (id: string) => {
    setDraft((current) => ({
      ...current,
      stories: current.stories.filter((item) => item.id !== id),
    }));
    setNotice(null);
  };

  const startAdd = () => {
    setForm(newStory());
    setEditing(null);
    setTab("add");
    setNotice(null);
  };

  const commitForm = () => {
    if (!form.name.trim() || !form.title.trim()) {
      setNotice({ error: true, text: "Name and title are required." });
      return;
    }
    const final: Story = {
      ...form,
      name: form.name.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || (form.body ?? "").slice(0, 120) || "A reader story.",
      status: "Published",
    };
    setDraft((current) => ({
      ...current,
      stories: current.stories.some((item) => item.id === final.id)
        ? current.stories.map((item) => (item.id === final.id ? final : item))
        : [final, ...current.stories],
    }));
    setEditing(null);
    setForm(newStory());
    setTab("stories");
    setNotice({ text: "Story saved. Save all changes to publish." });
  };

  const setGroup = <K extends keyof StoryContent>(key: K, value: StoryContent[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneStoryDefaults());
    setEditing(null);
    setNotice({ text: result.message, error: !result.ok });
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "stories", label: "Stories", count: draft.stories.length },
    { key: "add", label: "Add story" },
    { key: "requests", label: "Requests", count: pending.length },
    { key: "homepage", label: "Homepage" },
    { key: "page", label: "/stories page" },
    { key: "share", label: "Share page" },
  ];

  const renderForm = (value: Story, onChange: (story: Story) => void) => (
    <Section title="Story details">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className={subLabel}>Reader name</span>
          <input value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} className={fieldClass} />
        </label>
        <label className="block">
          <span className={subLabel}>Story type</span>
          <select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value as Story["type"] })} className={fieldClass}>
            <option value="text">Written</option>
            <option value="voice">Voice</option>
            <option value="pdf">PDF diary</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className={subLabel}>Title</span>
        <input value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} className={fieldClass} />
      </label>
      <label className="block">
        <span className={subLabel}>Excerpt</span>
        <textarea value={value.excerpt} onChange={(event) => onChange({ ...value, excerpt: event.target.value })} rows={2} className={`${fieldClass} resize-y`} />
      </label>
      <label className="block">
        <span className={subLabel}>Full story text</span>
        <textarea value={value.body ?? ""} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={5} className={`${fieldClass} resize-y`} />
      </label>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className={subLabel}>Duration (voice)</span>
          <input value={value.duration ?? ""} onChange={(event) => onChange({ ...value, duration: event.target.value })} placeholder="3:48" className={fieldClass} />
        </label>
        <label className="block">
          <span className={subLabel}>Avatar color</span>
          <input type="color" value={value.avatarColor} onChange={(event) => onChange({ ...value, avatarColor: event.target.value })} className="h-[42px] w-full cursor-pointer rounded-[4px] border border-line bg-white p-1" />
        </label>
      </div>

      {value.type === "pdf" && (
        <div className="rounded-[8px] border border-brand-100 bg-brand-50/40 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink">
            <FileText size={13} className="text-brand-700" aria-hidden="true" /> PDF diary
          </p>
          <label className="block">
            <span className={subLabel}>PDF file name or URL</span>
            <input
              value={value.attachmentName ?? ""}
              onChange={(event) => onChange({ ...value, attachmentName: event.target.value })}
              placeholder="my-diary.pdf"
              className={fieldClass}
            />
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/40">
              <FileText size={12} aria-hidden="true" />
              {uploading === "pdf" ? "Reading…" : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                disabled={uploading === "pdf"}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setUploading("pdf");
                  setNotice(null);
                  try {
                    const attachmentDataUrl = await readSmallFile(file, 1.5 * 1024 * 1024);
                    onChange({
                      ...value,
                      attachmentName: file.name,
                      attachmentDataUrl,
                    });
                    setNotice({ text: `${file.name} attached (${dataUrlSizeLabel(attachmentDataUrl)}).` });
                  } catch (error) {
                    setNotice({
                      error: true,
                      text: error instanceof Error ? error.message : "Could not read that PDF.",
                    });
                  } finally {
                    setUploading(null);
                    event.target.value = "";
                  }
                }}
              />
            </label>
            {value.attachmentDataUrl && (
              <>
                <a
                  href={value.attachmentDataUrl}
                  download={value.attachmentName || "story.pdf"}
                  className="inline-flex h-9 items-center rounded-[4px] border border-line px-3 text-[10px] font-medium text-brand-700 hover:border-brand-300"
                >
                  Download preview
                </a>
                <button
                  type="button"
                  onClick={() => onChange({ ...value, attachmentDataUrl: undefined, attachmentName: undefined })}
                  className="text-[10px] font-medium text-muted hover:text-brand-700"
                >
                  Remove file
                </button>
              </>
            )}
          </div>
          <p className="mt-1 text-[9px] leading-relaxed text-muted">
            PDFs up to 1.5 MB are stored in this browser. Larger files: use a hosted link in the field above.
          </p>
        </div>
      )}

      {value.type === "voice" && (
        <div className="rounded-[8px] border border-brand-100 bg-brand-50/40 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink">
            <FileAudio size={13} className="text-brand-700" aria-hidden="true" /> Voice recording
          </p>
          <label className="block">
            <span className={subLabel}>Audio URL (optional)</span>
            <input
              value={value.audioUrl ?? ""}
              onChange={(event) => onChange({ ...value, audioUrl: event.target.value })}
              placeholder="https://…/episode.mp3"
              className={fieldClass}
            />
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/40">
              <FileAudio size={12} aria-hidden="true" />
              {uploading === "audio" ? "Reading…" : "Upload audio"}
              <input
                type="file"
                accept="audio/*"
                className="sr-only"
                disabled={uploading === "audio"}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  setUploading("audio");
                  setNotice(null);
                  try {
                    const audioDataUrl = await readSmallFile(file, 1.5 * 1024 * 1024);
                    onChange({
                      ...value,
                      audioDataUrl,
                      audioUrl: undefined,
                      duration: value.duration || "—",
                    });
                    setNotice({ text: `${file.name} attached (${dataUrlSizeLabel(audioDataUrl)}).` });
                  } catch (error) {
                    setNotice({
                      error: true,
                      text: error instanceof Error ? error.message : "Could not read that audio file.",
                    });
                  } finally {
                    setUploading(null);
                    event.target.value = "";
                  }
                }}
              />
            </label>
            {value.audioDataUrl && (
              <>
                <audio controls src={value.audioDataUrl} className="h-9 max-w-[220px]" aria-label="Story audio preview" />
                <button
                  type="button"
                  onClick={() => onChange({ ...value, audioDataUrl: undefined })}
                  className="text-[10px] font-medium text-muted hover:text-brand-700"
                >
                  Remove audio
                </button>
              </>
            )}
          </div>
          <p className="mt-1 text-[9px] leading-relaxed text-muted">
            Audio up to 1.5 MB is stored in this browser. For longer stories, paste a hosted audio URL.
          </p>
        </div>
      )}
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
            Manage published stories, review submissions and edit all three story pages.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/stories" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <Eye size={13} /> View stories
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
              if (item.key === "add" && !form.name) startAdd();
              setTab(item.key);
            }}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
              tab === item.key ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] tabular-nums", tab === item.key ? "bg-white/20" : "bg-brand-50 text-brand-700")}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {tab === "stories" && (
            <Section title="Published stories" description="These appear on the homepage and the /stories wall.">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-muted" aria-live="polite">{draft.stories.length} stories</p>
                <button type="button" onClick={startAdd} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                  <Plus size={12} aria-hidden="true" /> Add story
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Story</th>
                      <th className="px-2 py-2 font-semibold">Type</th>
                      <th className="px-2 py-2 font-semibold">Likes</th>
                      <th className="px-2 py-2 font-semibold">Status</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.stories.map((story) => (
                      <tr key={story.id} className="border-b border-line/70 last:border-0">
                        <td className="px-2 py-2">
                          <p className="max-w-[220px] truncate text-[11px] font-semibold text-ink">{story.title}</p>
                          <p className="text-[9px] text-muted">{story.name} · {story.date}</p>
                        </td>
                        <td className="px-2 py-2 text-[10px] capitalize text-muted">{story.type}</td>
                        <td className="px-2 py-2 text-[10px] tabular-nums text-muted">{toBn(story.likes)}</td>
                        <td className="px-2 py-2">
                          <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-semibold", story.status === "Rejected" ? "bg-gold-300/20 text-gold-600" : "bg-mint/25 text-forest-700")}>
                            {story.status ?? "Published"}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-right">
                          <div className="inline-flex gap-1">
                            <button type="button" onClick={() => { setEditing(story); setForm(story); }} aria-label={`Edit ${story.title}`} className="rounded-[4px] border border-line px-2 py-1.5 text-[9px] font-medium text-ink hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">Edit</button>
                            <button type="button" onClick={() => removeStory(story.id)} aria-label={`Delete ${story.title}`} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                              <Trash2 size={12} aria-hidden="true" />
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

          {(tab === "add" || (editing && tab === "stories")) && (
            <>
              {renderForm(editing ?? form, editing ? setEditing : setForm)}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (editing) {
                      updateStory(editing.id, editing);
                      setEditing(null);
                      setNotice({ text: "Story updated. Save all changes to publish." });
                    } else {
                      commitForm();
                    }
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
                >
                  <Save size={13} aria-hidden="true" /> {editing ? "Save story" : "Add story"}
                </button>
                <button type="button" onClick={() => { setEditing(null); setForm(newStory()); setTab("stories"); }} className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                  Cancel
                </button>
              </div>
            </>
          )}

          {tab === "requests" && (
            <Section title="Story submissions" description="Read each submission, then publish or decline it.">
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "All", value: requests.length },
                  { label: "Pending", value: pending.length },
                  { label: "Approved", value: requests.filter((item) => item.status === "Approved").length },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[8px] border border-line bg-white p-3">
                    <p className="text-[9px] text-muted">{stat.label}</p>
                    <p className="mt-1 font-display text-xl font-bold tabular-nums text-ink">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Reader</th>
                      <th className="px-2 py-2 font-semibold">Story</th>
                      <th className="px-2 py-2 font-semibold">Type</th>
                      <th className="px-2 py-2 font-semibold">Status</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request: StoryRequest) => (
                      <tr key={request.id} className="border-b border-line/70 last:border-0 align-top">
                        <td className="px-2 py-2.5">
                          <p className="text-[11px] font-semibold text-ink">{request.name}</p>
                          <p className="text-[9px] text-muted">{new Date(request.createdAt).toLocaleDateString("en-BD")}</p>
                        </td>
                        <td className="max-w-[280px] px-2 py-2.5">
                          <p className="text-[10px] font-semibold text-ink">{request.title}</p>
                          <p className="mt-0.5 break-words text-[9px] leading-relaxed text-muted">{request.body || request.excerpt}</p>
                          {request.attachmentName && <p className="mt-1 text-[9px] text-brand-700">PDF: {request.attachmentName}</p>}
                        </td>
                        <td className="px-2 py-2.5 text-[10px] capitalize text-muted">{request.type}</td>
                        <td className="px-2 py-2.5">
                          <select
                            value={request.status}
                            onChange={(event) => setRequestStatus(request.id, event.target.value as StoryRequest["status"])}
                            aria-label={`Status for ${request.title}`}
                            className="rounded-[4px] border border-line bg-white px-2 py-1.5 text-[10px] text-ink"
                          >
                            {storyRequestStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2.5 text-right">
                          <div className="inline-flex flex-wrap justify-end gap-1">
                            <button type="button" onClick={() => { approve(request); setNotice({ text: `${request.title} is now published.` }); }} aria-label={`Accept ${request.title}`} className="inline-flex h-7 items-center gap-1 rounded-[4px] bg-mint/30 px-2 text-[9px] font-semibold text-forest-700 hover:bg-mint/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                              <CheckCircle2 size={11} aria-hidden="true" /> Accept
                            </button>
                            <button type="button" onClick={() => { setRequestStatus(request.id, "Rejected"); setNotice({ text: "Submission declined." }); }} aria-label={`Reject ${request.title}`} className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-line px-2 text-[9px] font-semibold text-muted hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                              <XCircle size={11} aria-hidden="true" /> Decline
                            </button>
                            <button type="button" onClick={() => removeRequest(request.id)} aria-label={`Delete ${request.title} request`} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                              <Trash2 size={12} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr><td colSpan={5} className="px-2 py-8 text-center text-[11px] text-muted">No submissions yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {tab === "homepage" && (
            <Section title="Homepage story section">
              {(["eyebrow", "title", "description", "linkLabel"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <input value={draft.section[key]} onChange={(event) => setGroup("section", { ...draft.section, [key]: event.target.value })} className={fieldClass} />
                </label>
              ))}
              <StringList label="Bullet points" values={draft.home.bullets} onChange={(values) => setGroup("home", { ...draft.home, bullets: values })} />
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block"><span className={subLabel}>Primary button</span><input value={draft.home.primaryLabel} onChange={(event) => setGroup("home", { ...draft.home, primaryLabel: event.target.value })} className={fieldClass} /></label>
                <label className="block"><span className={subLabel}>Secondary button</span><input value={draft.home.secondaryLabel} onChange={(event) => setGroup("home", { ...draft.home, secondaryLabel: event.target.value })} className={fieldClass} /></label>
              </div>
              <label className="block"><span className={subLabel}>Notice</span><input value={draft.home.notice} onChange={(event) => setGroup("home", { ...draft.home, notice: event.target.value })} className={fieldClass} /></label>
            </Section>
          )}

          {tab === "page" && (
            <Section title="/stories page">
              {(["eyebrow", "title", "description", "rulesEyebrow", "rulesTitle", "ctaEyebrow", "ctaTitle", "ctaText", "ctaLabel", "footerNote", "primaryLabel"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.page[key]}
                    onChange={(event) => setGroup("page", { ...draft.page, [key]: event.target.value })}
                    rows={key === "description" || key === "ctaText" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
              <StringList label="Stats" values={draft.page.stats.map((item) => `${item.value} | ${item.label}`)} onChange={(values) => setGroup("page", { ...draft.page, stats: values.map((value) => { const [v = "", l = ""] = value.split("|"); return { value: v.trim(), label: l.trim() }; }) })} />
              <StringList label="Rules" values={draft.page.rules} onChange={(values) => setGroup("page", { ...draft.page, rules: values })} multiline />
            </Section>
          )}

          {tab === "share" && (
            <Section title="/stories/share page">
              {(["eyebrow", "title", "description", "badge", "successTitle", "successText", "tipsTitle", "reviewTitle", "reviewText"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.share[key]}
                    onChange={(event) => setGroup("share", { ...draft.share, [key]: event.target.value })}
                    rows={key === "description" || key === "successText" || key === "reviewText" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
              <StringList label="Quick tips" values={draft.share.tips} onChange={(values) => setGroup("share", { ...draft.share, tips: values })} multiline />
            </Section>
          )}

          {notice && (
            <div role="status" className={cn("flex items-start gap-2 rounded-[8px] border px-3 py-2.5", notice.error ? "border-gold-300 bg-gold-300/15" : "border-brand-100 bg-brand-50")}>
              {notice.error ? <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" /> : <Check size={13} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          {tab !== "requests" && (
            <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
              <button type="button" onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                <Save size={13} aria-hidden="true" /> Save all changes
              </button>
              <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                <RotateCcw size={13} aria-hidden="true" /> Restore default
              </button>
              {dirty && <span className="ml-auto text-[10px] font-semibold text-gold-600">Unsaved changes</span>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" aria-hidden="true" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Homepage section</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">{draft.section.eyebrow}</p>
              <h3 className="mt-1 font-display text-base font-bold text-ink">{draft.section.title}</h3>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">{draft.section.description}</p>
              <ul className="mt-3 space-y-1">
                {draft.home.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-[9px] text-forest-800/75">
                    <Check size={10} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {draft.stories.slice(0, 4).map((story) => (
                  <div key={story.id} className="rounded-[6px] border border-line bg-white p-2.5">
                    <p className="text-[8px] font-semibold uppercase text-brand-600">{story.type}</p>
                    <p className="mt-0.5 line-clamp-1 text-[9px] font-semibold text-ink">{story.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[8px] text-muted">{story.excerpt}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1 text-[9px] text-muted">
                <Info size={10} aria-hidden="true" />
                {draft.stories.length} stories · {pending.length} awaiting review
              </p>
            </div>
          </section>
          <p className="text-[10px] leading-relaxed text-muted">
            Demo note: stories and submissions are stored in this browser only — nothing reaches a server.
          </p>
        </div>
      </div>
    </div>
  );
}
