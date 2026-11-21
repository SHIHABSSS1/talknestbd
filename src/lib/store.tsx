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
/** Private token for anonymous wishlists — no localStorage item copies. */
const GUEST_ID_KEY = "talknestbd-guest-id";

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
  const wishMigratedFor = useRef<string | null>(null);
  const [guestId, setGuestId] = useState("");

  // Every visitor — guest or signed in — gets a private token. Anonymous
  // wishlists are keyed by it on the server; signed-in readers use their id.
  useEffect(() => {
    try {
      let id = window.localStorage.getItem(GUEST_ID_KEY) || "";
      if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
        id = crypto.randomUUID();
        window.localStorage.setItem(GUEST_ID_KEY, id);
      }
      setGuestId(id);
    } catch {
      setGuestId(crypto.randomUUID());
    }
  }, []);

  useEffect(() => {
    if (!guestId) return;
    let cancelled = false;

    (async () => {
      const headers = { "x-guest-id": guestId };
      try {
        const legacy = readJSON<string[]>(WISH_KEY, []);
        const accountData = await accountFetch<{ slugs: string[] }>("/api/wishlist", {
          headers,
        });
        const accountSlugs = accountData.slugs ?? [];

        // On first login, merge the guest wishlist (and any legacy copy) into
        // the account, then clear the anonymous wishlist.
        if (userId && wishMigratedFor.current !== userId) {
          const guestData = await accountFetch<{ slugs: string[] }>(
            "/api/wishlist?scope=guest",
            { headers },
          ).catch(() => ({ slugs: [] as string[] }));
          const merged = Array.from(
            new Set([...accountSlugs, ...(guestData.slugs ?? []), ...legacy]),
          );
          await Promise.all(
            merged
              .filter((slug) => !accountSlugs.includes(slug))
              .map((slug) =>
                accountFetch("/api/wishlist", {
                  method: "POST",
                  body: JSON.stringify({ slug }),
                }).catch(() => undefined),
              ),
          );
          await accountFetch("/api/wishlist?all=true&scope=guest", {
            method: "DELETE",
            headers,
          }).catch(() => undefined);
          wishMigratedFor.current = userId;
          try {
            window.localStorage.removeItem(WISH_KEY);
          } catch {
            // ignore unavailable storage
          }
          if (!cancelled) setWishlist(merged);
        } else if (!cancelled) {
          // First anonymous load: upload any legacy localStorage slugs once.
          const toAdd = legacy.filter((slug) => !accountSlugs.includes(slug));
          if (toAdd.length && wishMigratedFor.current !== `guest:${guestId}`) {
            await Promise.all(
              toAdd.map((slug) =>
                accountFetch("/api/wishlist", {
                  method: "POST",
                  headers,
                  body: JSON.stringify({ slug }),
                }).catch(() => undefined),
              ),
            );
            wishMigratedFor.current = `guest:${guestId}`;
            try {
              window.localStorage.removeItem(WISH_KEY);
            } catch {
              // ignore unavailable storage
            }
          }
          setWishlist(Array.from(new Set([...accountSlugs, ...toAdd])));
        }
      } catch {
        if (!cancelled) setWishlist(readJSON<string[]>(WISH_KEY, []));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, guestId]);

  useEffect(() => {
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
      const exists = wishlist.includes(slug);
      setWishlist((previous) =>
        exists ? previous.filter((item) => item !== slug) : [...previous, slug],
      );
      notify(exists ? "Removed from wishlist" : "Added to wishlist");

      if (!guestId) return;
      void accountFetch("/api/wishlist", {
        method: exists ? "DELETE" : "POST",
        headers: { "x-guest-id": guestId },
        body: JSON.stringify({ slug }),
      }).catch(() => undefined);
    },
    [notify, wishlist, guestId],
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
