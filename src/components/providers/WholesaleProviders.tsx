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
  clearWholesaleContent,
  cloneWholesaleDefaults,
  readWholesaleContent,
  WHOLESALE_STORAGE_KEY,
  writeWholesaleContent,
  type SaveResult,
  type WholesaleContent,
} from "@/lib/wholesale-content";
import {
  addWholesaleRequest,
  readWholesaleRequests,
  removeWholesaleRequest,
  updateWholesaleRequest,
  WHOLESALE_REQUESTS_KEY,
  type WholesaleRequest,
} from "@/lib/wholesale-requests";

interface WholesaleContentContextValue {
  content: WholesaleContent;
  hydrated: boolean;
  save: (next: WholesaleContent) => SaveResult;
  reset: () => SaveResult;
}

const WholesaleContentContext = createContext<WholesaleContentContextValue | null>(null);
const initialContent: WholesaleContent = cloneWholesaleDefaults();

export function WholesaleContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<WholesaleContent>(initialContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readWholesaleContent());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === WHOLESALE_STORAGE_KEY || event.key === null) {
        setContent(readWholesaleContent());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: WholesaleContent) => {
    const result = writeWholesaleContent(next);
    if (result.ok) setContent(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearWholesaleContent();
    if (result.ok) setContent(cloneWholesaleDefaults());
    return result;
  }, []);

  const value = useMemo(
    () => ({ content, hydrated, save, reset }),
    [content, hydrated, save, reset],
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
    throw new Error("useWholesaleContent must be used within a WholesaleContentProvider");
  }
  return context;
}

interface WholesaleRequestsContextValue {
  requests: WholesaleRequest[];
  hydrated: boolean;
  add: (request: WholesaleRequest) => void;
  update: (id: string, patch: Partial<WholesaleRequest>) => void;
  remove: (id: string) => void;
}

const WholesaleRequestsContext = createContext<WholesaleRequestsContextValue | null>(null);

export function WholesaleRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<WholesaleRequest[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRequests(readWholesaleRequests());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === WHOLESALE_REQUESTS_KEY || event.key === null) {
        setRequests(readWholesaleRequests());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refresh = useCallback(() => setRequests(readWholesaleRequests()), []);

  const add = useCallback(
    (request: WholesaleRequest) => {
      addWholesaleRequest(request);
      refresh();
    },
    [refresh],
  );

  const update = useCallback(
    (id: string, patch: Partial<WholesaleRequest>) => {
      updateWholesaleRequest(id, patch);
      refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    (id: string) => {
      removeWholesaleRequest(id);
      refresh();
    },
    [refresh],
  );

  const value = useMemo(
    () => ({ requests, hydrated, add, update, remove }),
    [requests, hydrated, add, update, remove],
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
