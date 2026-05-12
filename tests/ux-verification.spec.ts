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
    await toggle.click({ force: true });

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

  test('Careers Admin form has character counter and loading state', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    // Wait for Astro scripts
    await page.waitForTimeout(1000);

    // Remove the dev-only ElementCaptureWidget to prevent it from intercepting clicks
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });

    const description = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initial state
    await expect(counter).toHaveText('0 / 5,000');

    // Type into description
    await description.fill('Building infrastructure with purpose.');
    await expect(counter).toHaveText('37 / 5,000');

    // Check loading state on submit
    const submitBtn = page.locator('#create-job-submit');
    const label = page.locator('#submit-label');
    const spinner = page.locator('#submit-spinner');

    // Fill required fields
    await page.locator('#jobs-api-key').fill('test-key');
    await page.locator('#title').fill('Site Engineer');
    await page.locator('#location').fill('Abu Dhabi');

    // Mock the API response to avoid actual network requests
    await page.route('**/api/jobs', async (route) => {
      await page.waitForTimeout(500); // Add a small delay to see the spinner
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, data: { job: { title: 'Site Engineer' } } }),
      });
    });

    // Click submit
    await submitBtn.click();

    // Verify loading state
    await expect(submitBtn).toBeDisabled();
    await expect(label).toHaveCSS('opacity', '0');
    await expect(spinner).toHaveCSS('opacity', '1');

    // After response, it should reset
    await expect(submitBtn).not.toBeDisabled();
    await expect(label).toHaveCSS('opacity', '1');
    await expect(spinner).toHaveCSS('opacity', '0');
    await expect(counter).toHaveText('0 / 5,000');
  });
});
