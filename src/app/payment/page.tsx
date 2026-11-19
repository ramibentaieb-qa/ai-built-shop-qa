import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutTotal } from "@/components/checkout-total";
import { PaymentForm } from "@/components/payment-form";
import { PaymentGate } from "@/components/payment-gate";

export const metadata: Metadata = {
  title: "Payment",
  description: "The details of the order and the mock payment form.",
};

export default function PaymentPage() {
  return (
    <PaymentGate>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Payment
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
          Mock payment: do not enter a real card number.
        </p>

        <CheckoutTotal />

        <PaymentForm />

        <Link
          href="/cart"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          Back to cart
        </Link>
      </div>
    </PaymentGate>
  );
}
