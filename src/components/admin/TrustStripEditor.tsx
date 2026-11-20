"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
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
import { TrustIcon } from "@/components/ui/TrustIcon";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import { resetTrustContent, saveTrustContent } from "@/lib/actions/trust-strip";
import {
  clearTrustContent,
  cloneTrustDefaults,
  readTrustContent,
  TRUST_STORAGE_KEY,
  trustDefaults,
  trustIconKeys,
  trustTints,
  type TrustCard,
  type TrustContent,
  type TrustIconKey,
  type TrustTintKey,
} from "@/lib/trust-content";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

type Notice = { text: string; error?: boolean };

/** Compressed data URL → { url } on disk. Keeps base64 out of Postgres. */
async function postImageDataUrl(src: string): Promise<string> {
  const response = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ src, folder: "trust-strip" }),
  });
  const result = (await response.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;
  if (!response.ok || !result?.url) {
    throw new Error(result?.error ?? "The image could not be uploaded.");
  }
  return result.url;
}

/** Uploads any card still holding a base64 image, so only URLs reach the DB. */
async function normaliseForSave(content: TrustContent): Promise<TrustContent> {
  const cards: TrustCard[] = [];
  for (const card of content.cards) {
    if (card.src?.startsWith("data:")) {
      cards.push({ ...card, src: await postImageDataUrl(card.src) });
    } else {
      cards.push(card);
    }
  }
  return { cards };
}

function createCard(index: number): TrustCard {
  const sample = trustDefaults.cards[index % trustDefaults.cards.length];
  return {
    ...sample,
    id: `card-${Date.now()}-${index}`,
    title: "New card",
    text: "",
  };
}

