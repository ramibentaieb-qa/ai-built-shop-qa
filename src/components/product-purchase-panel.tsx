"use client";

import { useState } from "react";

import { useCart } from "@/components/cart-provider";

const SIZES = ["S", "M", "L", "XL"] as const;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

export function ProductPurchasePanel({ productId }: { productId: string }) {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [showSizeError, setShowSizeError] = useState(false);
  const { addItem } = useCart();

  function selectSize(option: string) {
    setSize(option);
    // The message is only needed while no size is selected.
    setShowSizeError(false);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(MIN_QUANTITY, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(MAX_QUANTITY, current + 1));
  }

  function addToCart() {
    if (!size) {
      setShowSizeError(true);
      return;
    }

    addItem({ productId, size, quantity });

    // The chosen size and quantity stay as they are after adding.
  }

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="font-display text-sm font-bold uppercase tracking-widest text-ink">
          Size
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {SIZES.map((option) => (
            <label key={option} className="relative inline-flex">
              <input
                type="radio"
                name="size"
                value={option}
                data-testid={`size-option-${option}`}
                checked={size === option}
                aria-checked={size === option}
                onChange={() => selectSize(option)}
                className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-lg border border-line bg-surface checked:border-brand checked:bg-brand"
              />
              <span className="pointer-events-none relative z-10 inline-flex min-h-11 min-w-12 items-center justify-center rounded-lg px-4 text-sm font-semibold text-ink transition-colors peer-checked:text-brand-contrast">
                {option}
              </span>
            </label>
          ))}
        </div>

        {showSizeError && (
          <p
            data-testid="size-error"
            role="alert"
            className="mt-3 text-sm font-semibold text-danger-ink"
          >
            Please select a size
          </p>
        )}
      </fieldset>

      <div className="mt-6">
        <p
          id="quantity-label"
          className="font-display text-sm font-bold uppercase tracking-widest text-ink"
        >
          Quantity
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line bg-surface p-1">
          <button
            type="button"
            data-testid="quantity-decrease"
            onClick={decreaseQuantity}
            disabled={quantity <= MIN_QUANTITY}
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
            data-testid="quantity-value"
            aria-labelledby="quantity-label"
            aria-live="polite"
            rows={1}
            readOnly
            tabIndex={-1}
            value={quantity}
            className="h-11 min-w-8 max-w-8 resize-none overflow-hidden border-0 bg-transparent p-0 text-center text-base font-semibold leading-[44px] text-ink tabular-nums"
          />
          <button
            type="button"
            data-testid="quantity-increase"
            onClick={increaseQuantity}
            disabled={quantity >= MAX_QUANTITY}
            aria-label="Increase quantity"
            className="inline-flex size-11 items-center justify-center rounded-md text-lg font-semibold text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        data-testid="add-to-cart"
        onClick={addToCart}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong sm:w-auto"
      >
        Add to cart
      </button>
    </div>
  );
}
