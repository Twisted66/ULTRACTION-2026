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

  test('Careers Admin character counter updates and warns at threshold', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initially 0 / 5,000
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).not.toHaveClass(/text-accent/);

    // Type some text
    await textarea.fill('This is a test description for the careers admin page.');
    await expect(counter).toHaveText('54 / 5,000');

    // Reach 90% threshold (4500 characters)
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);
    await expect(counter).toHaveText('4,500 / 5,000');
    await expect(counter).toHaveClass(/text-accent/);

    // Reset form and check counter
    await page.locator('#create-job-form').evaluate((form: HTMLFormElement) => form.reset());
    // Use a small timeout to allow for the reset event handler to run
    await page.waitForTimeout(50);
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).not.toHaveClass(/text-accent/);
  });
});
