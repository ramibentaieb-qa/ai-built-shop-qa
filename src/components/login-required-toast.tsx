"use client";

import { useEffect, useRef } from "react";

import { useSession } from "@/components/session-provider";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/messages";
import { showToast } from "@/lib/toast-store";

/**
 * Tells the shopper why the checkout gate sent them to the login page. The
 * message is a notification at the bottom of the page, so it does not take up
 * space in the page and it goes away by itself.
 */
export function LoginRequiredToast({ returnPath }: { returnPath: string | null }) {
  const { session, expired, ready } = useSession();
  const decided = useRef(false);

  useEffect(() => {
    if (decided.current || !ready) {
      // The browser state is not known yet, so nothing is decided.
      return;
    }

    // The decision is made once, so the message does not come back later.
    decided.current = true;

    if (session) {
      // The shopper is logged in already, so there is nothing to log in to.
      return;
    }

    if (!returnPath) {
      // The shopper opened the login page on their own, so there is nothing
      // to explain.
      return;
    }

    if (expired) {
      // The account expired, so that message is the more important one.
      return;
    }

    showToast({
      testId: "login-required-message",
      text: LOGIN_REQUIRED_MESSAGE,
      tone: "info",
    });
  }, [ready, session, expired, returnPath]);

  return null;
}
