"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Database,
  Eye,
  ImagePlus,
  Link2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import { resetHeroContent, saveHeroContent } from "@/lib/actions/hero";
import {
  bannerSrc,
  clearLegacyHeroContent,
  cloneHeroDefaults,
  HERO_STORAGE_KEY,
  heroDefaults,
  readHeroContent,
  type HeroBanner,
  type HeroContent,
} from "@/lib/hero-content";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

type Notice = { text: string; error?: boolean };

/** Compressed data URL → { url } on disk. Keeps the database free of base64. */
async function postImageDataUrl(src: string): Promise<string> {
  const response = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ src, folder: "hero" }),
  });
  const result = (await response.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;
  if (!response.ok || !result?.url) {
    throw new Error(result?.error ?? "The image could not be uploaded.");
  }
  return result.url;
}

/** Uploads any slide still holding a base64 image, so only URLs reach the DB. */
async function normaliseForSave(content: HeroContent): Promise<HeroContent> {
  const banners: HeroBanner[] = [];
  for (const banner of content.banners) {
    if (banner.src?.startsWith("data:")) {
      banners.push({ ...banner, src: await postImageDataUrl(banner.src) });
    } else {
      banners.push(banner);
    }
  }
  return { banners };
}

function createBanner(index: number): HeroBanner {
  return {
    id: `slide-${Date.now()}-${index}`,
    imageId: heroDefaults.banners[index % heroDefaults.banners.length].imageId,
    alt: "",
  };
}

function sourceLabel(banner: HeroBanner): string {
  if (banner.src?.startsWith("/media/")) return "Uploaded to server";
  if (banner.src?.startsWith("data:")) return "Uploaded (not published yet)";
  if (banner.src) return "Custom URL";
  if (banner.imageId) return "Sample image";
  return "No image";
}

export function HeroEditor({
  label,
  initialContent,
}: {
  label: string;
  initialContent: HeroContent;
}) {
  const [saved, setSaved] = useState<HeroContent>(initialContent);
  const [draft, setDraft] = useState<HeroContent>(initialContent);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [legacy, setLegacy] = useState<HeroContent | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // Slides saved in this browser before the database existed. They cannot be
  // read on the server, so the editor offers a one-click import instead.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(HERO_STORAGE_KEY)) return;
    } catch {
      return;
    }
    const stored = readHeroContent();
    if (JSON.stringify(stored) !== JSON.stringify(initialContent)) {
      setLegacy(stored);
    }
  }, [initialContent]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
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
      const dataUrl = await fileToDataUrl(file);
      const size = dataUrlSizeLabel(dataUrl);
      const url = await postImageDataUrl(dataUrl);
      updateBanner(id, { src: url, imageId: undefined });
      setNotice({
        text: `${file.name} stored on the server (${size}) for slide ${position}. Save changes to publish.`,
      });
    } catch (error) {
      setNotice({
        error: true,
        text: error instanceof Error ? error.message : "Could not store that image.",
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
    setNotice(null);
    startTransition(async () => {
      try {
        const normalised = await normaliseForSave(draft);
        const result = await saveHeroContent(normalised);
        setNotice({ text: result.message, error: !result.ok });
        if (result.ok) {
          setDraft(normalised);
          setSaved(normalised);
          // The legacy copy is now published, so stop offering to import it.
          clearLegacyHeroContent();
          setLegacy(null);
        }
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not save the slides.",
        });
      }
    });
  };

  const handleReset = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await resetHeroContent();
      if (result.ok) {
        const fresh = cloneHeroDefaults();
        setDraft(fresh);
        setSaved(fresh);
        setLegacy(null);
        setActiveIndex(0);
      }
      setNotice({ text: result.message, error: !result.ok });
    });
  };

  const importLocal = () => {
    if (!legacy) return;
    setDraft(legacy);
    setActiveIndex(0);
    setNotice({
      text: "Loaded this browser's slides into the editor. Save changes to publish them for everyone.",
    });
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
                        {(banner.src &&
                          (banner.src.startsWith("data:") || banner.src.startsWith("/media/"))) && (
                          <button
                            type="button"
                            onClick={() => restoreSample(banner.id)}
                            className="text-[10px] font-medium text-brand-700 underline underline-offset-2"
                          >
                            {banner.src.startsWith("data:")
                              ? `Remove upload (${dataUrlSizeLabel(banner.src)})`
                              : "Remove upload"}
                          </button>
                        )}
                        {banner.imageId && !banner.src && (
                          <span className="text-[9px] text-muted">Using sample image</span>
                        )}
                      </div>
                      <span className={hint}>
                        Resized and compressed in your browser, then stored on the server
                        (uploads/hero) and served from /media. Max 15 MB.
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

          {legacy && (
            <div className="flex flex-wrap items-start gap-3 rounded-[8px] border border-dashed border-brand-300 bg-brand-50/50 px-3 py-2.5">
              <Database size={13} className="mt-0.5 shrink-0 text-brand-700" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-ink">
                  Slides found in this browser
                </p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-muted">
                  This browser still holds {legacy.banners.length} slide
                  {legacy.banners.length === 1 ? "" : "s"} saved before the database existed.
                  Import them, then save to publish for everyone.
                </p>
              </div>
              <button
                type="button"
                onClick={importLocal}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-white px-2.5 text-[10px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Database size={11} /> Import into editor
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              <Save size={13} /> {pending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-60"
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
              <span className="font-semibold text-ink">Storage:</span> slides live in the Neon
              database (<code>content_blocks</code>, key <code>hero</code>) and images are
              written to local disk under <code>uploads/hero</code>, served at{" "}
              <code>/media</code>. Saving publishes for every visitor; the homepage is cached
              and refreshed by the save action.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
