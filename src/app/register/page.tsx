import type { Metadata } from "next";

import { RegisterForm } from "@/components/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a demo account for MiniMart.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Create an account
      </h1>

      <p className="mt-4 rounded-xl border border-line bg-surface-muted p-4 text-sm leading-6 text-ink-muted">
        Demo accounts are stored in this browser and deleted after 24 hours. Do not use a real
        password.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
