/**
 * Cart data
 * ---------
 * The cart lives in the browser only (localStorage), never on a server.
 * These helpers are plain functions so the rules stay easy to read and to test.
 */

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

/** Where the cart is kept in the browser. */
export const CART_STORAGE_KEY = "ai-built-shop-qa:cart:v1";

/** The badge counts items, so every unit of a line counts as one item. */
export function countItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

/** The badge stays short: more than 99 items shows "99+". */
export function formatBadgeCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}

/** Adding the same product in the same size grows the entry that is already there. */
export function addCartItem(items: CartItem[], item: CartItem): CartItem[] {
  const existingIndex = items.findIndex(
    (current) => current.productId === item.productId && current.size === item.size,
  );

  if (existingIndex === -1) {
    return [...items, item];
  }

  return items.map((current, index) =>
    index === existingIndex
      ? { ...current, quantity: current.quantity + item.quantity }
      : current,
  );
}

/** Reads the stored cart and drops anything that is not a usable item. */
export function parseCartItems(raw: string | null): CartItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    typeof item.size === "string" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0
  );
}
