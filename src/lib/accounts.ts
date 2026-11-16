/**
 * Demo account rules
 * ------------------
 * The demo accounts live in the browser, in localStorage. There is no server
 * and no database. This module holds the rules about the accounts as plain
 * functions, so they stay easy to read and easy to reuse.
 */

export type Account = {
  name: string;
  email: string;
  password: string;
  /** When the account was created, in milliseconds since the epoch. */
  createdAt: number;
};

/** Where the demo accounts are kept in the browser. */
export const ACCOUNTS_STORAGE_KEY = "ai-built-shop-qa:accounts:v1";

/** A demo account is deleted 24 hours after it was created. */
export const ACCOUNT_LIFETIME_MS = 24 * 60 * 60 * 1000;

/** A password needs at least this many characters. */
export const MIN_PASSWORD_LENGTH = 8;

/** An email needs a name, an @ and a domain with a dot, like name@example.com. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** True when the email looks like `name@example.com`. */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/** The account with that email, ignoring upper and lower case. */
export function findAccountByEmail(accounts: Account[], email: string): Account | undefined {
  const wanted = email.trim().toLowerCase();

  return accounts.find((account) => account.email.trim().toLowerCase() === wanted);
}

/** True when the account is older than the lifetime of 24 hours. */
export function isExpired(account: Account, now: number): boolean {
  return now - account.createdAt >= ACCOUNT_LIFETIME_MS;
}

/** The accounts that are still young enough; the older ones are deleted. */
export function removeExpiredAccounts(accounts: Account[], now: number): Account[] {
  return accounts.filter((account) => !isExpired(account, now));
}

/** Reads the stored accounts and drops anything that is not a usable account. */
export function parseAccounts(raw: string | null): Account[] {
  if (!raw) {
    return [];
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const accounts: Account[] = [];

  for (const entry of parsed) {
    const account = toAccount(entry);

    if (account) {
      accounts.push(account);
    }
  }

  return accounts;
}

/**
 * True when the stored value looks like a list of accounts. The cleanup uses
 * this to find the stored accounts, whatever key they are stored under.
 */
export function looksLikeAccountList(value: unknown): value is unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.every((entry) => {
    if (typeof entry !== "object" || entry === null) {
      return false;
    }

    const record = entry as Record<string, unknown>;

    return typeof record.email === "string" && toTimestamp(record.createdAt) !== null;
  });
}

function toAccount(value: unknown): Account | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const createdAt = toTimestamp(record.createdAt);

  if (
    typeof record.name !== "string" ||
    typeof record.email !== "string" ||
    typeof record.password !== "string" ||
    createdAt === null
  ) {
    return null;
  }

  return {
    name: record.name,
    email: record.email,
    password: record.password,
    createdAt,
  };
}

/**
 * The creation time is kept in milliseconds, but a date string is understood
 * as well, so a stored account is read either way.
 */
function toTimestamp(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }

    const parsed = Date.parse(trimmed);

    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}
