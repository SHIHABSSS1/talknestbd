"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
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
  paymentLabels,
  type Order,
} from "@/lib/orders";

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

function customerName(order: Order): string {
  return order.address?.name || "Guest customer";
}

function customerPhone(order: Order): string {
  return order.address?.phone || "—";
}

function customerEmail(order: Order): string {
  return order.address?.email || "—";
}

function formatAddress(order: Order): string {
  const a = order.address;
  if (!a) return "—";
  return [a.street, a.area, a.district, a.division, a.postcode]
    .filter(Boolean)
    .join(", ");
}

/** Admin order list backed by /api/admin/orders (live Neon data). */
export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Order | null>(null);
  const [nextStatus, setNextStatus] = useState<OrderStatus>("Confirmed");
  const [notice, setNotice] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    accountFetch<Order[]>("/api/admin/orders")
      .then((rows) => {
        if (!cancelled) setOrders(rows);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : "Could not load orders.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTab = tab === "all" || order.status === tab;
      const matchesTerm =
        !term ||
        order.id.toLowerCase().includes(term) ||
        customerName(order).toLowerCase().includes(term) ||
        customerPhone(order).includes(term);
      return matchesTab && matchesTerm;
    });
  }, [orders, tab, query]);

  const stats = [
    { label: "Total orders", value: orders.length, icon: ShoppingBag, tone: "bg-brand-50 text-brand-700" },
    { label: "Confirmed", value: orders.filter((o) => o.status === "Confirmed").length, icon: Check, tone: "bg-mint/25 text-forest-700" },
    { label: "Processing", value: orders.filter((o) => o.status === "Processing").length, icon: Clock3, tone: "bg-gold-500/10 text-gold-600" },
    { label: "Out for delivery", value: orders.filter((o) => o.status === "Out for delivery").length, icon: Truck, tone: "bg-lavender/40 text-brand-800" },
  ];

  const openOrder = (order: Order) => {
    setActive(order);
    setNextStatus(order.status);
    setNotice("");
  };

  const closeDrawer = () => {
    setActive(null);
    setNotice("");
  };

  const saveStatus = () => {
    if (!active || nextStatus === active.status) return;
    setNotice("");
    startTransition(async () => {
      try {
        const result = await accountFetch<{ id: string; status: string }>(
          `/api/admin/orders/${encodeURIComponent(active.id)}`,
          { method: "PATCH", body: JSON.stringify({ status: nextStatus }) },
        );
        const status = result.status === "out_for_delivery" ? "Out for delivery" : "Confirmed";
        setOrders((current) =>
          current.map((order) => (order.id === active.id ? { ...order, status } : order)),
        );
        setActive((current) => (current ? { ...current, status } : current));
        setNotice("Status saved to the database.");
      } catch (reason) {
        setNotice(reason instanceof Error ? reason.message : "Could not update the status.");
      }
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted">
          <span>Dashboard</span><span>/</span><span className="font-semibold text-ink">Orders</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">Orders</h1>
        <p className="mt-1 text-[12px] text-muted">
          Live orders from the database — review items, delivery details and status.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-[8px] border border-gold-300 bg-gold-300/15 px-3 py-2.5 text-[11px] text-ink">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-gold-600" /> {error}
        </div>
      )}

      <section aria-label="Order metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[10px] border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-muted">{stat.label}</p>
                <p className="mt-1.5 font-display text-2xl font-bold text-ink">{stat.value}</p>
              </div>
              <span className={`grid h-9 w-9 place-items-center rounded-[8px] ${stat.tone}`}>
                <stat.icon size={15} />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[10px] border border-line bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  tab === item.value
                    ? "bg-brand-600 text-white"
                    : "bg-canvas text-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="relative ml-auto block min-w-[180px] flex-1 sm:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order or customer…"
              aria-label="Search orders"
              className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink placeholder:text-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/70 text-[9px] uppercase tracking-[0.1em] text-muted">
                <th className="px-4 py-2.5 font-semibold sm:px-5">Order</th>
                <th className="px-2 py-2.5 font-semibold">Customer</th>
                <th className="px-2 py-2.5 font-semibold">Items</th>
                <th className="px-2 py-2.5 font-semibold">Total</th>
                <th className="px-2 py-2.5 font-semibold">Payment</th>
                <th className="px-2 py-2.5 font-semibold">Status</th>
                <th className="px-2 py-2.5 font-semibold">Date</th>
                <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-brand-50/30">
                  <td className="px-4 py-3 text-[11px] font-semibold text-ink sm:px-5">{order.id}</td>
                  <td className="px-2 py-3">
                    <p className="text-[11px] font-medium text-ink">{customerName(order)}</p>
                    <p className="text-[9px] text-muted">{customerPhone(order)}</p>
                  </td>
                  <td className="px-2 py-3 text-[11px] text-body">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </td>
                  <td className="px-2 py-3 text-[11px] font-semibold text-ink">৳{order.total}</td>
                  <td className="px-2 py-3 text-[10px] text-body">{paymentLabels[order.paymentMethod]}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-[9px] font-medium ${statusClass[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-[10px] text-muted">{formatOrderDate(order.createdAt)}</td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line px-3 text-[10px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="py-12 text-center text-[12px] text-muted">Loading orders…</p>}
          {!loading && visible.length === 0 && (
            <p className="py-12 text-center text-[12px] text-muted">No orders match your filters.</p>
          )}
        </div>

        <div className="border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
          Showing {visible.length} of {orders.length} orders · Live data from the database
        </div>
      </section>

      {active && (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close order details"
            onClick={closeDrawer}
            className="absolute inset-0 bg-ink/40"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-600">Order details</p>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">{active.id}</h2>
                <p className="text-[10px] text-muted">{formatOrderDate(active.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div>
                <p className="mb-2 text-[10px] font-semibold text-ink">Customer</p>
                <div className="rounded-[8px] border border-line bg-canvas/60 p-3">
                  <p className="text-[11px] font-semibold text-ink">{customerName(active)}</p>
                  <p className="text-[10px] text-muted">{customerEmail(active)}</p>
                  <p className="text-[10px] text-muted">{customerPhone(active)}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold text-ink">Items</p>
                <ul className="space-y-2">
                  {active.items.map((item, index) => (
                    <li key={`${item.slug}-${index}`} className="flex items-start justify-between gap-3 rounded-[8px] border border-line p-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-ink">{item.title}</p>
                        <p className="text-[9px] text-muted">Qty {item.quantity} × ৳{item.price}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-ink">৳{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-line pt-3 text-[11px]">
                  <div className="flex justify-between text-muted"><span>Subtotal</span><span>৳{active.subtotal}</span></div>
                  <div className="flex justify-between text-muted"><span>Delivery</span><span>৳{active.deliveryCharge}</span></div>
                  <div className="flex justify-between font-semibold text-ink"><span>Total</span><span>৳{active.total}</span></div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold text-ink">Delivery & payment</p>
                <div className="space-y-1.5 rounded-[8px] border border-line bg-canvas/60 p-3 text-[10px] text-body">
                  <p className="flex items-start gap-2"><Truck size={12} className="mt-0.5 shrink-0 text-brand-600" /> {deliveryLabels[active.deliveryMethod]}</p>
                  <p className="flex items-start gap-2"><CreditCard size={12} className="mt-0.5 shrink-0 text-brand-600" /> {paymentLabels[active.paymentMethod]}{active.paymentNumber ? ` · ${active.paymentNumber}` : ""}</p>
                  <p className="flex items-start gap-2"><PackageCheck size={12} className="mt-0.5 shrink-0 text-brand-600" /> {formatAddress(active)}</p>
                  {active.note && <p className="pt-1 text-muted">Note: {active.note}</p>}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-semibold text-ink">Update status</p>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusClass[active.status]}`}>
                    {active.status}
                  </span>
                  <ArrowRight size={12} className="text-muted" />
                  <select
                    aria-label="New status"
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value as OrderStatus)}
                    className="h-9 flex-1 rounded-[4px] border border-line bg-white px-2 text-[11px] text-ink focus:border-brand-400 focus:outline-none"
                  >
                    {tabs.slice(1).map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
                {notice && <p className="mt-2 text-[10px] text-brand-700">{notice}</p>}
              </div>
            </div>

            <div className="border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={saveStatus}
                disabled={pending || nextStatus === active.status}
                className="h-9 w-full rounded-[4px] bg-brand-600 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save status"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
