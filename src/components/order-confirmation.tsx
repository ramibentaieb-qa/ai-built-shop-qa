"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { useCart } from "@/components/cart-provider";
import { useSession } from "@/components/session-provider";
import { formatMoney } from "@/lib/cart";
import { cartMatchesOrder, orderBelongsTo } from "@/lib/order";
import { getOrder, getServerOrder, subscribeToOrder } from "@/lib/order-store";

/**
 * The confirmation of the order the shopper placed. The order is kept in the
 * browser, so a refresh shows the same order again. The card of the shopper
 * is not part of it and is never shown.
 */
export function OrderConfirmation() {
  const { session, ready: sessionReady } = useSession();
  const { items, emptyCart } = useCart();
  const order = useSyncExternalStore(subscribeToOrder, getOrder, getServerOrder);

  // The server has no browser storage, so the order is only known after
  // hydration.
  const orderReady = useSyncExternalStore(
    subscribeToOrder,
    () => true,
    () => false,
  );

  const router = useRouter();

  useEffect(() => {
    if (!sessionReady || !orderReady) {
      // The browser state is not known yet, so nothing is decided.
      return;
    }

    if (!session) {
      // Story 10 rules: only a logged in shopper sees an order.
      router.replace("/login");
      return;
    }

    if (!order) {
      // There is no order to show.
      router.replace("/cart");
      return;
    }

    if (!orderBelongsTo(order, session.email)) {
      // The order belongs to another account, so it is not shown here.
      router.replace("/cart");
      return;
    }

    // The order is placed, so the cart is empty now. It is only emptied when
    // it still holds the items of this order, so newer items are kept.
    if (cartMatchesOrder(items, order)) {
      emptyCart();
    }
  }, [sessionReady, orderReady, session, order, items, emptyCart, router]);

  if (
    !sessionReady ||
    !orderReady ||
    !session ||
    !order ||
    !orderBelongsTo(order, session.email)
  ) {
    // The page is only shown when the shopper may see it.
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        Checkout
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Order placed
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
        Thank you for your order. Here is what you ordered.
      </p>

      <p
        data-testid="order-number"
        className="mt-6 font-display text-lg font-bold text-ink"
      >
        {order.number}
      </p>

      <dl className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-semibold text-ink-muted">Name</dt>
          <dd data-testid="order-name" className="mt-1 text-sm text-ink">
            {order.name}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-ink-muted">Email</dt>
          <dd data-testid="order-email" className="mt-1 text-sm text-ink">
            {order.email}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-ink-muted">Address</dt>
          <dd data-testid="order-address" className="mt-1 text-sm text-ink">
            {order.address}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-semibold text-ink-muted">City</dt>
          <dd data-testid="order-city" className="mt-1 text-sm text-ink">
            {order.city}
          </dd>
        </div>
      </dl>

      <ul className="mt-8 space-y-3">
        {order.lines.map((line) => (
          <li
            key={`${line.productId}-${line.size}`}
            data-testid="order-item"
            className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3"
          >
            <span className="text-sm text-ink">
              {line.name} — Size {line.size} — Quantity {line.quantity}
            </span>
            <span className="text-sm font-semibold text-ink">
              {formatMoney(line.lineTotalCents)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-ink-muted">Subtotal</span>
          <span data-testid="order-subtotal" className="font-semibold text-ink">
            {formatMoney(order.subtotalCents)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-ink-muted">Delivery fee</span>
          <span data-testid="order-delivery" className="font-semibold text-ink">
            {formatMoney(order.deliveryCents)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <span className="font-display text-base font-bold text-ink">Total</span>
          <span data-testid="order-total" className="font-display text-xl font-bold text-ink">
            {formatMoney(order.totalCents)}
          </span>
        </div>
      </div>

      <Link
        data-testid="continue-shopping"
        href="/products"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong"
      >
        Continue shopping
      </Link>
    </div>
  );
}
