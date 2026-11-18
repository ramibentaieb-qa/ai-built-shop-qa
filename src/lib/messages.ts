/**
 * The texts of the notifications
 * -------------------------------
 * The shop shows short messages at the bottom of the page. The words stay the
 * same as before, only the place where they appear changes.
 */

/** What the shopper reads after creating a demo account. */
export function welcomeMessage(name: string): string {
  return `Welcome, ${name}! Your account was created.`;
}

/** What the shopper reads when the checkout gate sends them to the login page. */
export const LOGIN_REQUIRED_MESSAGE = "Please log in to continue to payment";
