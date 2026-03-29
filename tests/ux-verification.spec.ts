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

  test('Careers Admin description counter updates on input', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    const description = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initial state
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).toHaveClass(/text-primary/);
    await expect(counter).not.toHaveClass(/text-accent/);

    // Type some text
    const testText = 'Building the future of infrastructure.';
    await description.fill(testText);
    await expect(counter).toHaveText(`${testText.length} / 5,000`);

    // Test 90% threshold (4500 chars)
    const longText = 'a'.repeat(4501);
    await description.fill(longText);
    await expect(counter).toHaveText('4,501 / 5,000');
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).not.toHaveClass(/text-primary/);

    // Test form reset
    await page.evaluate(() => {
      const form = document.getElementById('create-job-form');
      if (form instanceof HTMLFormElement) form.reset();
    });
    // Wait for the setTimeout(..., 0) in the reset handler
    await page.waitForTimeout(100);
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).toHaveClass(/text-primary/);
  });
});
