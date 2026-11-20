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
import {
  resetWholesaleContent,
  saveWholesaleContent,
} from "@/lib/actions/wholesale";
import type { SaveResult } from "@/lib/wholesale-content";
import {
  cloneWholesaleDefaults,
  type WholesaleContent,
} from "@/lib/wholesale-content";
import type { WholesaleRequest } from "@/lib/wholesale-requests";

interface WholesaleContentContextValue {
  content: WholesaleContent;
  /** Always true — the document arrives from the server, not localStorage. */
  hydrated: boolean;
  save: (next: WholesaleContent) => Promise<SaveResult>;
  reset: () => Promise<SaveResult>;
}

const WholesaleContentContext = createContext<WholesaleContentContextValue | null>(null);

export function WholesaleContentProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: WholesaleContent;
}) {
  const [content, setContent] = useState<WholesaleContent>(
    initialContent ?? cloneWholesaleDefaults(),
  );

  const save = useCallback(async (next: WholesaleContent) => {
    try {
      const result = await saveWholesaleContent(next);
      if (result.ok) setContent(next);
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not save the content.",
      };
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      const result = await resetWholesaleContent();
      if (result.ok) setContent(cloneWholesaleDefaults());
      return result;
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Could not reset the content.",
      };
    }
  }, []);

  const value = useMemo(
    () => ({ content, hydrated: true, save, reset }),
    [content, save, reset],
  );

  return (
    <WholesaleContentContext.Provider value={value}>
      {children}
    </WholesaleContentContext.Provider>
  );
}

export function useWholesaleContent(): WholesaleContentContextValue {
  const context = useContext(WholesaleContentContext);
  if (!context) {
    throw new Error(
      "useWholesaleContent must be used within a WholesaleContentProvider",
    );
  }
  return context;
}

interface WholesaleRequestsContextValue {
  requests: WholesaleRequest[];
  hydrated: boolean;
  /** Public submit — the server owns id/status/createdAt/userId. */
  add: (request: WholesaleRequest) => Promise<SaveResult>;
  update: (id: string, patch: Partial<WholesaleRequest>) => Promise<SaveResult>;
  remove: (id: string) => Promise<SaveResult>;
  clear: () => void;
}

const WholesaleRequestsContext = createContext<WholesaleRequestsContextValue | null>(null);

export function WholesaleRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<WholesaleRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/wholesale-requests", { cache: "no-store" });
      if (!response.ok) {
        setRequests([]);
        return;
      }
      const data = (await response.json()) as { requests?: WholesaleRequest[] };
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

  const add = useCallback(async (request: WholesaleRequest) => {
    try {
      const response = await fetch("/api/wholesale-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: request.organization,
          contact: request.contact,
          phone: request.phone,
          email: request.email,
          city: request.city,
          quantity: request.quantity,
          message: request.message,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { request?: WholesaleRequest; error?: string }
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
    async (id: string, patch: Partial<WholesaleRequest>) => {
      try {
        const response = await fetch("/api/wholesale-requests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: patch.status, adminNote: patch.adminNote }),
        });
        const data = (await response.json().catch(() => null)) as
          | { request?: WholesaleRequest; error?: string }
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
      const response = await fetch("/api/wholesale-requests", {
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
    <WholesaleRequestsContext.Provider value={value}>
      {children}
    </WholesaleRequestsContext.Provider>
  );
}

export function useWholesaleRequests(): WholesaleRequestsContextValue {
  const context = useContext(WholesaleRequestsContext);
  if (!context) {
    throw new Error(
      "useWholesaleRequests must be used within a WholesaleRequestsProvider",
    );
  }
  return context;
}
