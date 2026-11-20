import "server-only";

import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { books } from "@/data/books";
import { upSaleBooks } from "@/data/community";
import { sunnahItems } from "@/data/sunnah";
import { auth } from "@/lib/auth";
import { audioPrice } from "@/lib/audio";
import type {
  AddressFormValues,
  Order,
  OrderItem,
  SavedAddress,
} from "@/lib/orders";

export async function getApiSession(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export function unauthorized() {
  return NextResponse.json({ error: "Sign in required." }, { status: 401 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Not found.") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export const addressSchema = z.object({
  label: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email().optional(),
  division: z.string().trim().min(1).max(80),
  district: z.string().trim().min(1).max(80),
  area: z.string().trim().min(1).max(80),
  street: z.string().trim().min(1).max(200),
  postcode: z.string().trim().max(20).optional(),
  isDefault: z.boolean().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().max(40).optional(),
  city: z.string().trim().max(80).optional(),
});

export const orderSchema = z.object({
  id: z.string().trim().min(4).max(40).optional(),
  items: z
    .array(
      z.object({
        slug: z.string().trim().min(1),
        kind: z.enum(["book", "sunnah", "audio"]),
        title: z.string().trim().min(1),
        meta: z.string().optional(),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .min(1)
    .max(100),
  subtotal: z.number().nonnegative(),
  deliveryCharge: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["cod", "bkash", "nagad"]),
  deliveryMethod: z.enum(["standard", "express", "pickup"]),
  address: addressSchema.omit({ isDefault: true }),
  note: z.string().trim().max(500).optional(),
  paymentNumber: z.string().trim().max(40).optional(),
  status: z.enum(["Confirmed", "Processing", "Out for delivery"]).optional(),
});

export function newId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function money(value: string | number): number {
  return Number(value);
}

export function mapAddress(row: {
  id: string;
  label: string;
  name: string;
  phone: string;
  email: string | null;
  division: string;
  district: string;
  area: string;
  street: string;
  postcode: string | null;
  isDefault: boolean;
}): SavedAddress {
  return {
    id: row.id,
    label: row.label,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    division: row.division,
    district: row.district,
    area: row.area,
    street: row.street,
    postcode: row.postcode ?? undefined,
    isDefault: row.isDefault,
  };
}

export function toAddressDb(values: AddressFormValues & { isDefault?: boolean }) {
  return {
    label: values.label,
    name: values.name,
    phone: values.phone,
    email: values.email || null,
    division: values.division,
    district: values.district,
    area: values.area,
    street: values.street,
    postcode: values.postcode || null,
    isDefault: values.isDefault ?? false,
  };
}

/** DB rows store lowercase slugs; the UI uses title-case labels. */
export function normaliseOrderStatus(status: string): Order["status"] {
  const value = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (value === "out_for_delivery" || value === "outfordelivery") {
    return "Out for delivery";
  }
  if (value === "processing") return "Processing";
  if (value === "confirmed") return "Confirmed";
  return "Confirmed";
}

export function mapOrder(
  row: {
    id: string;
    createdAt: Date;
    subtotal: string;
    deliveryCharge: string;
    total: string;
    paymentMethod: string;
    paymentNumber: string | null;
    deliveryMethod: string;
    addressSnapshot: unknown;
    note: string | null;
    status: string;
  },
  items: OrderItem[],
): Order {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    items,
    subtotal: money(row.subtotal),
    deliveryCharge: money(row.deliveryCharge),
    total: money(row.total),
    paymentMethod: row.paymentMethod as Order["paymentMethod"],
    deliveryMethod: row.deliveryMethod as Order["deliveryMethod"],
    address: row.addressSnapshot as AddressFormValues,
    note: row.note ?? undefined,
    paymentNumber: row.paymentNumber ?? undefined,
    status: normaliseOrderStatus(row.status),
  };
}

/**
 * Re-reads the unit price from the catalogue instead of trusting the browser.
 * Returns null for unknown slugs so the order is rejected rather than priced
 * with a client-supplied number.
 */
export function resolveUnitPrice(slug: string, kind: OrderItem["kind"]): number | null {
  if (kind === "book") {
    const book = books.find((item) => item.slug === slug);
    if (book) return book.price;
    const used = upSaleBooks.find((item) => item.cartSlug === slug);
    return used?.price ?? null;
  }
  if (kind === "sunnah") {
    return sunnahItems.find((item) => item.slug === slug)?.price ?? null;
  }
  const audioBook = books.find((item) => item.slug === slug);
  return audioBook ? audioPrice(audioBook) : null;
}
