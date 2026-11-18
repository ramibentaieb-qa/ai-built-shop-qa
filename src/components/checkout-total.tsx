"use client";

import { useCart } from "@/components/cart-provider";
import { DELIVERY_FEE_CENTS, formatMoney, lineTotalCents } from "@/lib/cart";
import { getProduct } from "@/lib/products";

/** The total of the order, the same amount as on the cart page. */
export function CheckoutTotal() {
  const { items, ready } = useCart();

  // The cart lives in the browser, so wait for it before showing anything.
  if (!ready) {
    return null;
  }

  const subtotalCents = items.reduce((total, item) => {
    const product = getProduct(item.productId);

    return product ? total + lineTotalCents(product.price, item.quantity) : total;
  }, 0);

  return (
    <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 sm:px-6">
      <span className="font-display text-base font-bold text-ink">Order total</span>
      <span data-testid="checkout-total" className="font-display text-xl font-bold text-ink">
        {formatMoney(subtotalCents + DELIVERY_FEE_CENTS)}
      </span>
    </div>
  );
}
