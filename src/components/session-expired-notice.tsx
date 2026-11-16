"use client";

import { useSession } from "@/components/session-provider";
import { SESSION_EXPIRED_MESSAGE } from "@/lib/session";

/**
 * Tells the shopper that the demo account expired and that a new one has to
 * be made. It shows nothing while the account is still good.
 */
export function SessionExpiredNotice() {
  const { expired } = useSession();

  if (!expired) {
    return null;
  }

  return (
    <p
      data-testid="session-expired-message"
      role="status"
      className="border-b border-line bg-surface-muted px-4 py-3 text-center text-sm font-semibold text-danger-ink sm:px-6"
    >
      {SESSION_EXPIRED_MESSAGE}
    </p>
  );
}
