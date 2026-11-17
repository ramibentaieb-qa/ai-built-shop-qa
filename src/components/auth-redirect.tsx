"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/components/session-provider";

/**
 * Sends a shopper who is already logged in back to the home page. The register
 * and login pages are for shoppers who are not logged in yet.
 */
export function AuthRedirect() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // The home page replaces the page, so the back button does not lead back
      // to the register or login page.
      router.replace("/");
    }
  }, [session, router]);

  return null;
}
