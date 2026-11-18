/**
 * Notification store
 * ------------------
 * A notification is a short message at the bottom of the page. Only one is
 * shown at a time: a new one replaces the one before it.
 *
 * The notification lives in the browser while the page is open. A refresh
 * starts without one, so a message that was shown once is not shown again.
 */

export type ToastTone = "info" | "success" | "warning";

export type Toast = {
  /** The test id that belongs on the text inside the notification. */
  testId: string;
  /** The text the shopper reads. */
  text: string;
  /** How the notification looks. */
  tone: ToastTone;
  /** Runs when the shopper dismisses the notification. */
  onDismiss?: () => void;
};

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * The notification that is on screen right now. It is kept as it is, because
 * `useSyncExternalStore` needs the same value as long as nothing changed.
 */
let current: Toast | null = null;

function notifyListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** The notification the shopper sees right now. */
export function getToast(): Toast | null {
  return current;
}

/** The notification during server rendering and hydration: always none. */
export function getServerToast(): Toast | null {
  return null;
}

/** Listen for notifications that come and go. */
export function subscribeToToast(listener: Listener): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Shows a notification. A notification that is already on screen is replaced,
 * so the shopper only ever reads one at a time.
 */
export function showToast(toast: Toast): void {
  current = toast;
  notifyListeners();
}

/** Takes the notification away, for example when the shopper closes it. */
export function dismissToast(): void {
  const dismissed = current;

  if (!dismissed) {
    return;
  }

  current = null;
  notifyListeners();

  // The message was read, so the shop does not have to remember it.
  dismissed.onDismiss?.();
}
