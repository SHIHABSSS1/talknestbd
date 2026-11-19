/**
 * Shared order/address types and formatting helpers.
 *
 * Data is no longer stored in localStorage. Account data lives in Postgres and
 * is read/written through /api/account/** with the Better Auth session cookie.
 */
export type PaymentMethod = "cod" | "bkash" | "nagad";
export type DeliveryMethod = "standard" | "express" | "pickup";

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  area: string;
  street: string;
  postcode?: string;
  isDefault: boolean;
}

export interface OrderItem {
  slug: string;
  kind: "book" | "sunnah" | "audio";
  title: string;
  meta?: string;
  price: number;
  quantity: number;
}

export type AddressFormValues = Omit<SavedAddress, "id" | "isDefault">;

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  address: AddressFormValues;
  note?: string;
  paymentNumber?: string;
  status: "Confirmed" | "Processing" | "Out for delivery";
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  city: string;
}

export const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
};

export const deliveryLabels: Record<DeliveryMethod, string> = {
  standard: "Standard delivery",
  express: "Express delivery",
  pickup: "Store pickup",
};

export function generateOrderId(): string {
  const now = new Date();
  const date = [
    now.getFullYear().toString().slice(-2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TNB-${date}-${random}`;
}

export function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleDateString("en-GB");
  }
}
