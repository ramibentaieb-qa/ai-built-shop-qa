"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { purgeExpiredAccounts } from "@/lib/account-store";

/*
 * The cleanup runs as soon as the browser loads this file, which is before the
 * page has finished loading. An account that is older than 24 hours is then
 * already gone when the page is ready.
 */
if (typeof window !== "undefined") {
  purgeExpiredAccounts();
}

/**
 * Deletes the demo accounts that are older than 24 hours. It shows nothing: it
 * only keeps the stored accounts fresh, both on a full page load and after a
 * move to another page inside the shop.
 */
export function AccountCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    purgeExpiredAccounts();
  }, [pathname]);

  return null;
}
