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
  addSellRequest,
  clearSellRequests,
  readSellRequests,
  removeSellRequest,
  SELL_REQUESTS_KEY,
  updateSellRequest,
  type SellRequest,
} from "@/lib/sell-requests";

interface SellRequestsContextValue {
  requests: SellRequest[];
  hydrated: boolean;
  add: (request: SellRequest) => void;
  update: (id: string, patch: Partial<SellRequest>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const SellRequestsContext = createContext<SellRequestsContextValue | null>(null);

export function SellRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRequests(readSellRequests());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === SELL_REQUESTS_KEY || event.key === null) {
        setRequests(readSellRequests());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((request: SellRequest) => {
    addSellRequest(request);
    setRequests(readSellRequests());
  }, []);

  const update = useCallback((id: string, patch: Partial<SellRequest>) => {
    updateSellRequest(id, patch);
    setRequests(readSellRequests());
  }, []);

  const remove = useCallback((id: string) => {
    removeSellRequest(id);
    setRequests(readSellRequests());
  }, []);

  const clear = useCallback(() => {
    clearSellRequests();
    setRequests([]);
  }, []);

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
    throw new Error("useSellRequests must be used within a SellRequestsProvider");
  }
  return context;
}
