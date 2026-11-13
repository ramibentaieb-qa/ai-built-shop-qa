"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { countItems, type CartItem } from "@/lib/cart";
import {
  addItemToCart,
  getCartItems,
  getServerCartItems,
  subscribeToCart,
} from "@/lib/cart-store";

type CartContextValue = {
  items: CartItem[];
  /** Total number of items in the cart, the number the badge shows. */
  count: number;
  addItem: (item: CartItem) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Keeps the cart for the whole app: the header badge reads the count from it
 * and the product page writes to it. The cart is stored in the browser, so it
 * survives a refresh and a move between pages, and it is never sent anywhere.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartItems, getServerCartItems);

  const count = useMemo(() => countItems(items), [items]);

  const addItem = useCallback((item: CartItem) => {
    addItemToCart(item);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({ items, count, addItem }),
    [items, count, addItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Read the cart from anywhere inside the app. */
export function useCart(): CartContextValue {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return cart;
}
