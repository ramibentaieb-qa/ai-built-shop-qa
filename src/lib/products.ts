import productData from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
};

export const products: Product[] = productData;

/** Every price renders in the same `$12.34` format. */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
