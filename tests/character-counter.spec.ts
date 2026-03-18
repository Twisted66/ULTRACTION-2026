import { test, expect } from '@playwright/test';

test.describe('Contact Form Character Counter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    // Remove the dev-only ElementCaptureWidget to prevent it from intercepting interactions
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });
  });

  test('should initialize with 0 / 5000', async ({ page }) => {
    const counter = page.locator('#message-char-count');
    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).toHaveClass(/opacity-60/);
    await expect(counter).not.toHaveClass(/text-accent/);
  });

  test('should update counter as user types', async ({ page }) => {
    const textarea = page.locator('#message');
    const counter = page.locator('#message-char-count');

    await textarea.fill('Hello World');
    await expect(counter).toHaveText('11 / 5000');
  });

  test('should show warning color at 90% threshold', async ({ page }) => {
    const textarea = page.locator('#message');
    const counter = page.locator('#message-char-count');

    // Fill with 4500 characters
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);

    await expect(counter).toHaveText('4500 / 5000');
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-100/);
    await expect(counter).not.toHaveClass(/opacity-60/);
  });

  test('should reset counter when form is reset', async ({ page }) => {
    const textarea = page.locator('#message');
    const counter = page.locator('#message-char-count');
    const form = page.locator('[data-contact-form]');

    await textarea.fill('Some message');
    await expect(counter).toHaveText('12 / 5000');

    await page.evaluate(() => {
      const form = document.querySelector('[data-contact-form]') as HTMLFormElement;
      form.reset();
    });

    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);
  });
});
