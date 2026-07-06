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

  test('Careers Admin form has character counter and loading state', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Check initial counter state
    await expect(counter).toContainText('0 / 5,000');

    // Type some text and verify counter updates
    await textarea.fill('This is a test description with more than twenty characters.');
    const count = (await textarea.inputValue()).length;
    await expect(counter).toContainText(`${count} / 5,000`);

    // Verify visual feedback for required fields
    const requiredLabels = page.locator('label:has(span.text-accent)');
    await expect(requiredLabels).toHaveCount(4); // API Key, Title, Location, Description

    // Mock the API request to test loading state
    await page.route('**/api/jobs', async (route) => {
      // Delay response to capture loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, data: { job: { title: 'Test Job' } } }),
      });
    });

    // Fill form and submit
    await page.locator('#jobs-api-key').fill('test-key');
    await page.locator('#title').fill('Test Job');
    await page.locator('#location').fill('Test Location');
    // Description is already filled

    const submitBtn = page.locator('#create-job-submit');
    const submitLabel = page.locator('#submit-label');
    const submitSpinner = page.locator('#submit-spinner');

    // Click submit
    await submitBtn.click();

    // Verify loading state
    await expect(submitBtn).toBeDisabled();
    await expect(submitLabel).toHaveCSS('opacity', '0');
    await expect(submitSpinner).toHaveCSS('opacity', '1');

    // Wait for success and verify reset
    await expect(submitBtn).toBeEnabled();
    await expect(submitLabel).toHaveCSS('opacity', '1');
    await expect(submitSpinner).toHaveCSS('opacity', '0');
    await expect(counter).toContainText('0 / 5,000');
  });
});
