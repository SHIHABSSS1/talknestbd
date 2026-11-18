"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  ImagePlus,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { usePublisherContent } from "@/components/providers/PublisherContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { clonePublisherDefaults, type PublisherContent } from "@/lib/publisher-content";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import { slugify, uniqueSlug } from "@/lib/slug";
import type { Publisher } from "@/lib/types";
import { cn, formatCount } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "publishers" | "add" | "homepage" | "listing" | "detail";

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

function newPublisher(index: number, slugs: string[]): Publisher {
  return {
    slug: uniqueSlug("new-publisher", slugs),
    name: "New publisher",
    tagline: "",
    description: "",
    established: "2026",
    location: "Dhaka",
    initials: "NP",
    accent: "#1877F2",
    featured: index < 6,
  };
}

export function PublishersEditor({ label }: { label: string }) {
  const { content, save, reset } = usePublisherContent();
  const { books } = useBookContent();
  const [draft, setDraft] = useState<PublisherContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("publishers");
  const [editing, setEditing] = useState<Publisher | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setDraft(content), [content]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const updatePublisher = (slug: string, patch: Partial<Publisher>) => {
    setDraft((current) => ({
      ...current,
      publishers: current.publishers.map((publisher) =>
        publisher.slug === slug ? { ...publisher, ...patch } : publisher,
      ),
    }));
    setNotice(null);
  };

  const startAdd = () => {
    setEditing(newPublisher(draft.publishers.length, draft.publishers.map((item) => item.slug)));
    setTab("add");
    setNotice(null);
  };

  const removePublisher = (slug: string) => {
    setDraft((current) => ({
      ...current,
      publishers: current.publishers.filter((publisher) => publisher.slug !== slug),
    }));
    setNotice(null);
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file || !editing) return;
    setUploading(true);
    setNotice(null);
    try {
      const imageSrc = await fileToDataUrl(file);
      setEditing((current) => (current ? { ...current, imageSrc } : current));
      setNotice({ text: `Logo compressed (${dataUrlSizeLabel(imageSrc)}). Save the publisher to publish.` });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not read that image.",
      });
    } finally {
      setUploading(false);
    }
  };

  const setSection = <K extends keyof PublisherContent["section"]>(key: K, value: PublisherContent["section"][K]) => {
    setDraft((current) => ({ ...current, section: { ...current.section, [key]: value } }));
    setNotice(null);
  };

  const setListing = <K extends keyof PublisherContent["listing"]>(key: K, value: PublisherContent["listing"][K]) => {
    setDraft((current) => ({ ...current, listing: { ...current.listing, [key]: value } }));
    setNotice(null);
  };

  const setDetail = <K extends keyof PublisherContent["detail"]>(key: K, value: PublisherContent["detail"][K]) => {
    setDraft((current) => ({ ...current, detail: { ...current.detail, [key]: value } }));
    setNotice(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(clonePublisherDefaults());
    setEditing(null);
    setNotice({ text: result.message, error: !result.ok });
  };

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "publishers", label: "Publishers", count: draft.publishers.length },
    { key: "add", label: "Add publisher" },
    { key: "homepage", label: "Homepage" },
    { key: "listing", label: "/publishers page" },
    { key: "detail", label: "Detail page" },
  ];

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
            Manage publisher profiles, logos and every publisher page from one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/publishers" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
            <Eye size={13} /> View publishers
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
          {tab === "publishers" && (
            <Section title="Publisher profiles" description="Add, edit or remove publishers. Each gets a /publishers/<slug> page.">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] text-muted">{draft.publishers.length} presses</p>
                <button type="button" onClick={startAdd} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                  <Plus size={12} /> Add publisher
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[540px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                      <th className="px-2 py-2 font-semibold">Publisher</th>
                      <th className="px-2 py-2 font-semibold">Est.</th>
                      <th className="px-2 py-2 font-semibold">Books</th>
                      <th className="px-2 py-2 font-semibold">Featured</th>
                      <th className="px-2 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.publishers.map((publisher) => {
                      const count = books.filter((book) => book.publisherSlug === publisher.slug).length;
                      return (
                        <tr key={publisher.slug} className="border-b border-line/70 last:border-0">
                          <td className="px-2 py-2">
                            <button type="button" onClick={() => setEditing(publisher)} className="flex items-center gap-2 text-left">
                              <span
                                className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[4px] text-[10px] font-bold text-white"
                                style={{ backgroundColor: publisher.accent }}
                              >
                                {publisher.imageSrc ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={publisher.imageSrc} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  publisher.initials
                                )}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-[11px] font-semibold text-ink">{publisher.name}</span>
                                <span className="block truncate text-[9px] text-muted">{publisher.location}</span>
                              </span>
                            </button>
                          </td>
                          <td className="px-2 py-2 text-[10px] text-muted">{publisher.established}</td>
                          <td className="px-2 py-2 text-[10px] text-muted">{formatCount(count)}</td>
                          <td className="px-2 py-2">
                            <input
                              type="checkbox"
                              checked={publisher.featured}
                              onChange={(event) => updatePublisher(publisher.slug, { featured: event.target.checked })}
                              className="h-3.5 w-3.5 accent-brand-600"
                            />
                          </td>
                          <td className="px-2 py-2 text-right">
                            <div className="inline-flex gap-1">
                              <button type="button" onClick={() => setEditing(publisher)} className="rounded-[4px] border border-line px-2 py-1.5 text-[9px] font-medium text-ink hover:border-brand-300">Edit</button>
                              <button type="button" onClick={() => removePublisher(publisher.slug)} className="rounded-[4px] p-1.5 text-muted hover:text-brand-700" title="Delete publisher">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          {editing && (tab === "publishers" || tab === "add") && (
            <Section title={draft.publishers.some((item) => item.slug === editing.slug) ? "Edit publisher" : "New publisher"}>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Name</span>
                  <input
                    value={editing.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setEditing({
                        ...editing,
                        name,
                        slug: editing.slug.startsWith("new-publisher") ? slugify(name) : editing.slug,
                      });
                    }}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Slug</span>
                  <input
                    value={editing.slug}
                    onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Tagline</span>
                  <input
                    value={editing.tagline}
                    onChange={(event) => setEditing({ ...editing, tagline: event.target.value })}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Initials</span>
                  <input
                    value={editing.initials}
                    onChange={(event) => setEditing({ ...editing, initials: event.target.value })}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Established</span>
                  <input
                    value={editing.established}
                    onChange={(event) => setEditing({ ...editing, established: event.target.value })}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Location</span>
                  <input
                    value={editing.location}
                    onChange={(event) => setEditing({ ...editing, location: event.target.value })}
                    className={fieldClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={subLabel}>Description</span>
                <textarea
                  value={editing.description}
                  onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                  rows={3}
                  className={`${fieldClass} resize-y`}
                />
              </label>
              <label className="flex items-center gap-2">
                <span className={subLabel}>Accent color</span>
                <input
                  type="color"
                  value={editing.accent}
                  onChange={(event) => setEditing({ ...editing, accent: event.target.value })}
                  className="h-9 w-14 cursor-pointer rounded border border-line bg-white p-0.5"
                />
                <code className="text-[10px] text-muted">{editing.accent}</code>
              </label>

              <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-ink">Logo / photo</span>
                  <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink hover:border-brand-300">
                    <ImagePlus size={12} />
                    {uploading ? "Compressing…" : "Upload logo"}
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(event) => uploadImage(event.target.files?.[0])} />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[6px] text-sm font-bold text-white"
                    style={{ backgroundColor: editing.accent }}
                  >
                    {editing.imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editing.imageSrc} alt="" className="h-full w-full object-cover" />
                    ) : (
                      editing.initials
                    )}
                  </span>
                  <div className="min-w-0">
                    <input
                      value={editing.imageSrc ?? ""}
                      onChange={(event) => setEditing({ ...editing, imageSrc: event.target.value })}
                      placeholder="Image URL"
                      className={fieldClass}
                    />
                    {editing.imageSrc?.startsWith("data:") && (
                      <p className="mt-1 text-[9px] text-muted">Uploaded · {dataUrlSizeLabel(editing.imageSrc)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const slug = slugify(editing.slug || editing.name);
                    const final: Publisher = { ...editing, slug, name: editing.name.trim() || "Untitled publisher" };
                    const exists = draft.publishers.some((item) => item.slug === slug);
                    setDraft((current) => ({
                      ...current,
                      publishers: exists
                        ? current.publishers.map((item) => (item.slug === slug ? final : item))
                        : [...current.publishers, final],
                    }));
                    setEditing(null);
                    setTab("publishers");
                    setNotice({ text: "Publisher saved. Save all changes to publish." });
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
                >
                  <Save size={13} /> Save publisher
                </button>
                <button type="button" onClick={() => setEditing(null)} className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                  Cancel
                </button>
              </div>
            </Section>
          )}

          {tab === "homepage" && (
            <Section title="Homepage publishers section">
              {(["eyebrow", "title", "description", "linkLabel"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <input
                    value={draft.section[key]}
                    onChange={(event) => setSection(key, event.target.value)}
                    className={fieldClass}
                  />
                </label>
              ))}
            </Section>
          )}

          {tab === "listing" && (
            <Section title="/publishers page">
              {(["eyebrow", "title", "description", "ctaLabel", "ctaTitle", "ctaDescription", "ctaLinkLabel"] as const).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <textarea
                    value={draft.listing[key]}
                    onChange={(event) => setListing(key, event.target.value)}
                    rows={key === "description" || key === "ctaDescription" ? 3 : 1}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              ))}
            </Section>
          )}

          {tab === "detail" && (
            <Section title="Publisher detail page labels">
              {(Object.keys(draft.detail) as (keyof PublisherContent["detail"])[]).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key}</span>
                  <input
                    value={draft.detail[key]}
                    onChange={(event) => setDetail(key, event.target.value)}
                    className={fieldClass}
                  />
                </label>
              ))}
            </Section>
          )}

          {notice && (
            <div className={cn("flex items-start gap-2 rounded-[8px] border px-3 py-2.5", notice.error ? "border-gold-300 bg-gold-300/15" : "border-brand-100 bg-brand-50")}>
              {notice.error ? <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" /> : <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
            <button type="button" onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700">
              <Save size={13} /> Save all changes
            </button>
            <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
              <RotateCcw size={13} /> Restore default
            </button>
            {dirty && <span className="ml-auto text-[10px] font-semibold text-gold-600">Unsaved changes</span>}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Homepage strip</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">{draft.section.eyebrow}</p>
              <h3 className="mt-1 font-display text-base font-bold text-ink">{draft.section.title}</h3>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">{draft.section.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {draft.publishers.filter((item) => item.featured).slice(0, 6).map((publisher) => (
                  <div key={publisher.slug} className="flex flex-col items-center gap-1.5 rounded-[8px] border border-line bg-white p-2 text-center">
                    <span
                      className="grid h-10 w-10 place-items-center overflow-hidden rounded-[4px] text-[10px] font-bold text-white"
                      style={{ backgroundColor: publisher.accent }}
                    >
                      {publisher.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={publisher.imageSrc} alt="" className="h-full w-full object-cover" />
                      ) : (
                        publisher.initials
                      )}
                    </span>
                    <span className="block w-full truncate text-[8px] font-semibold text-ink">{publisher.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[9px] text-muted">
                {draft.publishers.filter((item) => item.featured).length} featured · {draft.publishers.length} total presses
              </p>
            </div>
          </section>
          <p className="text-[10px] leading-relaxed text-muted">
            Demo note: logos and profiles are stored in this browser only — nothing reaches a server.
          </p>
        </div>
      </div>
    </div>
  );
}
