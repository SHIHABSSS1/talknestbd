"use client";

import Link from "next/link";
import { useEffect, useState, useTransition, type ReactNode } from "react";
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
import {
  useWholesaleContent,
  useWholesaleRequests,
} from "@/components/providers/WholesaleProviders";
import { WholesaleIcon } from "@/components/ui/WholesaleIcon";
import {
  cloneWholesaleDefaults,
  wholesaleIconKeys,
  type WholesaleBenefit,
  type WholesaleContent,
  type WholesaleFaq,
  type WholesaleIconKey,
  type WholesaleTier,
} from "@/lib/wholesale-content";
import {
  wholesaleRequestStatuses,
  type WholesaleRequest,
} from "@/lib/wholesale-requests";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "home" | "page" | "freeOrder" | "requests";

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
        {values.length === 0 && <p className="text-[9px] text-muted">No items yet.</p>}
      </div>
    </div>
  );
}

export function WholesaleEditor({ label }: { label: string }) {
  const { content, save, reset } = useWholesaleContent();
  const { requests, hydrated, update, remove } = useWholesaleRequests();
  const [draft, setDraft] = useState<WholesaleContent>(content);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("home");
  const [pending, startTransition] = useTransition();

  useEffect(() => setDraft(content), [content]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const setHome = <K extends keyof WholesaleContent["home"]>(
    key: K,
    value: WholesaleContent["home"][K],
  ) => {
    setDraft((current) => ({ ...current, home: { ...current.home, [key]: value } }));
    setNotice(null);
  };

  const setHomeCard = (card: "wholesale" | "freeOrder", key: string, value: string | string[]) => {
    setDraft((current) => ({
      ...current,
      home: {
        ...current.home,
        [card]: { ...current.home[card], [key]: value },
      },
    }));
    setNotice(null);
  };

  const setPage = <K extends keyof WholesaleContent["page"]>(
    key: K,
    value: WholesaleContent["page"][K],
  ) => {
    setDraft((current) => ({ ...current, page: { ...current.page, [key]: value } }));
    setNotice(null);
  };

  const setNested = (
    parent: "priceList" | "whatsapp" | "bottomCta",
    key: string,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      page: {
        ...current.page,
        [parent]: { ...current.page[parent], [key]: value },
      },
    }));
    setNotice(null);
  };

  const setFreeOrder = <K extends keyof WholesaleContent["freeOrderPage"]>(
    key: K,
    value: WholesaleContent["freeOrderPage"][K],
  ) => {
    setDraft((current) => ({
      ...current,
      freeOrderPage: { ...current.freeOrderPage, [key]: value },
    }));
    setNotice(null);
  };

  const handleSave = () => {
    setNotice(null);
    startTransition(async () => {
      try {
        const result = await save(draft);
        setNotice({ text: result.message, error: !result.ok });
      } catch (error) {
        setNotice({
          error: true,
          text: error instanceof Error ? error.message : "Could not save the content.",
        });
      }
    });
  };

  const handleReset = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await reset();
      if (result.ok) setDraft(cloneWholesaleDefaults());
      setNotice({ text: result.message, error: !result.ok });
    });
  };

  const handleStatus = (id: string, status: WholesaleRequest["status"]) => {
    startTransition(async () => {
      const result = await update(id, { status });
      setNotice({ text: result.message, error: !result.ok });
    });
  };

  const handleRemove = (id: string) => {
    startTransition(async () => {
      const result = await remove(id);
      setNotice({ text: result.message, error: !result.ok });
    });
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
            Edit the homepage wholesale section, the /wholesale page, and review quote requests.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/wholesale"
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
            { key: "home", label: "Homepage" },
            { key: "page", label: "Page content" },
            { key: "freeOrder", label: "Free order page" },
            { key: "requests", label: "Requests", count: requests.length },
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
          {tab === "home" && (
            <>
              <Section title="Section heading">
                <label className="block">
                  <span className={subLabel}>Eyebrow</span>
                  <input
                    value={draft.home.eyebrow}
                    onChange={(event) => setHome("eyebrow", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input
                    value={draft.home.title}
                    onChange={(event) => setHome("title", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Description</span>
                  <textarea
                    value={draft.home.description}
                    onChange={(event) => setHome("description", event.target.value)}
                    rows={2}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              </Section>

              <Section title="Wholesale card">
                <label className="block">
                  <span className={subLabel}>Badge</span>
                  <input
                    value={draft.home.wholesale.badge}
                    onChange={(event) => setHomeCard("wholesale", "badge", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input
                    value={draft.home.wholesale.heading}
                    onChange={(event) => setHomeCard("wholesale", "heading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Text</span>
                  <textarea
                    value={draft.home.wholesale.text}
                    onChange={(event) => setHomeCard("wholesale", "text", event.target.value)}
                    rows={2}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
                <StringList
                  label="Benefit pills"
                  values={draft.home.wholesale.benefits}
                  onChange={(values) => setHomeCard("wholesale", "benefits", values)}
                />
              </Section>

              <Section title="Free delivery card">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Badge</span>
                    <input
                      value={draft.home.freeOrder.badge}
                      onChange={(event) => setHomeCard("freeOrder", "badge", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Label</span>
                    <input
                      value={draft.home.freeOrder.label}
                      onChange={(event) => setHomeCard("freeOrder", "label", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input
                    value={draft.home.freeOrder.heading}
                    onChange={(event) => setHomeCard("freeOrder", "heading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Text</span>
                  <input
                    value={draft.home.freeOrder.text}
                    onChange={(event) => setHomeCard("freeOrder", "text", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </Section>
            </>
          )}

          {tab === "page" && (
            <>
              <Section title="Page header">
                <label className="block">
                  <span className={subLabel}>Eyebrow</span>
                  <input
                    value={draft.page.hero.eyebrow}
                    onChange={(event) =>
                      setPage("hero", { ...draft.page.hero, eyebrow: event.target.value })
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Title</span>
                  <input
                    value={draft.page.hero.title}
                    onChange={(event) =>
                      setPage("hero", { ...draft.page.hero, title: event.target.value })
                    }
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Description</span>
                  <textarea
                    value={draft.page.hero.description}
                    onChange={(event) =>
                      setPage("hero", { ...draft.page.hero, description: event.target.value })
                    }
                    rows={3}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
                <StringList
                  label="Badges"
                  values={draft.page.hero.badges}
                  onChange={(values) => setPage("hero", { ...draft.page.hero, badges: values })}
                />
              </Section>

              <Section title="Price list">
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input
                    value={draft.page.priceList.heading}
                    onChange={(event) => setNested("priceList", "heading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Note</span>
                  <input
                    value={draft.page.priceList.note}
                    onChange={(event) => setNested("priceList", "note", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Footer</span>
                    <input
                      value={draft.page.priceList.footer}
                      onChange={(event) => setNested("priceList", "footer", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Terms link label</span>
                    <input
                      value={draft.page.priceList.termsLabel}
                      onChange={(event) => setNested("priceList", "termsLabel", event.target.value)}
                      className={fieldClass}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-ink">Tiers</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPage("tiers", [
                          ...draft.page.tiers,
                          {
                            id: `tier-${Date.now()}`,
                            name: "New tier",
                            quantity: "",
                            commission: "",
                            delivery: "",
                            highlight: false,
                          } satisfies WholesaleTier,
                        ])
                      }
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline"
                    >
                      <Plus size={11} /> Add
                    </button>
                  </div>
                  {draft.page.tiers.map((tier) => (
                    <div key={tier.id} className="rounded-[8px] border border-line p-2">
                      <div className="grid gap-2 sm:grid-cols-4">
                        {(["name", "quantity", "commission", "delivery"] as const).map(
                          (key) => (
                            <input
                              key={key}
                              value={tier[key]}
                              onChange={(event) =>
                                setPage(
                                  "tiers",
                                  draft.page.tiers.map((item) =>
                                    item.id === tier.id
                                      ? { ...item, [key]: event.target.value }
                                      : item,
                                  ),
                                )
                              }
                              placeholder={key}
                              className={fieldClass}
                            />
                          ),
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <label className="flex items-center gap-1.5 text-[10px] text-ink">
                          <input
                            type="checkbox"
                            checked={tier.highlight}
                            onChange={(event) =>
                              setPage(
                                "tiers",
                                draft.page.tiers.map((item) =>
                                  item.id === tier.id
                                    ? { ...item, highlight: event.target.checked }
                                    : item,
                                ),
                              )
                            }
                            className="h-3.5 w-3.5 accent-brand-600"
                          />
                          Highlight (Popular)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setPage(
                              "tiers",
                              draft.page.tiers.filter((item) => item.id !== tier.id),
                            )
                          }
                          className="text-muted hover:text-brand-700"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Benefits">
                {draft.page.benefits.map((benefit) => (
                  <div key={benefit.id} className="rounded-[8px] border border-line p-2">
                    <div className="grid gap-2 sm:grid-cols-[130px_1fr]">
                      <select
                        value={benefit.icon}
                        onChange={(event) =>
                          setPage(
                            "benefits",
                            draft.page.benefits.map((item) =>
                              item.id === benefit.id
                                ? {
                                    ...item,
                                    icon: event.target.value as WholesaleIconKey,
                                  }
                                : item,
                            ),
                          )
                        }
                        className={fieldClass}
                      >
                        {wholesaleIconKeys.map((item) => (
                          <option key={item.key} value={item.key}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <input
                        value={benefit.title}
                        onChange={(event) =>
                          setPage(
                            "benefits",
                            draft.page.benefits.map((item) =>
                              item.id === benefit.id
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        value={benefit.text}
                        onChange={(event) =>
                          setPage(
                            "benefits",
                            draft.page.benefits.map((item) =>
                              item.id === benefit.id
                                ? { ...item, text: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            "benefits",
                            draft.page.benefits.filter((item) => item.id !== benefit.id),
                          )
                        }
                        className="rounded-[4px] p-2 text-muted hover:text-brand-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage("benefits", [
                      ...draft.page.benefits,
                      {
                        id: `benefit-${Date.now()}`,
                        icon: "percent",
                        title: "New benefit",
                        text: "",
                      } satisfies WholesaleBenefit,
                    ])
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add benefit
                </button>
              </Section>

              <Section title="Lists & labels">
                <label className="block">
                  <span className={subLabel}>Popular picks heading</span>
                  <input
                    value={draft.page.popularHeading}
                    onChange={(event) => setPage("popularHeading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Catalogue button label</span>
                  <input
                    value={draft.page.catalogueLabel}
                    onChange={(event) => setPage("catalogueLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Who can order heading</span>
                  <input
                    value={draft.page.whoHeading}
                    onChange={(event) => setPage("whoHeading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <StringList
                  label="Who can order"
                  values={draft.page.who}
                  onChange={(values) => setPage("who", values)}
                />
              </Section>

              <Section title="FAQ">
                <label className="block">
                  <span className={subLabel}>FAQ heading</span>
                  <input
                    value={draft.page.faqHeading}
                    onChange={(event) => setPage("faqHeading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                {draft.page.faqs.map((faq) => (
                  <div key={faq.id} className="rounded-[8px] border border-line p-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        value={faq.question}
                        onChange={(event) =>
                          setPage(
                            "faqs",
                            draft.page.faqs.map((item) =>
                              item.id === faq.id
                                ? { ...item, question: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className={fieldClass}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPage(
                            "faqs",
                            draft.page.faqs.filter((item) => item.id !== faq.id),
                          )
                        }
                        className="rounded-[4px] p-2 text-muted hover:text-brand-700"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <textarea
                      value={faq.answer}
                      onChange={(event) =>
                        setPage(
                          "faqs",
                          draft.page.faqs.map((item) =>
                            item.id === faq.id ? { ...item, answer: event.target.value } : item,
                          ),
                        )
                      }
                      rows={2}
                      className={`${fieldClass} mt-2 resize-y`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPage("faqs", [
                      ...draft.page.faqs,
                      { id: `faq-${Date.now()}`, question: "New question", answer: "" } satisfies WholesaleFaq,
                    ])
                  }
                  className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100"
                >
                  <Plus size={12} /> Add FAQ
                </button>
              </Section>

              <Section title="WhatsApp & bottom CTA">
                <label className="block">
                  <span className={subLabel}>WhatsApp heading</span>
                  <input
                    value={draft.page.whatsapp.heading}
                    onChange={(event) => setNested("whatsapp", "heading", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>WhatsApp text</span>
                  <input
                    value={draft.page.whatsapp.text}
                    onChange={(event) => setNested("whatsapp", "text", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>WhatsApp link label</span>
                  <input
                    value={draft.page.whatsapp.linkLabel}
                    onChange={(event) => setNested("whatsapp", "linkLabel", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Bottom CTA text</span>
                  <input
                    value={draft.page.bottomCta.text}
                    onChange={(event) => setNested("bottomCta", "text", event.target.value)}
                    className={fieldClass}
                  />
                </label>
                <label className="block">
                  <span className={subLabel}>Bottom CTA button</span>
                  <input
                    value={draft.page.bottomCta.label}
                    onChange={(event) => setNested("bottomCta", "label", event.target.value)}
                    className={fieldClass}
                  />
                </label>
              </Section>
            </>
          )}

          {tab === "freeOrder" && (
            <>
              <Section title="Page header">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>Eyebrow</span>
                    <input value={draft.freeOrderPage.hero.eyebrow} onChange={(e) => setFreeOrder("hero", { ...draft.freeOrderPage.hero, eyebrow: e.target.value })} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Title</span>
                    <input value={draft.freeOrderPage.hero.title} onChange={(e) => setFreeOrder("hero", { ...draft.freeOrderPage.hero, title: e.target.value })} className={fieldClass} />
                  </label>
                </div>
                <label className="mt-3 block">
                  <span className={subLabel}>Description</span>
                  <textarea value={draft.freeOrderPage.hero.description} onChange={(e) => setFreeOrder("hero", { ...draft.freeOrderPage.hero, description: e.target.value })} rows={3} className={fieldClass} />
                </label>
                <div className="mt-3">
                  <StringList label="Header badges" values={draft.freeOrderPage.hero.badges} onChange={(values) => setFreeOrder("hero", { ...draft.freeOrderPage.hero, badges: values })} />
                </div>
              </Section>

              <Section title="Intro">
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input value={draft.freeOrderPage.intro.heading} onChange={(e) => setFreeOrder("intro", { ...draft.freeOrderPage.intro, heading: e.target.value })} className={fieldClass} />
                </label>
                <label className="mt-3 block">
                  <span className={subLabel}>Text</span>
                  <textarea value={draft.freeOrderPage.intro.text} onChange={(e) => setFreeOrder("intro", { ...draft.freeOrderPage.intro, text: e.target.value })} rows={3} className={fieldClass} />
                </label>
                <label className="mt-3 block">
                  <span className={subLabel}>Delivery note</span>
                  <input value={draft.freeOrderPage.intro.note} onChange={(e) => setFreeOrder("intro", { ...draft.freeOrderPage.intro, note: e.target.value })} className={fieldClass} />
                </label>
              </Section>

              <Section title="How it works">
                {draft.freeOrderPage.steps.map((step, index) => (
                  <div key={step.id} className="mb-3 rounded-[8px] border border-line p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-muted">Step {index + 1}</span>
                      <button type="button" onClick={() => setFreeOrder("steps", draft.freeOrderPage.steps.filter((_, i) => i !== index))} className="text-[10px] text-brand-700 hover:underline">Remove</button>
                    </div>
                    <input value={step.title} onChange={(e) => setFreeOrder("steps", draft.freeOrderPage.steps.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} placeholder="Title" className={fieldClass} />
                    <input value={step.text} onChange={(e) => setFreeOrder("steps", draft.freeOrderPage.steps.map((item, i) => i === index ? { ...item, text: e.target.value } : item))} placeholder="Text" className={`${fieldClass} mt-2`} />
                  </div>
                ))}
                <button type="button" onClick={() => setFreeOrder("steps", [...draft.freeOrderPage.steps, { id: `fo-step-${Date.now()}`, title: "New step", text: "" }])} className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-brand-200 bg-brand-50 px-2.5 text-[10px] font-semibold text-brand-700 hover:bg-brand-100">
                  <Plus size={12} /> Add step
                </button>
              </Section>

              <Section title="Delivery charges">
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input value={draft.freeOrderPage.charges.heading} onChange={(e) => setFreeOrder("charges", { ...draft.freeOrderPage.charges, heading: e.target.value })} className={fieldClass} />
                </label>
                <label className="mt-3 block">
                  <span className={subLabel}>Description</span>
                  <input value={draft.freeOrderPage.charges.description} onChange={(e) => setFreeOrder("charges", { ...draft.freeOrderPage.charges, description: e.target.value })} className={fieldClass} />
                </label>
                <div className="mt-3">
                  <StringList
                    label="Zones (label = charge)"
                    values={draft.freeOrderPage.charges.zones.map((zone) => `${zone.label} = ${zone.charge}`)}
                    onChange={(values) => setFreeOrder("charges", {
                      ...draft.freeOrderPage.charges,
                      zones: values.map((value, i) => {
                        const [label, charge] = value.split("=").map((part) => part?.trim() ?? "");
                        return { id: draft.freeOrderPage.charges.zones[i]?.id ?? `zone-${i}-${Date.now()}`, label, charge };
                      }),
                    })}
                  />
                </div>
              </Section>

              <Section title="Good to know & CTA">
                <label className="block">
                  <span className={subLabel}>Heading</span>
                  <input value={draft.freeOrderPage.goodToKnow.heading} onChange={(e) => setFreeOrder("goodToKnow", { ...draft.freeOrderPage.goodToKnow, heading: e.target.value })} className={fieldClass} />
                </label>
                <div className="mt-3">
                  <StringList label="Notes" values={draft.freeOrderPage.goodToKnow.items} onChange={(items) => setFreeOrder("goodToKnow", { ...draft.freeOrderPage.goodToKnow, items })} />
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className={subLabel}>CTA heading</span>
                    <input value={draft.freeOrderPage.cta.heading} onChange={(e) => setFreeOrder("cta", { ...draft.freeOrderPage.cta, heading: e.target.value })} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={subLabel}>CTA text</span>
                    <input value={draft.freeOrderPage.cta.text} onChange={(e) => setFreeOrder("cta", { ...draft.freeOrderPage.cta, text: e.target.value })} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Primary label</span>
                    <input value={draft.freeOrderPage.cta.primaryLabel} onChange={(e) => setFreeOrder("cta", { ...draft.freeOrderPage.cta, primaryLabel: e.target.value })} className={fieldClass} />
                  </label>
                  <label className="block">
                    <span className={subLabel}>Secondary label</span>
                    <input value={draft.freeOrderPage.cta.secondaryLabel} onChange={(e) => setFreeOrder("cta", { ...draft.freeOrderPage.cta, secondaryLabel: e.target.value })} className={fieldClass} />
                  </label>
                </div>
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
                  <div key={stat.label} className="rounded-[8px] border border-line bg-white p-3">
                    <p className="text-[9px] text-muted">{stat.label}</p>
                    <p className="mt-1 font-display text-xl font-bold text-ink">{stat.value}</p>
                  </div>
                ))}
              </div>

              <section className="rounded-[10px] border border-line bg-white">
                <div className="border-b border-line px-4 py-3.5 sm:px-5">
                  <h2 className="text-[13px] font-semibold text-ink">Wholesale requests</h2>
                  <p className="text-[10px] text-muted">
                    Quote requests submitted from /wholesale.
                  </p>
                </div>
                <div className="overflow-x-auto p-2 sm:p-3">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-line text-[9px] uppercase tracking-wide text-muted">
                        <th className="px-2 py-2 font-semibold">Organisation</th>
                        <th className="px-2 py-2 font-semibold">Contact</th>
                        <th className="px-2 py-2 font-semibold">Quantity</th>
                        <th className="px-2 py-2 font-semibold">Date</th>
                        <th className="px-2 py-2 font-semibold">Status</th>
                        <th className="px-2 py-2 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-line/70 last:border-0 align-top"
                        >
                          <td className="px-2 py-2.5">
                            <p className="text-[11px] font-semibold text-ink">
                              {request.organization}
                            </p>
                            <p className="max-w-[180px] text-[9px] leading-relaxed text-muted">
                              {request.message}
                            </p>
                          </td>
                          <td className="px-2 py-2.5">
                            <p className="text-[10px] text-ink">{request.contact}</p>
                            <p className="text-[9px] text-muted">{request.phone}</p>
                            <p className="text-[9px] text-muted">{request.email}</p>
                            <p className="text-[9px] text-muted">{request.city}</p>
                          </td>
                          <td className="px-2 py-2.5 text-[10px] text-ink">{request.quantity}</td>
                          <td className="px-2 py-2.5 text-[9px] text-muted">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2.5">
                            <select
                              value={request.status}
                              onChange={(event) =>
                                handleStatus(
                                  request.id,
                                  event.target.value as WholesaleRequest["status"],
                                )
                              }
                              className="rounded-[4px] border border-line bg-white px-2 py-1.5 text-[10px] text-ink"
                            >
                              {wholesaleRequestStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-2 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemove(request.id)}
                              className="rounded-[4px] p-1.5 text-muted hover:text-brand-700"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {requests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-2 py-8 text-center text-[11px] text-muted">
                            {hydrated
                              ? "No wholesale requests yet."
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
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          {tab !== "requests" && (
            <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={pending}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                <Save size={13} /> {pending ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={pending}
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300 disabled:opacity-50"
              >
                <RotateCcw size={13} /> Restore default
              </button>
              {dirty && (
                <span className="ml-auto text-[10px] font-semibold text-gold-600">
                  Unsaved changes
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <Eye size={14} className="text-brand-700" />
              <h2 className="text-[13px] font-semibold text-ink">Live preview</h2>
              <span className="ml-auto text-[9px] text-muted">
                {tab === "home" ? "Homepage" : tab === "requests" ? "Latest request" : "Page"}
              </span>
            </div>
            <div className="brand-wash p-4 sm:p-5">
              {tab === "requests" ? (
                requests.length > 0 ? (
                  <div className="space-y-2">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="rounded-[6px] border border-line bg-white p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold text-ink">
                            {request.organization}
                          </span>
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[8px] font-semibold text-brand-700">
                            {request.status}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[9px] text-muted">
                          {request.contact} · {request.phone}
                        </p>
                        <p className="text-[9px] text-muted">{request.quantity}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted">No requests yet.</p>
                )
              ) : tab === "home" ? (
                <div className="space-y-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                    {draft.home.eyebrow}
                  </p>
                  <h3 className="font-display text-base font-bold text-ink">
                    {draft.home.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-muted">
                    {draft.home.description}
                  </p>
                  <div className="rounded-[8px] bg-brand-900 p-3 text-white">
                    <span className="rounded-full bg-sale px-2 py-0.5 text-[8px] font-bold text-ink">
                      {draft.home.wholesale.badge}
                    </span>
                    <p className="mt-2 text-[11px] font-bold">{draft.home.wholesale.heading}</p>
                    <p className="mt-1 text-[9px] text-white/70">{draft.home.wholesale.text}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {draft.home.wholesale.benefits.map((item, index) => (
                        <span key={index} className="rounded-full bg-white/10 px-2 py-0.5 text-[8px]">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[8px] border border-line bg-white p-3">
                    <p className="text-[10px] font-semibold text-ink">
                      {draft.home.freeOrder.heading}
                    </p>
                    <p className="text-[9px] text-muted">{draft.home.freeOrder.text}</p>
                  </div>
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
                  <div className="space-y-1.5 pt-1">
                    {draft.page.benefits.map((benefit) => (
                      <div key={benefit.id} className="flex items-center gap-2 rounded-[6px] border border-line bg-white p-2">
                        <WholesaleIcon icon={benefit.icon} size={13} className="text-brand-700" />
                        <span className="text-[9px] font-semibold text-ink">{benefit.title}</span>
                      </div>
                    ))}
                  </div>
                  <p className="pt-1 text-[9px] text-muted">
                    {draft.page.tiers.length} tiers · {draft.page.faqs.length} FAQs
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
