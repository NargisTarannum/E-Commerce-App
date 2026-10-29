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
import { useToast } from "@/components/ui/Toast";

const STORAGE_KEY = "maison-aurel-wishlist-v1";
const MAX_ITEMS = 100;
const JSON_HEADERS = { "Content-Type": "application/json" };

// Reduces any product-like object to the fields the wishlist needs, and
// rejects malformed data (used for localStorage and API responses alike).
function toItem(p) {
  const id = Number(p?.id);
  const price = Number(p?.price);
  if (!Number.isInteger(id) || id <= 0 || !p?.name || !Number.isFinite(price) || price < 0) return null;
  return {
    id,
    slug: String(p.slug ?? id),
    name: String(p.name),
    category: p.category ? String(p.category) : "",
    price,
    oldPrice: Number(p.oldPrice) > 0 ? Number(p.oldPrice) : null,
    image: p.image ?? null,
    imageAlt: p.imageAlt ?? String(p.name),
    stock: Number.isFinite(Number(p.stock)) && p.stock !== null ? Number(p.stock) : null,
    unavailable: Boolean(p.unavailable),
  };
}

function sanitize(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  return list.reduce((acc, p) => {
    const item = toItem(p);
    if (item && !seen.has(item.id) && acc.length < MAX_ITEMS) {
      seen.add(item.id);
      acc.push(item);
    }
    return acc;
  }, []);
}

function loadLocal() {
  try {
    return sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY)));
  } catch {
    return [];
  }
}

function saveLocal(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage blocked or full: the wishlist still works in memory.
  }
}

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const toast = useToast();
  // Server and first client render both start empty, so markup always matches.
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [authed, setAuthed] = useState(false);

  const itemsRef = useRef([]);
  const authedRef = useRef(false);
  const pending = useRef(new Set());

  const setList = useCallback((next) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  // Load on mount. Signing in/out is a full page navigation, so this runs again
  // afterwards: signed in -> server wishlist (+ merge of the guest list); guest -> localStorage.
  useEffect(() => {
    let cancelled = false;

    async function refreshGuest(local) {
      try {
        const res = await fetch(`/api/wishlist/lookup?ids=${local.map((i) => i.id).join(",")}`);
        if (!res.ok) return;
        const { items: fresh = [], missing = [] } = await res.json();
        const byId = new Map(sanitize(fresh).map((i) => [i.id, i]));
        const next = local.map((i) => byId.get(i.id) ?? (missing.includes(i.id) ? { ...i, unavailable: true } : i));
        if (!cancelled) {
          setList(next);
          saveLocal(next);
        }
      } catch {
        // Offline: keep the saved snapshots.
      }
    }

    async function init() {
      const local = loadLocal();
      let guest = true;

      try {
        const res = await fetch("/api/wishlist", { cache: "no-store" });
        if (res.ok) {
          guest = false;
          let list = sanitize((await res.json()).items);

          if (local.length) {
            try {
              const merged = await fetch("/api/wishlist/merge", {
                method: "POST",
                headers: JSON_HEADERS,
                body: JSON.stringify({ productIds: local.map((i) => i.id) }),
              });
              if (merged.ok) {
                list = sanitize((await merged.json()).items);
                saveLocal([]);
                if (!cancelled) toast.show("Your saved items were added to your wishlist");
              }
            } catch {
              // Keep the guest list locally and retry on the next visit.
            }
          }

          if (!cancelled) {
            authedRef.current = true;
            setAuthed(true);
            setList(list);
          }
        }
      } catch {
        // Network error: fall back to the local list below.
      }

      if (guest && !cancelled) {
        authedRef.current = false;
        setAuthed(false);
        setList(local);
        if (local.length) refreshGuest(local);
      }
      if (!cancelled) setHydrated(true);
    }

    init();

    // Keep several tabs in sync for guests.
    const onStorage = (e) => {
      if (!authedRef.current && (e.key === STORAGE_KEY || e.key === null)) setList(loadLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, [setList, toast]);

  // Adds or removes a product. The UI updates immediately; if the server
  // rejects the change it is rolled back. Resolves to true on success.
  const setSaved = useCallback(
    async (product, shouldBeSaved, { silent = false } = {}) => {
      const item = toItem(product);
      if (!item) return false;
      if (pending.current.has(item.id)) return false;

      const exists = itemsRef.current.some((i) => i.id === item.id);
      if (exists === shouldBeSaved) return true;
      if (shouldBeSaved && itemsRef.current.length >= MAX_ITEMS) {
        toast.show(`Your wishlist is full (${MAX_ITEMS} items).`, "error");
        return false;
      }

      const apply = (add) =>
        setList(
          add
            ? [item, ...itemsRef.current.filter((i) => i.id !== item.id)]
            : itemsRef.current.filter((i) => i.id !== item.id)
        );

      pending.current.add(item.id);
      apply(shouldBeSaved);

      try {
        if (!authedRef.current) {
          saveLocal(itemsRef.current);
        } else {
          const res = shouldBeSaved
            ? await fetch("/api/wishlist", {
                method: "POST",
                headers: JSON_HEADERS,
                body: JSON.stringify({ productId: item.id }),
              })
            : await fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(res.status === 401 ? "Your session has expired. Please sign in again." : data.message);
          }
        }
        if (!silent) toast.show(shouldBeSaved ? "Added to wishlist" : "Removed from wishlist");
        return true;
      } catch (err) {
        apply(!shouldBeSaved); // roll back
        toast.show(err?.message || "Couldn't update your wishlist. Please try again.", "error");
        return false;
      } finally {
        pending.current.delete(item.id);
      }
    },
    [setList, toast]
  );

  const savedIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      hydrated,
      authed,
      isWishlisted: (id) => savedIds.has(Number(id)),
      toggle: (product) => setSaved(product, !savedIds.has(Number(product?.id))),
      remove: (id, options) => {
        const item = itemsRef.current.find((i) => i.id === Number(id));
        return item ? setSaved(item, false, options) : Promise.resolve(true);
      },
    }),
    [items, hydrated, authed, savedIds, setSaved]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>.");
  return ctx;
}
