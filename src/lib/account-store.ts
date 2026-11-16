/**
 * Account storage
 * --------------
 * The demo accounts are kept in the browser, in localStorage. There is no
 * server and no database: an account never leaves the browser.
 */

import {
  ACCOUNTS_STORAGE_KEY,
  looksLikeAccountList,
  parseAccounts,
  removeExpiredAccounts,
  type Account,
} from "@/lib/accounts";

type StoredAccountList = {
  key: string;
  accounts: Account[];
  /** How many entries the stored list holds, before the unusable ones are dropped. */
  stored: number;
};

function readStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    // A browser that blocks storage still works, there are simply no accounts.
    return null;
  }
}

/** Every key in the browser storage. */
function storedKeys(storage: Storage): string[] {
  const keys: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (key !== null) {
      keys.push(key);
    }
  }

  return keys;
}

/**
 * The stored lists of accounts. Every key is looked at, so an account that was
 * saved under an older key name is still found, and still expires.
 */
function storedAccountLists(storage: Storage): StoredAccountList[] {
  const lists: StoredAccountList[] = [];

  for (const key of storedKeys(storage)) {
    const raw = storage.getItem(key);

    if (!raw) {
      continue;
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }

    if (!looksLikeAccountList(parsed)) {
      continue;
    }

    lists.push({ key, accounts: parseAccounts(raw), stored: parsed.length });
  }

  return lists;
}

/**
 * Deletes the accounts that are older than 24 hours. It runs when a page
 * loads, so an expired account is gone and its email can be used again.
 */
export function purgeExpiredAccounts(now: number = Date.now()): void {
  const storage = readStorage();

  if (!storage) {
    return;
  }

  for (const { key, accounts, stored } of storedAccountLists(storage)) {
    const kept = removeExpiredAccounts(accounts, now);

    if (kept.length === stored) {
      // Nothing expired, so the stored list is left as it is.
      continue;
    }

    storage.setItem(key, JSON.stringify(kept));
  }
}

/** Every account in this browser, without the ones that have expired. */
export function getAccounts(): Account[] {
  const storage = readStorage();

  if (!storage) {
    return [];
  }

  // Reading always starts with a cleanup, so an expired account is never
  // returned and its email can be registered again.
  purgeExpiredAccounts();

  const accounts: Account[] = [];

  for (const list of storedAccountLists(storage)) {
    accounts.push(...list.accounts);
  }

  return accounts;
}

/** Saves a new account in the browser. */
export function addAccount(account: Account): void {
  const storage = readStorage();

  if (!storage) {
    return;
  }

  const accounts = parseAccounts(storage.getItem(ACCOUNTS_STORAGE_KEY));

  storage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify([...accounts, account]));
}
