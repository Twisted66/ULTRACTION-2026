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

  test('Careers admin form has required UX features', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    const description = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initial state
    await expect(counter).toHaveText('0 / 5,000');

    // Type something
    await description.fill('This is a test description with more than twenty characters.');
    await expect(counter).toHaveText('60 / 5,000');

    // Check for required field indicators
    const labels = page.locator('label');
    await expect(labels.filter({ hasText: 'Role Title *' })).toBeVisible();
    await expect(description).toHaveAttribute('aria-required', 'true');

    // Test loading state on submit
    // We'll mock the API response to ensure it doesn't actually hit a backend
    await page.route('**/api/jobs', async (route) => {
      // Add a delay to capture the spinner
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, data: { job: { title: 'Test' } } }),
      });
    });

    // Fill required fields
    await page.locator('#jobs-api-key').fill('test-key');
    await page.locator('#title').fill('Test Engineer');
    await page.locator('#location').fill('Dubai');

    // Submit
    const submitBtn = page.locator('#create-job-submit');
    const spinner = page.locator('#submit-spinner');
    const label = page.locator('#submit-label');

    await submitBtn.click();

    // Check loading state
    await expect(spinner).toHaveClass(/opacity-100/);
    await expect(label).toHaveCSS('opacity', '0');

    // Wait for completion
    await expect(spinner).toHaveClass(/opacity-0/);
    await expect(label).toHaveCSS('opacity', '1');
  });
});
