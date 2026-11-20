/**
 * Order rules
 * -----------
 * The order of the shopper: the lines that were ordered, the amounts and the
 * details the shopper entered. The card details are never part of an order.
 */

import { DELIVERY_FEE_CENTS, lineTotalCents, type CartItem } from "@/lib/cart";
import { getProduct } from "@/lib/products";

/** One line of an order: a product in a size, with how many and the price. */
export type OrderLine = {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  lineTotalCents: number;
};

/** The details the shopper entered. The card is not one of them. */
export type OrderDetails = {
  name: string;
  email: string;
  address: string;
  city: string;
};

/** The order of the shopper. */
export type Order = OrderDetails & {
  /** The email of the account that placed the order. */
  ownerEmail: string;
  /** The number the shopper reads, for example MM-482913. */
  number: string;
  lines: OrderLine[];
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  createdAt: number;
};

/** The number of an order: MM- and six digits. */
export function createOrderNumber(): string {
  return `MM-${Math.floor(Math.random() * 900000) + 100000}`;
}

/**
 * Builds the order of the shopper from the cart and the details they entered.
 * The amounts are the same as the ones on the cart page. The email of the
 * account is kept with the order, so the order only shows for that account.
 */
export function buildOrder(
  details: OrderDetails,
  items: CartItem[],
  ownerEmail: string,
): Order {
  const lines = items.flatMap((item) => {
    const product = getProduct(item.productId);

    return product
      ? [
          {
            productId: item.productId,
            name: product.name,
            size: item.size,
            quantity: item.quantity,
            lineTotalCents: lineTotalCents(product.price, item.quantity),
          },
        ]
      : [];
  });

  const subtotalCents = lines.reduce((total, line) => total + line.lineTotalCents, 0);

  return {
    ...details,
    ownerEmail,
    number: createOrderNumber(),
    lines,
    subtotalCents,
    deliveryCents: DELIVERY_FEE_CENTS,
    totalCents: subtotalCents + DELIVERY_FEE_CENTS,
    createdAt: Date.now(),
  };
}

/**
 * True when the order belongs to the account with that email. The order is
 * only shown for the account that placed it.
 */
export function orderBelongsTo(order: Order, email: string): boolean {
  return order.ownerEmail.trim().toLowerCase() === email.trim().toLowerCase();
}

/** True when the cart still holds the items of the order. */
export function cartMatchesOrder(items: CartItem[], order: Order): boolean {
  if (items.length !== order.lines.length) {
    return false;
  }

  return order.lines.every((line) => {
    const item = items.find(
      (current) => current.productId === line.productId && current.size === line.size,
    );

    return item !== undefined && item.quantity === line.quantity;
  });
}
