"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  UserRound,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { formatOrderDate, type Order } from "@/lib/orders";
import { cn, formatPrice } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "New";
};

type Detail = {
  customer: Customer;
  orders: Order[];
  addresses: { id: string; label: string; name: string; phone: string; city: string; street: string; isDefault: boolean }[];
};

type ListResponse = {
  customers: Customer[];
  total: number;
  newCount: number;
  totalSpend: number;
  page: number;
  pageSize: number;
};

const PAGE_SIZE = 10;

/** Customer directory backed by /api/admin/customers. */
export function CustomersManager() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (query) params.set("q", query);
      const data = await accountFetch<ListResponse>(`/api/admin/customers?${params}`);
      setRows(data.customers);
      setTotal(data.total);
      setTotalSpend(data.totalSpend);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load customers.");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const openDetail = async (customer: Customer) => {
    setDetailLoading(true);
    try {
      const data = await accountFetch<Detail>(
        `/api/admin/customers/${encodeURIComponent(customer.id)}`,
      );
      setDetail(data);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load customer details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const visible = status
    ? rows.filter((customer) => customer.status === status)
    : rows;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const stats = [
    { label: "Total customers", value: total, icon: UsersRound, tone: "bg-brand-50 text-brand-700" },
    { label: "New this month", value: rows.filter((c) => c.status === "New").length, icon: UserRound, tone: "bg-gold-500/10 text-gold-600" },
    { label: "Orders placed", value: rows.reduce((sum, c) => sum + c.orders, 0), icon: ShoppingBag, tone: "bg-mint/25 text-forest-700" },
    { label: "Customer spend", value: formatPrice(totalSpend), icon: Wallet, tone: "bg-lavender/40 text-brand-800" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Customers</h1>
        <p className="mt-1 text-[12px] text-muted">
          Account details, order history and spending — loaded from the database.
        </p>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-[8px] border border-gold-300 bg-gold-300/15 px-3 py-2.5 text-[11px] text-ink">
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-gold-600" /> {error}
        </div>
      )}

      <section aria-label="Customer metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
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
          <label className="relative block min-w-[180px] flex-1 sm:max-w-xs">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(1); }}
              placeholder="Search name, email, phone or city…"
              aria-label="Search customers"
              className="h-9 w-full rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
            className="h-9 rounded-[4px] border border-line bg-white px-2 text-[11px]"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-line bg-canvas/70 text-[9px] uppercase tracking-[0.1em] text-muted">
                <th className="px-4 py-2.5 font-semibold sm:px-5">Customer</th>
                <th className="px-2 py-2.5 font-semibold">Phone</th>
                <th className="px-2 py-2.5 font-semibold">City</th>
                <th className="px-2 py-2.5 font-semibold">Orders</th>
                <th className="px-2 py-2.5 font-semibold">Spent</th>
                <th className="px-2 py-2.5 font-semibold">Joined</th>
                <th className="px-4 py-2.5 text-right font-semibold sm:px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((customer) => (
                <tr key={customer.id} className="hover:bg-brand-50/30">
                  <td className="px-4 py-3 sm:px-5">
                    <p className="text-[11px] font-semibold text-ink">{customer.name}</p>
                    <p className="text-[9px] text-muted">{customer.email}</p>
                  </td>
                  <td className="px-2 py-3 text-[10px] text-body">{customer.phone || "—"}</td>
                  <td className="px-2 py-3 text-[10px] text-muted">{customer.city || "—"}</td>
                  <td className="px-2 py-3 text-[10px] text-ink">{customer.orders}</td>
                  <td className="px-2 py-3 text-[10px] font-semibold text-ink">{formatPrice(customer.spent)}</td>
                  <td className="px-2 py-3 text-[10px] text-muted">
                    {new Date(customer.joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right sm:px-5">
                    <button
                      type="button"
                      onClick={() => openDetail(customer)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-line px-3 text-[10px] font-medium text-ink hover:border-brand-300 hover:text-brand-700"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="py-10 text-center text-[11px] text-muted">Loading customers…</p>}
          {!loading && visible.length === 0 && (
            <p className="py-10 text-center text-[11px] text-muted">No customers match your search.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 text-[10px] text-muted sm:px-5">
          <span>{total} customers · Page {page} of {pages}</span>
          <div className="flex gap-1.5">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-[4px] border border-line px-2.5 py-1 disabled:opacity-40">Previous</button>
            <button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages} className="rounded-[4px] border border-line px-2.5 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" aria-label="Close customer details" onClick={() => setDetail(null)} className="absolute inset-0 bg-ink/40" />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-600">Customer details</p>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">{detail?.customer.name ?? "Loading…"}</h2>
              </div>
              <button type="button" onClick={() => setDetail(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-[4px] border border-line text-muted hover:text-ink">
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {detailLoading && <p className="text-[11px] text-muted">Loading customer details…</p>}
              {detail && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-[8px] border border-line p-3">
                      <p className="text-[9px] text-muted">Orders</p>
                      <p className="mt-1 font-display text-xl font-bold text-ink">{detail.orders.length}</p>
                    </div>
                    <div className="rounded-[8px] border border-line p-3">
                      <p className="text-[9px] text-muted">Total spent</p>
                      <p className="mt-1 font-display text-xl font-bold text-ink">{formatPrice(detail.orders.reduce((sum, o) => sum + o.total, 0))}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold text-ink">Contact & account</p>
                    <div className="space-y-1.5 rounded-[8px] border border-line bg-canvas/60 p-3 text-[10px] text-body">
                      <p className="flex items-center gap-2"><Mail size={12} className="text-brand-600" /> {detail.customer.email}</p>
                      <p className="flex items-center gap-2"><Phone size={12} className="text-brand-600" /> {detail.customer.phone || "—"}</p>
                      <p className="flex items-center gap-2"><MapPin size={12} className="text-brand-600" /> {detail.customer.city || "—"}</p>
                      <p>Joined {new Date(detail.customer.joined).toLocaleDateString()} · {detail.customer.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold text-ink">Order history</p>
                    <div className="space-y-2">
                      {detail.orders.length === 0 && <p className="text-[10px] text-muted">No orders yet.</p>}
                      {detail.orders.map((order) => (
                        <div key={order.id} className="rounded-[8px] border border-line p-3">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-semibold text-ink">{order.id}</p>
                            <p className="text-[10px] font-semibold text-ink">{formatPrice(order.total)}</p>
                          </div>
                          <p className="mt-1 text-[9px] text-muted">
                            {formatOrderDate(order.createdAt)} · {order.status} · {order.items.length} item(s)
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-semibold text-ink">Saved addresses</p>
                    <div className="space-y-2">
                      {detail.addresses.length === 0 && <p className="text-[10px] text-muted">No saved addresses.</p>}
                      {detail.addresses.map((address) => (
                        <div key={address.id} className="rounded-[8px] border border-line p-3 text-[10px]">
                          <p className="font-semibold text-ink">
                            {address.label}{address.isDefault ? " · Default" : ""}
                          </p>
                          <p className="mt-1 text-muted">{address.name} · {address.phone}</p>
                          <p className="text-muted">{address.street}, {address.city}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
