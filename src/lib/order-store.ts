/**
 * Order storage
 * -------------
 * The order that the shopper placed is kept in the browser, in sessionStorage.
 * It is the last order only: it stays until the tab is closed, another order
 * is placed or the shopper logs out. The card details are never part of it.
 */

import type { Order, OrderLine } from "@/lib/order";

type Listener = () => void;

const listeners = new Set<Listener>();

/** Where the last order is kept in the browser. */
export const ORDER_STORAGE_KEY = "ai-built-shop-qa:order:v1";

/**
 * The order is cached, because `useSyncExternalStore` needs the same value as
 * long as nothing changed.
 */
let cacheValid = false;
let cachedOrder: Order | null = null;

function readStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** The order as the browser knows it right now. */
export function getOrder(): Order | null {
  if (!cacheValid) {
    cachedOrder = parseOrder(readStorage()?.getItem(ORDER_STORAGE_KEY) ?? null);
    cacheValid = true;
  }

  return cachedOrder;
}

/** The order during server rendering and hydration: always none. */
export function getServerOrder(): Order | null {
  return null;
}

/** Listen for the order that comes and goes. */
export function subscribeToOrder(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/** Keeps the order of the shopper in the browser. */
export function saveOrder(order: Order): void {
  cachedOrder = order;
  cacheValid = true;

  try {
    readStorage()?.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // A browser that blocks storage still works, the order stays in memory.
  }

  notifyListeners();
}

/** Removes the last order from the browser. */
export function clearOrder(): void {
  cachedOrder = null;
  cacheValid = true;

  try {
    readStorage()?.removeItem(ORDER_STORAGE_KEY);
  } catch {
    // A browser that blocks storage still works, the order is gone from memory.
  }

  notifyListeners();
}

/** Reads the stored order and drops anything that is not usable. */
export function parseOrder(raw: string | null): Order | null {
  if (!raw) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const record = parsed as Record<string, unknown>;

  if (
    typeof record.number !== "string" ||
    typeof record.name !== "string" ||
    typeof record.email !== "string" ||
    typeof record.ownerEmail !== "string" ||
    typeof record.address !== "string" ||
    typeof record.city !== "string" ||
    !Array.isArray(record.lines) ||
    typeof record.subtotalCents !== "number" ||
    typeof record.deliveryCents !== "number" ||
    typeof record.totalCents !== "number" ||
    typeof record.createdAt !== "number"
  ) {
    return null;
  }

  const lines = record.lines.filter(isOrderLine);

  if (lines.length !== record.lines.length) {
    return null;
  }

  return {
    number: record.number,
    name: record.name,
    email: record.email,
    ownerEmail: record.ownerEmail,
    address: record.address,
    city: record.city,
    lines,
    subtotalCents: record.subtotalCents,
    deliveryCents: record.deliveryCents,
    totalCents: record.totalCents,
    createdAt: record.createdAt,
  };
}

function isOrderLine(value: unknown): value is OrderLine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.productId === "string" &&
    typeof record.name === "string" &&
    typeof record.size === "string" &&
    typeof record.quantity === "number" &&
    typeof record.lineTotalCents === "number"
  );
}
