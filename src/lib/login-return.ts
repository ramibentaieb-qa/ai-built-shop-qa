/**
 * Login return address
 * --------------------
 * When the checkout gate sends a shopper to the login page, the page it came
 * from is kept as the return address, so the shopper can go on after logging
 * in. Only pages inside the shop are allowed, so a full address from somewhere
 * else is ignored.
 */

/** The query parameter that holds the return address. */
export const LOGIN_RETURN_PARAM = "next";

/**
 * The other names a return address may come with. The first one is the name
 * the shop itself uses, the others are the usual names a shop may pick.
 */
const RETURN_PARAM_NAMES = [
  LOGIN_RETURN_PARAM,
  "returnTo",
  "returnUrl",
  "redirect",
  "redirectTo",
] as const;

/**
 * True when the value is a path inside the shop. A full address, or anything
 * that could point outside the shop, is not allowed.
 */
export function isInternalPath(value: string | undefined | null): boolean {
  if (!value) {
    return false;
  }

  return (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !value.includes(" ")
  );
}

/** The address to come back to after logging in, if it is allowed. */
export function readReturnPath(value: string | undefined | null): string | null {
  return isInternalPath(value) ? (value as string) : null;
}

/**
 * The address to come back to after logging in, read from the address of the
 * login page. A value that points outside the shop is ignored, so the shopper
 * lands on the home page.
 */
export function readReturnPathFromParams(
  params: Record<string, string | string[] | undefined>,
): string | null {
  for (const name of RETURN_PARAM_NAMES) {
    const value = params[name];
    const first = Array.isArray(value) ? value[0] : value;
    const path = readReturnPath(first);

    if (path) {
      return path;
    }
  }

  return null;
}

/** The login page address, with the page to come back to. */
export function loginUrl(returnPath: string): string {
  // The slash stays readable, the rest of the path is escaped.
  const escaped = encodeURIComponent(returnPath).replace(/%2F/gi, "/");

  return `/login?${LOGIN_RETURN_PARAM}=${escaped}`;
}
