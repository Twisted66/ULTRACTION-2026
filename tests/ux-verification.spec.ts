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
    await toggle.click({ force: true });

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

  test('Careers Admin form enhancements', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    // Check legend
    await expect(page.getByText('Fields marked with * are required')).toBeVisible();

    // Check character counter
    const description = page.locator('#description');
    const counter = page.locator('#description-counter');
    await expect(counter).toHaveText('0 / 5,000');

    await description.fill('Test description with more than twenty characters.');
    // Check that counter is updated (using regex to ignore formatting if any, though we used toLocaleString)
    await expect(counter).not.toHaveText('0 / 5,000');

    // Check submit button loading state
    const submitBtn = page.locator('#create-job-submit');
    const spinner = page.locator('#submit-spinner');

    // Fill required fields to enable submission
    await page.locator('#jobs-api-key').fill('test-key');
    await page.locator('#title').fill('Test Job');
    await page.locator('#location').fill('Abu Dhabi');

    // We don't want to actually submit successfully as we don't have a backend here,
    // but we can check if it enters loading state
    await submitBtn.click();

    // It might be too fast if it fails immediately, but let's see if we can catch it
    // we use a promise to catch it during the transition
    await expect(spinner).toBeVisible();
  });
});
