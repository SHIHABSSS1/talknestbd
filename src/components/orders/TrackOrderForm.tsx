"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import {
  deliveryLabels,
  formatOrderDate,
  normaliseOrderStatus,
  paymentLabels,
  type Order,
} from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";

const steps = ["Confirmed", "Processing", "Out for delivery"] as const;

export function TrackOrderForm({ initialId = "" }: { initialId?: string }) {
  const [id, setId] = useState(() => {
    if (initialId) return initialId;
    if (typeof window === "undefined") return "";
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("talknestbd-guest-orders") || "{}",
      ) as Record<string, string>;
      const ids = Object.keys(saved);
      return ids[ids.length - 1] ?? "";
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const track = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setOrder(null);
    if (!id.trim() || !email.trim()) {
      setError("Enter your order number and the email used at checkout.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ id: id.trim(), email: email.trim() });
      const data = await accountFetch<{ order: Order }>(`/api/guest/orders?${params}`);
      setOrder(data.order);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not find that order.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? steps.indexOf(normaliseOrderStatus(order.status) as (typeof steps)[number]) : -1;

  return (
    <div className="space-y-6">
      <form onSubmit={track} className="rounded-3xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-ink">Order number</span>
            <input
              value={id}
              onChange={(event) => setId(event.target.value)}
              placeholder="TNB-261121-1234"
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[13px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold text-ink">Email used at checkout</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[13px] text-ink placeholder:text-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15"
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="mt-3 flex items-start gap-1.5 text-[11px] text-clay-600">
            <AlertCircle size={13} className="mt-0.5 shrink-0" /> {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-forest-900 px-5 text-[11px] font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-50"
        >
          <Search size={14} /> {loading ? "Tracking…" : "Track order"}
        </button>
        <p className="mt-3 text-[10px] text-muted">
          Signed in? View all orders in your <Link href="/account/orders" className="font-semibold text-brand-700 hover:underline">account</Link> instead.
        </p>
      </form>

      {order && (
        <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-700">Order {order.id}</p>
              <h2 className="mt-1 font-display text-xl font-bold text-ink">Status: {normaliseOrderStatus(order.status)}</h2>
              <p className="mt-1 text-[10px] text-muted">Placed {formatOrderDate(order.createdAt)}</p>
            </div>
            <p className="font-display text-xl font-bold text-ink">{formatPrice(order.total)}</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => {
              const done = index <= currentStep;
              return (
                <div
                  key={step}
                  className={cn(
                    "rounded-2xl border p-4",
                    done ? "border-brand-200 bg-brand-50/60" : "border-line bg-canvas/60",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("grid h-8 w-8 place-items-center rounded-full", done ? "bg-brand-600 text-white" : "bg-cream-300 text-muted")}>
                      {step === "Confirmed" ? <CheckCircle2 size={15} /> : step === "Processing" ? <PackageCheck size={15} /> : <Truck size={15} />}
                    </span>
                    <p className="text-[11px] font-semibold text-ink">{step}</p>
                  </div>
                  <p className="mt-2 text-[9px] text-muted">
                    {done ? "Completed" : "Pending"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-canvas/60 p-4 text-[11px] text-body">
              <p className="font-semibold text-ink">Delivery</p>
              <p className="mt-1">{deliveryLabels[order.deliveryMethod]}</p>
              <p className="mt-1 flex items-start gap-1.5 text-muted">
                <MapPin size={12} className="mt-0.5 shrink-0" /> {order.address?.street}, {order.address?.area}, {order.address?.district}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas/60 p-4 text-[11px] text-body">
              <p className="font-semibold text-ink">Payment</p>
              <p className="mt-1">{paymentLabels[order.paymentMethod]}</p>
              <p className="mt-1 flex items-center gap-1.5 text-muted">
                <Clock3 size={12} /> {order.paymentStatus}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-[11px] font-semibold text-ink">Items</p>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={`${item.slug}-${index}`} className="flex justify-between gap-3 rounded-xl border border-line px-3 py-2 text-[11px]">
                  <span className="truncate text-ink">{item.title} <span className="text-muted">× {item.quantity}</span></span>
                  <span className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
