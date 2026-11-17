import type { Metadata } from "next";

import { AuthRedirect } from "@/components/auth-redirect";
import { LoginForm } from "@/components/login-form";
import { readReturnPathFromParams } from "@/lib/login-return";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your MiniMart demo account.",
};

/** What the shopper reads when the checkout gate sends them here. */
const LOGIN_REQUIRED_MESSAGE = "Please log in to continue to payment";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const returnPath = readReturnPathFromParams(params);

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <AuthRedirect returnPath={returnPath} />

      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Log in
      </h1>

      {returnPath && (
        <p
          data-testid="login-required-message"
          role="status"
          className="mt-4 rounded-xl border border-line bg-surface-muted p-4 text-sm leading-6 text-ink-muted"
        >
          {LOGIN_REQUIRED_MESSAGE}
        </p>
      )}

      <div className="mt-8">
        <LoginForm returnPath={returnPath} />
      </div>
    </div>
  );
}
