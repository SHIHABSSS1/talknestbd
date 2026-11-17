import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  ExternalLink,
  Image as ImageIcon,
  LibraryBig,
  PackageCheck,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { adminNavGroups } from "@/lib/admin-nav";

export const metadata: Metadata = {
  title: "Dashboard",
};

const stats = [
  {
    label: "Total books",
    value: "128",
    hint: "+12 this month",
    icon: LibraryBig,
    tone: "bg-brand-50 text-brand-700",
  },
  {
    label: "Orders today",
    value: "08",
    hint: "3 awaiting dispatch",
    icon: ShoppingBag,
    tone: "bg-gold-500/10 text-gold-600",
  },
  {
    label: "New reviews",
    value: "05",
    hint: "Need moderation",
    icon: Star,
    tone: "bg-mint/25 text-forest-700",
  },
  {
    label: "Site status",
    value: "Live",
    hint: "Demo mode",
    icon: TrendingUp,
    tone: "bg-lavender/40 text-brand-800",
  },
];

const quickActions = [
  {
    label: "Edit hero banner",
    hint: "Title & description",
    href: "/admin/sections/hero",
    icon: ImageIcon,
  },
  {
    label: "Upload a book",
    hint: "Add to the catalog",
    href: "/admin/books",
    icon: BookOpen,
  },
  {
    label: "Manage orders",
    hint: "Demo order list",
    href: "/admin/orders",
    icon: PackageCheck,
  },
  {
    label: "Site settings",
    hint: "Workspace options",
    href: "/admin/settings",
    icon: Settings,
  },
];

const activity = [
  { title: "Hero banner updated", time: "12 minutes ago", icon: ImageIcon },
  { title: "New book added to Best sellers", time: "2 hours ago", icon: BookOpen },
  { title: "Review approved", time: "Yesterday", icon: Star },
];

export default function AdminDashboardPage() {
  const sections = adminNavGroups.find((group) => group.label === "Homepage sections")?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="hero-mesh relative overflow-hidden rounded-[12px] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.08]" />
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-100">
              <Sparkles size={11} /> Admin overview
            </span>
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-[30px]">
              Welcome back, Admin.
            </h1>
            <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-white/65">
              Here&apos;s what&apos;s happening across your store. Use the sidebar to
              edit any homepage section, or jump straight in below.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/admin/sections/hero"
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-white px-4 text-[11px] font-semibold text-brand-800 transition-colors hover:bg-brand-50"
              >
                Edit hero section <ArrowRight size={13} />
              </Link>
              <Link
                href="/"
                className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-white/25 px-4 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
              >
                View site <ExternalLink size={13} />
              </Link>
            </div>
          </div>
          <div className="hidden shrink-0 rounded-[10px] border border-white/15 bg-white/[0.06] px-5 py-4 text-center sm:block">
            <p className="text-[9px] uppercase tracking-[0.14em] text-brand-100">Today</p>
            <p className="mt-1 font-display text-2xl font-bold">17 Nov</p>
            <p className="text-[9px] text-white/50">Demo workspace</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[10px] border border-line bg-white p-4 shadow-[0_10px_30px_-28px_rgba(11,61,122,0.6)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium text-muted">{stat.label}</p>
                <p className="mt-1.5 font-display text-2xl font-bold text-ink">{stat.value}</p>
              </div>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[8px] ${stat.tone}`}>
                <stat.icon size={16} />
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1 text-[9px] text-muted">
              <TrendingUp size={11} className="text-mint" /> {stat.hint}
            </p>
          </div>
        ))}
      </section>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        {/* Homepage sections */}
        <section className="rounded-[10px] border border-line bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <div>
              <h2 className="text-[13px] font-semibold text-ink">Homepage sections</h2>
              <p className="text-[10px] text-muted">Edit titles and descriptions</p>
            </div>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-semibold text-brand-700">
              {sections.length} sections
            </span>
          </div>
          <ul className="divide-y divide-line">
            {sections.slice(0, 6).map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50/40 sm:px-5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-canvas text-brand-700 group-hover:bg-brand-100">
                    <section.icon size={14} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-semibold text-ink">
                      {section.label}
                    </span>
                    <span className="block truncate text-[9px] text-muted">
                      {section.href}
                    </span>
                  </span>
                  <span className="hidden rounded-full bg-mint/25 px-2 py-0.5 text-[9px] font-medium text-forest-700 sm:inline">
                    Published
                  </span>
                  <ArrowRight
                    size={13}
                    className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <Link
              href="/admin/sections/hero"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
            >
              Manage all sections <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        <div className="space-y-4">
          {/* Quick actions */}
          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Quick actions</h2>
              <p className="text-[10px] text-muted">Common tasks</p>
            </div>
            <ul className="divide-y divide-line">
              {quickActions.map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50/40 sm:px-5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-brand-50 text-brand-700">
                      <action.icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-ink">
                        {action.label}
                      </span>
                      <span className="block truncate text-[9px] text-muted">{action.hint}</span>
                    </span>
                    <ArrowRight
                      size={13}
                      className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Recent activity */}
          <section className="rounded-[10px] border border-line bg-white">
            <div className="border-b border-line px-4 py-3.5 sm:px-5">
              <h2 className="text-[13px] font-semibold text-ink">Recent activity</h2>
              <p className="text-[10px] text-muted">Demo updates</p>
            </div>
            <ul className="space-y-3.5 px-4 py-4 sm:px-5">
              {activity.map((item) => (
                <li key={item.title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas text-brand-700">
                    <item.icon size={12} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[9px] text-muted">
                      <Clock3 size={10} /> {item.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Demo disclaimer */}
      <p className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3 text-center text-[10px] text-muted">
        Demo admin panel — no backend connection. All metrics and activity above
        are illustrative only.
      </p>
    </div>
  );
}
