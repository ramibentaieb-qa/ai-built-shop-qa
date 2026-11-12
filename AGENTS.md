## How the AI must work
- Do NOT build the whole project at once.
- Work only on the user story I give you, one at a time, from `docs/user-stories.md`.
- Implement only what the story's acceptance criteria describe. Do not add extra features or start later stories.
- Use one branch per story (`feature/<name>`), with small commits, and never commit directly to `main`.
- When done, tell me how to run and test it, then wait for my review.
- Fix bugs only when I give you a GitHub Issue, and reference the issue number in the commit.
- Do not edit or delete anything in tests/ or pages-objects/. Those belong to the QA lead.
- If you add your own unit tests, put them in a separate folder (for example src/__tests__/).
- Report which checks you ran, but do not claim a story is accepted. The QA lead decides that.

## Locator naming
`nav-products`, `nav-cart`, `cart-badge`, `product-list`, `product-card-{id}`, `product-name-{id}`, `product-price-{id}`, `product-title`, `product-price`, `size-option-{S|M|L|XL}`, `quantity-increase`, `quantity-decrease`, `quantity-value`, `add-to-cart`, `size-error`.

### Locators
`product-title`, `product-price`, `product-description`, `product-image`, `size-option-S`, `size-option-M`, `size-option-L`, `size-option-XL`, `quantity-decrease`, `quantity-increase`, `quantity-value`, `add-to-cart`, `back-to-products`.
(On `/products`, the existing `product-card`, `product-name` and `product-image` are unchanged; the name and image become links.)