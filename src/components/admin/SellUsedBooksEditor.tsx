"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useSellContent } from "@/components/providers/SellContentProvider";
import { useSellRequests } from "@/components/providers/SellRequestsProvider";
import { sellRequestStatuses, type SellRequest } from "@/lib/sell-requests";
import { formatPrice } from "@/lib/utils";
import { SellIcon } from "@/components/ui/SellIcon";
import {
  cloneSellDefaults,
  sellIconKeys,
  type SellCalculatorContent,
  type SellCondition,
  type SellContent,
  type SellFaq,
  type SellIconKey,
  type SellPageContent,
  type SellStat,
  type SellStep,
  type SellTestimonial,
} from "@/lib/sell-content";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "banner" | "page" | "calculator" | "requests";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
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
              title="Remove"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {values.length === 0 && (
          <p className="text-[9px] text-muted">No items yet.</p>
        )}
      </div>
    </div>
  );
}

export function SellUsedBooksEditor({ label }: { label: string }) {
  const { content, save, reset } = useSellContent();
  const { requests, hydrated, update: updateRequest, remove: removeRequest } = useSellRequests();
  const [draft, setDraft] = useState<SellContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("banner");

  useEffect(() => setDraft(content), [content]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const setBanner = (key: keyof SellContent["banner"], value: string) => {
    setDraft((current) => ({
      ...current,
      banner: { ...current.banner, [key]: value },
    }));
    setNotice(null);
  };

  const setHero = (key: "eyebrow" | "title" | "description", value: string) => {
    setDraft((current) => ({
      ...current,
      page: { ...current.page, hero: { ...current.page.hero, [key]: value } },
    }));
    setNotice(null);
  };

  const setWhy = (
    key:
      | "eyebrow"
      | "title"
      | "description"
      | "ctaPrimary"
      | "ctaPrimaryHref"
      | "ctaSecondary"
      | "ctaSecondaryHref",
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      page: { ...current.page, why: { ...current.page.why, [key]: value } },
    }));
    setNotice(null);
  };

  const setPage = <K extends keyof SellPageContent>(
    key: K,
    value: SellPageContent[K],
  ) => {
    setDraft((current) => ({
      ...current,
      page: { ...current.page, [key]: value },
    }));
    setNotice(null);
  };

  const setCalculator = <K extends keyof SellCalculatorContent>(
    key: K,
    value: SellCalculatorContent[K],
  ) => {
    setDraft((current) => ({
      ...current,
      calculator: { ...current.calculator, [key]: value },
    }));
    setNotice(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneSellDefaults());
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
            Edit the homepage banner copy and the full /sell-used-books page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/sell-used-books"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
          >
            <Eye size={13} /> View page
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-[8px] border border-line bg-white p-1">
        {(
          [
            { key: "banner", label: "Banner" },
            { key: "page", label: "Page content" },
            { key: "calculator", label: "Calculator" },
            { key: "requests", label: "Sell requests", count: requests.length },
          ] as { key: Tab; label: string; count?: number }[]
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors",
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
          {tab === "banner" && (
            <Section title="Homepage banner" description="Copy shown in the sell-used-books banner on the homepage.">
              <label className="block">
                <span className={subLabel}>Eyebrow</span>
                <input
                  value={draft.banner.eyebrow}
                  onChange={(event) => setBanner("eyebrow", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Title</span>
                <input
                  value={draft.banner.title}
                  onChange={(event) => setBanner("title", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="block">
                <span className={subLabel}>Description</span>
                <textarea
                  value={draft.banner.description}
                  onChange={(event) => setBanner("description", event.target.value)}
                  rows={3}
                  className={`${fieldClass} resize-y`}
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Button label</span>
                  <input
                    value={draft.banner.linkLabel}
                    onChange={(event) => setBanner("linkLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Button link</span>
                  <input
                    value={draft.banner.linkHref}
                    onChange={(event) => setBanner("linkHref", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className={subLabel}>Secondary link label</span>
                  <input
                    value={draft.banner.secondaryLabel}
                    onChange={(event) => setBanner("secondaryLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Secondary link URL</span>
                  <input
                    value={draft.banner.secondaryHref}
                    onChange={(event) => setBanner("secondaryHref", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </div>
            </Section>
          )}

          {tab === "page" && (
            <>
              <Section title="Page header" description="Hero copy and badge chips at the top of the page.">
                <label className="block">
                  <span className={subLabel}>Eyebrow</span>
                  <input
                    value={draft.page.hero.eyebrow}
                    onChange={(event) => setHero("eyebrow", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input
                    value={draft.page.hero.title}
                    onChange={(event) => setHero("title", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Description</span>
                  <textarea
                    value={draft.page.hero.description}
                    onChange={(event) => setHero("description", event.target.value)}
                    rows={3}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
                <StringList
                  label="Badges"
                  values={draft.page.hero.badges}
                  onChange={(values) =>
                    setDraft((current) => ({
                      ...current,
                      page: {
                        ...current.page,
                        hero: { ...current.page.hero, badges: values },
                      },
                    }))
                  }
                />
              </Section>

              <Section title="Steps" description="The numbered how-it-works cards.">
                {draft.page.steps.map((step, index) => (
                  <div key={step.id} className="rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-ink">Step {index + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            "steps",
                            draft.page.steps.filter((item) => item.id !== step.id),
                          )
                        }
                        className="text-muted hover:text-brand-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                      <label className="block">
                        <span className={subLabel}>Icon</span>
                        <select
                          value={step.icon}
                          onChange={(event) =>
                            setPage(
                              "steps",
                              draft.page.steps.map((item) =>
                                item.id === step.id
                                  ? { ...item, icon: event.target.value as SellIconKey }
                                  : item,
                              ),
                            )
                          }
                          className={fieldClass}
                        >
                          {sellIconKeys.map((item) => (
                            <option key={item.key} value={item.key}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={subLabel}>Title</span>
                        <input
                          value={step.title}
                          onChange={(event) =>
                            setPage(
                              "steps",
                              draft.page.steps.map((item) =>
                                item.id === step.id ? { ...item, title: event.target.value } : item,
                              ),
                            )
                          }
                          className={fieldClass}
                        />
                      </label>
                    </div>
                    <label className="mt-2 block">
                      <span className={subLabel}>Text</span>
                      <input
                        value={step.text}
                        onChange={(event) =>
                          setPage(
                            "steps",
                            draft.page.steps.map((item) =>
                              item.id === step.id ? { ...item, text: event.target.value } : item,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage("steps", [
                      ...draft.page.steps,
                      {
                        id: `step-${Date.now()}`,
                        icon: "check",
                        title: "New step",
                        text: "",
                      } satisfies SellStep,
                    ])
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add step
                </button>
              </Section>

              <Section title="Why sell card" description="Dark feature card with stats and buttons.">
                <label className="block">
                  <span className={subLabel}>Eyebrow</span>
                  <input
                    value={draft.page.why.eyebrow}
                    onChange={(event) => setWhy("eyebrow", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input
                    value={draft.page.why.title}
                    onChange={(event) => setWhy("title", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Description</span>
                  <textarea
                    value={draft.page.why.description}
                    onChange={(event) => setWhy("description", event.target.value)}
                    rows={3}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Primary button label</span>
                    <input
                      value={draft.page.why.ctaPrimary}
                      onChange={(event) => setWhy("ctaPrimary", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Primary button link</span>
                    <input
                      value={draft.page.why.ctaPrimaryHref}
                      onChange={(event) => setWhy("ctaPrimaryHref", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Secondary button label</span>
                    <input
                      value={draft.page.why.ctaSecondary}
                      onChange={(event) => setWhy("ctaSecondary", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Secondary button link</span>
                    <input
                      value={draft.page.why.ctaSecondaryHref}
                      onChange={(event) => setWhy("ctaSecondaryHref", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-ink">Stats</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            why: {
                              ...current.page.why,
                              stats: [
                                ...current.page.why.stats,
                                { id: `stat-${Date.now()}`, value: "", label: "" } satisfies SellStat,
                              ],
                            },
                          },
                        }))
                      }
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline"
                    >
                      <Plus size={11} /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {draft.page.why.stats.map((stat) => (
                      <div key={stat.id} className="flex items-center gap-1.5">
                        <input
                          value={stat.value}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              page: {
                                ...current.page,
                                why: {
                                  ...current.page.why,
                                  stats: current.page.why.stats.map((item) =>
                                    item.id === stat.id
                                      ? { ...item, value: event.target.value }
                                      : item,
                                  ),
                                },
                              },
                            }))
                          }
                          className={`${fieldClass} w-24`}
                          placeholder="50%"
                        />
                        <input
                          value={stat.label}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              page: {
                                ...current.page,
                                why: {
                                  ...current.page.why,
                                  stats: current.page.why.stats.map((item) =>
                                    item.id === stat.id
                                      ? { ...item, label: event.target.value }
                                      : item,
                                  ),
                                },
                              },
                            }))
                          }
                          className={fieldClass}
                          placeholder="Label"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              page: {
                                ...current.page,
                                why: {
                                  ...current.page.why,
                                  stats: current.page.why.stats.filter(
                                    (item) => item.id !== stat.id,
                                  ),
                                },
                              },
                            }))
                          }
                          className="rounded-[4px] p-2 text-muted hover:text-brand-700"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="Accepted & not accepted">
                <StringList
                  label="What we accept"
                  values={draft.page.accepted}
                  onChange={(values) => setPage("accepted", values)}
                />
                <StringList
                  label="What we can't accept"
                  values={draft.page.notAccepted}
                  onChange={(values) => setPage("notAccepted", values)}
                />
                <StringList
                  label="Assurance strip"
                  values={draft.page.assurances}
                  onChange={(values) => setPage("assurances", values)}
                />
              </Section>

              <Section title="Testimonials">
                {draft.page.testimonials.map((item) => (
                  <div key={item.id} className="rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-ink">Testimonial</span>
                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            "testimonials",
                            draft.page.testimonials.filter((entry) => entry.id !== item.id),
                          )
                        }
                        className="text-muted hover:text-brand-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <label className="block">
                      <span className={subLabel}>Name</span>
                      <input
                        value={item.name}
                        onChange={(event) =>
                          setPage(
                            "testimonials",
                            draft.page.testimonials.map((entry) =>
                              entry.id === item.id ? { ...entry, name: event.target.value } : entry,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                    </label>
                    <label className="mt-2 block">
                      <span className={subLabel}>Quote</span>
                      <textarea
                        value={item.text}
                        onChange={(event) =>
                          setPage(
                            "testimonials",
                            draft.page.testimonials.map((entry) =>
                              entry.id === item.id ? { ...entry, text: event.target.value } : entry,
                            ),
                          )
                        }
                        rows={2}
                        className={`${fieldClass} resize-y`}
                      />
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage("testimonials", [
                      ...draft.page.testimonials,
                      {
                        id: `test-${Date.now()}`,
                        name: "Reader",
                        text: "",
                      } satisfies SellTestimonial,
                    ])
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add testimonial
                </button>
              </Section>

              <Section title="FAQ">
                {draft.page.faqs.map((faq) => (
                  <div key={faq.id} className="rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="truncate text-[11px] font-semibold text-ink">
                        {faq.question}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            "faqs",
                            draft.page.faqs.filter((entry) => entry.id !== faq.id),
                          )
                        }
                        className="text-muted hover:text-brand-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <label className="block">
                      <span className={subLabel}>Question</span>
                      <input
                        value={faq.question}
                        onChange={(event) =>
                          setPage(
                            "faqs",
                            draft.page.faqs.map((entry) =>
                              entry.id === faq.id ? { ...entry, question: event.target.value } : entry,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                    </label>
                    <label className="mt-2 block">
                      <span className={subLabel}>Answer</span>
                      <textarea
                        value={faq.answer}
                        onChange={(event) =>
                          setPage(
                            "faqs",
                            draft.page.faqs.map((entry) =>
                              entry.id === faq.id ? { ...entry, answer: event.target.value } : entry,
                            ),
                          )
                        }
                        rows={2}
                        className={`${fieldClass} resize-y`}
                      />
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage("faqs", [
                      ...draft.page.faqs,
                      { id: `faq-${Date.now()}`, question: "New question", answer: "" } satisfies SellFaq,
                    ])
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add FAQ
                </button>
              </Section>

              <Section title="Notes & bottom CTA">
                <label className="block">
                  <span className={subLabel}>Note heading</span>
                  <input
                    value={draft.page.noteHeading}
                    onChange={(event) => setPage("noteHeading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Policy link label</span>
                    <input
                      value={draft.page.policyLink.label}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            policyLink: {
                              ...current.page.policyLink,
                              label: event.target.value,
                            },
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Policy link URL</span>
                    <input
                      value={draft.page.policyLink.href}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            policyLink: {
                              ...current.page.policyLink,
                              href: event.target.value,
                            },
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={subLabel}>How selling works note</span>
                  <textarea
                    value={draft.page.sellingNote}
                    onChange={(event) => setPage("sellingNote", event.target.value)}
                    rows={3}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Bottom CTA text</span>
                  <input
                    value={draft.page.bottomCta.text}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        page: {
                          ...current.page,
                          bottomCta: { ...current.page.bottomCta, text: event.target.value },
                        },
                      }))
                    }
                    className={fieldClass}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Primary label</span>
                    <input
                      value={draft.page.bottomCta.primaryLabel}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            bottomCta: {
                              ...current.page.bottomCta,
                              primaryLabel: event.target.value,
                            },
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Primary link</span>
                    <input
                      value={draft.page.bottomCta.primaryHref}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            bottomCta: {
                              ...current.page.bottomCta,
                              primaryHref: event.target.value,
                            },
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Secondary label</span>
                    <input
                      value={draft.page.bottomCta.secondaryLabel}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            bottomCta: {
                              ...current.page.bottomCta,
                              secondaryLabel: event.target.value,
                            },
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Secondary link</span>
                    <input
                      value={draft.page.bottomCta.secondaryHref}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          page: {
                            ...current.page,
                            bottomCta: {
                              ...current.page.bottomCta,
                              secondaryHref: event.target.value,
                            },
                          },
                        }))
                      }
                      className={fieldClass}
                    />
                  </label>
                </div>
              </Section>
            </>
          )}

          {tab === "calculator" && (
            <>
              <Section title="Calculator intro">
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input
                    value={draft.calculator.heading}
                    onChange={(event) => setCalculator("heading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Subheading</span>
                  <input
                    value={draft.calculator.subheading}
                    onChange={(event) => setCalculator("subheading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </Section>

              <Section
                title="Book condition & commission"
                description="Each condition's label, rate (%) and note — shown in the calculator."
              >
                {draft.calculator.conditions.map((condition) => (
                  <div key={condition.id} className="rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-ink">
                        {condition.label || "Condition"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCalculator(
                            "conditions",
                            draft.calculator.conditions.filter(
                              (item) => item.id !== condition.id,
                            ),
                          )
                        }
                        className="text-muted hover:text-brand-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-[1fr_90px]">
                      <label className="block">
                        <span className={subLabel}>Label</span>
                        <input
                          value={condition.label}
                          onChange={(event) =>
                            setCalculator(
                              "conditions",
                              draft.calculator.conditions.map((item) =>
                                item.id === condition.id
                                  ? { ...item, label: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className={subLabel}>Rate %</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={condition.rate}
                          onChange={(event) =>
                            setCalculator(
                              "conditions",
                              draft.calculator.conditions.map((item) =>
                                item.id === condition.id
                                  ? { ...item, rate: Number(event.target.value) }
                                  : item,
                              ),
                            )
                          }
                          className={fieldClass}
                        />
                      </label>
                    </div>
                    <label className="mt-2 block">
                      <span className={subLabel}>Note</span>
                      <input
                        value={condition.note}
                        onChange={(event) =>
                          setCalculator(
                            "conditions",
                            draft.calculator.conditions.map((item) =>
                              item.id === condition.id
                                ? { ...item, note: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCalculator("conditions", [
                      ...draft.calculator.conditions,
                      {
                        id: `cond-${Date.now()}`,
                        label: "New condition",
                        rate: 40,
                        note: "",
                      } satisfies SellCondition,
                    ])
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add condition
                </button>
              </Section>

              <Section title="Calculator messages">
                <label className="block">
                  <span className={subLabel}>Eligibility cap (BDT)</span>
                  <input
                    type="number"
                    min={0}
                    value={draft.calculator.cap}
                    onChange={(event) =>
                      setCalculator("cap", Number(event.target.value))
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Eligibility note</span>
                  <input
                    value={draft.calculator.eligibilityNote}
                    onChange={(event) =>
                      setCalculator("eligibilityNote", event.target.value)
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Disclaimer</span>
                  <textarea
                    value={draft.calculator.disclaimer}
                    onChange={(event) =>
                      setCalculator("disclaimer", event.target.value)
                    }
                    rows={3}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Submit label</span>
                    <input
                      value={draft.calculator.submitLabel}
                      onChange={(event) =>
                        setCalculator("submitLabel", event.target.value)
                      }
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Success title</span>
                    <input
                      value={draft.calculator.successTitle}
                      onChange={(event) =>
                        setCalculator("successTitle", event.target.value)
                      }
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={subLabel}>Success text</span>
                  <textarea
                    value={draft.calculator.successText}
                    onChange={(event) =>
                      setCalculator("successText", event.target.value)
                    }
                    rows={2}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              </Section>
            </>
          )}

          {tab === "requests" && (
            <>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "Total requests", value: requests.length },
                  {
                    label: "New",
                    value: requests.filter((item) => item.status === "New").length,
                  },
                  {
                    label: "Completed",
                    value: requests.filter((item) => item.status === "Completed").length,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[8px] border border-line bg-white p-3"
                  >
                    <p className="text-[9px] text-muted">{stat.label}</p>
                    <p className="mt-1 font-display text-xl font-bold text-ink">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <section className="rounded-[10px] border border-line bg-white">
                <div className="border-b border-line px-4 py-3.5 sm:px-5">
                  <h2 className="text-[13px] font-semibold text-ink">Sell requests</h2>
                  <p className="text-[10px] text-muted">
                    Requests submitted from the calculator, including customer details.
                  </p>
                </div>
                <div className="overflow-x-auto p-2 sm:p-3">
                  <table className="w-full min-w-[820px] text-left">
                    <thead>
                      <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                        <th className="px-2 py-2 font-semibold">Customer</th>
                        <th className="px-2 py-2 font-semibold">Book / value</th>
                        <th className="px-2 py-2 font-semibold">Date</th>
                        <th className="px-2 py-2 font-semibold">Status</th>
                        <th className="px-2 py-2 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request: SellRequest) => (
                        <tr
                          key={request.id}
                          className="border-b border-line/70 last:border-0 align-top"
                        >
                          <td className="px-2 py-2.5">
                            <p className="text-[11px] font-semibold text-ink">
                              {request.name}
                            </p>
                            <p className="text-[9px] text-muted">{request.phone}</p>
                            {request.email && (
                              <p className="text-[9px] text-muted">{request.email}</p>
                            )}
                            <p className="mt-0.5 max-w-[200px] text-[9px] leading-relaxed text-muted">
                              {request.address}
                            </p>
                          </td>
                          <td className="px-2 py-2.5">
                            <p className="max-w-[180px] text-[10px] text-ink">
                              {request.bookTitle}
                            </p>
                            <p className="text-[9px] text-muted">
                              {request.condition} · {request.rate}%
                            </p>
                            <p className="text-[10px] font-semibold text-brand-700">
                              {formatPrice(request.amount)}
                            </p>
                            <p className="text-[9px] text-muted">
                              Paid {formatPrice(request.purchasePrice)}
                            </p>
                          </td>
                          <td className="px-2 py-2.5 text-[9px] text-muted">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2.5">
                            <select
                              value={request.status}
                              onChange={(event) =>
                                updateRequest(request.id, {
                                  status: event.target.value as SellRequest["status"],
                                })
                              }
                              className="rounded-[4px] border border-line bg-white px-2 py-1.5 text-[10px] text-ink"
                            >
                              {sellRequestStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => removeRequest(request.id)}
                              title="Delete request"
                              className="rounded-[4px] p-1.5 text-muted hover:text-brand-700"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-2 py-8 text-center text-[11px] text-muted">
                            {hydrated
                              ? "No sell requests yet. They appear here when customers submit the calculator form."
                              : "Loading requests…"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
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
              <p
                className={cn(
                  "text-[10px] leading-relaxed",
                  notice.error ? "text-ink" : "text-brand-800",
                )}
              >
                {notice.text}
              </p>
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
              <span className="ml-auto text-[9px] text-muted">
                {tab === "banner"
                  ? "Homepage banner"
                  : tab === "calculator"
                    ? "Commission"
                    : tab === "requests"
                      ? "Latest request"
                      : "Page"}
              </span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              {tab === "requests" ? (
                requests.length > 0 ? (
                  <div className="space-y-1.5">
                    {requests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className="rounded-[6px] border border-line bg-white p-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold text-ink">
                            {request.name}
                          </span>
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[8px] font-semibold text-brand-700">
                            {request.status}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[9px] text-muted">
                          {request.bookTitle} · {formatPrice(request.amount)}
                        </p>
                        <p className="text-[9px] text-muted">{request.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted">No requests yet.</p>
                )
              ) : tab === "calculator" ? (
                <div className="space-y-2">
                  <p className="font-display text-sm font-bold text-ink">
                    {draft.calculator.heading}
                  </p>
                  <p className="text-[10px] text-muted">{draft.calculator.subheading}</p>
                  {draft.calculator.conditions.map((condition) => (
                    <div
                      key={condition.id}
                      className="flex items-center justify-between rounded-[6px] border border-line bg-white px-3 py-2"
                    >
                      <span className="text-[10px] font-semibold text-ink">
                        {condition.label}
                      </span>
                      <span className="text-[11px] font-bold text-brand-700">
                        {condition.rate}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : tab === "banner" ? (
                <div className="rounded-[8px] bg-brand-900 p-5 text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-200">
                    {draft.banner.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold">
                    {draft.banner.title}
                  </h3>
                  <p className="mt-2 text-[10px] leading-relaxed text-white/70">
                    {draft.banner.description}
                  </p>
                  <span className="mt-3 inline-flex rounded-full bg-sale px-3 py-1.5 text-[10px] font-semibold text-ink">
                    {draft.banner.linkLabel}
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                    {draft.page.hero.eyebrow}
                  </p>
                  <h3 className="font-display text-base font-bold text-ink">
                    {draft.page.hero.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-muted">
                    {draft.page.hero.description}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {draft.page.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-1.5 rounded-[6px] border border-line bg-white p-2"
                      >
                        <SellIcon icon={step.icon} size={14} className="text-forest-600" />
                        <span className="truncate text-[9px] font-semibold text-ink">
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="pt-1 text-[9px] text-muted">
                    {draft.page.faqs.length} FAQs · {draft.page.testimonials.length} testimonials
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
