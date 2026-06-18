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

  test('Careers Admin form has required fields and character counter', async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto('/careers-admin');

    // Check for the legend
    const legend = page.locator('text=Fields marked with * are required');
    await expect(legend).toBeVisible();

    // Check for asterisks in labels
    const apiKeyLabel = page.locator('label[for="jobs-api-key"]');
    await expect(apiKeyLabel).toContainText('*');

    const titleLabel = page.locator('label[for="title"]');
    await expect(titleLabel).toContainText('*');

    const descriptionLabel = page.locator('label[for="description"]');
    await expect(descriptionLabel).toContainText('*');

    // Check for aria-required
    const apiKeyInput = page.locator('#jobs-api-key');
    await expect(apiKeyInput).toHaveAttribute('aria-required', 'true');

    const descriptionInput = page.locator('#description');
    await expect(descriptionInput).toHaveAttribute('aria-required', 'true');

    // Test character counter
    const counter = page.locator('#description-counter');
    await expect(counter).toContainText('0 / 5,000');

    await descriptionInput.fill('This is a test description with more than 20 characters.');
    // 56 characters
    await expect(counter).toContainText('56 / 5,000');

    // Test counter nearing limit color change (90% of 5000 is 4500)
    const longText = 'a'.repeat(4500);
    await descriptionInput.fill(longText);
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toContainText('4,500 / 5,000');
  });
});
