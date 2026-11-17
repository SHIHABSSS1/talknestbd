"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import type { SectionContent } from "@/lib/section-content";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";

export function SectionEditor({
  slug,
  label,
  defaults,
}: {
  slug: string;
  label: string;
  defaults: SectionContent;
}) {
  const [form, setForm] = useState<SectionContent>(defaults);
  const [notice, setNotice] = useState("");

  const dirty = (Object.keys(defaults) as (keyof SectionContent)[]).some(
    (key) => form[key] !== defaults[key],
  );

  const update = (key: keyof SectionContent, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const save = () => {
    setNotice(
      "Design preview only — saving will be connected to your database later.",
    );
  };

  const reset = () => {
    setForm(defaults);
    setNotice("Form reset to the original copy.");
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
            Edit the title and description for this homepage section.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
        >
          <ArrowLeft size={13} /> Back to dashboard
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Form */}
        <section className="rounded-[10px] border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-5">
            <div>
              <h2 className="text-[13px] font-semibold text-ink">Section content</h2>
              <p className="text-[10px] text-muted">Fields shown on the storefront</p>
            </div>
            {dirty && (
              <span className="rounded-full bg-gold-500/10 px-2.5 py-1 text-[9px] font-semibold text-gold-600">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-ink">
                Eyebrow
                <span className="font-normal text-muted">{form.eyebrow.length} chars</span>
              </span>
              <input
                value={form.eyebrow}
                onChange={(event) => update("eyebrow", event.target.value)}
                placeholder="e.g. Best Sellers"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-ink">
                Title
                <span className="font-normal text-muted">{form.title.length} chars</span>
              </span>
              <input
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="Section heading"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-ink">
                Description
                <span className="font-normal text-muted">{form.description.length} chars</span>
              </span>
              <textarea
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Supporting copy for this section"
                rows={4}
                className={`${fieldClass} resize-y leading-relaxed`}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-ink">Link label</span>
              <input
                value={form.linkLabel}
                onChange={(event) => update("linkLabel", event.target.value)}
                placeholder="e.g. View all"
                className={fieldClass}
              />
              <span className="mt-1 block text-[9px] text-muted">
                Route: <code className="text-brand-700">/admin/sections/{slug}</code>
              </span>
            </label>

            {notice && (
              <div className="flex items-start gap-2 rounded-[8px] border border-brand-100 bg-brand-50 px-3 py-2.5">
                <Check size={13} className="mt-0.5 shrink-0 text-brand-700" />
                <p className="text-[10px] leading-relaxed text-brand-800">{notice}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={save}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <Save size={13} /> Save changes
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        </section>

        {/* Live preview */}
        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">Updates as you type</span>
            </div>
            <div className="brand-wash p-4 sm:p-6">
              <div className="rounded-[10px] border border-line bg-white p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                  <Sparkles size={10} /> {form.eyebrow || "Eyebrow"}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug text-ink">
                  {form.title || "Section title"}
                </h3>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  {form.description || "Section description"}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700">
                  {form.linkLabel || "Link label"} <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </section>

          <div className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="text-[10px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Design preview:</span> this editor is
              UI-only. Saving, validation and database wiring will be added later — nothing
              is stored anywhere yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
