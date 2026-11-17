"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  UploadCloud,
} from "lucide-react";
import { useUsedContent } from "@/components/providers/UsedContentProvider";
import { cloneUsedDefaults, type UsedContent } from "@/lib/used-content";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };

export function UsedBooksEditor({ label }: { label: string }) {
  const { content, save, reset } = useUsedContent();
  const [draft, setDraft] = useState<UsedContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setDraft(content), [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const set = <K extends keyof UsedContent>(key: K, value: UsedContent[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const uploadImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setNotice(null);
    try {
      const imageSrc = await fileToDataUrl(file);
      set("imageSrc", imageSrc);
      setNotice({
        text: `Image compressed (${dataUrlSizeLabel(imageSrc)}). Save changes to publish.`,
      });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not read that image.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneUsedDefaults());
    setNotice({ text: result.message, error: !result.ok });
  };

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
            Edit the copy, badge, feature list and image of the pre-loved books banner.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
          >
            <Eye size={13} /> View homepage
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Section copy</h2>
              <p className="text-[10px] text-muted">Text shown on the homepage banner.</p>
            </div>
            <div className="space-y-3 p-4 sm:p-5">
              <label className="block">
                <span className={subLabel}>Eyebrow</span>
                <input
                  value={draft.eyebrow}
                  onChange={(event) => set("eyebrow", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Title (before highlight)</span>
                  <input
                    value={draft.titlePrefix}
                    onChange={(event) => set("titlePrefix", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Title highlight</span>
                  <input
                    value={draft.titleHighlight}
                    onChange={(event) => set("titleHighlight", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className={subLabel}>Description</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => set("description", event.target.value)}
                  rows={3}
                  className={`${fieldClass} resize-y leading-relaxed`}
                />
              </label>
            </div>
          </section>

          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Badge & chip</h2>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              <label className="block">
                <span className={subLabel}>Badge value</span>
                <input
                  value={draft.badgeValue}
                  onChange={(event) => set("badgeValue", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Badge label</span>
                <input
                  value={draft.badgeLabel}
                  onChange={(event) => set("badgeLabel", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={subLabel}>Image chip text</span>
                <input
                  value={draft.chip}
                  onChange={(event) => set("chip", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
          </section>

          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Feature list</h2>
              <p className="text-[10px] text-muted">Small bullet points under the buttons.</p>
            </div>
            <div className="space-y-2 p-4 sm:p-5">
              {draft.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <input
                    value={feature}
                    onChange={(event) => {
                      const next = [...draft.features];
                      next[index] = event.target.value;
                      set("features", next);
                    }}
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "features",
                        draft.features.filter((_, i) => i !== index),
                      )
                    }
                    className="rounded-[4px] p-2 text-muted hover:text-brand-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("features", [...draft.features, ""])}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
              >
                <Plus size={12} /> Add feature
              </button>
            </div>
          </section>

          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Image</h2>
              <p className="text-[10px] text-muted">
                Pasted URL or uploaded image shown on the left half of the banner.
              </p>
            </div>
            <div className="space-y-3 p-4 sm:p-5">
              <div className="h-40 overflow-hidden rounded-[8px] border border-line bg-brand-100">
                {draft.imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.imageSrc}
                    alt={draft.imageAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-[10px] text-muted">
                    No image
                  </div>
                )}
              </div>
              <label className="block">
                <span className={subLabel}>Image URL</span>
                <input
                  value={draft.imageSrc}
                  onChange={(event) => set("imageSrc", event.target.value)}
                  placeholder="https://…"
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Alt text</span>
                <input
                  value={draft.imageAlt}
                  onChange={(event) => set("imageAlt", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                <span className={subLabel}>
                  <span className="inline-flex items-center gap-1">
                    <UploadCloud size={11} /> Upload image
                  </span>
                </span>
                <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink hover:border-brand-300 hover:text-brand-700">
                  <ImagePlus size={12} />
                  {uploading ? "Compressing…" : "Choose image"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(event) => uploadImage(event.target.files?.[0])}
                  />
                </label>
                {draft.imageSrc.startsWith("data:") && (
                  <span className="ml-2 text-[9px] text-muted">
                    Uploaded · {dataUrlSizeLabel(draft.imageSrc)}
                  </span>
                )}
                <p className="mt-1 text-[9px] leading-relaxed text-muted">
                  Uploaded images are resized and stored in this browser only.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Fixed buttons & links</h2>
              <p className="text-[10px] text-muted">
                These are intentionally not editable — they point to the correct pages.
              </p>
            </div>
            <div className="space-y-1.5 p-4 text-[10px] text-muted sm:p-5">
              <p>
                Buy used books → <code className="text-brand-700">/up-sales</code>
              </p>
              <p>
                Sell used books → <code className="text-brand-700">/sell-used-books</code>
              </p>
              <p>
                How it works → <code className="text-brand-700">/sell-used-books</code>
              </p>
            </div>
          </section>

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
              <Save size={13} /> Save changes
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
              <span className="ml-auto text-[9px] text-muted">Homepage banner</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <div className="grid overflow-hidden rounded-[8px] border border-line bg-white">
                <div className="relative h-32 overflow-hidden bg-brand-100">
                  {draft.imageSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={draft.imageSrc}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute left-2 top-2 rounded-[4px] bg-brand-900 px-2 py-1 text-white">
                    <p className="text-[11px] font-bold leading-none text-sale">
                      {draft.badgeValue}
                    </p>
                    <p className="text-[7px] uppercase text-white/70">{draft.badgeLabel}</p>
                  </div>
                  <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[8px] text-brand-900">
                    {draft.chip}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-600">
                    {draft.eyebrow}
                  </p>
                  <h3 className="mt-1 font-display text-base font-bold leading-snug text-ink">
                    {draft.titlePrefix}
                    <span className="text-brand-600">{draft.titleHighlight}</span>
                  </h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">
                    {draft.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-[4px] bg-brand-600 px-3 py-1.5 text-[9px] font-semibold text-white">
                      Buy used books
                    </span>
                    <span className="rounded-[4px] border border-line px-3 py-1.5 text-[9px] font-medium text-ink">
                      Sell used books
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-muted">
                    {draft.features.map((feature, index) => (
                      <span key={index} className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-brand-500" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
