const { test, expect } = require('@playwright/test');

// Test metadata to pass to WP scheduler via the monitoring API
test.monitoring = {
    slug: 'tm-checkout-flow',
    name: 'TM Checkout Flow',
    description: 'Checks the customer checkout process',
    type: 'playwright'
};

test('tm-checkout-flow', async ({ page }) => {

    await page.goto('https://store.tailormade.uk/product/phantom-edge-quad/?base=Arabescato&veneer=Brushed%20Bronze&colour=Arabescato');
expect(true).toBe(false);
    // Accept cookies if the button is present
    const acceptCookiesButton = page.locator('#btn-accept-all');
    if (await acceptCookiesButton.isVisible()) {
        await acceptCookiesButton.click();
    }

    await page.click('.single_add_to_cart_button');

    const countLocator = page.locator('.header-items-count');
    await expect(countLocator).toBeVisible();
    await expect(countLocator).toHaveText('1');

    await page.goto('https://store.tailormade.uk/checkout');

    // Check that the form with name 'checkout' is visible
    await expect(page.locator('form[name="checkout"]')).toBeVisible();

});