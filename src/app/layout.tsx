import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";

import { AccountCleanup } from "@/components/account-cleanup";
import { CartProvider } from "@/components/cart-provider";
import { SessionExpiredNotice } from "@/components/session-expired-notice";
import { SessionProvider } from "@/components/session-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SHOP_DESCRIPTION, SHOP_NAME } from "@/lib/shop";

import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SHOP_NAME} | A small online shop`,
    template: `%s | ${SHOP_NAME}`,
  },
  description: SHOP_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AccountCleanup />
        <SessionProvider>
          <CartProvider>
            <SiteHeader />
            <SessionExpiredNotice />
            <main id="main-content" tabIndex={-1} className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
