import { test, expect } from '@playwright/test';

test.describe('Character Counter', () => {
  test('Contact form message counter works correctly', async ({ page }) => {
    await page.goto('/contact');

    // Wait for the form to be ready
    await page.waitForSelector('[data-contact-form]');

    const messageInput = page.locator('#message');
    const messageCounter = page.locator('#message-counter');

    // Initial state
    await expect(messageCounter).toHaveText('0 / 5000');
    await expect(messageCounter).toHaveClass(/opacity-50/);
    await expect(messageCounter).not.toHaveClass(/text-accent/);

    // Type some text
    await messageInput.fill('Hello world');
    await expect(messageCounter).toHaveText('11 / 5000');

    // Reach 90% threshold (4500 characters)
    const longText = 'a'.repeat(4500);
    await messageInput.fill(longText);
    await expect(messageCounter).toHaveText('4500 / 5000');
    await expect(messageCounter).toHaveClass(/text-accent/);
    await expect(messageCounter).toHaveClass(/opacity-100/);
    await expect(messageCounter).not.toHaveClass(/opacity-50/);

    // Back below threshold
    await messageInput.fill('a'.repeat(4499));
    await expect(messageCounter).toHaveText('4499 / 5000');
    await expect(messageCounter).not.toHaveClass(/text-accent/);
    await expect(messageCounter).not.toHaveClass(/opacity-100/);
    await expect(messageCounter).toHaveClass(/opacity-50/);
  });
});
