"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  PackageCheck,
  PenLine,
  Repeat2,
  Settings2,
  ShoppingBag,
  Star,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  DonutChart,
  Sparkline,
  type ChartPoint,
  type DonutSegment,
} from "@/components/admin/analytics-charts";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useSellRequests } from "@/components/providers/SellRequestsProvider";
import { useWholesaleRequests } from "@/components/providers/WholesaleProviders";
import { useReviews } from "@/components/providers/ReviewsProvider";
import { useStories } from "@/components/providers/StoriesProvider";
import { adminNavGroups } from "@/lib/admin-nav";
import { ORDERS_KEY, readOrders, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const SAMPLE_REVENUE = [18400, 24200, 21800, 32600, 28900, 41200, 36700];
const SAMPLE_STATUS = [
  { label: "Confirmed", value: 8, color: "#1877f2" },
  { label: "Processing", value: 5, color: "#ff9900" },
  { label: "Out for delivery", value: 3, color: "#96db9d" },
];

function buildSeries(orders: Order[], days: number, by: "revenue" | "count"): ChartPoint[] {
  const today = startOfDay(new Date());
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date(today - (days - 1 - index) * DAY_MS);
    return {
      key: date.toDateString(),
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      value: 0,
    };
  });
  const lookup = new Map(buckets.map((bucket, index) => [bucket.key, index]));
  orders.forEach((order) => {
    const timestamp = new Date(order.createdAt).getTime();
    if (!Number.isFinite(timestamp)) return;
    const index = lookup.get(new Date(timestamp).toDateString());
    if (index === undefined) return;
    buckets[index].value += by === "revenue" ? order.total : 1;
  });
  return buckets;
}

function sampleSeries(days: number): ChartPoint[] {
  const today = startOfDay(new Date());
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today - (days - 1 - index) * DAY_MS);
    const base = SAMPLE_REVENUE[index % SAMPLE_REVENUE.length];
    return {
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      value: Math.round(base * (0.86 + ((index * 17) % 30) / 100)),
    };
  });
}

function relativeTime(iso: string, now: number): string {
  const timestamp = new Date(iso).getTime();
  if (!Number.isFinite(timestamp)) return "Just now";
  const minutes = Math.max(0, Math.round((now - timestamp) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const isPending = (status: string) => status === "New" || status === "Pending";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  status: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  trend?: string;
  icon: LucideIcon;
  iconClass: string;
  sparkData: number[];
  sparkColor: string;
}

function MetricCard({
  label,
  value,
  hint,
  trend,
  icon: Icon,
  iconClass,
  sparkData,
  sparkColor,
}: MetricCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[12px] border border-line bg-white p-4 shadow-[0_14px_36px_-30px_rgba(11,61,122,0.65)] transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(11,61,122,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="font-display text-[26px] font-bold leading-none tracking-tight text-ink">{value}</p>
            {trend && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-mint/25 px-1.5 py-0.5 text-[9px] font-semibold text-forest-700">
                <TrendingUp size={10} /> {trend}
              </span>
            )}
          </div>
        </div>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[10px] ${iconClass}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="max-w-[55%] text-[10px] leading-snug text-muted">{hint}</p>
        <div className="w-[42%] max-w-[120px] shrink-0 opacity-90">
          <Sparkline data={sparkData} color={sparkColor} ariaLabel={`${label} trend`} />
        </div>
      </div>
    </article>
  );
}

function PanelHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-brand-50 text-brand-700">
            <Icon size={14} />
          </span>
        )}
        <div>
          <h2 className="text-[13px] font-semibold text-ink">{title}</h2>
          <p className="mt-0.5 text-[10px] text-muted">{subtitle}</p>
        </div>
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-semibold text-brand-700">
          {badge}
        </span>
      )}
    </div>
  );
}

