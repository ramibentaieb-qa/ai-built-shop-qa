/**
 * Session storage
 * ---------------
 * The session of the logged in shopper is kept in the browser, in
 * sessionStorage. There is no server and no database: the session never leaves
 * the browser and it ends when the tab is closed.
 */

import { findAccountByEmail } from "@/lib/accounts";
import { getAccounts } from "@/lib/account-store";
import {
  SESSION_EXPIRED_KEY,
  SESSION_STORAGE_KEY,
  parseSession,
  type Session,
} from "@/lib/session";

export type SessionState = {
  /** The logged in shopper, or null when nobody is logged in. */
  session: Session | null;
  /** True when the account of the shopper expired. */
  expired: boolean;
};

type Listener = () => void;

const listeners = new Set<Listener>();

/** The session state during server rendering and hydration: always empty. */
const SERVER_STATE: SessionState = { session: null, expired: false };

/**
 * The state is cached, because `useSyncExternalStore` needs the same value as
 * long as nothing changed.
 */
let cacheValid = false;
let cachedState: SessionState = SERVER_STATE;

function readStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    // A browser that blocks storage still works, the session stays in memory.
    return null;
  }
}

function readState(): SessionState {
  const storage = readStorage();

  if (!storage) {
    return SERVER_STATE;
  }

  return {
    session: parseSession(storage.getItem(SESSION_STORAGE_KEY)),
    expired: storage.getItem(SESSION_EXPIRED_KEY) !== null,
  };
}

function writeState(next: SessionState): void {
  cachedState = next;
  cacheValid = true;

  const storage = readStorage();

  try {
    if (next.session) {
      storage?.setItem(SESSION_STORAGE_KEY, JSON.stringify(next.session));
    } else {
      storage?.removeItem(SESSION_STORAGE_KEY);
    }

    if (next.expired) {
      storage?.setItem(SESSION_EXPIRED_KEY, "1");
    } else {
      storage?.removeItem(SESSION_EXPIRED_KEY);
    }
  } catch {
    // A browser that blocks storage still works, the session stays in memory.
  }

  for (const listener of listeners) {
    listener();
  }
}

/** The session state as the browser currently knows it. */
export function getSessionState(): SessionState {
  if (!cacheValid) {
    cachedState = readState();
    cacheValid = true;
  }

  return cachedState;
}

/** The session state during server rendering and hydration: always empty. */
export function getServerSessionState(): SessionState {
  return SERVER_STATE;
}

/** Listen for session changes. */
export function subscribeToSession(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Checks the session against the accounts in the browser. When the account is
 * gone it has expired after 24 hours, so the session ends and the shopper is
 * told about it.
 */
export function checkSession(): Session | null {
  const state = getSessionState();

  if (!state.session) {
    return null;
  }

  // Reading the accounts also deletes the ones that have expired.
  const account = findAccountByEmail(getAccounts(), state.session.email);

  if (account) {
    return state.session;
  }

  writeState({ session: null, expired: true });

  return null;
}

/** Logs the shopper in. */
export function startSession(session: Session): void {
  writeState({ session, expired: false });
}

/** Ends the session and logs the shopper out. */
export function endSession(): void {
  writeState({ session: null, expired: getSessionState().expired });
}

/** Hides the message about the expired account, for example after registering. */
export function clearExpiredNotice(): void {
  const state = getSessionState();

  if (!state.expired) {
    return;
  }

  writeState({ session: state.session, expired: false });
}
