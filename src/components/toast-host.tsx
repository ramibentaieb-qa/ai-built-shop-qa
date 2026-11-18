"use client";

import { useEffect, useRef, useSyncExternalStore, type FocusEvent } from "react";

import {
  dismissToast,
  getServerToast,
  getToast,
  subscribeToToast,
  type ToastTone,
} from "@/lib/toast-store";

/** How long a notification stays before it goes away by itself. */
const TOAST_DURATION_MS = 5000;

/** The border and the background of each kind of notification. */
const TONE_SURFACE: Record<ToastTone, string> = {
  info: "border-line bg-surface",
  success: "border-success/40 bg-success/10",
  warning: "border-danger/40 bg-surface",
};

/** The colour of the text of each kind of notification. */
const TONE_TEXT: Record<ToastTone, string> = {
  info: "text-ink",
  success: "text-ink",
  warning: "text-danger-ink",
};

/**
 * Shows the notification of the shop at the bottom of the page. The
 * notification goes away by itself after a while, and the shopper can close it
 * right away. It stays as long as the pointer is on it or it has the focus, so
 * the text can be read and the close button can be found.
 */
export function ToastHost() {
  const toast = useSyncExternalStore(subscribeToToast, getToast, getServerToast);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0);
  const left = useRef(TOAST_DURATION_MS);

  useEffect(() => {
    if (!toast) {
      return;
    }

    // Every notification gets the same time, also the one that replaces
    // another one.
    left.current = TOAST_DURATION_MS;
    startedAt.current = Date.now();

    timer.current = setTimeout(() => {
      dismissToast();
    }, left.current);

    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [toast]);

  /** The countdown stops while the pointer is on the notification. */
  function pause() {
    if (timer.current === null) {
      return;
    }

    clearTimeout(timer.current);
    timer.current = null;

    // The time that is left is kept, so the notification does not lose it.
    left.current = Math.max(0, left.current - (Date.now() - startedAt.current));
  }

  /** The countdown starts again when the pointer leaves the notification. */
  function resume() {
    if (timer.current !== null) {
      return;
    }

    if (left.current <= 0) {
      // The notification was due to go away while it was being read.
      dismissToast();
      return;
    }

    startedAt.current = Date.now();
    timer.current = setTimeout(() => {
      dismissToast();
    }, left.current);
  }

  /** The countdown stops while the notification has the focus. */
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      // The focus stays inside the notification.
      return;
    }

    resume();
  }

  if (!toast) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        data-testid="toast"
        role="status"
        className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${TONE_SURFACE[toast.tone]}`}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={handleBlur}
      >
        <p
          data-testid={toast.testId}
          className={`flex-1 text-sm font-semibold sm:text-base ${TONE_TEXT[toast.tone]}`}
        >
          {toast.text}
        </p>
        <button
          type="button"
          data-testid="toast-close"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="-mr-2 -mt-2 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-ink-muted transition-colors hover:bg-surface-muted"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
}