export function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [range, setRange] = useState<7 | 30>(7);
  const [today, setToday] = useState("");
  const [now, setNow] = useState(0);
  const [chartData, setChartData] = useState<{
    revenue: ChartPoint[];
    orders: ChartPoint[];
    week: number[];
  }>({ revenue: [], orders: [], week: [] });

  const { books, uploads, hydrated: booksHydrated } = useBookContent();
  const sell = useSellRequests();
  const wholesale = useWholesaleRequests();
  const reviews = useReviews();
  const stories = useStories();

  useEffect(() => {
    setOrders(readOrders());
    setNow(Date.now());
    setToday(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
    const onStorage = (event: StorageEvent) => {
      if (event.key === ORDERS_KEY || event.key === null) setOrders(readOrders());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sections =
    adminNavGroups.find((group) => group.label === "Homepage sections")?.items ?? [];

  const hasOrders = orders.length > 0;

  // Date-derived series are built after mount so prerendering stays stable.
  useEffect(() => {
    const sample = sampleSeries(range);
    setChartData({
      revenue: hasOrders ? buildSeries(orders, range, "revenue") : sample,
      orders: hasOrders
        ? buildSeries(orders, range, "count")
        : sample.map((point) => ({
            ...point,
            value: Math.max(2, Math.round(point.value / 3200)),
          })),
      week: (hasOrders ? buildSeries(orders, 7, "revenue") : sampleSeries(7)).map(
        (point) => point.value,
      ),
    });
  }, [orders, hasOrders, range]);

  const { revenue: revenueSeries, orders: orderSeries, week: weekSeries } = chartData;

  const totalRevenue = hasOrders
    ? orders.reduce((sum, order) => sum + order.total, 0)
    : SAMPLE_REVENUE.reduce((sum, value) => sum + value, 0);
  const orderCount = hasOrders ? orders.length : 16;
  const averageOrder = orderCount ? Math.round(totalRevenue / orderCount) : 0;

  const statusCounts = useMemo(() => {
    if (!hasOrders) return SAMPLE_STATUS;
    return SAMPLE_STATUS.map((status) => ({
      ...status,
      value: orders.filter((order) => order.status === status.label).length,
    }));
  }, [orders, hasOrders]);

  const requestGroups = useMemo(
    () => [
      {
        key: "sell",
        label: "Sell a book",
        hint: "Used-book sale requests",
        href: "/admin/sections/sell-used-books",
        icon: Repeat2,
        color: "#1877f2",
        rows: sell.requests.map((request) => ({
          id: request.id,
          createdAt: request.createdAt,
          status: request.status,
          title: request.bookTitle,
          subtitle: request.name,
        })),
      },
      {
        key: "wholesale",
        label: "Wholesale quotes",
        hint: "Bulk order enquiries",
        href: "/admin/sections/free-order-wholesale",
        icon: Building2,
        color: "#ff9900",
        rows: wholesale.requests.map((request) => ({
          id: request.id,
          createdAt: request.createdAt,
          status: request.status,
          title: request.organization,
          subtitle: request.contact,
        })),
      },
      {
        key: "reviews",
        label: "Review requests",
        hint: "Reader reviews to moderate",
        href: "/admin/sections/reviews",
        icon: Star,
        color: "#96db9d",
        rows: reviews.requests.map((request) => ({
          id: request.id,
          createdAt: request.createdAt,
          status: request.status,
          title: request.bookTitle,
          subtitle: request.name,
        })),
      },
      {
        key: "stories",
        label: "Story submissions",
        hint: "Community stories to review",
        href: "/admin/sections/stories",
        icon: PenLine,
        color: "#b06fe0",
        rows: stories.requests.map((request) => ({
          id: request.id,
          createdAt: request.createdAt,
          status: request.status,
          title: request.title,
          subtitle: request.name,
        })),
      },
    ],
    [sell.requests, wholesale.requests, reviews.requests, stories.requests],
  );

  const allRequests = useMemo(
    () =>
      requestGroups
        .flatMap((group) =>
          group.rows.map((row) => ({
            ...row,
            href: group.href,
            icon: group.icon,
            color: group.color,
            group: group.label,
          })),
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [requestGroups],
  );

  const totalRequests = allRequests.length;
  const pendingRequests = allRequests.filter((row) => isPending(row.status)).length;
  const hasRequests = totalRequests > 0;

  const requestSegments: DonutSegment[] = useMemo(() => {
    if (!hasRequests) {
      return [
        { label: "Sell a book", value: 6, color: "#1877f2", href: "/admin/sections/sell-used-books" },
        { label: "Wholesale quotes", value: 4, color: "#ff9900", href: "/admin/sections/free-order-wholesale" },
        { label: "Review requests", value: 5, color: "#96db9d", href: "/admin/sections/reviews" },
        { label: "Story submissions", value: 3, color: "#b06fe0", href: "/admin/sections/stories" },
      ];
    }
    return requestGroups.map((group) => ({
      label: group.label,
      value: group.rows.length,
      color: group.color,
      href: group.href,
    }));
  }, [hasRequests, requestGroups]);

  const requestTotal = hasRequests ? totalRequests : 18;

  const activity: ActivityItem[] = useMemo(() => {
    if (hasRequests) {
      return allRequests.slice(0, 5).map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: `${row.group} · ${row.subtitle}`,
        time: relativeTime(row.createdAt, now || Date.parse(row.createdAt)),
        status: row.status,
        href: row.href,
        icon: row.icon,
        color: row.color,
      }));
    }
    return [
      {
        id: "demo-sell",
        title: "Used-book sale request",
        subtitle: "Sell a book · Tanha Rahman",
        time: "12m ago",
        status: "New",
        href: "/admin/sections/sell-used-books",
        icon: Repeat2,
        color: "#1877f2",
      },
      {
        id: "demo-quote",
        title: "Bulk order enquiry",
        subtitle: "Wholesale quotes · Mahin Ahmed",
        time: "1h ago",
        status: "Contacted",
        href: "/admin/sections/free-order-wholesale",
        icon: Building2,
        color: "#ff9900",
      },
      {
        id: "demo-review",
        title: "New review to moderate",
        subtitle: "Review requests · Sadia Islam",
        time: "3h ago",
        status: "Pending",
        href: "/admin/sections/reviews",
        icon: Star,
        color: "#96db9d",
      },
      {
        id: "demo-story",
        title: "Community story submitted",
        subtitle: "Story submissions · Rakibul Hasan",
        time: "Yesterday",
        status: "Pending",
        href: "/admin/sections/stories",
        icon: PenLine,
        color: "#b06fe0",
      },
      {
        id: "demo-sell-2",
        title: "Used-book sale request",
        subtitle: "Sell a book · Nusrat Jahan",
        time: "Yesterday",
        status: "Contacted",
        href: "/admin/sections/sell-used-books",
        icon: Repeat2,
        color: "#1877f2",
      },
      {
        id: "demo-review-2",
        title: "New review to moderate",
        subtitle: "Review requests · Imran Hossain",
        time: "2d ago",
        status: "Pending",
        href: "/admin/sections/reviews",
        icon: Star,
        color: "#96db9d",
      },
    ];
  }, [allRequests, hasRequests]);

  return (
    <div className="space-y-5">
      {/* Welcome / command banner */}
      <section className="hero-mesh relative overflow-hidden rounded-[14px] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.08]" />
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-24 h-56 w-56 rounded-full border border-white/[0.07]"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-100">
              <LayoutDashboard size={11} /> Admin control center
            </span>
            <h1 className="mt-3 font-display text-[28px] font-bold leading-tight sm:text-[34px]">
              Welcome back, Admin.
            </h1>
            <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-white/70">
              Your store at a glance — live orders, sales trends and every request
              waiting for a decision. Jump straight into the work that matters.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={pendingRequests > 0 ? "/admin/sections/sell-used-books" : "/admin/books"}
                className="inline-flex h-9 items-center gap-1.5 rounded-[5px] bg-white px-4 text-[11px] font-semibold text-brand-800 transition-colors hover:bg-brand-50"
              >
                {pendingRequests > 0 ? "Review requests" : "Upload a book"} <ArrowRight size={13} />
              </Link>
              <Link
                href="/"
                className="inline-flex h-9 items-center gap-1.5 rounded-[5px] border border-white/25 px-4 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
              >
                View live site <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:w-[340px] lg:grid-cols-1">
            <div className="rounded-[10px] border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-brand-100">
                <CalendarDays size={11} /> Today
              </p>
              <p className="mt-1 text-[12px] font-semibold leading-snug">
                {today || "Loading date…"}
              </p>
            </div>
            <div className="rounded-[10px] border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-brand-100">
                <Inbox size={11} /> Waiting
              </p>
              <p className="mt-1 text-[12px] font-semibold">
                {pendingRequests} request{pendingRequests === 1 ? "" : "s"} to review
              </p>
            </div>
            <div className="col-span-2 rounded-[10px] border border-white/15 bg-white/[0.07] px-4 py-3 backdrop-blur-sm sm:col-span-1">
              <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.1em] text-brand-100">
                <Activity size={11} /> Workspace
              </p>
              <p className="mt-1 text-[12px] font-semibold">Demo mode · Browser only</p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      <section aria-label="Key metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Revenue"
          value={formatPrice(totalRevenue)}
          hint={hasOrders ? "From saved customer orders" : "Sample preview — place an order to go live"}
          trend={hasOrders ? undefined : "+12.4%"}
          icon={Wallet}
          iconClass="bg-brand-50 text-brand-700"
          sparkData={weekSeries}
          sparkColor="#1877f2"
        />
        <MetricCard
          label="Orders"
          value={String(orderCount).padStart(2, "0")}
          hint={`${statusCounts.find((item) => item.label === "Processing")?.value ?? 0} processing right now`}
          trend={hasOrders ? undefined : "+8.1%"}
          icon={ShoppingBag}
          iconClass="bg-gold-500/10 text-gold-600"
          sparkData={orderSeries.slice(0, 7).map((point) => point.value)}
          sparkColor="#ff9900"
        />
        <MetricCard
          label="Books in catalog"
          value={booksHydrated ? String(books.length).padStart(2, "0") : "—"}
          hint={`${uploads.length} added from this browser`}
          icon={LibraryBig}
          iconClass="bg-mint/25 text-forest-700"
          sparkData={[4, 6, 7, 9, 11, 12, books.length || 12]}
          sparkColor="#2aa06a"
        />
        <MetricCard
          label="Requests"
          value={String(totalRequests).padStart(2, "0")}
          hint={`${pendingRequests} need your attention · 4 pipelines`}
          trend={pendingRequests > 0 ? `${pendingRequests} new` : undefined}
          icon={Inbox}
          iconClass="bg-lavender/40 text-brand-800"
          sparkData={requestSegments.map((segment) => segment.value)}
          sparkColor="#8b5cf6"
        />
      </section>

      {/* Analytics */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="rounded-[12px] border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 sm:px-5">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-brand-50 text-brand-700">
                <TrendingUp size={14} />
              </span>
              <div>
                <h2 className="text-[13px] font-semibold text-ink">Revenue overview</h2>
                <p className="mt-0.5 text-[10px] text-muted">
                  {hasOrders ? "Based on orders saved in this browser" : "Illustrative sales trend"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[9px] font-semibold text-brand-700">
                {hasOrders ? "Live data" : "Sample preview"}
              </span>
              <div className="flex rounded-[6px] border border-line bg-canvas p-0.5" role="group" aria-label="Chart range">
                {([7, 30] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRange(option)}
                    aria-pressed={range === option}
                    className={`rounded-[5px] px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                      range === option
                        ? "bg-white text-brand-700 shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {option}d
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 pt-4 sm:px-5">
            <AreaChart
              data={revenueSeries}
              gradientId="dashboard-revenue-fill"
              color="#1877f2"
              valueLabel={(value) => formatPrice(Math.round(value))}
              ariaLabel={`Revenue over the last ${range} days, from ${formatPrice(revenueSeries[0]?.value ?? 0)} to ${formatPrice(revenueSeries[revenueSeries.length - 1]?.value ?? 0)}`}
            />
          </div>
          <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
            <div className="px-4 py-3">
              <p className="text-[9px] uppercase tracking-wide text-muted">Total</p>
              <p className="mt-0.5 text-[13px] font-semibold text-ink">{formatPrice(totalRevenue)}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[9px] uppercase tracking-wide text-muted">Avg. order</p>
              <p className="mt-0.5 text-[13px] font-semibold text-ink">{formatPrice(averageOrder)}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[9px] uppercase tracking-wide text-muted">Orders</p>
              <p className="mt-0.5 text-[13px] font-semibold text-ink">{orderCount}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[12px] border border-line bg-white">
          <PanelHeader
            title="Requests by type"
            subtitle={hasRequests ? "Live requests from this browser" : "Illustrative request mix"}
            badge={hasRequests ? `${totalRequests} total` : "Sample preview"}
            icon={Inbox}
          />
          <div className="px-4 py-5 sm:px-5">
            <DonutChart
              segments={requestSegments}
              total={requestTotal}
              centerLabel="requests"
              ariaLabel={`Request breakdown: ${requestSegments.map((item) => `${item.label} ${item.value}`).join(", ")}`}
            />
          </div>
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
              <BellRing size={12} className="mt-0.5 shrink-0 text-gold-600" />
              {hasRequests
                ? `${pendingRequests} request${pendingRequests === 1 ? "" : "s"} still waiting for a decision.`
                : "Submit a request on a storefront page and these numbers update here instantly."}
            </p>
          </div>
        </section>
      </div>

      {/* Request inbox + order pipeline */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="rounded-[12px] border border-line bg-white">
          <PanelHeader
            title="Request inbox"
            subtitle="Every request surface, with live counts"
            badge={`${pendingRequests} pending`}
            icon={Inbox}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line bg-canvas/60 text-[9px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-2.5 font-semibold sm:px-5">Request type</th>
                  <th className="px-3 py-2.5 text-center font-semibold">Total</th>
                  <th className="px-3 py-2.5 text-center font-semibold">Pending</th>
                  <th className="px-3 py-2.5 font-semibold">Progress</th>
                  <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {requestGroups.map((group) => {
                  const total = group.rows.length;
                  const pending = group.rows.filter((row) => isPending(row.status)).length;
                  const done = total - pending;
                  const percent = total ? Math.round((done / total) * 100) : 0;
                  return (
                    <tr key={group.key} className="transition-colors hover:bg-brand-50/30">
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px]"
                            style={{ background: `${group.color}1f`, color: group.color }}
                          >
                            <group.icon size={15} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-ink">{group.label}</p>
                            <p className="text-[9px] text-muted">{group.hint}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-[12px] font-bold text-ink">{total}</td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-flex min-w-6 justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                            pending > 0
                              ? "bg-gold-500/10 text-gold-600"
                              : "bg-mint/25 text-forest-700"
                          }`}
                        >
                          {pending}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-canvas">
                            <div
                              className="h-full rounded-full transition-[width] duration-500"
                              style={{ width: `${percent}%`, background: group.color }}
                            />
                          </div>
                          <span className="text-[9px] text-muted">{percent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Link
                          href={group.href}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:underline"
                        >
                          Open <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <p className="text-[10px] leading-relaxed text-muted">
              Counts come from the same browser storage the request forms write to. Open a
              request page to change its status — this table updates right away.
            </p>
          </div>
        </section>

        <section className="rounded-[12px] border border-line bg-white">
          <PanelHeader
            title="Order pipeline"
            subtitle={hasOrders ? "Saved customer orders" : "Illustrative order stages"}
            badge={hasOrders ? "Live data" : "Sample preview"}
            icon={PackageCheck}
          />
          <div className="space-y-4 px-4 py-5 sm:px-5">
            {statusCounts.map((status) => {
              const share = orderCount ? Math.round((status.value / orderCount) * 100) : 0;
              return (
                <div key={status.label}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-[11px] font-medium text-body">
                      <span className="h-2 w-2 rounded-full" style={{ background: status.color }} />
                      {status.label}
                    </span>
                    <span className="text-[10px] font-semibold text-ink">
                      {status.value} <span className="font-normal text-muted">· {share}%</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${share}%`, background: status.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-line px-4 py-3 sm:px-5">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:underline"
            >
              Manage orders <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      </div>

      {/* Activity, quick actions, sections */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section className="rounded-[12px] border border-line bg-white">
          <PanelHeader
            title="Latest requests"
            subtitle={hasRequests ? "Newest submissions across all pipelines" : "Preview of what lands here"}
            badge={hasRequests ? `${totalRequests} total` : "Sample preview"}
            icon={FileText}
          />
          <ul className="divide-y divide-line">
            {activity.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-brand-50/30 sm:px-5"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px]"
                    style={{ background: `${item.color}1f`, color: item.color }}
                  >
                    <item.icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-semibold text-ink">{item.title}</p>
                    <p className="truncate text-[9px] text-muted">{item.subtitle}</p>
                  </div>
                  <span
                    className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium sm:inline ${
                      isPending(item.status)
                        ? "bg-gold-500/10 text-gold-600"
                        : "bg-mint/25 text-forest-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[9px] text-muted">
                    <Clock3 size={10} /> {item.time}
                  </span>
                  <ArrowRight
                    size={12}
                    className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          <section className="rounded-[12px] border border-line bg-white">
            <PanelHeader title="Quick actions" subtitle="Common tasks" icon={CheckCircle2} />
            <ul className="divide-y divide-line">
              {[
                { label: "Edit hero banner", hint: "Title & description", href: "/admin/sections/hero", icon: ImageIcon },
                { label: "Upload a book", hint: "Add to the catalog", href: "/admin/books", icon: LibraryBig },
                { label: "Manage orders", hint: "Demo order list", href: "/admin/orders", icon: ShoppingBag },
                { label: "Site settings", hint: "Workspace options", href: "/admin/settings", icon: Settings2 },
              ].map((action) => (
                <li key={action.href}>
                  <Link
                    href={action.href}
                    className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-brand-50/40 sm:px-5"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-brand-50 text-brand-700">
                      <action.icon size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-ink">{action.label}</span>
                      <span className="block truncate text-[9px] text-muted">{action.hint}</span>
                    </span>
                    <ArrowRight
                      size={12}
                      className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[12px] border border-line bg-white">
            <PanelHeader
              title="Homepage sections"
              subtitle={`${sections.length} editable areas`}
              icon={ImageIcon}
            />
            <ul className="divide-y divide-line">
              {sections.slice(0, 5).map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    className="group flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-brand-50/40 sm:px-5"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-canvas text-brand-700">
                      <section.icon size={13} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-ink">
                      {section.label}
                    </span>
                    <ArrowRight
                      size={12}
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
        </div>
      </div>

      {/* Demo disclaimer */}
      <p className="rounded-[8px] border border-dashed border-line bg-white/60 px-4 py-3 text-center text-[10px] leading-relaxed text-muted">
        Demo admin panel — no backend connection. Orders, books and request counts are read
        from this browser only; sample figures are clearly labelled wherever live data is
        not available.
      </p>
    </div>
  );
}
