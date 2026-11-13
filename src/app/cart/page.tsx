import type { Metadata } from "next";

import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "The products in your cart.",
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

      <CartView />
    </div>
  );
}
