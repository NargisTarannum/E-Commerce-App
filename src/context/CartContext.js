"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export const MAX_QTY = 10;
const STORAGE_KEY = "maison-aurel-cart-v1";

const clampQty = (n) =>
  Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n)) || 1));

// Validates anything read from localStorage (or built from a product),
// so corrupted or hand-edited data can never crash the UI.
function sanitize(data) {
  if (!Array.isArray(data)) return [];
  const seen = new Set();

  return data.reduce((acc, item) => {
    if (!item || item.id == null || seen.has(item.id)) return acc;
    const price = Number(item.price);
    if (!item.name || !Number.isFinite(price) || price < 0) return acc;

    seen.add(item.id);
    acc.push({
      id: item.id,
      slug: String(item.slug ?? item.id),
      name: String(item.name),
      category: item.category ? String(item.category) : "",
      price,
      oldPrice: Number(item.oldPrice) > 0 ? Number(item.oldPrice) : null,
      image: item.image ?? null,
      imageAlt: item.imageAlt ?? String(item.name),
      quantity: clampQty(item.quantity),
    });
    return acc;
  }, []);
}

function loadCart() {
  try {
    return sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY)));
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items, hydrated: true };

    case "ADD": {
      const { product, quantity } = action;
      const exists = state.items.some((i) => i.id === product.id);

      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: clampQty(i.quantity + quantity) }
              : i
          ),
        };
      }

      const [snapshot] = sanitize([{ ...product, quantity }]);
      return snapshot ? { ...state, items: [...state.items, snapshot] } : state;
    }

    case "CHANGE_BY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: clampQty(i.quantity + action.delta) }
            : i
        ),
      };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };

    case "CLEAR":
      return { ...state, items: [] };

    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Server and first client render both start empty, so markup always matches.
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    hydrated: false,
  });

  // Restore the saved cart after mount (client only).
  useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() });

    // Keep multiple tabs in sync.
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        dispatch({ type: "HYDRATE", items: loadCart() });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Save on every change, but only after restoring.
  // Without the guard, the empty initial state would erase the saved cart.
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage full or blocked (private mode): the cart still works in memory.
    }
  }, [state.items, state.hydrated]);

  const addItem = useCallback(
    (product, quantity = 1) => dispatch({ type: "ADD", product, quantity }),
    []
  );
  const increment = useCallback(
    (id) => dispatch({ type: "CHANGE_BY", id, delta: 1 }),
    []
  );
  const decrement = useCallback(
    (id) => dispatch({ type: "CHANGE_BY", id, delta: -1 }),
    []
  );
  const removeItem = useCallback(
    (id) => dispatch({ type: "REMOVE", id }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const value = useMemo(() => {
    const { items, hydrated } = state;
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal =
      Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) /
      100;

    return {
      items,
      hydrated,
      itemCount,
      subtotal,
      addItem,
      increment,
      decrement,
      removeItem,
      clearCart,
    };
  }, [state, addItem, increment, decrement, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>.");
  return ctx;
}