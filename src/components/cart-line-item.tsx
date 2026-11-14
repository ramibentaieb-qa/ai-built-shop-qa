"use client";

import Image from "next/image";
import Link from "next/link";
import { useId } from "react";

import { useCart } from "@/components/cart-provider";
import {
  MAX_LINE_QUANTITY,
  MIN_LINE_QUANTITY,
  formatMoney,
  toCents,
  type CartItem,
} from "@/lib/cart";
import type { Product } from "@/lib/products";

type CartLineItemProps = {
  item: CartItem;
  product: Product;
};

/** One line of the cart: one product in one size. */
export function CartLineItem({ item, product }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const quantityLabelId = useId();

  const unitPriceCents = toCents(product.price);
  const unitPrice = formatMoney(unitPriceCents);
  const lineTotal = formatMoney(unitPriceCents * item.quantity);

  return (
    <li
      data-testid="cart-item"
      className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-5"
    >
      {/*
        On a phone the image sits next to the name, on a wider screen the
        details move into their own column.
      */}
      <div className="flex gap-4 sm:contents">
        <Image
          src={product.image}
          alt={product.alt}
          width={96}
          height={96}
          unoptimized
          data-testid="cart-item-image"
          className="size-20 shrink-0 rounded-xl border border-line bg-surface-muted object-cover sm:size-24"
        />

        <div className="min-w-0 flex-1">
          <h2
            data-testid="cart-item-name"
            className="font-display text-lg font-bold tracking-tight text-ink"
          >
            <Link href={`/products/${product.id}`} className="transition-colors hover:text-brand">
              {product.name}
            </Link>
          </h2>

          <p className="mt-2 text-sm text-ink-muted">
            Size:{" "}
            <span data-testid="cart-item-size" className="font-semibold text-ink">
              {item.size}
            </span>
          </p>

          <p className="mt-1 text-sm text-ink-muted">
            Each{" "}
            <span data-testid="cart-item-price" className="font-semibold text-ink">
              {unitPrice}
            </span>
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center gap-3">
            <span
              id={quantityLabelId}
              className="sr-only text-sm font-medium text-ink-muted sm:not-sr-only"
            >
              Quantity
            </span>
            <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface p-1">
              <button
                type="button"
                data-testid="cart-item-decrease"
                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                disabled={item.quantity <= MIN_LINE_QUANTITY}
                aria-label="Decrease quantity"
                className="inline-flex size-11 items-center justify-center rounded-md text-lg font-semibold text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                −
              </button>
              {/*
                A read-only textarea, not an input: the value can be read as text
                and as a value, but it can never be typed into.
              */}
              <textarea
                data-testid="cart-item-quantity"
                aria-labelledby={quantityLabelId}
                aria-live="polite"
                rows={1}
                readOnly
                tabIndex={-1}
                value={item.quantity}
                className="h-11 min-w-8 max-w-8 resize-none overflow-hidden border-0 bg-transparent p-0 text-center text-base font-semibold leading-[44px] text-ink tabular-nums"
              />
              <button
                type="button"
                data-testid="cart-item-increase"
                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                disabled={item.quantity >= MAX_LINE_QUANTITY}
                aria-label="Increase quantity"
                className="inline-flex size-11 items-center justify-center rounded-md text-lg font-semibold text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                +
              </button>
            </div>
          </div>

          <p data-testid="cart-item-total" className="font-display text-xl font-bold text-ink">
            {lineTotal}
          </p>
        </div>

        <button
          type="button"
          data-testid="cart-item-remove"
          onClick={() => removeItem(item.productId, item.size)}
          className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted hover:text-danger-ink"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
