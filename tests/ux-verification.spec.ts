import { test, expect, type Page } from '@playwright/test';

test.describe('UX Improvements Verification', () => {
  test('Mobile menu toggle swaps icons', async ({ page }: { page: Page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    // Wait for Astro scripts to mount
    await page.waitForTimeout(1000);

    // Remove the dev-only ElementCaptureWidget to prevent it from intercepting clicks
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });

    const toggle = page.locator('#mobile-menu-toggle');
    const openIcon = toggle.locator('#hamburger-icon');
    const closeIcon = toggle.locator('#close-icon');

    // Initially, open icon should be visible, close icon should be hidden
    await expect(openIcon).toBeVisible();
    await expect(closeIcon).toBeHidden();

    // Click to open menu
    await toggle.click();

    // Now, open icon should be hidden, close icon should be visible
    await expect(openIcon).toBeHidden();
    await expect(closeIcon).toBeVisible();

    // Click again to close menu
    await toggle.click();

    // Back to initial state
    await expect(openIcon).toBeVisible();
    await expect(closeIcon).toBeHidden();
  });

  test('MagneticButton handles spread props', async ({ page }: { page: Page }) => {
    await page.goto('/contact');

    // The MagneticButton in contact.astro has data-submit-button
    const submitButton = page.locator('button[data-submit-button]');

    // It should exist if the prop was correctly spread
    await expect(submitButton).toBeVisible();

    // Check for other spread props like type="submit"
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('Careers Admin form standardizes UX and accessibility', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    // Check for required fields legend
    const legend = page.locator('text=Fields marked with * are required.');
    await expect(legend).toBeVisible();

    // Check for asterisk in labels
    const titleLabel = page.locator('label[for="title"]');
    await expect(titleLabel).toContainText('*');

    // Check for aria-required
    const titleInput = page.locator('#title');
    await expect(titleInput).toHaveAttribute('aria-required', 'true');

    // Check character counter
    const counter = page.locator('#description-counter');
    await expect(counter).toHaveText('0 / 5,000');

    const textarea = page.locator('#description');
    await textarea.fill('This is a test description that should be at least 20 chars long.');

    // Check if counter updated (it uses toLocaleString, so 0 / 5,000)
    const count = (await textarea.inputValue()).length;
    await expect(counter).toHaveText(`${count} / 5,000`);

    // Check threshold feedback (90% of 5,000 = 4,500)
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveText('4,500 / 5,000');
  });
});
