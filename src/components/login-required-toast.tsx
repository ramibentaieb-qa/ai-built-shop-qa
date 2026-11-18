"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session-provider";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/messages";
import { getToast, showToast } from "@/lib/toast-store";

/**
 * Tells the shopper why the checkout gate sent them to the login page. The
 * message is a notification at the bottom of the page, so it does not take up
 * space in the page and it goes away by itself.
 */
export function LoginRequiredToast({ returnPath }: { returnPath: string | null }) {
  const { session, ready } = useSession();

  useEffect(() => {
    if (!ready) {
      // The browser state is not known yet, so nothing is decided.
      return;
    }

    if (session) {
      // The shopper is logged in already, so there is nothing to log in to.
      return;
    }

    if (!returnPath) {
      // The shopper opened the login page on their own, so there is nothing
      // to explain.
      return;
    }

    if (getToast()) {
      // Another notification is on screen, and it is the more important one,
      // for example the message about an expired account.
      return;
    }

    showToast({
      testId: "login-required-message",
      text: LOGIN_REQUIRED_MESSAGE,
      tone: "info",
    });
  }, [ready, session, returnPath]);

  return null;
}
