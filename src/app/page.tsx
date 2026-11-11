import Link from "next/link";

import { SHOP_NAME, SHOP_TAGLINE } from "@/lib/shop";

const READY_ITEMS = [
  {
    title: "Storefront shell",
    description:
      "A responsive header with Home and Cart navigation, a welcome message and a clear footer.",
  },
  {
    title: "Cart placeholder",
    description:
      "The Cart page is in place and ready for cart logic when that story starts.",
  },
  {
    title: "Helpful 404",
    description:
      "Unknown URLs show a clear \"Page not found\" message instead of a blank screen.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-10">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Online shop
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          {SHOP_NAME}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8">
          Welcome to {SHOP_NAME} — {SHOP_TAGLINE.toLowerCase()}. The storefront is ready for
          its first products; browsing, cart logic and checkout arrive in later stories.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong"
          >
            Go to cart
          </Link>
          <Link
            href="#ready-to-test"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            See what&apos;s ready
          </Link>
        </div>
      </section>

      <section
        id="ready-to-test"
        aria-labelledby="ready-to-test-heading"
        className="mt-8 scroll-mt-24 rounded-2xl border border-line bg-surface p-6 sm:mt-10 sm:p-8"
      >
        <h2
          id="ready-to-test-heading"
          className="font-display text-lg font-bold tracking-tight text-ink"
        >
          Ready to test
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {READY_ITEMS.map((item) => (
            <li key={item.title} className="rounded-xl border border-line bg-surface-muted p-4">
              <h3 className="font-display text-sm font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{item.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-6 text-ink-muted">
          Products, search, cart logic, checkout, login and the database are intentionally not
          part of this story.
        </p>
      </section>
    </div>
  );
}
