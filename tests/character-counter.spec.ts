import { test, expect } from '@playwright/test';

test.describe('Character Counter UX', () => {
  test('Contact form message counter updates on input', async ({ page }) => {
    await page.goto('/contact');

    // Remove the dev-only ElementCaptureWidget to prevent it from intercepting clicks
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });

    const textarea = page.locator('textarea#message');
    const counter = page.locator('#message-counter');

    await expect(counter).toHaveText('0 / 5000');

    await textarea.fill('Hello World');
    await expect(counter).toHaveText('11 / 5000');

    // Check threshold warning (90% of 5000 is 4500)
    const longText = 'A'.repeat(4501);
    await textarea.fill(longText);
    await expect(counter).toHaveText('4501 / 5000');
    await expect(counter).toHaveClass(/text-accent/);
  });

  test('Message counter resets when form is reset', async ({ page }) => {
    await page.goto('/contact');

    // Remove the dev-only ElementCaptureWidget
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });

    const textarea = page.locator('textarea#message');
    const counter = page.locator('#message-counter');

    await textarea.fill('Testing reset');
    await expect(counter).toHaveText('13 / 5000');

    // Manually trigger form reset since there's no reset button, we can do it via evaluate
    await page.evaluate(() => {
      const form = document.querySelector('form[data-contact-form]');
      if (form instanceof HTMLFormElement) form.reset();
    });

    await expect(counter).toHaveText('0 / 5000');
  });
});
