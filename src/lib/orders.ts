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

const ORDERS_KEY = "talknestbd-orders-v1";
const ADDRESS_KEY = "talknestbd-addresses-v1";
const PROFILE_KEY = "talknestbd-profile-v1";

export const defaultProfile: Profile = {
  name: "Tanha Rahman",
  email: "tanha@example.com",
  phone: "+880 1712-000000",
  city: "Dhaka",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable in private mode.
  }
}

export function readOrders(): Order[] {
  const orders = read<Order[]>(ORDERS_KEY, []);
  return Array.isArray(orders) ? orders : [];
}

export function saveOrder(order: Order) {
  const orders = readOrders();
  write(ORDERS_KEY, [order, ...orders]);
}

export function readOrder(id: string): Order | undefined {
  return readOrders().find((order) => order.id === id);
}

export function readAddresses(): SavedAddress[] {
  const addresses = read<SavedAddress[]>(ADDRESS_KEY, []);
  return Array.isArray(addresses) ? addresses : [];
}

export function saveAddress(address: Omit<SavedAddress, "id">): SavedAddress {
  const addresses = readAddresses();
  const entry: SavedAddress = {
    ...address,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `addr-${Date.now()}`,
  };
  const next = address.isDefault
    ? [entry, ...addresses.map((item) => ({ ...item, isDefault: false }))]
    : [entry, ...addresses];
  write(ADDRESS_KEY, next);
  return entry;
}

export function removeAddress(id: string) {
  write(
    ADDRESS_KEY,
    readAddresses().filter((address) => address.id !== id),
  );
}

export function makeDefaultAddress(id: string) {
  write(
    ADDRESS_KEY,
    readAddresses().map((address) => ({
      ...address,
      isDefault: address.id === id,
    })),
  );
}

export function readProfile(): Profile {
  return { ...defaultProfile, ...read<Partial<Profile>>(PROFILE_KEY, {}) };
}

export function saveProfile(profile: Profile) {
  write(PROFILE_KEY, profile);
}

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
