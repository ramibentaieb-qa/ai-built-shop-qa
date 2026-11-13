"use client";

import Link from "next/link";

import { CartLineItem } from "@/components/cart-line-item";
import { useCart } from "@/components/cart-provider";
import { getProduct } from "@/lib/products";

/** The lines of the cart, or the empty cart message when there is nothing yet. */
export function CartView() {
  const { items, ready } = useCart();

  // The cart lives in the browser, so wait for it before showing anything.
  if (!ready) {
    return null;
  }

  const lines = items.flatMap((item) => {
    const product = getProduct(item.productId);

    return product ? [{ item, product }] : [];
  });

  if (lines.length === 0) {
    return <EmptyCart />;
  }

  return (
    <ul className="mt-8 space-y-4">
      {lines.map(({ item, product }) => (
        <CartLineItem
          key={`${item.productId}-${item.size}`}
          item={item}
          product={product}
        />
      ))}
    </ul>
  );
}

function EmptyCart() {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-8 text-center sm:p-12">
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted text-ink-muted">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>
      <p data-testid="cart-empty" className="mt-4 font-display text-lg font-bold text-ink">
        Your cart is empty
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
        Nothing in here yet. Pick a t-shirt and it will show up in your cart.
      </p>
      <Link
        data-testid="continue-shopping"
        href="/products"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong"
      >
        Continue shopping
      </Link>
    </div>
  );
}
