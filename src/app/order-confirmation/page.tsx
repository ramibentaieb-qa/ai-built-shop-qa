import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order placed",
  description: "Your order is placed.",
};

export default function OrderConfirmationPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Order placed
      </h1>
    </div>
  );
}
