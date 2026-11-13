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

/** A cart line holds between one and ten items. */
export const MIN_LINE_QUANTITY = 1;
export const MAX_LINE_QUANTITY = 10;

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
  return mergeCartItems([...items, item]);
}

/**
 * One line per product and size: entries for the same product and size are
 * brought together and their quantities are added up.
 */
export function mergeCartItems(items: CartItem[]): CartItem[] {
  const merged: CartItem[] = [];

  for (const item of items) {
    const existing = merged.find(
      (current) => current.productId === item.productId && current.size === item.size,
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.push({ ...item });
    }
  }

  return merged;
}

/** Keeps a line quantity between the lowest and the highest allowed value. */
export function clampLineQuantity(quantity: number): number {
  return Math.min(MAX_LINE_QUANTITY, Math.max(MIN_LINE_QUANTITY, quantity));
}

/** Money is counted in cents, so a total never shows a rounding error. */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/** Shows cents as money, for example 5998 becomes "$59.98". */
export function formatMoney(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);

  return `${sign}$${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`;
}

/** The total of one cart line: the unit price times the quantity. */
export function lineTotalCents(unitPrice: number, quantity: number): number {
  return toCents(unitPrice) * quantity;
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
