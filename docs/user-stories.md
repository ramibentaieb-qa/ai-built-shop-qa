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

## Story 6: Order Summary and Checkout Link

**As a** shopper,
**I want** to see the full cost of my order,
**so that** I know what I will pay before I continue.

### Acceptance Criteria
1. Below the items, the cart page shows in this order: Subtotal, Delivery fee, Total.
2. Subtotal is the sum of all line totals. The delivery fee is a flat $5.00 when the cart has items. Total = Subtotal + Delivery fee (for example, a subtotal of $59.98 gives a total of $64.98).
3. All amounts update immediately when a quantity changes or a line is removed.
4. A "Proceed to checkout" link opens `/payment`, which shows a placeholder page with the text "Payment page coming soon".
5. When the cart is empty, the order summary and the "Proceed to checkout" link are not shown.
6. Amounts use the same money format as Story 5 (a `$` sign and two decimals).

### Locators
`cart-subtotal`, `cart-delivery`, `cart-total`, `proceed-to-checkout`.

### Out of scope
Discounts and coupons, real payment, a checkout form, login, and any database.

## Story 7: Registration

**As a** new shopper,
**I want** to create a demo account,
**so that** I can log in later and continue to payment.

### Acceptance Criteria
1. The header has a "Register" link that opens `/register`.
2. The form has these fields: full name, email, password and confirm password, plus a "Create account" button. A notice on the page says: "Demo accounts are stored in this browser and deleted after 24 hours. Do not use a real password."
3. Every field is required. Leaving one empty shows an error for that field, and no account is created.
4. The email must have a valid format (for example `name@example.com`). Otherwise, an error is shown.
5. The password must have at least 8 characters, and the confirm password must match it. Otherwise, an error is shown.
6. An email that is already registered (compared without regard to upper or lower case) shows the error "This email is already registered", and no second account is created.
7. A valid form creates the account, shows "Account created", and clears the form. The shopper is not logged in yet, and the cart is not changed.
8. Each account is saved in the browser with its creation time. Accounts older than 24 hours are deleted when any page loads, and their email can be registered again.
9. The page displays correctly at 375px and 1440px width, and every control can be used with the keyboard only.

### Locators
`nav-register`, `register-name`, `register-email`, `register-password`, `register-confirm-password`, `register-submit`, `register-error-name`, `register-error-email`, `register-error-password`, `register-error-confirm`, `register-success`.

### Out of scope
Login, logout, protecting `/payment`, password recovery, email verification, and any database.

## Story 8: Login and Logout

**As a** registered shopper,
**I want** to log in and out of my demo account,
**so that** I can later continue to payment as a known user.

### Acceptance Criteria
1. The header shows "Login" and "Register" links when nobody is logged in. "Login" opens `/login`.
2. The login form has an email field, a password field and a "Log in" button. Both fields are required, and an empty field shows an error for that field.
3. A correct email and password logs the shopper in and redirects to the Home page. The email is compared without regard to upper or lower case, and the password is case-sensitive.
4. A wrong email or a wrong password shows the same error, "Invalid email or password", and the shopper stays logged out.
5. When logged in, the header shows the shopper's full name and a "Logout" button, and the "Login" and "Register" links are hidden.
6. Clicking "Logout" ends the session, returns to the Home page, and shows the "Login" and "Register" links again.
7. The session survives a page refresh and navigation between pages, but not a closed browser (it ends when the browser is closed).
8. When the account expires (24 hours after its creation, as in Story 7), the shopper is logged out on the next page load and sees the message "Your demo account has expired, please register again".
9. The cart is not changed by logging in or out.
10. The page displays correctly at 375px and 1440px width, and every control can be used with the keyboard only.

### Locators
`nav-login`, `login-email`, `login-password`, `login-submit`, `login-error-email`, `login-error-password`, `login-error`, `nav-user-name`, `nav-logout`, `session-expired-message`.

### Out of scope
Protecting `/payment` (next story), password recovery, "remember me", email verification, and any database.

## Story 9: Automatic Login After Registration

**As a** new shopper,
**I want** to be logged in as soon as I register,
**so that** I do not have to log in again right after creating my account.

### Acceptance Criteria
1. A valid registration creates the account (as in Story 7), logs the shopper in, and redirects to the Home page.
2. After the redirect, the header shows the shopper's full name and the "Logout" button. The "Login" and "Register" links are hidden.
3. The Home page shows the message "Welcome, {full name}! Your account was created." (`welcome-message`).
4. A failed registration (any validation error, or a duplicate email) does not log the shopper in and stays on `/register`.
5. A logged-in shopper who opens `/register` or `/login` is redirected to the Home page.
6. The session rules from Story 8 apply: it survives a refresh and ends when the browser closes. The 24-hour account expiry also applies.
7. The cart is not changed by registering.

### Locators
`welcome-message` (new), plus the existing `nav-user-name` and `nav-logout`.

