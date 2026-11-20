import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Order placed",
  description: "Your order is placed.",
};

export default function OrderConfirmationPage() {
  return <OrderConfirmation />;
}
