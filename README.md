![Playwright Tests](https://github.com/ramibentaieb-qa/ai-built-shop-qa/actions/workflows/playwright.yml/badge.svg)

# MiniMart — AI-Built Online Shop (QA base)

A Next.js skeleton for a small online shop, built for manual QA. This branch delivers
**Story 5: Cart page items** on top of the Story 1 shell, the Story 2 product list, the
Story 3 product detail page and the Story 4 cart.

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

### Deliberately out of scope for Story 1

Products, search, cart logic, checkout, login and the database were **not** implemented in
Story 1. They arrive in later stories.

## What Story 2 adds

- A **Products** link in the header on every page (`data-testid="nav-products"`) that opens
  `/products`.
- A `/products` page listing exactly 12 men's urban t-shirts, each with an image, a unique name
  and a price.
- Product data in one local file, `src/data/products.json`, with the artwork in
  `public/products/`.
- A responsive product grid — one column on mobile, up to four on wide screens, with no
  horizontal scrolling.

### Deliberately out of scope for Story 2

Search, filters, the product detail page, add-to-cart, cart logic, checkout, login and the
database are **not** implemented in this story. They arrive in later stories.

## What Story 3 adds

- A product detail page at `/products/{id}` (for example `/products/1`). Clicking a product
  name or image on `/products` opens it.
- The detail page shows the product title, price, description and image, plus size options
  (S, M, L, XL), a quantity selector and an **Add to cart** button.
- The quantity starts at 1. **+** increases it by one up to 10 and **−** decreases it by one down
  to 1; at those limits the matching button is disabled. The quantity itself is read-only and
  cannot be typed into.
- Only one size can be selected at a time, and the selected size is marked.
- An unknown id such as `/products/999` returns a real **404** with the "Page not found" page.
- A **Back to products** link returns to `/products`.

### Deliberately out of scope for Story 3

Adding to the cart, the "Please select a size" message, the cart badge, reviews, image galleries
and the database are **not** implemented in this story. The **Add to cart** button is present but
does nothing yet — that is the next story.

## What Story 4 adds

- The **Add to cart** button on a product page now works. Clicking it without picking a size shows
  the message **"Please select a size"** (`data-testid="size-error"`); the message disappears as
  soon as a size is selected. Nothing is added to the cart in that case.
- With a size selected, the chosen quantity is added to the cart. The chosen size and quantity
  stay as they are after adding.
- A red **cart badge** (`data-testid="cart-badge"`) in the header, on top of the cart icon. It
  shows the total number of items in the cart, and it is hidden while the cart is empty. More than
  99 items shows `99+`.
- The badge keeps its count when you move between pages (Home, Products, Product detail, Cart,
  the 404 page) and when you use the browser back and forward buttons.
- The cart is kept in the browser only (`localStorage`), so it survives a refresh. There is no
  server, no API route and no database.

### Deliberately out of scope for Story 4

The contents of the cart page, removing items, changing quantities in the cart, checkout, login
and the database are **not** implemented in this story. The cart page is still a placeholder.

## What Story 5 adds

- The `/cart` page now shows what is really in the cart: one line for every product and size
  combination. The same product in two sizes is two lines.
- A line shows the product image (with alt text), the product name, the size, the unit price, the
  quantity and the line total (unit price × quantity). The name links back to the product page.
- Every line has its own **+** and **−** buttons. **+** raises the quantity by one up to 10 and is
  disabled at 10, **−** lowers it by one down to 1 and is disabled at 1.
- Changing the quantity updates the line total and the header badge right away, without a reload.
- Every line has a **Remove** button. It takes the line away and lowers the badge by the
  quantity of that line.
- When the cart is empty the page shows **"Your cart is empty"** and a **Continue shopping** link
  to `/products`. The badge is hidden.
- The cart and the quantity changes are kept in the browser, so a refresh does not lose them.
- Money is calculated in cents, so a line total never shows a rounding error.

### Deliberately out of scope for Story 5

The subtotal, discount, delivery fee and order total, the checkout and payment pages, login and
the database are **not** implemented in this story. They arrive in later stories.

## Project structure

```
src/
  app/
    layout.tsx          # Root layout: header, footer, fonts, metadata
    page.tsx            # Home page
    products/page.tsx   # Product list page
    products/[id]/page.tsx # Product detail page
    cart/page.tsx       # Cart page
    not-found.tsx       # "Page not found" page
    globals.css         # Design tokens and base styles
  components/
    site-header.tsx     # Header with Home / Products / Cart navigation and the cart badge
    site-footer.tsx     # Footer
    product-card.tsx    # Product card: image, name, price
    product-purchase-panel.tsx # Sizes, quantity stepper, add to cart
    cart-provider.tsx   # Shares the cart between the badge, the product page and the cart page
    cart-view.tsx       # The cart page: the lines, or the empty cart message
    cart-line-item.tsx  # One line of the cart: image, name, size, price, quantity, total
  data/
    products.json       # The 12 products
  lib/
    shop.ts             # Shop name and tagline (single source of truth)
    products.ts         # Product types, lookup and price formatting
    cart.ts             # Cart rules: counting items, the 99+ badge, money, adding an item
    cart-store.ts       # Keeps the cart in the browser storage
public/
  products/             # Product artwork (SVG)
```

## Notes for QA

- The shop name lives in `src/lib/shop.ts` and feeds the header, footer, pages and metadata.
- No API routes, database or environment variables are needed to run this story.
- Product data lives in `src/data/products.json`; every price is formatted in one place
  (`formatPrice` in `src/lib/products.ts`), so the `$12.34` format stays consistent.
- Locators on the list page: `nav-products`, `product-list`, `product-card`, `product-image`,
  `product-name`, `product-price`.
- Locators on the detail page: `product-title`, `product-price`, `product-description`,
  `product-image`, `size-option-S`, `size-option-M`, `size-option-L`, `size-option-XL`,
  `quantity-value`, `quantity-increase`, `quantity-decrease`, `add-to-cart`,
  `back-to-products`.
- The quantity value is a read-only field: it reads as text *and* as a value, but it cannot be
  typed into.
- Product ids are the numbers `1` to `12`; any other id is a 404.
- Locators for the cart: `nav-cart` (the cart link in the header), `cart-badge` (the number on
  the cart icon), `add-to-cart` and `size-error`.
- The badge text is the number only, for example `3` or `99+`. It is not in the DOM while the
  cart is empty.
- The cart lives in the browser under the `ai-built-shop-qa:cart:v1` key of `localStorage`. Clear
  that key to start from an empty cart.
- Locators on the cart page: `cart-item`, `cart-item-image`, `cart-item-name`, `cart-item-size`,
  `cart-item-price`, `cart-item-total`, `cart-item-quantity`, `cart-item-increase`,
  `cart-item-decrease`, `cart-item-remove`, `cart-empty` and `continue-shopping`. The badge is
  still `cart-badge`.
- The element behind each cart locator: the line is an `li`, the image is an `img`, the name is an
  `h2` with a link inside, the size and the unit price are `span`s, the quantity is a read-only
  `textarea`, the line total is a `p`, the three buttons are `button`s, the empty message is a
  `p` and the continue shopping link is an `a`.
- The cart quantity is a read-only field, like the one on the product page: it reads as text *and*
  as a value, but it cannot be typed into.
- A line total is the unit price times the quantity, counted in cents, so `$29.99` × 3 is
  `$89.97`.
- The branch for this work is `feature/cart-items`; `main` is left untouched.
