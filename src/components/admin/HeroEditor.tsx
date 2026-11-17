"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  ImagePlus,
  Link2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useHeroContent } from "@/components/providers/HeroContentProvider";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import {
  bannerSrc,
  cloneHeroDefaults,
  heroDefaults,
  type HeroBanner,
  type HeroContent,
} from "@/lib/hero-content";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

type Notice = { text: string; error?: boolean };

function createBanner(index: number): HeroBanner {
  return {
    id: `slide-${Date.now()}-${index}`,
    imageId: heroDefaults.banners[index % heroDefaults.banners.length].imageId,
    alt: "",
  };
}

function sourceLabel(banner: HeroBanner): string {
  if (banner.src?.startsWith("data:")) return "Uploaded";
  if (banner.src) return "Custom URL";
  if (banner.imageId) return "Sample image";
  return "No image";
}

export function HeroEditor({ label }: { label: string }) {
  const { content, save, reset } = useHeroContent();
  const [draft, setDraft] = useState<HeroContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // Adopt stored content once it has been read from localStorage (and on save).
  useEffect(() => setDraft(content), [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);
  const safeIndex = Math.min(activeIndex, Math.max(0, draft.banners.length - 1));
  const activeBanner = draft.banners[safeIndex];

  const updateBanner = (id: string, patch: Partial<HeroBanner>) => {
    setDraft((current) => ({
      ...current,
      banners: current.banners.map((banner) =>
        banner.id === id ? { ...banner, ...patch } : banner,
      ),
    }));
    setNotice(null);
  };

  const addBanner = () => {
    setDraft((current) => ({
      ...current,
      banners: [...current.banners, createBanner(current.banners.length)],
    }));
    setActiveIndex(draft.banners.length);
    setNotice(null);
  };

  const removeBanner = (id: string) => {
    setDraft((current) => ({
      ...current,
      banners: current.banners.filter((banner) => banner.id !== id),
    }));
    setNotice(null);
  };

  const moveBanner = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.banners.length) return;
    setDraft((current) => {
      const banners = [...current.banners];
      [banners[index], banners[target]] = [banners[target], banners[index]];
      return { ...current, banners };
    });
    setNotice(null);
  };

  const uploadImage = async (id: string, file: File | undefined) => {
    if (!file) return;
    const position = draft.banners.findIndex((banner) => banner.id === id) + 1;
    setBusyId(id);
    setNotice(null);
    try {
      const src = await fileToDataUrl(file);
      updateBanner(id, { src, imageId: undefined });
      setNotice({
        text: `${file.name} compressed (${dataUrlSizeLabel(src)}) and added to slide ${position}. Save changes to publish.`,
      });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not read that image.",
      });
    } finally {
      setBusyId(null);
      if (fileInputs.current[id]) fileInputs.current[id]!.value = "";
    }
  };

  const restoreSample = (id: string) => {
    const sample = heroDefaults.banners.find((banner) => banner.id === id);
    updateBanner(id, {
      imageId: sample?.imageId,
      src: undefined,
      position: sample?.position,
      alt: draft.banners.find((banner) => banner.id === id)?.alt || sample?.alt || "",
    });
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    const fresh = cloneHeroDefaults();
    setDraft(fresh);
    setActiveIndex(0);
    setNotice({ text: result.message, error: !result.ok });
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="transition-colors hover:text-brand-700">
          Dashboard
        </Link>
        <span>/</span>
        <span>Homepage sections</span>
        <span>/</span>
        <span className="font-semibold text-ink">{label}</span>
      </div>

      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">{label}</h1>
            <span className="rounded-full bg-mint/25 px-2.5 py-1 text-[9px] font-semibold text-forest-700">
              Published
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            Manage the rotating banner images shown at the top of the homepage.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Eye size={13} /> View homepage
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {/* Banner slides */}
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Banner slides</h2>
                <p className="text-[10px] text-muted">
                  {draft.banners.length} slide{draft.banners.length === 1 ? "" : "s"} · shown in this order
                </p>
              </div>
              <button
                type="button"
                onClick={addBanner}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Plus size={12} /> Add slide
              </button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {draft.banners.length === 0 && (
                <p className="rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[11px] text-muted">
                  No slides yet. Add one to show a banner on the homepage.
                </p>
              )}

              {draft.banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`rounded-[8px] border p-3 transition-colors ${
                    index === safeIndex ? "border-brand-300 bg-brand-50/40" : "border-line bg-white"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      title="Preview this slide"
                      className="relative h-9 w-20 shrink-0 overflow-hidden rounded-[4px] border border-line bg-brand-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerSrc(banner, 320)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-ink">Slide {index + 1}</p>
                      <p className="text-[9px] text-muted">{sourceLabel(banner)}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveBanner(index, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBanner(index, 1)}
                        disabled={index === draft.banners.length - 1}
                        title="Move down"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBanner(banner.id)}
                        title="Remove slide"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block">
                      <span className={subLabel}>
                        <span className="inline-flex items-center gap-1">
                          <Link2 size={11} /> Image URL
                        </span>
                      </span>
                      <input
                        value={banner.src ?? ""}
                        onChange={(event) =>
                          updateBanner(banner.id, {
                            src: event.target.value,
                            imageId: undefined,
                          })
                        }
                        placeholder="https://… direct image link"
                        className={fieldClass}
                      />
                      <span className={hint}>
                        Paste a direct image URL, or upload a file below. Leave blank to use
                        the sample image.
                      </span>
                    </label>

                    <div>
                      <span className={subLabel}>
                        <span className="inline-flex items-center gap-1">
                          <UploadCloud size={11} /> Upload image
                        </span>
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700">
                          <ImagePlus size={13} />
                          {busyId === banner.id ? "Compressing…" : "Choose image"}
                          <input
                            ref={(node) => {
                              fileInputs.current[banner.id] = node;
                            }}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="sr-only"
                            disabled={busyId === banner.id}
                            onChange={(event) =>
                              uploadImage(banner.id, event.target.files?.[0])
                            }
                          />
                        </label>
                        {banner.src?.startsWith("data:") && (
                          <button
                            type="button"
                            onClick={() => restoreSample(banner.id)}
                            className="text-[10px] font-medium text-brand-700 underline underline-offset-2"
                          >
                            Remove upload ({dataUrlSizeLabel(banner.src)})
                          </button>
                        )}
                        {banner.imageId && !banner.src && (
                          <span className="text-[9px] text-muted">Using sample image</span>
                        )}
                      </div>
                      <span className={hint}>
                        Images are resized and compressed in your browser, then saved to this
                        browser only. Max 15 MB.
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className={subLabel}>Alt text</span>
                        <input
                          value={banner.alt}
                          onChange={(event) => updateBanner(banner.id, { alt: event.target.value })}
                          placeholder="Describe the image"
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className={subLabel}>Object position</span>
                        <input
                          value={banner.position ?? ""}
                          onChange={(event) =>
                            updateBanner(banner.id, { position: event.target.value || undefined })
                          }
                          placeholder="50% 45%"
                          className={fieldClass}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {notice && (
            <div
              className={`flex items-start gap-2 rounded-[8px] border px-3 py-2.5 ${
                notice.error
                  ? "border-gold-300 bg-gold-300/15"
                  : "border-brand-100 bg-brand-50"
              }`}
            >
              {notice.error ? (
                <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" />
              ) : (
                <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />
              )}
              <p
                className={`text-[10px] leading-relaxed ${
                  notice.error ? "text-ink" : "text-brand-800"
                }`}
              >
                {notice.text}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
            >
              <Save size={13} /> Save changes
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <RotateCcw size={13} /> Restore sample
            </button>
            {dirty && (
              <span className="ml-auto text-[10px] font-semibold text-gold-600">
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Homepage banner</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <div className="overflow-hidden rounded-[8px] border border-line bg-brand-100">
                <div className="relative aspect-[16/9] w-full sm:aspect-[2.6/1] lg:aspect-[3.2/1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeBanner ? bannerSrc(activeBanner, 1200) : bannerSrc(heroDefaults.banners[0], 1200)}
                    alt={activeBanner?.alt || "Hero banner preview"}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={
                      activeBanner?.position
                        ? { objectPosition: activeBanner.position }
                        : undefined
                    }
                  />
                </div>
              </div>
              {draft.banners.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {draft.banners.map((banner, index) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      title={`Preview slide ${index + 1}`}
                      className={`h-9 w-16 overflow-hidden rounded-[4px] border transition-colors ${
                        index === safeIndex
                          ? "border-brand-500 ring-2 ring-brand-500/20"
                          : "border-line hover:border-brand-300"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={bannerSrc(banner, 240)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 truncate text-[9px] text-muted">
                {activeBanner?.alt || "No alt text for this slide"}
              </p>
            </div>
          </section>

          <div className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Demo note:</span> slides and copy are
              stored in this browser (localStorage) only — no upload reaches a server, and
              there is no database. Saved changes appear on the homepage in this browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
