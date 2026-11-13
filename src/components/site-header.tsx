"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/components/cart-provider";
import { formatBadgeCount } from "@/lib/cart";
import { SHOP_NAME } from "@/lib/shop";

type NavLink = {
  href: string;
  label: string;
  testId?: string;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home", testId: "nav-home" },
  { href: "/products", label: "Products", testId: "nav-products" },
  { href: "/cart", label: "Cart", testId: "nav-cart" },
];

function ShopMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h9.5a2 2 0 0 0 2-1.6L21.7 7H5.2" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { count } = useCart();

  // The badge is only shown when there is something in the cart.
  const showBadge = count > 0;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg font-display text-lg font-bold tracking-tight text-ink transition-colors hover:text-brand"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand text-brand-contrast">
            <ShopMark />
          </span>
          {SHOP_NAME}
        </Link>

        <nav aria-label="Main" className="w-full sm:w-auto">
          <ul className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const isCart = link.href === "/cart";

              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    data-testid={link.testId}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-muted text-ink"
                        : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                    }`}
                  >
                    {isCart && <CartIcon />}
                    {link.label}
                  </Link>

                  {/*
                    The badge sits on the top right corner of the cart icon.
                    The icon starts 12px from the left of the link (the px-3
                    padding) and is 24px wide, so its right edge is 36px from
                    the left of the link. Anchoring the badge to that edge keeps
                    it over the icon and lets a wider badge grow to the left,
                    away from the "Cart" label. It is lifted 8px so it rests on
                    top of the icon instead of beside it.
                  */}
                  {isCart && showBadge && (
                    <span
                      data-testid="cart-badge"
                      aria-live="polite"
                      className="pointer-events-none absolute -top-2 right-[calc(100%_-_36px)] inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[11px] leading-none font-bold text-danger-contrast tabular-nums"
                    >
                      {formatBadgeCount(count)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
