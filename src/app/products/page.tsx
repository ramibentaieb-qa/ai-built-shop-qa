import type { Metadata } from "next";

import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the full range of men's urban t-shirts.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="max-w-2xl">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Catalogue
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Men&apos;s urban t-shirts
        </h1>
        <p className="mt-4 text-base leading-7 text-ink-muted">
          A full range of {products.length} urban t-shirts. Browse the collection and pick your
          favourite.
        </p>
      </header>

      <ul
        data-testid="product-list"
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
