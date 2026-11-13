/**
 * Cart store
 * ----------
 * The cart lives in the browser, in localStorage. This module is the small
 * store that keeps the header badge and the product page in sync with it.
 *
 * React reads the store through `useSyncExternalStore`, so the value is read
 * again after hydration and the page never mixes server and browser markup.
 */

import { CART_STORAGE_KEY, addCartItem, parseCartItems, type CartItem } from "@/lib/cart";

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * The parsed cart is cached, because `useSyncExternalStore` needs the same
 * value as long as nothing changed.
 */
let cacheValid = false;
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = [];

/** The server has no browser storage, so the cart starts empty there. */
export const EMPTY_CART: CartItem[] = [];

function readStoredCart(): string | null {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredCart(items: CartItem[]): void {
  cachedItems = items;
  cachedRaw = JSON.stringify(items);

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, cachedRaw);
  } catch {
    // A browser that blocks storage still works, the cart stays in memory.
  }
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** Listen for cart changes, including changes made in another tab. */
export function subscribeToCart(listener: Listener): () => void {
  listeners.add(listener);

  if (listeners.size === 1) {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

function handleStorageChange(): void {
  // Another tab changed the cart, so the cached copy is out of date.
  cacheValid = false;
  notifyListeners();
}

/** The cart as the browser currently knows it. */
export function getCartItems(): CartItem[] {
  if (!cacheValid) {
    cachedRaw = readStoredCart();
    cachedItems = parseCartItems(cachedRaw);
    cacheValid = true;
  }

  return cachedItems;
}

/** The cart during server rendering and hydration: always empty. */
export function getServerCartItems(): CartItem[] {
  return EMPTY_CART;
}

/** Put an item in the cart and tell the app about it. */
export function addItemToCart(item: CartItem): void {
  writeStoredCart(addCartItem(getCartItems(), item));
  notifyListeners();
}
