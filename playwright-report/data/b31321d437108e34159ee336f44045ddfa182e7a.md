# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tm-store/uptime.spec.js >> tm-checkout-flow
- Location: tests/tm-store/uptime.spec.js:3:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('tm-checkout-flow', async ({ page }) => {
> 4  | expect(true).toBe(false);
     |              ^ Error: expect(received).toBe(expected) // Object.is equality
  5  |     await page.goto('https://store.tailormade.uk/product/phantom-edge-quad/?base=Arabescato&veneer=Brushed%20Bronze&colour=Arabescato');
  6  | 
  7  |     // Accept cookies if the button is present
  8  |     const acceptCookiesButton = page.locator('#btn-accept-all');
  9  |     if (await acceptCookiesButton.isVisible()) {
  10 |         await acceptCookiesButton.click();
  11 |     }
  12 | 
  13 |     await page.click('.single_add_to_cart_button');
  14 | 
  15 |     const countLocator = page.locator('.header-items-count');
  16 |     await expect(countLocator).toBeVisible();
  17 |     await expect(countLocator).toHaveText('1');
  18 | 
  19 |     await page.goto('https://store.tailormade.uk/checkout');
  20 | 
  21 |     // Check that the form with name 'checkout' is visible
  22 |     await expect(page.locator('form[name="checkout"]')).toBeVisible();
  23 | 
  24 | });
```