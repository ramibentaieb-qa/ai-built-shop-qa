# MiniMart — AI-Built Online Shop (QA base)

A Next.js skeleton for a small online shop, built for manual QA. This branch contains
**Story 1: Project setup** only — the application shell and nothing more.

## Requirements

- Node.js 20.9 or newer (Node 22 LTS or newer recommended)
- npm 10 or newer

## 1. Install the dependencies

```bash
npm install
```

## 2. Run the app in development

```bash
npm run dev
```

Then open <http://localhost:3000> in your browser. Stop the server with `Ctrl+C`.

## 3. Build for production

```bash
npm run build
npm run start
```

`npm run build` creates an optimized production build in `.next/`, and `npm run start` serves
that build on <http://localhost:3000>.

## All available scripts

| Script            | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Starts the development server on port 3000          |
| `npm run build`   | Creates the optimized production build in `.next/`  |
| `npm run start`   | Serves the production build (run `build` first)    |
| `npm run lint`    | Runs ESLint over the project                        |

## What Story 1 delivers

- A home page (`/`) showing the shop name, a short welcome message, and a header with
  **Home** and **Cart** navigation links.
- A Cart page (`/cart`) — an empty placeholder, no cart logic yet.
- A clear **Page not found** page for unknown URLs such as `/abc123`.
- A responsive layout that works on desktop and mobile widths, with light and dark colour
  themes that follow the operating system preference.
- A README with these instructions, and a root layout that adds the header and footer to
  every page.

### Deliberately out of scope

Products, search, cart logic, checkout, login and the database are **not** implemented in this
story. They arrive in later stories.

## Project structure

```
src/
  app/
    layout.tsx        # Root layout: header, footer, fonts, metadata
    page.tsx          # Home page
    cart/page.tsx     # Cart placeholder
    not-found.tsx     # "Page not found" page
    globals.css       # Design tokens and base styles
  components/
    site-header.tsx   # Header with Home / Cart navigation
    site-footer.tsx   # Footer
  lib/
    shop.ts           # Shop name and tagline (single source of truth)
```

## Notes for QA

- The shop name lives in `src/lib/shop.ts` and feeds the header, footer, pages and metadata.
- No API routes, database or environment variables are needed to run this story.
- The branch for this work is `feature/project-setup`; `main` is left untouched.
