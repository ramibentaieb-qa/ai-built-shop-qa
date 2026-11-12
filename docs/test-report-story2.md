| criterion | result  | notes     | 
|-----------|---------|-----------|
| 1         | ok      |           |
| 2         | ok      |           |   
| 3         | ok      |           |   
| 4         | ok      |           | 
| 5         | ko      |   ok Fixed: all 3 nav IDs present|

Story: Story 2, criterion 5 (automation-friendly locators)
Branch: feature/product-list
Environment: Windows, Brave, localhost:3000 (npm run dev)

Steps to reproduce

Open http://localhost:3000/products
Press F12 and run: [...document.querySelectorAll('[data-testid]')].map(e => e.dataset.testid)
Expected
The header links have test IDs: nav-products, nav-cart and nav-home.

Actual
Only nav-products exists. The Cart and Home header links have no data-testid.

Severity: Low (no user impact; blocks reliable automated tests for the cart badge in a later story)

Notes
The locator list was not in docs/user-stories.md when the story was built. Product card IDs (product-card, product-name, product-price, product-image) are accepted as they are.