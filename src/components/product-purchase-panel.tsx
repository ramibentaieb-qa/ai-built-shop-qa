"use client";

import { useState } from "react";

const SIZES = ["S", "M", "L", "XL"] as const;

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

export function ProductPurchasePanel() {
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [showSizeError, setShowSizeError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(MIN_QUANTITY, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(MAX_QUANTITY, current + 1));
  }

  function handleAddToCart() {
    if (!size) {
      setShowSizeError(true);
      setNotice(null);
      return;
    }

    setShowSizeError(false);
    setNotice("Cart support arrives in the next story — nothing was added.");
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
                onChange={() => {
                  setSize(option);
                  setShowSizeError(false);
                }}
                className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-lg border border-line bg-surface checked:border-brand checked:bg-brand"
              />
              <span className="pointer-events-none relative z-10 inline-flex min-h-11 min-w-12 items-center justify-center rounded-lg px-4 text-sm font-semibold text-ink transition-colors peer-checked:text-brand-contrast">
                {option}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {showSizeError ? (
        <p
          data-testid="size-error"
          role="alert"
          className="mt-3 text-sm font-semibold text-red-700 dark:text-red-400"
        >
          Please choose a size first.
        </p>
      ) : null}

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
            aria-label="Decrease quantity"
            aria-disabled={quantity <= MIN_QUANTITY}
            className="inline-flex size-11 items-center justify-center rounded-md text-lg font-semibold text-ink transition-colors hover:bg-surface-muted aria-disabled:opacity-40 aria-disabled:hover:bg-transparent"
          >
            −
          </button>
          <output
            data-testid="quantity-value"
            aria-labelledby="quantity-label"
            aria-live="polite"
            className="min-w-8 text-center text-base font-semibold text-ink tabular-nums"
          >
            {quantity}
          </output>
          <button
            type="button"
            data-testid="quantity-increase"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
            aria-disabled={quantity >= MAX_QUANTITY}
            className="inline-flex size-11 items-center justify-center rounded-md text-lg font-semibold text-ink transition-colors hover:bg-surface-muted aria-disabled:opacity-40 aria-disabled:hover:bg-transparent"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        data-testid="add-to-cart"
        onClick={handleAddToCart}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong sm:w-auto"
      >
        Add to cart
      </button>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-ink-muted">
        {notice}
      </p>
    </div>
  );
}
