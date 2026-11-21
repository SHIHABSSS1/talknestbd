"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useSession } from "@/lib/auth-client";
import { accountFetch } from "@/lib/account-client";

export type StoreKind = "book" | "sunnah" | "audio";

export interface CartItem {
  slug: string;
  kind: StoreKind;
  title: string;
  price: number;
  meta?: string;
  quantity: number;
}

interface StoreContextValue {
  items: CartItem[];
  wishlist: string[];
  toast: string | null;
  cartCount: number;
  cartTotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string, kind: StoreKind) => void;
  setQuantity: (slug: string, kind: StoreKind, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  notify: (message: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "talknestbd-cart-v1";
const WISH_KEY = "talknestbd-wishlist-v1";

const subscribeNoop = () => () => {};

/**
 * True only once React has finished hydrating the calling tree.
 *
 * Reading a localStorage-backed flag from the provider is not enough here:
 * the provider sits outside the route/header Suspense boundaries, so its
 * effect can flip the flag before a streamed boundary hydrates, which makes
 * the first client render disagree with the server HTML. `getServerSnapshot`
 * keeps every consumer on `false` during hydration and switches to `true`
 * afterwards.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    const savedWishlist = readJSON<string[]>(WISH_KEY, []);
    if (Array.isArray(savedWishlist)) setWishlist(savedWishlist);

    const guestCart = readJSON<CartItem[]>(CART_KEY, []).filter(
      (item) => item && item.slug && item.quantity > 0,
    );

    if (!userId) {
      setItems(guestCart);
      setHydrated(true);
      return;
    }

    // Signed in: pull the account cart from the API and merge any guest cart
    // once per login, then keep localStorage for future guest visits only.
    let cancelled = false;
    (async () => {
      try {
        if (guestCart.length && syncedFor.current !== userId) {
          await Promise.all(
            guestCart.map((item) =>
              accountFetch("/api/cart", {
                method: "POST",
                body: JSON.stringify(item),
              }).catch(() => undefined),
            ),
          );
          syncedFor.current = userId;
          window.localStorage.removeItem(CART_KEY);
        }
        const data = await accountFetch<{ items: CartItem[] }>("/api/cart");
        if (!cancelled) setItems(data.items ?? []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    // Guest carts still persist locally; account carts live in Postgres.
    if (!hydrated || userId) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated, userId]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((previous) => {
        const found = previous.find(
          (line) => line.slug === item.slug && line.kind === item.kind,
        );
        if (found) {
          return previous.map((line) =>
            line === found ? { ...line, quantity: line.quantity + quantity } : line,
          );
        }
        return [...previous, { ...item, quantity }];
      });
      if (userId) {
        void accountFetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({ ...item, quantity }),
        }).catch(() => undefined);
      }
      notify("Added to cart");
    },
    [notify, userId],
  );

  const removeItem = useCallback(
    (slug: string, kind: StoreKind) => {
      setItems((previous) =>
        previous.filter((line) => !(line.slug === slug && line.kind === kind)),
      );
      if (userId) {
        void accountFetch("/api/cart", {
          method: "DELETE",
          body: JSON.stringify({ slug, kind }),
        }).catch(() => undefined);
      }
    },
    [userId],
  );

  const setQuantity = useCallback(
    (slug: string, kind: StoreKind, quantity: number) => {
      setItems((previous) =>
        quantity < 1
          ? previous.filter((line) => !(line.slug === slug && line.kind === kind))
          : previous.map((line) =>
              line.slug === slug && line.kind === kind ? { ...line, quantity } : line,
            ),
      );
      if (userId) {
        void accountFetch("/api/cart", {
          method: "PATCH",
          body: JSON.stringify({ slug, kind, quantity }),
        }).catch(() => undefined);
      }
    },
    [userId],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (userId) {
      void accountFetch("/api/cart?all=true", { method: "DELETE" }).catch(
        () => undefined,
      );
    } else {
      window.localStorage.removeItem(CART_KEY);
    }
  }, [userId]);

  const toggleWishlist = useCallback(
    (slug: string) => {
      setWishlist((previous) => {
        const exists = previous.includes(slug);
        notify(exists ? "Removed from wishlist" : "Added to wishlist");
        return exists ? previous.filter((item) => item !== slug) : [...previous, slug];
      });
    },
    [notify],
  );

  const isWishlisted = useCallback(
    (slug: string) => wishlist.includes(slug),
    [wishlist],
  );

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      wishlist,
      toast,
      cartCount,
      cartTotal,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      notify,
    }),
    [
      items,
      wishlist,
      toast,
      cartCount,
      cartTotal,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      notify,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
