"use client";

import Link from "next/link";

import { formatMoney } from "@/lib/cart";

type OrderSummaryProps = {
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
};

/** The cost of the order: subtotal, delivery fee and total. */
export function OrderSummary({ subtotalCents, deliveryCents, totalCents }: OrderSummaryProps) {
  return (
    <section className="mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold tracking-tight text-ink">Order summary</h2>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-ink-muted">Subtotal</span>
          <span data-testid="cart-subtotal" className="font-semibold text-ink">
            {formatMoney(subtotalCents)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-ink-muted">Delivery fee</span>
          <span data-testid="cart-delivery" className="font-semibold text-ink">
            {formatMoney(deliveryCents)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <span className="font-display text-base font-bold text-ink">Total</span>
          <span data-testid="cart-total" className="font-display text-xl font-bold text-ink">
            {formatMoney(totalCents)}
          </span>
        </div>
      </div>

      <Link
        data-testid="proceed-to-checkout"
        href="/payment"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong sm:w-auto"
      >
        Proceed to checkout
      </Link>
    </section>
  );
}
