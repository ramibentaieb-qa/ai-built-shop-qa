/**
 * Checkout rules
 * --------------
 * The rules for the checkout form. They are plain functions so they stay easy
 * to read and to test.
 *
 * The card details are only looked at, never kept: nothing in this file
 * writes them anywhere.
 */

import { isValidEmail } from "@/lib/accounts";

/** The fields of the checkout form, in the order they are shown. */
export const PAYMENT_FIELDS = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "cardNumber",
  "expiry",
  "cvc",
] as const;

export type PaymentField = (typeof PAYMENT_FIELDS)[number];

export type PaymentValues = Record<PaymentField, string>;

export type PaymentErrors = Partial<Record<PaymentField, string>>;

/** Name, address and city may not be longer than this. */
export const MAX_TEXT_LENGTH = 100;

/** A card number has this many digits. */
export const CARD_DIGITS = 16;

/** The CVC has this many digits. */
export const CVC_DIGITS = 3;

/** A phone number has between this many and this many digits. */
export const MIN_PHONE_DIGITS = 8;
export const MAX_PHONE_DIGITS = 15;

/** What the shopper reads when a field is left empty. */
export const REQUIRED_MESSAGES: Record<PaymentField, string> = {
  name: "Full name is required",
  email: "Email is required",
  phone: "Phone number is required",
  address: "Address is required",
  city: "City is required",
  cardNumber: "Card number is required",
  expiry: "Expiry date is required",
  cvc: "CVC is required",
};

/** The digits of a phone number: spaces and a leading plus do not count. */
export function phoneDigits(value: string): string {
  const trimmed = value.trim();
  const withoutPlus = trimmed.startsWith("+") ? trimmed.slice(1) : trimmed;

  return withoutPlus.replace(/\s/g, "");
}

/** True when the phone number holds 8 to 15 digits and nothing else. */
export function isValidPhone(value: string): boolean {
  const digits = phoneDigits(value);

  return (
    digits.length >= MIN_PHONE_DIGITS &&
    digits.length <= MAX_PHONE_DIGITS &&
    /^\d+$/.test(digits)
  );
}

/** The digits of a card number: spaces between groups do not count. */
export function cardDigits(value: string): string {
  return value.replace(/\s/g, "");
}

/** True when the card number holds exactly 16 digits. */
export function isValidCardNumber(value: string): boolean {
  const digits = cardDigits(value);

  return digits.length === CARD_DIGITS && /^\d+$/.test(digits);
}

/** True when the CVC holds exactly three digits. */
export function isValidCvc(value: string): boolean {
  return new RegExp(`^\\d{${CVC_DIGITS}}$`).test(value.trim());
}

/** True when the expiry date is MM/YY with a month from 01 to 12. */
export function isValidExpiryFormat(value: string): boolean {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.trim());
}

/**
 * True when the expiry date is not in the past. The current month is still
 * good, so the card is only too old when the month before it has passed.
 */
export function isNotExpired(value: string, now: Date = new Date()): boolean {
  if (!isValidExpiryFormat(value)) {
    return false;
  }

  const [month, year] = value.trim().split("/").map(Number);
  const expiry = new Date(2000 + year, month - 1, 1);
  const current = new Date(now.getFullYear(), now.getMonth(), 1);

  return expiry.getTime() >= current.getTime();
}

/** The message for one field, or nothing when the field is good. */
export function validateField(field: PaymentField, value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return REQUIRED_MESSAGES[field];
  }

  switch (field) {
    case "name":
      return trimmed.length > MAX_TEXT_LENGTH
        ? `Full name must be at most ${MAX_TEXT_LENGTH} characters`
        : null;
    case "email":
      return isValidEmail(trimmed) ? null : "Please enter a valid email address";
    case "phone":
      return isValidPhone(trimmed)
        ? null
        : `Phone number must have ${MIN_PHONE_DIGITS} to ${MAX_PHONE_DIGITS} digits`;
    case "address":
      return trimmed.length > MAX_TEXT_LENGTH
        ? `Address must be at most ${MAX_TEXT_LENGTH} characters`
        : null;
    case "city":
      return trimmed.length > MAX_TEXT_LENGTH
        ? `City must be at most ${MAX_TEXT_LENGTH} characters`
        : null;
    case "cardNumber":
      return isValidCardNumber(trimmed) ? null : `Card number must have ${CARD_DIGITS} digits`;
    case "expiry":
      if (!isValidExpiryFormat(trimmed)) {
        return "Expiry date must be in the MM/YY format";
      }

      return isNotExpired(trimmed) ? null : "Expiry date must not be in the past";
    case "cvc":
      return isValidCvc(trimmed) ? null : `CVC must have ${CVC_DIGITS} digits`;
  }
}

/** The messages for every field that is not good yet. */
export function validatePayment(values: PaymentValues): PaymentErrors {
  const errors: PaymentErrors = {};

  for (const field of PAYMENT_FIELDS) {
    const message = validateField(field, values[field]);

    if (message) {
      errors[field] = message;
    }
  }

  return errors;
}
