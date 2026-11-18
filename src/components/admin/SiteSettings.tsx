"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  Database,
  Download,
  Globe2,
  ImagePlus,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCcw,
  Save,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Upload,
} from "lucide-react";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import { cloneSiteSettings, type SiteSettings } from "@/lib/site-settings";
import { logoutAdmin } from "@/lib/admin-auth";
import { dataUrlSizeLabel, fileToDataUrl } from "@/lib/image";
import { cn, formatCount } from "@/lib/utils";

const fieldClass =
  "w-full rounded-[4px] border border-line bg-white px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15";
const subLabel = "mb-1.5 block text-[11px] font-semibold text-ink";

type Notice = { text: string; error?: boolean };
type Tab = "general" | "social" | "commerce" | "seo" | "tracking" | "security" | "alerts" | "data";

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

function StringList({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (values: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className={subLabel}>{label}</span>
        <button type="button" onClick={() => onChange([...values, ""])} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline">
          <Plus size={11} aria-hidden="true" /> Add
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
              placeholder={placeholder}
              className={fieldClass}
            />
            <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label={`Remove ${label} ${index + 1}`} className="rounded-[4px] p-2 text-muted hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
              <RefreshCcw size={12} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-[8px] border border-line bg-white p-3 transition-colors hover:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/30">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded accent-brand-600"
      />
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function SiteSettings() {
  const { settings, save, reset } = useSiteSettings();
  const {
    currentUser,
    isSuperAdmin,
    updateProfile,
    changePassword,
    setAvatar,
    resetDemo,
  } = useAdminAccess();
  const [draft, setDraft] = useState<SiteSettings>(settings);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [tab, setTab] = useState<Tab>("general");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordNotice, setPasswordNotice] = useState<Notice | null>(null);
  const [uploading, setUploading] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(settings), [settings]);
  useEffect(() => {
    setProfileName(currentUser?.name ?? "");
    setProfileEmail(currentUser?.email ?? "");
  }, [currentUser]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const setGroup = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setNotice(null);
  };

  const handleSave = () => {
    const result = save(draft);
    setNotice({ text: result.message, error: !result.ok });
  };

  const handleReset = () => {
    const result = reset();
    setDraft(cloneSiteSettings());
    setNotice({ text: result.message, error: !result.ok });
  };

  const handlePassword = () => {
    if (passwords.next !== passwords.confirm) {
      setPasswordNotice({ error: true, text: "New passwords do not match." });
      return;
    }
    const result = changePassword(passwords.current, passwords.next);
    setPasswordNotice({ text: result.message, error: !result.ok });
    if (result.ok) setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const avatar = await fileToDataUrl(file);
      setAvatar(avatar);
      setNotice({ text: `Avatar updated (${dataUrlSizeLabel(avatar)}).` });
    } catch (error) {
      setNotice({ error: true, text: error instanceof Error ? error.message : "Could not read image." });
    } finally {
      setUploading(false);
    }
  };

  const exportData = () => {
    const payload: Record<string, unknown> = {};
    if (typeof window !== "undefined") {
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (!key) continue;
        try {
          payload[key] = JSON.parse(window.localStorage.getItem(key) ?? "null");
        } catch {
          payload[key] = window.localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `talknestbd-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice({ text: "Backup downloaded as JSON." });
  };

  const tabs: { key: Tab; label: string; icon: typeof Globe2 }[] = [
    { key: "general", label: "General", icon: Globe2 },
    { key: "social", label: "Social media", icon: Share2 },
    { key: "commerce", label: "Commerce", icon: ShoppingBag },
    { key: "seo", label: "SEO & Search", icon: BarChart3 },
    { key: "tracking", label: "Tracking", icon: Upload },
    { key: "security", label: "Security", icon: Lock },
    { key: "alerts", label: "Alerts", icon: Bell },
    { key: "data", label: "Data", icon: Database },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
        <Link href="/admin" className="transition-colors hover:text-brand-700">Dashboard</Link>
        <span>/</span>
        <span className="font-semibold text-ink">Site settings</span>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Site settings</h1>
          <p className="mt-1 text-[12px] text-muted">
            Branding, storefront links, search visibility, tracking and admin security.
          </p>
        </div>
        <Link href="/admin" className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[11px] font-medium text-ink hover:border-brand-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
          <ArrowLeft size={13} aria-hidden="true" /> Back to dashboard
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 overflow-x-auto rounded-[8px] border border-line bg-white p-1">
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[5px] px-3 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
                tab === item.key ? "bg-brand-600 text-white" : "text-muted hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              <Icon size={13} aria-hidden="true" /> {item.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {tab === "general" && (
            <Section title="Site identity" description="Shown across the storefront, receipts and metadata.">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block"><span className={subLabel}>Site name</span><input value={draft.identity.name} onChange={(event) => setGroup("identity", { ...draft.identity, name: event.target.value })} className={fieldClass} /></label>
                <label className="block"><span className={subLabel}>Initials</span><input value={draft.identity.initials} maxLength={3} onChange={(event) => setGroup("identity", { ...draft.identity, initials: event.target.value })} className={fieldClass} /></label>
              </div>
              <label className="block"><span className={subLabel}>Tagline</span><input value={draft.identity.tagline} onChange={(event) => setGroup("identity", { ...draft.identity, tagline: event.target.value })} className={fieldClass} /></label>
              <label className="block"><span className={subLabel}>Description</span><textarea value={draft.identity.description} onChange={(event) => setGroup("identity", { ...draft.identity, description: event.target.value })} rows={3} className={`${fieldClass} resize-y`} /></label>
            </Section>
          )}
          {tab === "general" && (
            <Section title="Contact details" description="Used in the header, footer, checkout and support links.">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block"><span className={subLabel}>Email</span><input type="email" value={draft.identity.email} onChange={(event) => setGroup("identity", { ...draft.identity, email: event.target.value })} className={fieldClass} /></label>
                <label className="block"><span className={subLabel}>Phone</span><input type="tel" value={draft.identity.phone} onChange={(event) => setGroup("identity", { ...draft.identity, phone: event.target.value })} className={fieldClass} /></label>
              </div>
              <label className="block"><span className={subLabel}>WhatsApp link</span><input type="url" value={draft.identity.whatsapp} onChange={(event) => setGroup("identity", { ...draft.identity, whatsapp: event.target.value })} className={fieldClass} /></label>
              <label className="block"><span className={subLabel}>Address</span><input value={draft.identity.address} onChange={(event) => setGroup("identity", { ...draft.identity, address: event.target.value })} className={fieldClass} /></label>
            </Section>
          )}

          {tab === "social" && (
            <Section title="Social profiles" description="Links used in the footer, header and share buttons.">
              {(Object.keys(draft.social) as (keyof SiteSettings["social"])[]).map((key) => (
                <label className="block" key={key}>
                  <span className={subLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <input type="url" value={draft.social[key]} onChange={(event) => setGroup("social", { ...draft.social, [key]: event.target.value })} placeholder="https://…" className={fieldClass} />
                </label>
              ))}
            </Section>
          )}

          {tab === "commerce" && (
            <>
              <Section title="Pricing rules">
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block"><span className={subLabel}>Free delivery above (৳)</span><input type="number" min={0} value={draft.commerce.freeDeliveryThreshold} onChange={(event) => setGroup("commerce", { ...draft.commerce, freeDeliveryThreshold: Number(event.target.value) })} className={fieldClass} /></label>
                  <label className="block"><span className={subLabel}>Used-book payout rate (%)</span><input type="number" min={0} max={100} value={draft.commerce.sellUsedBookRate} onChange={(event) => setGroup("commerce", { ...draft.commerce, sellUsedBookRate: Number(event.target.value) })} className={fieldClass} /></label>
                </div>
              </Section>
              <Section title="Available options" description="Switch payment and service options on the storefront.">
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["cod", "bkash", "nagad", "express", "wholesale", "autoPublishReviews"] as const).map((key) => (
                    <Toggle
                      key={key}
                      label={key === "cod" ? "Cash on delivery" : key === "bkash" ? "bKash" : key === "nagad" ? "Nagad" : key === "express" ? "Express delivery" : key === "wholesale" ? "Wholesale orders" : "Auto-publish reviews"}
                      hint={key === "autoPublishReviews" ? "Skip manual review moderation" : undefined}
                      checked={draft.commerce[key]}
                      onChange={(value) => setGroup("commerce", { ...draft.commerce, [key]: value })}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}

          {tab === "seo" && (
            <>
              <Section title="Search visibility" description="Verification tokens are injected as meta tags in this browser.">
                <label className="block"><span className={subLabel}>Public site URL</span><input type="url" value={draft.seo.siteUrl} onChange={(event) => setGroup("seo", { ...draft.seo, siteUrl: event.target.value })} className={fieldClass} /></label>
                <label className="block"><span className={subLabel}>Google Search Console verification</span><input value={draft.seo.gscVerification} onChange={(event) => setGroup("seo", { ...draft.seo, gscVerification: event.target.value })} placeholder="google-site-verification token" className={fieldClass} /></label>
                <label className="block"><span className={subLabel}>Bing verification</span><input value={draft.seo.bingVerification} onChange={(event) => setGroup("seo", { ...draft.seo, bingVerification: event.target.value })} className={fieldClass} /></label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block"><span className={subLabel}>Google Analytics 4 ID</span><input value={draft.seo.googleAnalyticsId} onChange={(event) => setGroup("seo", { ...draft.seo, googleAnalyticsId: event.target.value })} placeholder="G-XXXXXXX" className={fieldClass} /></label>
                  <label className="block"><span className={subLabel}>Google Tag Manager ID</span><input value={draft.seo.tagManagerId} onChange={(event) => setGroup("seo", { ...draft.seo, tagManagerId: event.target.value })} placeholder="GTM-XXXXXXX" className={fieldClass} /></label>
                </div>
                <label className="block"><span className={subLabel}>Twitter handle</span><input value={draft.seo.twitterHandle} onChange={(event) => setGroup("seo", { ...draft.seo, twitterHandle: event.target.value })} className={fieldClass} /></label>
                <Toggle label="Allow search engines to index" hint="Controls the robots.txt recommendation shown below." checked={draft.seo.robotsIndex} onChange={(value) => setGroup("seo", { ...draft.seo, robotsIndex: value })} />
              </Section>
              <Section title="Implementation checklist">
                <ul className="space-y-2">
                  {["/sitemap.xml is generated from the route table", "/robots.txt points to the sitemap", "Open Graph + Twitter metadata in the root layout", "Verification meta tags injected from settings"].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-forest-800/80">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          {tab === "tracking" && (
            <>
              <Section title="Facebook tracking" description="Configure Pixel and Conversions API-style events (demo settings only).">
                <label className="block"><span className={subLabel}>Pixel ID</span><input value={draft.tracking.facebookPixelId} onChange={(event) => setGroup("tracking", { ...draft.tracking, facebookPixelId: event.target.value })} placeholder="000000000000000" className={fieldClass} /></label>
                <label className="block">
                  <span className={subLabel}>Conversions API access token</span>
                  <input type="password" value={draft.tracking.facebookApiToken} onChange={(event) => setGroup("tracking", { ...draft.tracking, facebookApiToken: event.target.value })} className={fieldClass} autoComplete="off" />
                  <span className="mt-1 block text-[9px] leading-relaxed text-gold-600">
                    Demo only — never enter a real access token. This value is stored in your browser, not on a server.
                  </span>
                </label>
                <label className="block"><span className={subLabel}>Test event code</span><input value={draft.tracking.testEventCode} onChange={(event) => setGroup("tracking", { ...draft.tracking, testEventCode: event.target.value })} className={fieldClass} /></label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Toggle label="Browser Pixel" hint="Injects the Pixel script when an ID is set." checked={draft.tracking.pixelEnabled} onChange={(value) => setGroup("tracking", { ...draft.tracking, pixelEnabled: value })} />
                  <Toggle label="Server-side events" hint="Preview the CAPI payload; no events are sent without a backend." checked={draft.tracking.serverSideEnabled} onChange={(value) => setGroup("tracking", { ...draft.tracking, serverSideEnabled: value })} />
                </div>
                <StringList label="Tracked events" values={draft.tracking.events} onChange={(values) => setGroup("tracking", { ...draft.tracking, events: values })} placeholder="Purchase" />
              </Section>
              {draft.tracking.serverSideEnabled && (
                <Section title="CAPI payload preview">
                  <pre className="overflow-x-auto rounded-[8px] bg-forest-950 p-4 text-[10px] leading-relaxed text-cream-100">
{JSON.stringify({
  event_name: draft.tracking.events[0] || "PageView",
  event_time: Math.floor(Date.now() / 1000),
  action_source: "website",
  event_source_url: draft.seo.siteUrl,
  user_data: { em: "hashed-email", ph: "hashed-phone" },
  test_event_code: draft.tracking.testEventCode || null,
}, null, 2)}
                  </pre>
                  <p className="text-[10px] leading-relaxed text-muted">
                    This demo stores settings in your browser only. Real server-side tracking needs a backend endpoint that sends events to Meta with the access token kept secret.
                  </p>
                </Section>
              )}
            </>
          )}

          {tab === "security" && (
            <>
              <Section title="Admin profile" description={`Signed in as ${currentUser?.name ?? "Admin"}`}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block"><span className={subLabel}>Name</span><input value={profileName} onChange={(event) => setProfileName(event.target.value)} className={fieldClass} /></label>
                  <label className="block"><span className={subLabel}>Email</span><input type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} className={fieldClass} /></label>
                </div>
                <button type="button" onClick={() => { updateProfile({ name: profileName, email: profileEmail }); setNotice({ text: "Profile saved in this browser." }); }} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                  <Save size={13} aria-hidden="true" /> Save profile
                </button>
              </Section>
              <Section title="Change password" description="Demo password stored in this browser.">
                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="block"><span className={subLabel}>Current password</span><input type="password" value={passwords.current} onChange={(event) => setPasswords({ ...passwords, current: event.target.value })} autoComplete="current-password" className={fieldClass} /></label>
                  <label className="block"><span className={subLabel}>New password</span><input type="password" value={passwords.next} minLength={6} onChange={(event) => setPasswords({ ...passwords, next: event.target.value })} autoComplete="new-password" className={fieldClass} /></label>
                  <label className="block"><span className={subLabel}>Confirm password</span><input type="password" value={passwords.confirm} minLength={6} onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })} autoComplete="new-password" className={fieldClass} /></label>
                </div>
                <button type="button" onClick={handlePassword} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                  <KeyRound size={13} aria-hidden="true" /> Update password
                </button>
                {passwordNotice && (
                  <p role="status" className={cn("text-[10px] leading-relaxed", passwordNotice.error ? "text-gold-600" : "text-brand-700")}>{passwordNotice.text}</p>
                )}
                <p className="text-[9px] text-muted">Default demo password: demo1234</p>
              </Section>
              <Section title="Profile photo" description="Compressed and stored in this browser.">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {currentUser?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentUser.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      (profileName || "A").charAt(0)
                    )}
                  </span>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line bg-white px-3 text-[10px] font-medium text-ink hover:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/40">
                    <ImagePlus size={12} aria-hidden="true" /> {uploading ? "Compressing…" : "Upload photo"}
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploading} onChange={(event) => handleAvatar(event.target.files?.[0])} />
                  </label>
                  <button type="button" onClick={() => setAvatar(null)} className="text-[10px] font-medium text-muted hover:text-brand-700">Remove</button>
                </div>
              </Section>
              <Section title="Session">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => { logoutAdmin(); window.location.href = "/admin/login"; }} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                    <LogOut size={13} aria-hidden="true" /> Sign out
                  </button>
                  {isSuperAdmin && (
                    <button type="button" onClick={() => { resetDemo(); setNotice({ text: "Demo admin data restored." }); }} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300">
                      <RefreshCcw size={13} aria-hidden="true" /> Reset admin demo
                    </button>
                  )}
                </div>
              </Section>
            </>
          )}

          {tab === "alerts" && (
            <Section title="Admin alerts" description="Choose which activity should raise a notification in the demo panel.">
              <div className="grid gap-2 sm:grid-cols-2">
                {([
                  ["newOrders", "New orders", "A customer places an order"],
                  ["newReviews", "New reviews", "A reader submits a review"],
                  ["newStories", "New stories", "A reader shares a story"],
                  ["newSellRequests", "Sell requests", "A used-book quote request arrives"],
                  ["weeklyDigest", "Weekly digest", "A summary of store activity"],
                ] as const).map(([key, label, hint]) => (
                  <Toggle
                    key={key}
                    label={label}
                    hint={hint}
                    checked={draft.notifications[key]}
                    onChange={(value) => setGroup("notifications", { ...draft.notifications, [key]: value })}
                  />
                ))}
              </div>
            </Section>
          )}

          {tab === "data" && (
            <>
              <Section title="Backup & restore" description="All demo data lives in this browser.">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={exportData} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                    <Download size={13} aria-hidden="true" /> Export all data
                  </button>
                  <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500/40">
                    <Upload size={13} aria-hidden="true" /> Import settings
                    <input ref={importRef} type="file" accept="application/json" className="sr-only" onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        const parsed = JSON.parse(await file.text()) as Partial<SiteSettings>;
                        setDraft({
                          ...cloneSiteSettings(),
                          ...parsed,
                          identity: { ...cloneSiteSettings().identity, ...parsed.identity },
                          social: { ...cloneSiteSettings().social, ...parsed.social },
                          seo: { ...cloneSiteSettings().seo, ...parsed.seo },
                          tracking: { ...cloneSiteSettings().tracking, ...parsed.tracking },
                          notifications: { ...cloneSiteSettings().notifications, ...parsed.notifications },
                          commerce: { ...cloneSiteSettings().commerce, ...parsed.commerce },
                        });
                        setNotice({ text: "Settings loaded from file. Save changes to apply." });
                      } catch {
                        setNotice({ error: true, text: "That file is not valid JSON." });
                      }
                      event.target.value = "";
                    }} />
                  </label>
                </div>
              </Section>
              <Section title="Storage overview" description="Keys currently used by this demo.">
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {["cart / wishlist", "orders / addresses / profile", "hero / trust / categories", "books / shelves / audio / stories", "reviews / requests", "video quiz / comments", "site settings / admin access"].map((key) => (
                    <li key={key} className="rounded-[6px] border border-line bg-white px-2.5 py-2 text-[10px] text-muted">{key}</li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          {notice && (
            <div role="status" aria-live="polite" className={cn("flex items-start gap-2 rounded-[8px] border px-3 py-2.5", notice.error ? "border-gold-300 bg-gold-300/15" : "border-brand-100 bg-brand-50")}>
              {notice.error ? <AlertCircle size={13} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" /> : <Check size={13} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />}
              <p className="text-[10px] leading-relaxed text-ink">{notice.text}</p>
            </div>
          )}

          {tab !== "security" && tab !== "data" && (
            <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-line bg-white p-4">
              <button type="button" onClick={handleSave} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                <Save size={13} aria-hidden="true" /> Save changes
              </button>
              <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40">
                <RefreshCcw size={13} aria-hidden="true" /> Restore defaults
              </button>
              {dirty && <span className="ml-auto text-[10px] font-semibold text-gold-600">Unsaved changes</span>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <section className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5 sm:px-5">
              <ShieldCheck size={14} className="text-brand-700" aria-hidden="true" />
              <h2 className="text-[13px] font-semibold text-ink">Live overview</h2>
              <span className="ml-auto text-[9px] text-muted">Storefront</span>
            </div>
            <div className="brand-wash space-y-3 p-4 sm:p-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-700">{draft.identity.name}</p>
                <p className="mt-1 font-display text-base font-bold text-ink">{draft.identity.tagline}</p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{draft.identity.description}</p>
              </div>
              <div className="grid gap-2">
                <PreviewRow icon={<Mail size={12} />} label="Email" value={draft.identity.email} />
                <PreviewRow icon={<Globe2 size={12} />} label="Website" value={draft.seo.siteUrl} />
                <PreviewRow icon={<ShoppingBag size={12} />} label="Free delivery" value={`৳${formatCount(draft.commerce.freeDeliveryThreshold)}`} />
                <PreviewRow icon={<BarChart3 size={12} />} label="Search index" value={draft.seo.robotsIndex ? "Allowed" : "Blocked"} />
              </div>
              <div className="flex flex-wrap gap-1.5 border-t border-line pt-3">
                {(Object.entries(draft.social) as [keyof SiteSettings["social"], string][]).filter(([, value]) => value).map(([key, value]) => (
                  <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line bg-white px-2 py-1 text-[9px] font-medium text-brand-700 hover:border-brand-300">
                    {key}
                  </a>
                ))}
              </div>
            </div>
          </section>
          <div className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3">
            <p className="flex items-start gap-2 text-[10px] leading-relaxed text-muted">
              <Bell size={13} className="mt-0.5 shrink-0 text-brand-700" aria-hidden="true" />
              Demo note: settings, tokens and password are stored in this browser only. No verification or tracking data is sent to Google or Meta from this demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[6px] border border-line bg-white px-2.5 py-2">
      <span className="text-brand-700" aria-hidden="true">{icon}</span>
      <span className="text-[9px] text-muted">{label}</span>
      <span className="ml-auto max-w-[60%] truncate text-[10px] font-semibold text-ink">{value}</span>
    </div>
  );
}
