import { test, expect } from '@playwright/test';

test.describe('Product page', () => {
  test('renders product from backend', async ({ page, baseURL }) => {
    // Ensure baseURL is set (frontend server must be running)
    const frontend = baseURL || process.env.FRONTEND_URL || 'http://localhost:8080';

    // We will navigate to a product route (known slug). Adjust if your slugs differ.
    const slug = 'mango-pickle';
    await page.goto(`${frontend}/product/${slug}`);

    // Wait for either the product title or the not-found message
    await Promise.race([
      page.waitForSelector('text=Product Not Found', { timeout: 3000 }).catch(() => {}),
      page.waitForSelector('h1', { timeout: 5000 }),
    ]);

    // If product found, assert name visible
    const notFound = await page.locator('text=Product Not Found').count();
    if (notFound === 0) {
      // Check product title exists and description is visible
      await expect(page.locator('h1')).toBeVisible();
      const title = await page.locator('h1').innerText();
      expect(title.toLowerCase()).toContain('mango');
      await expect(page.locator('text=Add to Cart')).toBeVisible();
    } else {
      // If not found, log and fail
      throw new Error('Product page returned Not Found — verify backend contains the slug.');
    }
  });
});
