/**
 * Demo session rules
 * ------------------
 * The session of the logged in shopper lives in the browser, in sessionStorage.
 * It survives a refresh and a move between pages, and it ends when the tab is
 * closed. The accounts stay in localStorage, as in Story 7, so a shopper can
 * log in again in a new tab.
 */

export type Session = {
  email: string;
  name: string;
  /** When the account was created, in milliseconds since the epoch. */
  createdAt: number;
};

/** Where the session is kept in the browser. */
export const SESSION_STORAGE_KEY = "ai-built-shop-qa:session:v1";

/** Remembers that the account of the shopper expired. */
export const SESSION_EXPIRED_KEY = "ai-built-shop-qa:session-expired:v1";

/** Keeps the name of the shopper who just registered, for the welcome message. */
export const SESSION_WELCOME_KEY = "ai-built-shop-qa:session-welcome:v1";

/** What the shopper reads when the demo account expired. */
export const SESSION_EXPIRED_MESSAGE =
  "Your demo account has expired, please register again";

/** Reads the stored session and drops anything that is not usable. */
export function parseSession(raw: string | null): Session | null {
  if (!raw) {
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const record = parsed as Record<string, unknown>;

  if (
    typeof record.email !== "string" ||
    typeof record.name !== "string" ||
    typeof record.createdAt !== "number" ||
    !Number.isFinite(record.createdAt)
  ) {
    return null;
  }

  return {
    email: record.email,
    name: record.name,
    createdAt: record.createdAt,
  };
}