export function TrustStripEditor({
  label,
  initialContent,
}: {
  label: string;
  initialContent: TrustContent;
}) {
  const [saved, setSaved] = useState<TrustContent>(initialContent);
  const [draft, setDraft] = useState<TrustContent>(initialContent);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [legacy, setLegacy] = useState<TrustContent | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  // Cards saved in this browser before the database existed cannot be read on
  // the server; offer a one-click import like the hero editor does.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(TRUST_STORAGE_KEY)) return;
    } catch {
      return;
    }
    const stored = readTrustContent();
    if (JSON.stringify(stored) !== JSON.stringify(initialContent)) setLegacy(stored);
  }, [initialContent]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const updateCard = (id: string, patch: Partial<TrustCard>) => {
    setDraft((current) => ({
      ...current,
      cards: current.cards.map((card) =>
        card.id === id ? { ...card, ...patch } : card,
      ),
    }));
    setNotice(null);
  };

  const addCard = () => {
    setDraft((current) => ({
      ...current,
      cards: [...current.cards, createCard(current.cards.length)],
    }));
    setNotice(null);
  };

  const removeCard = (id: string) => {
    setDraft((current) => ({
      ...current,
      cards: current.cards.filter((card) => card.id !== id),
    }));
    setNotice(null);
  };

  const moveCard = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.cards.length) return;
    setDraft((current) => {
      const cards = [...current.cards];
      [cards[index], cards[target]] = [cards[target], cards[index]];
      return { ...current, cards };
    });
    setNotice(null);
  };

  const uploadImage = async (id: string, file: File | undefined) => {
    if (!file) return;
    setBusyId(id);
    setNotice(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const size = dataUrlSizeLabel(dataUrl);
      const url = await postImageDataUrl(dataUrl);
      updateCard(id, { src: url });
      setNotice({
        text: `${file.name} stored on the server (${size}) for this card. Save changes to publish.`,
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

  const restoreSampleIcon = (id: string) => updateCard(id, { src: undefined });

  const handleSave = () => {
    setNotice(null);
    startTransition(async () => {
      try {
        const normalised = await normaliseForSave(draft);
        const result = await saveTrustContent(normalised);
        setNotice({ text: result.message, error: !result.ok });
        if (result.ok) {
          setDraft(normalised);
          setSaved(normalised);
          clearTrustContent();
          setLegacy(null);
        }
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not save the cards.",
        });
      }
    });
  };

  const handleReset = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await resetTrustContent();
      if (result.ok) {
        const fresh = cloneTrustDefaults();
        setDraft(fresh);
        setSaved(fresh);
        setLegacy(null);
      }
      setNotice({ text: result.message, error: !result.ok });
    });
  };

  const importLocal = () => {
    if (!legacy) return;
    setDraft(legacy);
    setNotice({
      text: "Loaded this browser's cards into the editor. Save changes to publish them for everyone.",
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
            Edit the four quick-link cards shown just below the hero banner.
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
          {/* Cards */}
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Quick-link cards</h2>
                <p className="text-[10px] text-muted">
                  {draft.cards.length} card{draft.cards.length === 1 ? "" : "s"} · shown in this order
                </p>
              </div>
              <button
                type="button"
                onClick={addCard}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Plus size={12} /> Add card
              </button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {draft.cards.length === 0 && (
                <p className="rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[11px] text-muted">
                  No cards yet. Add one to show a quick link below the hero.
                </p>
              )}

              {draft.cards.map((card, index) => (
                <div key={card.id} className="rounded-[8px] border border-line bg-white p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[7px] ${trustTints[card.tint]?.className ?? trustTints.brand.className}`}
                    >
                      {card.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.src} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <TrustIcon icon={card.icon} className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-ink">
                        Card {index + 1}: {card.title || "Untitled"}
                      </p>
                      <p className="text-[9px] text-muted">
                        {card.src?.startsWith("data:") ? "Uploaded image" : card.src ? "Custom image URL" : "Icon"}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveCard(index, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCard(index, 1)}
                        disabled={index === draft.cards.length - 1}
                        title="Move down"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCard(card.id)}
                        title="Remove card"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className={subLabel}>Title</span>
                        <input
                          value={card.title}
                          onChange={(event) => updateCard(card.id, { title: event.target.value })}
                          placeholder="e.g. Audiobooks"
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className={subLabel}>Subtitle</span>
                        <input
                          value={card.text}
                          onChange={(event) => updateCard(card.id, { text: event.target.value })}
                          placeholder="e.g. Listen on any device"
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className={subLabel}>
                        <span className="inline-flex items-center gap-1">
                          <Link2 size={11} /> Link (route)
                        </span>
                      </span>
                      <input
                        value={card.href}
                        onChange={(event) => updateCard(card.id, { href: event.target.value })}
                        placeholder="/audio-books"
                        className={fieldClass}
                      />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className={subLabel}>Icon</span>
                        <select
                          value={card.icon}
                          onChange={(event) =>
                            updateCard(card.id, { icon: event.target.value as TrustIconKey })
                          }
                          className={fieldClass}
                        >
                          {trustIconKeys.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={subLabel}>Icon colour</span>
                        <select
                          value={card.tint}
                          onChange={(event) =>
                            updateCard(card.id, { tint: event.target.value as TrustTintKey })
                          }
                          className={fieldClass}
                        >
                          {Object.entries(trustTints).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div>
                      <span className={subLabel}>
                        <span className="inline-flex items-center gap-1">
                          <UploadCloud size={11} /> Image (optional, replaces icon)
                        </span>
                      </span>
                      <label className="block">
                        <span className="sr-only">Image URL</span>
                        <input
                          value={card.src ?? ""}
                          onChange={(event) => updateCard(card.id, { src: event.target.value })}
                          placeholder="https://… direct image link (blank = use icon)"
                          className={fieldClass}
                        />
                      </label>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700">
                          <ImagePlus size={12} />
                          {busyId === card.id ? "Compressing…" : "Choose image"}
                          <input
                            ref={(node) => {
                              fileInputs.current[card.id] = node;
                            }}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="sr-only"
                            disabled={busyId === card.id}
                            onChange={(event) => uploadImage(card.id, event.target.files?.[0])}
                          />
                        </label>
                        {card.src && (
                          <button
                            type="button"
                            onClick={() => restoreSampleIcon(card.id)}
                            className="text-[10px] font-medium text-brand-700 underline underline-offset-2"
                          >
                            {card.src.startsWith("data:")
                              ? `Remove image (${dataUrlSizeLabel(card.src)})`
                              : "Remove image"}
                          </button>
                        )}
                      </div>
                      <span className={hint}>
                        Images are compressed in the browser and stored on the server when you
                        save. Max 15 MB.
                      </span>
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
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <Save size={13} /> {pending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
            >
              <RotateCcw size={13} /> Restore sample
            </button>
            {legacy && (
              <button
                type="button"
                onClick={importLocal}
                disabled={pending}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-3 text-[10px] font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50"
              >
                <UploadCloud size={13} /> Import from this browser
              </button>
            )}
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
              <span className="ml-auto text-[9px] text-muted">Homepage cards</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <div className="grid grid-cols-2 gap-2 rounded-[10px] border border-line bg-white p-3 sm:gap-3">
                {draft.cards.map((card) => {
                  const tint = trustTints[card.tint] ?? trustTints.brand;
                  return (
                    <div
                      key={card.id}
                      className="flex items-center gap-2 rounded-[8px] border border-line bg-white px-2.5 py-2.5 sm:gap-3 sm:px-3"
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-[7px] ${tint.className}`}
                      >
                        {card.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.src} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <TrustIcon icon={card.icon} className="h-4 w-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-bold text-ink">
                          {card.title || "Untitled"}
                        </span>
                        <span className="block truncate text-[9px] text-muted">
                          {card.text || "—"}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-[9px] text-muted">
                Preview is at desktop width; on phones the cards show two per row.
              </p>
            </div>
          </section>

          <div className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Storage note:</span> cards live in the
              Neon database (content_blocks, key <code>trust-strip</code>) and images are
              written to local disk under <code>uploads/trust-strip</code>, served at{" "}
              <code>/media</code>. Saved changes appear on the homepage for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
