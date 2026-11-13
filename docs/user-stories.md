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

---

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

----

## Story 3: Product Detail

**As a** shopper,
**I want** to open a product,
**so that** I can read its details and choose size and quantity.

### Acceptance Criteria
1. Clicking a product name or image on `/products` opens `/products/{id}`, where the id is a number from 1 to 12 (for example `/products/1`).
2. The detail page shows the same title and price as the clicked card, a non-empty description, at least one image with meaningful alt text, the sizes S, M, L and XL, a quantity selector, and an "Add to cart" button.
3. The quantity starts at 1. "+" increases it by 1, up to 10 (at 10 the "+" button is disabled). "−" decreases it by 1, down to 1 (at 1 the "−" button is disabled). The quantity cannot be typed in.
4. Only one size can be selected at a time. Selecting another size replaces the previous one, and the selected size is visibly marked.
5. An unknown id (`/products/999`, `/products/0`, `/products/-1`, `/products/abc`) shows the "Page not found" page with status 404.
6. A "Back to products" link returns to `/products`.
7. The page displays correctly at 375px and 1440px width, and every control can be used with the keyboard only.

### Locators
`product-title`, `product-price`, `product-description`, `product-image`, `size-option-S`, `size-option-M`, `size-option-L`, `size-option-XL`, `quantity-decrease`, `quantity-increase`, `quantity-value`, `add-to-cart`, `back-to-products`.
(On `/products`, the existing `product-card`, `product-name` and `product-image` are unchanged; the name and image become links.)

### Out of scope
Adding to the cart (the "Add to cart" button may exist but does nothing yet), the "Please select a size" message, the cart badge, reviews, image galleries, and any database.

## Story 4: Add to Cart and Cart Badge

**As a** shopper,
**I want** to add a product to my cart,
**so that** I can see how many items I have chosen.

### Acceptance Criteria
1. If no size is selected, clicking "Add to cart" shows the message "Please select a size" (`size-error`) and the badge does not change. The message disappears as soon as a size is selected.
2. With a size selected, clicking "Add to cart" adds the chosen quantity, and the badge shows the total number of items in the cart.
3. The badge is red, appears above the cart icon in the header, and is hidden when the cart is empty.
4. Adding more items increases the total (for example 2 added, then 1 more, shows 3). This is true for the same product and size, the same product in another size, and different products.
5. The badge keeps its count when moving between pages (Home, Products, Product detail, Cart, 404) and when using the browser back and forward buttons.
6. The badge keeps its count after refreshing the page (stored in the browser, no database).
7. If the total is above 99, the badge shows `99+`.
8. After adding, the selected size and quantity stay as they are.
9. The badge is displayed correctly at 375px and 1440px width.

### Locators
`nav-cart` (existing), `cart-badge`, `add-to-cart`, `size-error`. The badge text is the number only.

### Out of scope
The contents of the cart page, removing items, changing quantities in the cart, checkout, login, and any database.

## Story 5: Cart Page Items

**As a** shopper,
**I want** to see and edit the products in my cart,
**so that** I can check my choices before paying.

### Acceptance Criteria
1. The cart page shows one line for each product and size combination that was added. The same product in two sizes appears as two lines.
2. Each line shows the product name, image (with alt text), size, unit price, quantity and line total (unit price × quantity).
3. Each line has "+" and "−" buttons. "+" increases the quantity by 1 up to 10 (disabled at 10). "−" decreases it by 1 down to 1 (disabled at 1).
4. Changing the quantity updates the line total and the header badge immediately, without reloading the page.
5. Each line has a "Remove" button. Removing a line removes it from the page and decreases the header badge by that line's quantity.
6. When the cart is empty, the page shows "Your cart is empty" and a "Continue shopping" link to `/products`. The badge is hidden.
7. The cart contents and quantity changes survive a page refresh.
8. The page displays correctly at 375px and 1440px width, and every control can be used with the keyboard only.
9. Money is shown with two decimals and a `$` sign (for example `$59.98`), with no rounding artifacts.

### Locators
`cart-item`, `cart-item-image`, `cart-item-name`, `cart-item-size`, `cart-item-price`, `cart-item-total`, `cart-item-quantity`, `cart-item-increase`, `cart-item-decrease`, `cart-item-remove`, `cart-empty`, `continue-shopping`, `cart-badge` (existing).

### Out of scope
Subtotal, discount, delivery fee and order total (next story), the checkout and payment pages, login, and any database.
