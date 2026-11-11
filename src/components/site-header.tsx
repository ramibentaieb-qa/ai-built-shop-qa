"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SHOP_NAME } from "@/lib/shop";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/cart", label: "Cart" },
] as const;

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

export function SiteHeader() {
  const pathname = usePathname();

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

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-surface-muted text-ink"
                        : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
