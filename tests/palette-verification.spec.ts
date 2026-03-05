import { test, expect } from '@playwright/test';

test.describe('Contact Form Character Counter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display initial character count', async ({ page }) => {
    const counter = page.locator('#message-counter');
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText('0 / 5000');
  });

  test('should update character count on input', async ({ page }) => {
    const textarea = page.locator('textarea#message');
    const counter = page.locator('#message-counter');

    await textarea.fill('Hello world');
    await expect(counter).toHaveText('11 / 5000');
  });

  test('should show visual feedback when count is >= 4500', async ({ page }) => {
    const textarea = page.locator('textarea#message');
    const counter = page.locator('#message-counter');

    // Fill with 4500 characters
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);

    await expect(counter).toHaveText('4500 / 5000');
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-100/);
    await expect(counter).not.toHaveClass(/opacity-50/);
  });

  test('should update counter when pre-filled via URL (careers)', async ({ page }) => {
    // Navigate to contact with careers subject and a role to trigger pre-fill
    await page.goto('/contact?subject=careers&role=Engineer');

    const textarea = page.locator('textarea#message');
    const counter = page.locator('#message-counter');

    // Wait for client-side pre-fill script to run
    await expect(async () => {
      const value = await textarea.inputValue();
      expect(value.length).toBeGreaterThan(0);
    }).toPass();

    const value = await textarea.inputValue();
    const expectedCount = value.length;
    await expect(counter).toHaveText(`${expectedCount} / 5000`);
  });
});
