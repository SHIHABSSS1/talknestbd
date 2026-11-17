/** Wholesale quote requests submitted from the /wholesale form. */

export type WholesaleRequestStatus = "New" | "Contacted" | "Completed";

export interface WholesaleRequest {
  id: string;
  createdAt: string;
  organization: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  quantity: string;
  message: string;
  status: WholesaleRequestStatus;
}

export const WHOLESALE_REQUESTS_KEY = "talknestbd-wholesale-requests-v1";

export const wholesaleRequestStatuses: WholesaleRequestStatus[] = [
  "New",
  "Contacted",
  "Completed",
];

function isRequest(value: unknown): value is WholesaleRequest {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.organization === "string" &&
    typeof item.contact === "string" &&
    typeof item.phone === "string" &&
    typeof item.email === "string" &&
    typeof item.city === "string" &&
    typeof item.quantity === "string" &&
    typeof item.message === "string" &&
    typeof item.status === "string" &&
    wholesaleRequestStatuses.includes(item.status as WholesaleRequestStatus)
  );
}

export function readWholesaleRequests(): WholesaleRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WHOLESALE_REQUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every(isRequest) ? parsed : [];
  } catch {
    return [];
  }
}

export function addWholesaleRequest(request: WholesaleRequest): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      WHOLESALE_REQUESTS_KEY,
      JSON.stringify([request, ...readWholesaleRequests()]),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function updateWholesaleRequest(
  id: string,
  patch: Partial<WholesaleRequest>,
): void {
  if (typeof window === "undefined") return;
  try {
    const next = readWholesaleRequests().map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
    window.localStorage.setItem(WHOLESALE_REQUESTS_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function removeWholesaleRequest(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      WHOLESALE_REQUESTS_KEY,
      JSON.stringify(readWholesaleRequests().filter((item) => item.id !== id)),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}
