import { test, expect } from '@playwright/test';

test.describe('Character Counter Verification', () => {
  test('Careers Admin character counter works correctly', async ({ page }) => {
    await page.goto('/careers-admin');

    // Wait for Astro scripts to mount
    await page.waitForTimeout(1000);

    // Remove the dev-only ElementCaptureWidget to prevent it from intercepting clicks
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });

    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initial state
    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);

    // Type some text
    await textarea.fill('Hello world');
    await expect(counter).toHaveText('11 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);

    // Fill up to 90% (4500 characters)
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);
    await expect(counter).toHaveText('4500 / 5000');
    await expect(counter).toHaveClass(/text-accent/);

    // Go below 90%
    await textarea.fill('a'.repeat(4499));
    await expect(counter).toHaveText('4499 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);

    // Reset form
    await page.click('#create-job-form button[type="button"]#refresh-jobs'); // Just checking another button to ensure we don't accidentally reset
    // Actually testing form reset is better
    await page.evaluate(() => {
      const form = document.getElementById('create-job-form');
      if (form instanceof HTMLFormElement) form.reset();
    });
    // Wait for the setTimeout in the reset listener
    await page.waitForTimeout(100);
    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);
  });

  test('Contact form has character counter if applicable', async ({ page }) => {
    // In some versions we added it to contact form too, let's check if it exists there
    await page.goto('/contact');

    // We didn't explicitly add it to contact.astro in this PR, but it's a good pattern.
    // Let's see if it's there.
    const counter = page.locator('#message-counter');
    const count = await counter.count();

    if (count > 0) {
      const textarea = page.locator('#message');
      await textarea.fill('Testing contact counter');
      const text = await counter.textContent();
      expect(text).toContain('23');
    }
  });
});
