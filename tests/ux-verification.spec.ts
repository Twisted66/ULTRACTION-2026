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

  test('Careers Admin description has character counter with threshold feedback', async ({ page }: { page: Page }) => {
    await page.setViewportSize({ width: 1280, height: 1200 });
    await page.goto('/careers-admin');

    // Remove the dev-only ElementCaptureWidget
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });

    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initial state
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).toHaveClass(/text-primary/);
    await expect(counter).not.toHaveClass(/text-accent/);

    // Type some text
    await textarea.fill('Short description');
    await expect(counter).toHaveText('17 / 5,000');
    await expect(counter).toHaveClass(/text-primary/);

    // Reach 90% threshold (4500 characters)
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);
    await expect(counter).toHaveText('4,500 / 5,000');

    // Should now have the accent color
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-100/);
    await expect(counter).not.toHaveClass(/text-primary/);

    // Screenshot for verification
    const counterBox = page.locator('.space-y-2').filter({ has: textarea });
    await counterBox.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'verification/careers-admin-counter-accent.png' });

    // Reset form and check counter
    await page.locator('#create-job-form').evaluate((form: HTMLFormElement) => form.reset());
    // The reset event has a setTimeout(..., 0) in the script
    await page.waitForTimeout(100);
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).toHaveClass(/text-primary/);
  });
});
