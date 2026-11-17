/** Customer sell requests raised from the calculator on /sell-used-books. */

export type SellRequestStatus = "New" | "Contacted" | "Completed";

export interface SellRequest {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  bookTitle: string;
  purchasePrice: number;
  condition: string;
  rate: number;
  amount: number;
  status: SellRequestStatus;
}

export const SELL_REQUESTS_KEY = "talknestbd-sell-requests-v1";

export const sellRequestStatuses: SellRequestStatus[] = [
  "New",
  "Contacted",
  "Completed",
];

function isRequest(value: unknown): value is SellRequest {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.name === "string" &&
    typeof item.phone === "string" &&
    typeof item.email === "string" &&
    typeof item.address === "string" &&
    typeof item.bookTitle === "string" &&
    typeof item.purchasePrice === "number" &&
    typeof item.condition === "string" &&
    typeof item.rate === "number" &&
    typeof item.amount === "number" &&
    typeof item.status === "string" &&
    sellRequestStatuses.includes(item.status as SellRequestStatus)
  );
}

export function readSellRequests(): SellRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SELL_REQUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every(isRequest) ? parsed : [];
  } catch {
    return [];
  }
}

export function addSellRequest(request: SellRequest): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SELL_REQUESTS_KEY,
      JSON.stringify([request, ...readSellRequests()]),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function updateSellRequest(id: string, patch: Partial<SellRequest>): void {
  if (typeof window === "undefined") return;
  try {
    const next = readSellRequests().map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
    window.localStorage.setItem(SELL_REQUESTS_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function removeSellRequest(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      SELL_REQUESTS_KEY,
      JSON.stringify(readSellRequests().filter((item) => item.id !== id)),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function clearSellRequests(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SELL_REQUESTS_KEY);
  } catch {
    // localStorage may be unavailable — demo only.
  }
}
