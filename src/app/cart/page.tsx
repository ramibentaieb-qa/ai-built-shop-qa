import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your cart. Cart logic arrives in a later story.",
};

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        Cart
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Your cart
      </h1>

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
        <p className="mt-4 font-display text-lg font-bold text-ink">Your cart is empty</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
          Cart logic is not part of this story yet, so this page is an empty placeholder for it.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
