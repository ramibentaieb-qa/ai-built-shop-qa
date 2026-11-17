import type { Metadata } from "next";
import Link from "next/link";

import { PaymentGate } from "@/components/payment-gate";

export const metadata: Metadata = {
  title: "Payment",
  description: "Payment is not part of this story yet.",
};

export default function PaymentPage() {
  return (
    <PaymentGate>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Payment page coming soon
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-ink-muted">
          This demo shop takes no payments and no customer data. The real checkout arrives in a
          later story.
        </p>
        <Link
          href="/cart"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong"
        >
          Back to cart
        </Link>
      </div>
    </PaymentGate>
  );
}
