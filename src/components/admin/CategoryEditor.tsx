"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
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
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import {
  categoryAccentPresets,
  categoryDefaults,
  categoryIconKeys,
  cloneCategoryDefaults,
  createSubcategory,
  type CategoryContent,
  type CategoryHeading,
  type CategoryIconKey,
  type CategorySubcategory,
  type CategoryTile,
} from "@/lib/category-content";
import { categoryRoute, slugify, uniqueSlug } from "@/lib/slug";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";
const hint = "mt-1 block text-[9px] leading-relaxed text-muted";

type Notice = { text: string; error?: boolean };

function createTile(index: number, usedSlugs: string[]): CategoryTile {
  const sample = categoryDefaults.tiles[index % categoryDefaults.tiles.length];
  const slug = uniqueSlug("New shelf", usedSlugs);
  return {
    ...sample,
    id: `cat-${Date.now()}-${index}`,
    slug,
    href: categoryRoute(slug),
    name: "New shelf",
    englishName: "",
    description: "",
    subcategories: [],
    homeBooks: true,
  };
}

function routeFor(tile: CategoryTile, slug: string) {
  return tile.audio ? "/audio-books" : categoryRoute(slug);
}

export function CategoryEditor({ label }: { label: string }) {
  const { content, save, reset } = useCategoryContent();
  const [draft, setDraft] = useState<CategoryContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => setDraft(content), [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">(
    "categories",
  );
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  const parentTile =
    draft.tiles.find((tile) => tile.id === selectedParentId) ?? draft.tiles[0];
  const parentOptions = draft.tiles.filter((tile) => !tile.audio);
  const activeParent =
    parentTile && !parentTile.audio ? parentTile : parentOptions[0];

  const updateHeading = (key: keyof CategoryHeading, value: string) => {
    setDraft((current) => ({
      ...current,
      heading: { ...current.heading, [key]: value },
    }));
    setNotice(null);
  };

  const updateTile = (id: string, patch: Partial<CategoryTile>) => {
    setDraft((current) => ({
      ...current,
      tiles: current.tiles.map((tile) =>
        tile.id === id ? { ...tile, ...patch } : tile,
      ),
    }));
    setNotice(null);
  };

  const addTile = () => {
    setDraft((current) => ({
      ...current,
      tiles: [
        ...current.tiles,
        createTile(
          current.tiles.length,
          current.tiles.map((tile) => tile.slug),
        ),
      ],
    }));
    setNotice(null);
  };

  /** Name changes regenerate the route while the slug is still auto-generated. */
  const changeName = (tile: CategoryTile, name: string) => {
    const auto = tile.slug === slugify(tile.name);
    const slug = auto ? slugify(name) : tile.slug;
    updateTile(tile.id, { name, slug, href: routeFor(tile, slug) });
  };

  const changeSlug = (tile: CategoryTile, value: string) => {
    const slug = slugify(value);
    updateTile(tile.id, { slug, href: routeFor(tile, slug) });
  };

  const addSubcategory = (tile: CategoryTile) => {
    const sub = createSubcategory(
      "New subcategory",
      tile.subcategories.map((item) => item.slug),
    );
    updateTile(tile.id, { subcategories: [...tile.subcategories, sub] });
  };

  const updateSubcategory = (
    tile: CategoryTile,
    subId: string,
    patch: Partial<CategorySubcategory>,
  ) => {
    updateTile(tile.id, {
      subcategories: tile.subcategories.map((sub) => {
        if (sub.id !== subId) return sub;
        const next = { ...sub, ...patch };
        if (patch.name !== undefined && sub.slug === slugify(sub.name)) {
          next.slug = slugify(patch.name);
        }
        return next;
      }),
    });
  };

  const removeSubcategory = (tile: CategoryTile, subId: string) => {
    updateTile(tile.id, {
      subcategories: tile.subcategories.filter((sub) => sub.id !== subId),
    });
  };

  const removeTile = (id: string) => {
    setDraft((current) => ({
      ...current,
      tiles: current.tiles.filter((tile) => tile.id !== id),
    }));
    setNotice(null);
  };

  const moveTile = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.tiles.length) return;
    setDraft((current) => {
      const tiles = [...current.tiles];
      [tiles[index], tiles[target]] = [tiles[target], tiles[index]];
      return { ...current, tiles };
    });
    setNotice(null);
  };

  const uploadImage = async (id: string, file: File | undefined) => {
    if (!file) return;
    setBusyId(id);
    setNotice(null);
    try {
      const src = await fileToDataUrl(file);
      updateTile(id, { src });
      setNotice({
        text: `${file.name} compressed (${dataUrlSizeLabel(src)}). Save changes to publish.`,
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

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneCategoryDefaults());
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
            Edit the shelves shown on the homepage and the Categories page. Book counts
            stay up to date automatically.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/categories"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Eye size={13} /> View categories
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-[8px] border border-line bg-white p-1">
        {(
          [
            { key: "categories", label: "Categories", count: draft.tiles.length },
            {
              key: "subcategories",
              label: "Subcategories",
              count: draft.tiles.reduce(
                (total, tile) => total + tile.subcategories.length,
                0,
              ),
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors ${
              activeTab === tab.key
                ? "bg-brand-600 text-white"
                : "text-muted hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                activeTab === tab.key ? "bg-white/20" : "bg-brand-50 text-brand-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {activeTab === "categories" && (
            <>
          {/* Section heading */}
          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Section heading</h2>
              <p className="text-[10px] text-muted">
                Shown above the category shelves on the homepage.
              </p>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              <label className="block">
                <span className={subLabel}>Eyebrow</span>
                <input
                  value={draft.heading.eyebrow}
                  onChange={(event) => updateHeading("eyebrow", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Title</span>
                <input
                  value={draft.heading.title}
                  onChange={(event) => updateHeading("title", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={subLabel}>Description</span>
                <textarea
                  value={draft.heading.description}
                  onChange={(event) => updateHeading("description", event.target.value)}
                  rows={2}
                  className={`${fieldClass} resize-y leading-relaxed`}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className={subLabel}>Link label</span>
                <input
                  value={draft.heading.linkLabel}
                  onChange={(event) => updateHeading("linkLabel", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
          </section>

          {/* Tiles */}
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Category shelves</h2>
                <p className="text-[10px] text-muted">
                  {draft.tiles.length} shelve{draft.tiles.length === 1 ? "" : "s"} · shown in this order
                </p>
              </div>
              <button
                type="button"
                onClick={addTile}
                className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
              >
                <Plus size={12} /> Add shelf
              </button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {draft.tiles.length === 0 && (
                <p className="rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[11px] text-muted">
                  No shelves yet. Add one to show a category tile.
                </p>
              )}

              {draft.tiles.map((tile, index) => (
                <div key={tile.id} className="rounded-[8px] border border-line bg-white p-3">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full text-[11px] font-bold text-brand-900"
                      style={{ backgroundColor: `${tile.accent}55` }}
                    >
                      {tile.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tile.src} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <CategoryIcon icon={tile.icon} size={16} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-ink">
                        {index + 1}. {tile.name || "Untitled shelf"}
                      </p>
                      <p className="text-[9px] text-muted">
                        {tile.src?.startsWith("data:") ? "Uploaded image" : tile.src ? "Custom image URL" : "Icon"}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveTile(index, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTile(index, 1)}
                        disabled={index === draft.tiles.length - 1}
                        title="Move down"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTile(tile.id)}
                        title="Remove shelf"
                        className="rounded-[4px] p-1.5 text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className={subLabel}>Name</span>
                        <input
                          value={tile.name}
                          onChange={(event) => changeName(tile, event.target.value)}
                          placeholder="e.g. Novels"
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className={subLabel}>English name</span>
                        <input
                          value={tile.englishName}
                          onChange={(event) => updateTile(tile.id, { englishName: event.target.value })}
                          placeholder="e.g. Fiction"
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className={subLabel}>
                        Description <span className="font-normal text-muted">(Categories page)</span>
                      </span>
                      <textarea
                        value={tile.description}
                        onChange={(event) => updateTile(tile.id, { description: event.target.value })}
                        rows={2}
                        className={`${fieldClass} resize-y leading-relaxed`}
                      />
                    </label>

                    <div className="rounded-[8px] border border-brand-100 bg-brand-50/50 p-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <span className={subLabel}>
                            <span className="inline-flex items-center gap-1">
                              <Link2 size={11} /> URL slug
                            </span>
                          </span>
                          <input
                            value={tile.slug}
                            onChange={(event) => changeSlug(tile, event.target.value)}
                            placeholder="novels"
                            className={fieldClass}
                          />
                        </label>
                        <div className="flex flex-col justify-end">
                          <span className={subLabel}>Auto-created route</span>
                          <code className="rounded-[4px] border border-line bg-white px-3 py-2.5 text-[11px] text-brand-700">
                            {tile.href}
                          </code>
                        </div>
                      </div>
                      <p className={hint}>
                        The route is created automatically from the name. Save, then open
                        this URL — new categories get a working detail page.
                      </p>
                      <label className="mt-2 flex items-center gap-2 text-[10px] text-ink">
                        <input
                          type="checkbox"
                          checked={tile.homeBooks}
                          onChange={(event) =>
                            updateTile(tile.id, { homeBooks: event.target.checked })
                          }
                          className="h-3.5 w-3.5 rounded border-line accent-brand-600"
                        />
                        Show a book slider for this category on the homepage
                      </label>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className={subLabel}>Icon</span>
                        <select
                          value={tile.icon}
                          onChange={(event) =>
                            updateTile(tile.id, { icon: event.target.value as CategoryIconKey })
                          }
                          className={fieldClass}
                        >
                          {categoryIconKeys.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={subLabel}>Accent colour</span>
                        <select
                          value={tile.accent}
                          onChange={(event) => updateTile(tile.id, { accent: event.target.value })}
                          className={fieldClass}
                        >
                          {categoryAccentPresets.map((preset) => (
                            <option key={preset.value} value={preset.value}>
                              {preset.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="color"
                        value={tile.accent}
                        onChange={(event) => updateTile(tile.id, { accent: event.target.value })}
                        className="h-8 w-10 cursor-pointer rounded border border-line bg-white p-0.5"
                      />
                      <span className="text-[10px] text-muted">
                        Custom accent: <code className="text-brand-700">{tile.accent}</code>
                      </span>
                    </label>

                    <div>
                      <span className={subLabel}>
                        <span className="inline-flex items-center gap-1">
                          <UploadCloud size={11} /> Image (optional, replaces icon)
                        </span>
                      </span>
                      <input
                        value={tile.src ?? ""}
                        onChange={(event) => updateTile(tile.id, { src: event.target.value })}
                        placeholder="https://… direct image link (blank = use icon)"
                        className={fieldClass}
                      />
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-2.5 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700">
                          <ImagePlus size={12} />
                          {busyId === tile.id ? "Compressing…" : "Choose image"}
                          <input
                            ref={(node) => {
                              fileInputs.current[tile.id] = node;
                            }}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            className="sr-only"
                            disabled={busyId === tile.id}
                            onChange={(event) => uploadImage(tile.id, event.target.files?.[0])}
                          />
                        </label>
                        {tile.src && (
                          <button
                            type="button"
                            onClick={() => updateTile(tile.id, { src: undefined })}
                            className="text-[10px] font-medium text-brand-700 underline underline-offset-2"
                          >
                            {tile.src.startsWith("data:")
                              ? `Remove image (${dataUrlSizeLabel(tile.src)})`
                              : "Remove image"}
                          </button>
                        )}
                      </div>
                      <span className={hint}>
                        Uploaded images are compressed in the browser and saved to this browser
                        only. Max 15 MB.
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
            </>
          )}

          {activeTab === "subcategories" && (
            <section className="rounded-[10px] border border-line bg-white">
              <div className="border-b border-line px-4 py-3.5 sm:px-5">
                <h2 className="text-[13px] font-semibold text-ink">Subcategories</h2>
                <p className="text-[10px] text-muted">
                  Child shelves for each main category, shown on its category page.
                </p>
              </div>
              <div className="space-y-4 p-4 sm:p-5">
                <label className="block">
                  <span className={subLabel}>Main category</span>
                  <select
                    value={activeParent?.id ?? ""}
                    onChange={(event) => setSelectedParentId(event.target.value)}
                    className={fieldClass}
                  >
                    {parentOptions.map((tile) => (
                      <option key={tile.id} value={tile.id}>
                        {tile.name}
                      </option>
                    ))}
                  </select>
                </label>

                {!activeParent ? (
                  <p className="rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[11px] text-muted">
                    Add a main category in the Categories tab first.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-line bg-canvas/60 px-3 py-2.5">
                      <div>
                        <p className="text-[11px] font-semibold text-ink">
                          {activeParent.name}
                        </p>
                        <p className="text-[9px] text-muted">
                          {activeParent.subcategories.length} subcategor
                          {activeParent.subcategories.length === 1 ? "y" : "ies"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addSubcategory(activeParent)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-white px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        <Plus size={12} /> Add subcategory
                      </button>
                    </div>

                    {activeParent.subcategories.length === 0 ? (
                      <p className="rounded-[8px] border border-dashed border-line px-3 py-6 text-center text-[11px] text-muted">
                        No subcategories for this category yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {activeParent.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="rounded-[8px] border border-line bg-white p-3"
                          >
                            <div className="grid gap-2 sm:grid-cols-2">
                              <label className="block">
                                <span className={subLabel}>Name</span>
                                <input
                                  value={sub.name}
                                  onChange={(event) =>
                                    updateSubcategory(activeParent, sub.id, {
                                      name: event.target.value,
                                    })
                                  }
                                  placeholder="e.g. Poetry"
                                  className={fieldClass}
                                />
                              </label>
                              <label className="block">
                                <span className={subLabel}>Slug (auto from name)</span>
                                <input
                                  value={sub.slug}
                                  onChange={(event) =>
                                    updateSubcategory(activeParent, sub.id, {
                                      slug: slugify(event.target.value),
                                    })
                                  }
                                  placeholder="poetry"
                                  className={fieldClass}
                                />
                              </label>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <code className="text-[9px] text-muted">
                                books with subcategory = {sub.slug}
                              </code>
                              <button
                                type="button"
                                onClick={() => removeSubcategory(activeParent, sub.id)}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-700 hover:underline"
                              >
                                <Trash2 size={11} /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={hint}>
                      Link a book to a subcategory from Admin → Books → Subcategory.
                    </div>
                  </>
                )}
              </div>
            </section>
          )}

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
              <h2 className="text-[13px] font-semibold text-ink">Homepage preview</h2>
              <span className="ml-auto text-[9px] text-muted">Category showcase</span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                {draft.heading.eyebrow || "Eyebrow"}
              </p>
              <p className="mt-1 font-display text-base font-bold text-ink">
                {draft.heading.title || "Section title"}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {draft.tiles.slice(0, 8).map((tile) => (
                  <div
                    key={tile.id}
                    className="flex flex-col items-center gap-1.5 rounded-[8px] border border-line bg-white px-1 py-2.5 text-center"
                  >
                    <span
                      className="grid h-9 w-9 place-items-center overflow-hidden rounded-full"
                      style={{ backgroundColor: `${tile.accent}55` }}
                    >
                      {tile.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tile.src} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <CategoryIcon icon={tile.icon} size={16} className="text-brand-900" />
                      )}
                    </span>
                    <span className="block truncate text-[9px] font-medium text-ink">
                      {tile.name || "Shelf"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700">
                {draft.heading.linkLabel || "View all"} <ArrowRight size={11} />
              </p>
            </div>
          </section>

          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Categories page preview</h2>
              <span className="ml-auto text-[9px] text-muted">Card design</span>
            </div>
            <div className="brand-wash space-y-2 p-4 sm:p-5">
              {draft.tiles.slice(0, 3).map((tile) => (
                <div
                  key={tile.id}
                  className="relative overflow-hidden rounded-[8px] border border-line bg-white p-3"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="grid h-9 w-9 place-items-center overflow-hidden rounded-[4px] text-sm font-bold text-white"
                      style={{ backgroundColor: tile.accent }}
                    >
                      {tile.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tile.src} alt="" className="h-full w-full object-cover" />
                      ) : tile.audio ? (
                        <CategoryIcon icon={tile.icon} size={16} className="text-white" />
                      ) : (
                        tile.name.charAt(0)
                      )}
                    </span>
                    <ArrowRight size={13} className="text-muted/50" />
                  </div>
                  <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.1em] text-muted">
                    {tile.englishName || "—"}
                  </p>
                  <p className="text-[12px] font-bold text-ink">{tile.name || "Untitled"}</p>
                  <p className="mt-1 line-clamp-2 text-[9px] leading-relaxed text-muted">
                    {tile.description || "—"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Demo note:</span> tiles are stored in
              this browser (localStorage) only — no upload reaches a server. Book counts are
              calculated from the catalogue, so they always stay correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
