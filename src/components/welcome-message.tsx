"use client";

import { useSession } from "@/components/session-provider";

/**
 * Welcomes a shopper who has just registered. The message belongs to the home
 * page, so it is gone once the shopper moves to another page.
 */
export function WelcomeMessage() {
  const { welcome } = useSession();

  if (!welcome) {
    return null;
  }

  return (
    <div className="mb-8 rounded-2xl border border-success/30 bg-success/10 px-5 py-4 sm:mb-10 sm:px-6">
      <p
        data-testid="welcome-message"
        role="status"
        className="text-base font-semibold text-ink sm:text-lg"
      >
        Welcome, {welcome}! Your account was created.
      </p>
    </div>
  );
}
