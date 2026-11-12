import { SHOP_NAME } from "@/lib/shop";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <p>
          {SHOP_NAME} — a mock shop for QA testing. No real orders, payments or customer data.
        </p>
        <p className="text-ink-muted/80">Story 2 · Product list</p>
      </div>
    </footer>
  );
}
