import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // `cacheComponents` streams a prerendered shell before the page resolves, which
  // turns an unknown product id into a 200 that renders the not-found page.
  // Without it the app renders the route in one pass, so `notFound()` can set a
  // real 404 status.
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
