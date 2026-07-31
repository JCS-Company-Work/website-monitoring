# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tm-store/uptime.spec.js >> tm-checkout-flow
- Location: tests/tm-store/uptime.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.single_add_to_cart_button')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "401" [level=1] [ref=e4]
  - heading "Unauthorized" [level=2] [ref=e5]
  - paragraph [ref=e6]: Proper authorization is required to access this resource!
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('tm-checkout-flow', async ({ page }) => {
  4  | 
  5  |     await page.goto('https://staging.store.tailormade.uk/product/phantom-edge-quad/?base=Arabescato&veneer=Brushed%20Bronze&colour=Arabescato');
  6  | 
  7  |     // Accept cookies if the button is present
  8  |     const acceptCookiesButton = page.locator('#btn-accept-all');
  9  |     if (await acceptCookiesButton.isVisible()) {
  10 |         await acceptCookiesButton.click();
  11 |     }
  12 | 
> 13 |     await page.click('.single_add_to_cart_button');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  14 | 
  15 |     const countLocator = page.locator('.header-items-count');
  16 |     await expect(countLocator).toBeVisible();
  17 |     await expect(countLocator).toHaveText('1');
  18 | 
  19 |     await page.goto('https://staging.store.tailormade.uk/checkout');
  20 | 
  21 |     // Check that the form with name 'checkout' is visible
  22 |     await expect(page.locator('form[name="checkout"]')).toBeVisible();
  23 | 
  24 | });
```