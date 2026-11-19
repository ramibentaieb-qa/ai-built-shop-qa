"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent, type RefObject } from "react";

import { useSession } from "@/components/session-provider";
import {
  PAYMENT_FIELDS,
  validateField,
  validatePayment,
  type PaymentErrors,
  type PaymentField,
  type PaymentValues,
} from "@/lib/payment";

type FieldConfig = {
  /** The field of the rules. */
  field: PaymentField;
  /** The id of the input, which is also its test id. */
  id: string;
  /** The test id of the message below the field. */
  errorTestId: string;
  label: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  placeholder?: string;
};

/** The fields of the form, in the order they are shown. */
const FIELDS: FieldConfig[] = [
  {
    field: "name",
    id: "checkout-name",
    errorTestId: "checkout-error-name",
    label: "Full name",
    autoComplete: "name",
  },
  {
    field: "email",
    id: "checkout-email",
    errorTestId: "checkout-error-email",
    label: "Email",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
  {
    field: "phone",
    id: "checkout-phone",
    errorTestId: "checkout-error-phone",
    label: "Phone number",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
  },
  {
    field: "address",
    id: "checkout-address",
    errorTestId: "checkout-error-address",
    label: "Address",
    autoComplete: "street-address",
  },
  {
    field: "city",
    id: "checkout-city",
    errorTestId: "checkout-error-city",
    label: "City",
    autoComplete: "address-level2",
  },
  {
    field: "cardNumber",
    id: "checkout-card-number",
    errorTestId: "checkout-error-card-number",
    label: "Card number",
    inputMode: "numeric",
    // The card is never kept by the browser.
    autoComplete: "off",
    placeholder: "4242 4242 4242 4242",
  },
  {
    field: "expiry",
    id: "checkout-expiry",
    errorTestId: "checkout-error-expiry",
    label: "Expiry date",
    inputMode: "numeric",
    autoComplete: "off",
    placeholder: "MM/YY",
  },
  {
    field: "cvc",
    id: "checkout-cvc",
    errorTestId: "checkout-error-cvc",
    label: "CVC",
    // The security code is hidden while it is typed, like a password.
    type: "password",
    inputMode: "numeric",
    autoComplete: "off",
    placeholder: "123",
  },
];

type TextFieldProps = {
  id: string;
  label: string;
  testId: string;
  errorTestId: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  placeholder?: string;
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
  inputMode,
  autoComplete,
  placeholder,
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
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        ref={inputRef}
        data-testid={testId}
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

/**
 * The checkout form. The name and the email start from the account of the
 * shopper, and both can be changed. The card details are only read while the
 * shopper types: they are never written anywhere.
 */
export function PaymentForm() {
  const router = useRouter();
  const { session } = useSession();

  // What the shopper typed. The name and the email come from the account
  // until the shopper types something else.
  const [typed, setTyped] = useState<Partial<Record<PaymentField, string>>>({});
  const [errors, setErrors] = useState<PaymentErrors>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);

  const refs: Record<PaymentField, RefObject<HTMLInputElement | null>> = {
    name: nameRef,
    email: emailRef,
    phone: phoneRef,
    address: addressRef,
    city: cityRef,
    cardNumber: cardNumberRef,
    expiry: expiryRef,
    cvc: cvcRef,
  };

  const values: PaymentValues = {
    name: typed.name ?? session?.name ?? "",
    email: typed.email ?? session?.email ?? "",
    phone: typed.phone ?? "",
    address: typed.address ?? "",
    city: typed.city ?? "",
    cardNumber: typed.cardNumber ?? "",
    expiry: typed.expiry ?? "",
    cvc: typed.cvc ?? "",
  };

  function focusField(field: PaymentField) {
    refs[field]?.current?.focus();
  }

  function updateField(field: PaymentField, value: string) {
    setTyped((current) => ({ ...current, [field]: value }));

    if (!errors[field]) {
      return;
    }

    // The message goes away as soon as the field is good again.
    if (validateField(field, value)) {
      return;
    }

    setErrors((current) => {
      const next = { ...current };
      delete next[field];

      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // The browser checks the form itself, so every message comes from here.
    event.preventDefault();

    const nextErrors = validatePayment(values);

    setErrors(nextErrors);

    const firstInvalid = PAYMENT_FIELDS.find((field) => nextErrors[field]);

    if (firstInvalid) {
      // The first field that needs attention gets the focus, and no order is
      // placed.
      focusField(firstInvalid);
      return;
    }

    // Everything is good, so the order is placed. Nothing of the card is
    // taken along.
    router.push("/order-confirmation");
  }

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-2xl rounded-2xl border border-line bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-col gap-5">
        {FIELDS.map((field) => (
          <TextField
            key={field.field}
            id={field.id}
            label={field.label}
            testId={field.id}
            errorTestId={field.errorTestId}
            type={field.type}
            inputMode={field.inputMode}
            autoComplete={field.autoComplete}
            placeholder={field.placeholder}
            value={values[field.field]}
            error={errors[field.field]}
            inputRef={refs[field.field]}
            onChange={(value) => updateField(field.field, value)}
          />
        ))}
      </div>

      <button
        type="submit"
        data-testid="place-order"
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong sm:w-auto"
      >
        Place order
      </button>
    </form>
  );
}
