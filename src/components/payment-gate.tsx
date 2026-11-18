"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useCart } from "@/components/cart-provider";
import { useSession } from "@/components/session-provider";
import { loginUrl } from "@/lib/login-return";

/**
 * Keeps the payment page for logged in shoppers only. A shopper who is not
 * logged in is sent to the login page, and a shopper with an empty cart is
 * sent to the cart page.
 */
export function PaymentGate({ children }: { children: ReactNode }) {
  const { session, ready: sessionReady } = useSession();
  const { items, ready: cartReady } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!sessionReady || !cartReady) {
      // The browser state is not known yet, so nothing is decided.
      return;
    }

    if (!session) {
      // Only a logged in shopper reaches the payment page.
      router.replace(loginUrl("/payment"));
      return;
    }

    if (items.length === 0) {
      // There is nothing to pay for.
      router.replace("/cart");
    }
  }, [sessionReady, cartReady, session, items.length, router]);

  if (!sessionReady || !cartReady || !session || items.length === 0) {
    // The page is only shown when the shopper may see it.
    return null;
  }

  return children;
}