### Changes to earlier stories
Story 7, criterion 7 is replaced by this story. "The shopper is not logged in yet" no longer applies, and the form no longer stays on screen after success.

### Out of scope
Email verification, "remember me", password recovery, and any database.


## Story 10: Checkout Gate

**As a** shop owner,
**I want** only logged-in shoppers to reach the payment page,
**so that** every order belongs to a known account.

### Acceptance Criteria
1. A shopper who is not logged in and opens `/payment` (through "Proceed to checkout" or by typing the address) is redirected to `/login`.
2. The login page then shows the message "Please log in to continue to payment" (`login-required-message`). The message is not shown when the shopper opens `/login` normally.
3. After a successful login from this redirect, the shopper lands on `/payment`. After a normal login, the shopper still lands on the Home page (Story 8).
4. A logged-in shopper with items in the cart who opens `/payment` sees the placeholder page "Payment page coming soon".
5. A logged-in shopper with an empty cart who opens `/payment` is redirected to `/cart`, which shows "Your cart is empty".
6. The cart is unchanged by the redirect and the login.
7. If the account expires (24 hours, as in Story 7) while the shopper is on `/payment`, the next page load logs them out and sends them to `/login` with the message "Your demo account has expired, please register again".
8. The return address after login only works for pages inside the shop. Any other value (for example a full `https://` address) is ignored, and the shopper lands on the Home page.

### Locators
`login-required-message` (new), plus the existing `nav-user-name`, `login-email`, `login-password`, `login-submit`, `proceed-to-checkout` and `cart-empty`.

### Out of scope
The payment form, order confirmation, password recovery, and any database. A shopper who registers from the login page lands on the Home page (Story 9), not on `/payment`.


## Story 11: Notifications (toasts)

**As a** shopper,
**I want** short messages to appear briefly and then go away,
**so that** I get the information without it taking up space on the page.

### Acceptance Criteria
1. These three messages appear as a notification at the bottom of the page, not inside the page content: the welcome message after registration, the "Please log in to continue to payment" message, and the "Your demo account has expired, please register again" message.
2. A notification disappears by itself after 5 seconds.
3. A notification has a close button that dismisses it immediately.
4. A notification does not disappear while the pointer is over it or while it has keyboard focus.
5. A notification triggered before a redirect is shown on the page the shopper lands on (for example, the welcome message on Home after registering).
6. A notification is not shown again after a page refresh.
7. Only one notification is shown at a time. A new one replaces the current one.
8. Notifications are announced by screen readers (`role="status"`).
9. The notification displays correctly at 375px and 1440px width, and does not cover the header.

### Locators
`toast` (the container), `toast-close` (the close button). The existing `welcome-message`, `login-required-message` and `session-expired-message` stay on the text element inside the toast.

### Changes to earlier stories
Story 9 criterion 3, Story 8 criterion 8 and Story 10 criteria 2 and 7 now show their messages as notifications, with the same text.

### Out of scope
Inline form errors (`size-error`, login and register field errors), sounds, animations, and any database.

## Story 12: Payment Form

**As a** logged-in shopper,
**I want** to enter my delivery and card details,
**so that** I can place my order.

### Acceptance Criteria
1. `/payment` shows the order total (`checkout-total`, same amount as on the cart page) and a form with these fields: full name, email, phone, address, city, card number, expiry date (MM/YY), and CVC, plus a "Place order" button (`place-order`). The Story 10 rules still apply (login required, empty cart goes to `/cart`).
2. Full name and email are filled in from the logged-in account, and can be changed.
3. Every field is required. An empty field shows an error for that field, and no order is placed.
4. The email must have a valid format. The phone number must have 8 to 15 digits (spaces and a leading `+` are allowed). Name, address and city must have at most 100 characters.
5. The card number must have exactly 16 digits (spaces between groups are allowed). The CVC must have exactly 3 digits.
6. The expiry date must be in the format MM/YY, with a month from 01 to 12, and must not be in the past. The current month is still valid.
7. Every error message disappears as soon as its field is corrected.
8. When all fields are valid, clicking "Place order" opens `/order-confirmation`, which for now shows only the heading "Order placed".
9. The card number, expiry date and CVC are never saved in the browser, and the form is empty of card data after a page refresh.
10. The page shows the notice "Mock payment: do not enter a real card number."
11. The page displays correctly at 375px and 1440px width, and every control can be used with the keyboard only.

### Locators
`checkout-total`, `checkout-name`, `checkout-email`, `checkout-phone`, `checkout-address`, `checkout-city`, `checkout-card-number`, `checkout-expiry`, `checkout-cvc`, `place-order`, and one error per field: `checkout-error-name`, `checkout-error-email`, `checkout-error-phone`, `checkout-error-address`, `checkout-error-city`, `checkout-error-card-number`, `checkout-error-expiry`, `checkout-error-cvc`.

### Out of scope
The content of the confirmation page, emptying the cart, order history, real payment, and any database.