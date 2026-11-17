"use client";

import { useState } from "react";
import { Bell, Check, Globe2, Mail, Save, Share2, ShoppingBag } from "lucide-react";
import { siteConfig } from "@/lib/utils";

const inputClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const labelClass = "mb-1.5 block text-[11px] font-semibold text-ink";

function SectionCard({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: typeof Globe2;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[10px] border border-line bg-white">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:px-5">
        <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-brand-50 text-brand-700">
          <Icon size={15} />
        </span>
        <div>
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          <p className="text-[10px] text-muted">{hint}</p>
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function SiteSettings() {
  const [form, setForm] = useState({
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    initials: "TN",
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    address: siteConfig.address,
    facebook: siteConfig.facebook,
    telegram: siteConfig.telegram,
    youtube: siteConfig.youtube,
    freeDeliveryThreshold: String(siteConfig.freeDeliveryThreshold),
    sellUsedBookRate: String(siteConfig.sellUsedBookRate),
  });
  const [toggles, setToggles] = useState({
    cod: true,
    bkash: true,
    nagad: true,
    express: true,
    wholesale: true,
    reviews: false,
  });
  const [notice, setNotice] = useState("");

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setNotice("");
  };
  const toggle = (key: keyof typeof toggles) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
    setNotice("");
  };

  const toggleLabels: { key: keyof typeof toggles; label: string; hint: string }[] = [
    { key: "cod", label: "Cash on delivery", hint: "Accept payment at the doorstep" },
    { key: "bkash", label: "bKash", hint: "Show bKash at checkout" },
    { key: "nagad", label: "Nagad", hint: "Show Nagad at checkout" },
    { key: "express", label: "Express delivery", hint: "Faster shipping option" },
    { key: "wholesale", label: "Wholesale orders", hint: "Bulk ordering for organisations" },
    { key: "reviews", label: "Auto-publish reviews", hint: "Skip manual moderation" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span>Dashboard</span><span>/</span><span className="font-semibold text-ink">Site settings</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Site settings</h1>
        <p className="mt-1 text-[12px] text-muted">Manage storefront identity, contact details and commerce options.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setNotice("Design preview only — settings are not saved anywhere.");
        }}
        className="space-y-4"
      >
        <SectionCard icon={Globe2} title="Site identity" hint="Shown across the storefront and emails">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Site name</span>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Logo initials</span>
              <input value={form.initials} onChange={(e) => set("initials", e.target.value)} maxLength={3} className={inputClass} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={labelClass}>Tagline</span>
            <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
          </label>
          <label className="mt-4 block">
            <span className={labelClass}>Description</span>
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${inputClass} resize-y`} />
          </label>
        </SectionCard>

        <SectionCard icon={Mail} title="Contact details" hint="How readers reach your team">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Email</span>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Phone</span>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={labelClass}>WhatsApp link</span>
            <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} />
          </label>
          <label className="mt-4 block">
            <span className={labelClass}>Address</span>
            <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
          </label>
        </SectionCard>

        <SectionCard icon={Share2} title="Social links" hint="Footer and contact page profiles">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={labelClass}>Facebook</span>
              <input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Telegram</span>
              <input value={form.telegram} onChange={(e) => set("telegram", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>YouTube</span>
              <input value={form.youtube} onChange={(e) => set("youtube", e.target.value)} className={inputClass} />
            </label>
          </div>
        </SectionCard>

        <SectionCard icon={ShoppingBag} title="Commerce" hint="Delivery and pricing rules">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Free delivery threshold (BDT)</span>
              <input type="number" min={0} value={form.freeDeliveryThreshold} onChange={(e) => set("freeDeliveryThreshold", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Used-book payout rate (%)</span>
              <input type="number" min={0} max={100} value={form.sellUsedBookRate} onChange={(e) => set("sellUsedBookRate", e.target.value)} className={inputClass} />
            </label>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {toggleLabels.map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-line px-3 py-2.5 transition-colors hover:border-brand-200"
              >
                <span>
                  <span className="block text-[11px] font-medium text-ink">{item.label}</span>
                  <span className="block text-[9px] text-muted">{item.hint}</span>
                </span>
                <input
                  type="checkbox"
                  checked={toggles[item.key]}
                  onChange={() => toggle(item.key)}
                  className="h-4 w-4 shrink-0 accent-brand-600"
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-dashed border-line bg-white/60 px-4 py-4">
          <div className="flex items-start gap-2">
            <Bell size={14} className="mt-0.5 shrink-0 text-brand-600" />
            <p className="max-w-xl text-[10px] leading-relaxed text-muted">
              <span className="font-semibold text-ink">Demo notice:</span> this settings page is a
              design preview. Nothing is saved — connect your database when you are ready.
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-5 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Save size={13} /> Save settings
          </button>
        </div>

        {notice && (
          <p className="flex items-center gap-1.5 rounded-[8px] border border-brand-100 bg-brand-50 px-3 py-2.5 text-[10px] text-brand-800">
            <Check size={12} /> {notice}
          </p>
        )}
      </form>
    </div>
  );
}
