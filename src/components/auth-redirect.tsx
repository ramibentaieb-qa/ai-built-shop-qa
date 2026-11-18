"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/components/session-provider";

/**
 * Sends a shopper who is already logged in away from the register and login
 * pages. They go to the page they asked for before logging in, or to the home
 * page when there is no such page.
 */
export function AuthRedirect({ returnPath }: { returnPath?: string | null }) {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // The page replaces the one before it, so the back button does not lead
      // back to the register or login page.
      router.replace(returnPath ?? "/");
    }
  }, [session, returnPath, router]);

  return null;
}
