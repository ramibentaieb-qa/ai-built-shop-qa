import Image from "next/image";
import Link from "next/link";

import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.id}`;

  return (
    <article
      data-testid="product-card"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-brand"
    >
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-surface-muted"
      >
        <Image
          src={product.image}
          alt={product.alt}
          fill
          unoptimized
          data-testid="product-image"
          sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h2
          data-testid="product-name"
          className="font-display text-base font-bold leading-6 text-ink"
        >
          <Link href={href} className="transition-colors hover:text-brand">
            {product.name}
          </Link>
        </h2>
        <p data-testid="product-price" className="text-sm font-semibold text-brand">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
