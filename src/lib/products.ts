import productData from "@/data/products.json";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  description: string;
};

export const products: Product[] = productData;

/** Look up a single product by the id used in its URL, e.g. `/products/1`. */
export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** Every price renders in the same `$12.34` format. */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
