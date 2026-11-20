"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SaveResult } from "@/lib/sell-content";
import type { SellRequest } from "@/lib/sell-requests";

interface SellRequestsContextValue {
  requests: SellRequest[];
  hydrated: boolean;
  /** Public submit from the calculator — the server owns id/status/userId. */
  add: (request: SellRequest) => Promise<SaveResult>;
  /** Admin-only status/note update. */
  update: (id: string, patch: Partial<SellRequest>) => Promise<SaveResult>;
  /** Admin-only delete. */
  remove: (id: string) => Promise<SaveResult>;
  /** Clears the local list only (no bulk server delete). */
  clear: () => void;
}

const SellRequestsContext = createContext<SellRequestsContextValue | null>(null);

/** Database-backed sell requests via /api/sell-requests. */
export function SellRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/sell-requests", { cache: "no-store" });
      if (!response.ok) {
        setRequests([]);
        return;
      }
      const data = (await response.json()) as { requests?: SellRequest[] };
      setRequests(data.requests ?? []);
    } catch {
      setRequests([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(async (request: SellRequest) => {
    try {
      const response = await fetch("/api/sell-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: request.name,
          phone: request.phone,
          email: request.email,
          address: request.address,
          bookTitle: request.bookTitle,
          purchasePrice: request.purchasePrice,
          condition: request.condition,
          rate: request.rate,
          amount: request.amount,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { request?: SellRequest; error?: string }
        | null;
      if (!response.ok) {
        return { ok: false, message: data?.error ?? "Could not submit the request." };
      }
      if (data?.request) {
        setRequests((current) => [data.request!, ...current]);
      }
      return { ok: true, message: "Request sent — we'll be in touch shortly." };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not submit the request.",
      };
    }
  }, []);

  const update = useCallback(
    async (id: string, patch: Partial<SellRequest>) => {
      try {
        const response = await fetch("/api/sell-requests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: patch.status, adminNote: patch.adminNote }),
        });
        const data = (await response.json().catch(() => null)) as
          | { request?: SellRequest; error?: string }
          | null;
        if (!response.ok) {
          return { ok: false, message: data?.error ?? "Could not update the request." };
        }
        if (data?.request) {
          setRequests((current) =>
            current.map((item) => (item.id === id ? data.request! : item)),
          );
        }
        return { ok: true, message: "Request updated." };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "Could not update the request.",
        };
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    try {
      const response = await fetch("/api/sell-requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        return { ok: false, message: data?.error ?? "Could not delete the request." };
      }
      setRequests((current) => current.filter((item) => item.id !== id));
      return { ok: true, message: "Request removed." };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not delete the request.",
      };
    }
  }, []);

  const clear = useCallback(() => setRequests([]), []);

  const value = useMemo(
    () => ({ requests, hydrated, add, update, remove, clear }),
    [requests, hydrated, add, update, remove, clear],
  );

  return (
    <SellRequestsContext.Provider value={value}>
      {children}
    </SellRequestsContext.Provider>
  );
}

export function useSellRequests(): SellRequestsContextValue {
  const context = useContext(SellRequestsContext);
  if (!context) {
    throw new Error(
      "useSellRequests must be used within a SellRequestsProvider",
    );
  }
  return context;
}
