"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type RefObject } from "react";

import { useSession } from "@/components/session-provider";
import { findAccountByEmail } from "@/lib/accounts";
import { getAccounts } from "@/lib/account-store";

type FieldName = "email" | "password";

type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_FORM: Record<FieldName, string> = {
  email: "",
  password: "",
};

/** The order the fields are shown in, and the order they are checked in. */
const FIELD_ORDER: FieldName[] = ["email", "password"];

/** What the shopper reads when the email or the password is wrong. */
const WRONG_CREDENTIALS_MESSAGE = "Invalid email or password";

type TextFieldProps = {
  id: string;
  label: string;
  testId: string;
  errorTestId: string;
  type: "email" | "password";
  autoComplete: string;
  value: string;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
};

/** One field of the form: a label, the field itself and the message below it. */
function TextField({
  id,
  label,
  testId,
  errorTestId,
  type,
  autoComplete,
  value,
  error,
  inputRef,
  onChange,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        ref={inputRef}
        data-testid={testId}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 block min-h-11 w-full rounded-lg border bg-surface px-3 py-2.5 text-base text-ink transition-colors focus:border-brand ${
          error ? "border-danger" : "border-line"
        }`}
      />
      {error && (
        <p
          id={errorId}
          data-testid={errorTestId}
          role="alert"
          className="mt-2 text-sm font-semibold text-danger-ink"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Checks the form and returns the message for every field that is empty. */
function validate(values: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

/**
 * The login form. The email is compared without regard to upper or lower case,
 * the password is compared as it is. A wrong email and a wrong password give
 * the same message, so it stays hidden which one was wrong.
 */
export function LoginForm({ returnPath }: { returnPath?: string | null }) {
  const router = useRouter();
  const { logIn } = useSession();

  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failed, setFailed] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function focusField(field: FieldName) {
    const refs: Record<FieldName, RefObject<HTMLInputElement | null>> = {
      email: emailRef,
      password: passwordRef,
    };

    refs[field]?.current?.focus();
  }

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // The browser checks the form itself, so every message comes from here.
    event.preventDefault();

    const nextErrors = validate(values);

    setErrors(nextErrors);
    setFailed(false);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);

    if (firstInvalid) {
      // The first field that needs attention gets the focus.
      focusField(firstInvalid);
      return;
    }

    // Reading the accounts also deletes the ones that have expired.
    const account = findAccountByEmail(getAccounts(), values.email);

    if (!account || account.password !== values.password) {
      setFailed(true);
      return;
    }

    logIn({
      email: account.email,
      name: account.name,
      createdAt: account.createdAt,
    });

    // The shopper goes back to the page the checkout gate sent them from, or
    // to the home page after a normal login.
    router.push(returnPath ?? "/");
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-col gap-5">
        <TextField
          id="login-email"
          label="Email"
          testId="login-email"
          errorTestId="login-error-email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          inputRef={emailRef}
          onChange={(value) => updateField("email", value)}
        />

        <TextField
          id="login-password"
          label="Password"
          testId="login-password"
          errorTestId="login-error-password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          inputRef={passwordRef}
          onChange={(value) => updateField("password", value)}
        />
      </div>

      {failed && (
        <p
          id="login-error"
          data-testid="login-error"
          role="alert"
          className="mt-4 text-sm font-semibold text-danger-ink"
        >
          {WRONG_CREDENTIALS_MESSAGE}
        </p>
      )}

      <button
        type="submit"
        data-testid="login-submit"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong sm:w-auto"
      >
        Log in
      </button>
    </form>
  );
}
