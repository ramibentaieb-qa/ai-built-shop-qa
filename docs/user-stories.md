# User Stories

## Story 1: Project setup

**As a** QA lead,
**I want** a working Next.js shop application skeleton that runs locally,
**so that** I have a stable base to test and to build the next stories on.

### Acceptance criteria
1. The project installs with `npm install` without errors.
2. The app starts with `npm run dev` and opens at `http://localhost:3000` without errors in the terminal or the browser console.
3. The home page displays the shop name, a short welcome message, and a header with the navigation links "Home" and "Cart" (the Cart page can be an empty placeholder).
4. The home page displays correctly on desktop and mobile screen widths (no overlapping or cut-off content).
5. Opening a URL that doesn't exist (for example `/abc123`) shows a clear "Page not found" message, not a blank page or a crash.
6. `npm run build` completes without errors.
7. The README explains how to install, run and build the project, in the order a new person would follow.
8. The work is on the branch `feature/project-setup`, with small commits and clear messages, and nothing is committed directly to `main`.

### Out of scope
Products, search, cart logic, checkout, login, and any database. Do not implement these in this story.


## Story 2: Product List

**As a** shopper,
**I want** to browse a list of t-shirts,
**so that** I can see what is available and choose one to look at.

### Acceptance Criteria
1. Every page has a "Products" link in the header (`data-testid="nav-products"`). Clicking it opens `/products`.
2. `/products` shows exactly 12 products (male urban t-shirts), each with a unique name.
3. Each product card shows an image (with meaningful alt text), the product name, and the price in one consistent format (for example `$29.99`).
4. The page displays correctly at 375px and 1440px width (no overlap, no horizontal scrolling).
5. Locators follow the naming list below.

### Out of scope
Search, filters, product detail page, add to cart, cart page, checkout, login, and any database. Product data may live in one local file.



## Locator naming
`nav-products`, `nav-cart`, `cart-badge`, `product-list`, `product-card-{id}`, `product-name-{id}`, `product-price-{id}`, `product-title`, `product-price`, `size-option-{S|M|L|XL}`, `quantity-increase`, `quantity-decrease`, `quantity-value`, `add-to-cart`, `size-error`.