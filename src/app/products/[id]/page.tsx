import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { formatPrice, getProduct, products } from "@/lib/products";

type ProductDetailProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductDetailProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        data-testid="back-to-products"
        href="/products"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-ink-muted transition-colors hover:text-brand"
      >
        <span aria-hidden="true">←</span>
        Back to products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface-muted">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            unoptimized
            priority
            data-testid="product-image"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Urban t-shirt
          </p>
          <h1
            data-testid="product-title"
            className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
          >
            {product.name}
          </h1>
          <p data-testid="product-price" className="mt-3 text-lg font-semibold text-brand">
            {formatPrice(product.price)}
          </p>
          <p
            data-testid="product-description"
            className="mt-4 max-w-xl text-base leading-7 text-ink-muted"
          >
            {product.description}
          </p>

          <ProductPurchasePanel productId={product.id} />
        </div>
      </div>
    </div>
  );
}
