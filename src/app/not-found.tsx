import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand">
        Error 404
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-ink-muted">
        We couldn&apos;t find the page you were looking for. The link may be broken, or the page
        may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-strong"
      >
        Back to home
      </Link>
    </div>
  );
}
