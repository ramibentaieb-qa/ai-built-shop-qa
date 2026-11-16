"use client";

import { useRef, useState, type FormEvent, type RefObject } from "react";

import { useSession } from "@/components/session-provider";
import { MIN_PASSWORD_LENGTH, findAccountByEmail, isValidEmail } from "@/lib/accounts";
import { addAccount, getAccounts } from "@/lib/account-store";

type FieldName = "name" | "email" | "password" | "confirm";

type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_FORM: Record<FieldName, string> = {
  name: "",
  email: "",
  password: "",
  confirm: "",
};

/** The order the fields are shown in, and the order they are checked in. */
const FIELD_ORDER: FieldName[] = ["name", "email", "password", "confirm"];

type TextFieldProps = {
  id: string;
  label: string;
  testId: string;
  errorTestId: string;
  type?: "text" | "email" | "password";
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
  type = "text",
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

/** Checks the form and returns the message for every field that is not ready. */
function validate(values: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  if (!values.confirm) {
    errors.confirm = "Confirm password is required";
  } else if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
}

/**
 * The registration form. A demo account is created in the browser only: there
 * is no server and no database, and the shopper is not logged in afterwards.
 */
export function RegisterForm() {
  const { dismissExpiredNotice } = useSession();

  const [values, setValues] = useState<Record<FieldName, string>>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [created, setCreated] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  function focusField(field: FieldName) {
    const refs: Record<FieldName, RefObject<HTMLInputElement | null>> = {
      name: nameRef,
      email: emailRef,
      password: passwordRef,
      confirm: confirmRef,
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
    setCreated(false);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);

    if (firstInvalid) {
      // The first field that needs attention gets the focus.
      focusField(firstInvalid);
      return;
    }

    // An email that is already registered cannot be used a second time.
    if (findAccountByEmail(getAccounts(), values.email)) {
      setErrors({ email: "This email is already registered" });
      focusField("email");
      return;
    }

    addAccount({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
      createdAt: Date.now(),
    });

    // The form starts empty again. The shopper is not logged in and the cart is
    // not touched.
    setValues({ ...EMPTY_FORM });
    setErrors({});
    setCreated(true);

    // A new account means the message about the expired one is not needed.
    dismissExpiredNotice();
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-col gap-5">
        <TextField
          id="register-name"
          label="Full name"
          testId="register-name"
          errorTestId="register-error-name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          inputRef={nameRef}
          onChange={(value) => updateField("name", value)}
        />

        <TextField
          id="register-email"
          label="Email"
          testId="register-email"
          errorTestId="register-error-email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          inputRef={emailRef}
          onChange={(value) => updateField("email", value)}
        />

        <TextField
          id="register-password"
          label="Password"
          testId="register-password"
          errorTestId="register-error-password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          inputRef={passwordRef}
          onChange={(value) => updateField("password", value)}
        />

        <TextField
          id="register-confirm-password"
          label="Confirm password"
          testId="register-confirm-password"
          errorTestId="register-error-confirm"
          type="password"
          autoComplete="new-password"
          value={values.confirm}
          error={errors.confirm}
          inputRef={confirmRef}
          onChange={(value) => updateField("confirm", value)}
        />
      </div>

      <button
        type="submit"
        data-testid="register-submit"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong sm:w-auto"
      >
        Create account
      </button>

      {created && (
        <p
          data-testid="register-success"
          role="status"
          className="mt-4 text-sm font-semibold text-success"
        >
          Account created
        </p>
      )}
    </form>
  );
}
