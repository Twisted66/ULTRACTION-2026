import { test, expect } from '@playwright/test';

test.describe('Contact Form Character Counter', () => {
  test('updates counter in real-time and applies warning style at 90%', async ({ page }) => {
    await page.goto('/contact');

    const textarea = page.locator('textarea#message');
    const counter = page.locator('#message-counter');

    // Initial state
    await expect(textarea).toHaveAttribute('maxlength', '5000');
    await expect(textarea).toHaveAttribute('aria-describedby', 'message-counter');
    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).toHaveClass(/opacity-50/);
    await expect(counter).not.toHaveClass(/text-accent/);

    // Type some text
    await textarea.fill('Hello World');
    await expect(counter).toHaveText('11 / 5000');

    // Fill up to 4499 characters (just below 90% threshold)
    const longText4499 = 'A'.repeat(4499);
    await textarea.fill(longText4499);
    await expect(counter).toHaveText('4499 / 5000');
    await expect(counter).toHaveClass(/opacity-50/);
    await expect(counter).not.toHaveClass(/text-accent/);

    // Fill up to 4500 characters (at 90% threshold)
    const longText4500 = 'A'.repeat(4500);
    await textarea.fill(longText4500);
    await expect(counter).toHaveText('4500 / 5000');
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).not.toHaveClass(/opacity-50/);

    // Fill up to 5000 characters
    const longText5000 = 'A'.repeat(5000);
    await textarea.fill(longText5000);
    await expect(counter).toHaveText('5000 / 5000');
    await expect(counter).toHaveClass(/text-accent/);
  });
});
