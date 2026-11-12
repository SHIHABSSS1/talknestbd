"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  hydrated: boolean;
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

  useEffect(() => {
    const savedCart = readJSON<CartItem[]>(CART_KEY, []);
    const savedWishlist = readJSON<string[]>(WISH_KEY, []);
    if (Array.isArray(savedCart)) {
      setItems(savedCart.filter((item) => item && item.slug && item.quantity > 0));
    }
    if (Array.isArray(savedWishlist)) setWishlist(savedWishlist);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

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
      notify("Added to cart");
    },
    [notify],
  );

  const removeItem = useCallback((slug: string, kind: StoreKind) => {
    setItems((previous) =>
      previous.filter((line) => !(line.slug === slug && line.kind === kind)),
    );
  }, []);

  const setQuantity = useCallback((slug: string, kind: StoreKind, quantity: number) => {
    if (quantity < 1) {
      setItems((previous) =>
        previous.filter((line) => !(line.slug === slug && line.kind === kind)),
      );
      return;
    }
    setItems((previous) =>
      previous.map((line) =>
        line.slug === slug && line.kind === kind ? { ...line, quantity } : line,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

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
      hydrated,
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
      hydrated,
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
