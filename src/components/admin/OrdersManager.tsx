"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import {
  deliveryLabels,
  formatOrderDate,
  normaliseOrderStatus,
  paymentLabels,
  type Order,
  type PaymentStatus,
} from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";

type OrderStatus = Order["status"];
type Tab = "all" | OrderStatus;

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All orders" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Processing", label: "Processing" },
  { value: "Out for delivery", label: "Out for delivery" },
];

const statusClass: Record<OrderStatus, string> = {
  Confirmed: "bg-brand-50 text-brand-700",
  Processing: "bg-gold-500/10 text-gold-600",
  "Out for delivery": "bg-mint/25 text-forest-700",
};

const paymentClass: Record<PaymentStatus, string> = {
  pending: "bg-gold-500/10 text-gold-600",
  paid: "bg-mint/25 text-forest-700",
  refunded: "bg-clay-500/10 text-clay-600",
};

const PAGE_SIZE = 10;

type ListResponse = { orders: Order[]; total: number; page: number; pageSize: number };

function formatAddress(order: Order): string {
  const address = order.address;
  if (!address) return "—";
  return [address.street, address.area, address.district, address.division, address.postcode]
    .filter(Boolean)
    .join(", ");
}

/** Admin order list, filters and status/payment updates via the API. */
export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("Confirmed");
  const [nextPayment, setNextPayment] = useState<PaymentStatus>("pending");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (tab !== "all") params.set("status", tab.toLowerCase().replace(/\s+/g, "_"));
      if (paymentFilter) params.set("payment", paymentFilter);
      if (query) params.set("q", query);
      const data = await accountFetch<ListResponse>(`/api/admin/orders?${params}`);
      setOrders(data.orders ?? []);
      setTotal(data.total ?? 0);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [page, tab, paymentFilter, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const openOrder = (order: Order) => {
    setActive(order);
    setNextStatus(order.status);
    setNextPayment(order.paymentStatus);
    setNotice("");
  };

  const save = () => {
    if (!active) return;
    setNotice("");
    startTransition(async () => {
      try {
        const result = await accountFetch<{
          id: string;
          status: string;
          paymentStatus: string;
        }>(`/api/admin/orders/${encodeURIComponent(active.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus, paymentStatus: nextPayment }),
        });
        const updated: Order = {
          ...active,
          status: normaliseOrderStatus(result.status),
          paymentStatus: (result.paymentStatus as PaymentStatus) ?? active.paymentStatus,
        };
        setOrders((current) =>
          current.map((order) => (order.id === updated.id ? updated : order)),
        );
        setActive(updated);
        setNotice("Order updated in the database.");
        void load();
      } catch (reason) {
        setNotice(reason instanceof Error ? reason.message : "Could not update the order.");
      }
    });
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Orders</h1>
        <p className="mt-1 text-[12px] text-muted">
          Search, filter and manage every order — all data comes from the database.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-[8px] border border-gold-300 bg-gold-300/15 px-3 py-2.5 text-[11px] text-ink">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-gold-600" /> {error}
        </div>
      )}

      <section aria-label="Order metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total orders", value: total, icon: ShoppingBag, tone: "bg-brand-50 text-brand-700" },
          { label: "Confirmed", value: orders.filter((o) => o.status === "Confirmed").length, icon: Check, tone: "bg-mint/25 text-forest-700" },
          { label: "Processing", value: orders.filter((o) => o.status === "Processing").length, icon: Clock3, tone: "bg-gold-500/10 text-gold-600" },
          { label: "Page value", value: formatPrice(totalValue), icon: CreditCard, tone: "bg-lavender/40 text-brand-800" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[10px] border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted">{stat.label}</p>
                <p className="mt-1.5 font-display text-xl font-bold text-ink">{stat.value}</p>
              </div>
              <span className={cn("grid h-9 w-9 place-items-center rounded-[8px]", stat.tone)}>
                <stat.icon size={15} />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[10px] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => { setTab(item.value); setPage(1); }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[10px] font-medium",
                  tab === item.value
                    ? "bg-brand-600 text-white"
                    : "bg-canvas text-muted hover:bg-brand-50 hover:text-brand-700",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="relative block min-w-[180px] flex-1 sm:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search order or customer…"
              aria-label="Search orders"
              className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink"
            />
          </label>
          <select
            value={paymentFilter}
            onChange={(event) => { setPaymentFilter(event.target.value); setPage(1); }}
            aria-label="Filter by payment status"
            className="h-9 rounded-[4px] border border-line bg-white px-2 text-[11px]"
          >
            <option value="">All payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/70 text-[9px] uppercase tracking-[0.1em] text-muted">
                <th className="px-4 py-2.5 font-semibold sm:px-5">Order</th>
                <th className="px-2 py-2.5 font-semibold">Customer</th>
                <th className="px-2 py-2.5 font-semibold">Total</th>
                <th className="px-2 py-2.5 font-semibold">Payment</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-2 py-2.5 font-semibold">Date</th>
                <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-50/30">
                  <td className="px-4 py-3 text-[11px] font-semibold text-ink sm:px-5">{order.id}</td>
                  <td className="px-2 py-3">
                    <p className="text-[11px] font-medium text-ink">{order.address?.name || "Guest customer"}</p>
                    <p className="text-[9px] text-muted">{order.address?.phone || "—"}</p>
                  </td>
                  <td className="px-2 py-3 text-[11px] font-semibold text-ink">{formatPrice(order.total)}</td>
                  <td className="px-2 py-3">
                    <p className="text-[10px] text-body">{paymentLabels[order.paymentMethod]}</p>
                    <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-medium", paymentClass[order.paymentStatus])}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <span className={cn("rounded-full px-2 py-1 text-[9px] font-medium", statusClass[order.status])}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-[10px] text-muted">{formatOrderDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line px-3 text-[10px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="py-10 text-center text-[11px] text-muted">Loading orders…</p>}
          {!loading && orders.length === 0 && (
            <p className="py-10 text-center text-[11px] text-muted">No orders match these filters.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
          <span>{total} orders · Page {page} of {pages}</span>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-[4px] border border-line px-2.5 py-1 disabled:opacity-40">Previous</button>
            <button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="rounded-[4px] border border-line px-2.5 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" aria-label="Close order details" onClick={() => setActive(null)} className="absolute inset-0 bg-ink/40" />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-600">Order details</p>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">{active.id}</h2>
                <p className="text-[10px] text-muted">{formatOrderDate(active.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setActive(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-ink">
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div className="space-y-1 rounded-[8px] border border-line bg-canvas/60 p-3 text-[10px] text-body">
                <p className="font-semibold text-ink">{active.address?.name || "Guest customer"}</p>
                <p>{active.address?.email || "—"}</p>
                <p>{active.address?.phone || "—"}</p>
                <p>{formatAddress(active)}</p>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold text-ink">Items</p>
                <ul className="space-y-2">
                  {active.items.map((item, index) => (
                    <li key={`${item.slug}-${index}`} className="flex justify-between gap-3 rounded-[8px] border border-line p-3 text-[11px]">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{item.title}</span>
                        <span className="text-[9px] text-muted">Qty {item.quantity} × {formatPrice(item.price)}</span>
                      </span>
                      <span className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-line pt-3 text-[11px]">
                  <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatPrice(active.subtotal)}</span></div>
                  <div className="flex justify-between text-muted"><span>Delivery</span><span>{formatPrice(active.deliveryCharge)}</span></div>
                  <div className="flex justify-between font-semibold text-ink"><span>Total</span><span>{formatPrice(active.total)}</span></div>
                </div>
              </div>
              <div className="space-y-1.5 rounded-[8px] border border-line bg-canvas/60 p-3 text-[10px] text-body">
                <p className="flex items-center gap-2"><Truck size={12} className="text-brand-600" /> {deliveryLabels[active.deliveryMethod]}</p>
                <p className="flex items-center gap-2"><CheckCircle2 size={12} className="text-brand-600" /> {paymentLabels[active.paymentMethod]}{active.paymentNumber ? ` · ${active.paymentNumber}` : ""}</p>
                <p className="flex items-center gap-2"><PackageCheck size={12} className="text-brand-600" /> {statusClass[active.status] ? active.status : active.status}</p>
                {active.note && <p className="mt-1 text-muted">Note: {active.note}</p>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-ink">Order status</span>
                  <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value as OrderStatus)} className="w-full rounded-[4px] border border-line bg-white px-2 py-2 text-[11px]">
                    {tabs.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-semibold text-ink">Payment status</span>
                  <select value={nextPayment} onChange={(event) => setNextPayment(event.target.value as PaymentStatus)} className="w-full rounded-[4px] border border-line bg-white px-2 py-2 text-[11px]">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </label>
              </div>
              {notice && <p role="status" className="text-[10px] text-brand-700">{notice}</p>}
            </div>
            <div className="border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="h-9 w-full rounded-[4px] bg-brand-600 text-[11px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save order"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
