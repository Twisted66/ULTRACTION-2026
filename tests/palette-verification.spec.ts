import { test, expect } from '@playwright/test';

test.describe('Palette UX Enhancements', () => {
  test('Contact form has character counter and limit', async ({ page }) => {
    await page.goto('/contact');

    const textarea = page.locator('#message');
    const counter = page.locator('#message-counter');

    await expect(textarea).toHaveAttribute('maxlength', '5000');
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText('0 / 5000');

    await textarea.fill('Hello world');
    await expect(counter).toHaveText('11 / 5000');

    // Test 90% threshold styling
    const longText = 'a'.repeat(4501);
    await textarea.fill(longText);
    await expect(counter).toHaveClass(/text-accent/);
  });
});
