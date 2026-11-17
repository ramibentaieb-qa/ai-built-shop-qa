"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  checkSession,
  clearExpiredNotice,
  clearWelcome,
  endSession,
  getServerSessionState,
  getSessionState,
  startSession,
  subscribeToSession,
  type SessionState,
} from "@/lib/session-store";
import type { Session } from "@/lib/session";

/*
 * The session is checked as soon as the browser loads this file, so an account
 * that has expired is already closed when the page is ready.
 */
if (typeof window !== "undefined") {
  checkSession();
}

type SessionContextValue = SessionState & {
  /** False until the session stored in the browser has been read. */
  ready: boolean;
  /** Logs the shopper in. */
  logIn: (session: Session) => void;
  /** Ends the session and logs the shopper out. */
  logOut: () => void;
  /** Hides the message about the expired account. */
  dismissExpiredNotice: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/**
 * Keeps the session for the whole app: the header reads the shopper from it,
 * the login form writes it and the logout button ends it. The session is kept
 * in the browser, so it survives a refresh and a move between pages, and it
 * ends when the tab is closed.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    subscribeToSession,
    getSessionState,
    getServerSessionState,
  );

  // The server has no browser storage, so the session is only known after
  // hydration.
  const ready = useSyncExternalStore(
    subscribeToSession,
    () => true,
    () => false,
  );

  const pathname = usePathname();

  useEffect(() => {
    // An account can expire while the shopper is moving between pages.
    checkSession();

    // The welcome message belongs to the home page, so it is forgotten when
    // the shopper moves to another page.
    if (pathname !== "/") {
      clearWelcome();
    }
  }, [pathname]);

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      ready,
      logIn: startSession,
      logOut: endSession,
      dismissExpiredNotice: clearExpiredNotice,
    }),
    [state, ready],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Read the session from anywhere inside the app. */
export function useSession(): SessionContextValue {
  const session = useContext(SessionContext);

  if (!session) {
    throw new Error("useSession must be used inside a SessionProvider");
  }

  return session;
}
