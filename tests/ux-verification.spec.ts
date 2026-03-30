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

  test('Careers Admin character counter and required fields', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    // Check legend
    const legend = page.getByText('Fields marked with * are required.');
    await expect(legend).toBeVisible();

    // Check required indicators in labels
    const labels = ['Jobs API Key', 'Role Title', 'Location', 'Description'];
    for (const labelText of labels) {
      const label = page.locator('label', { hasText: labelText });
      await expect(label.locator('span.text-accent')).toHaveText('*');
    }

    // Check character counter
    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    await expect(counter).toHaveText('0 / 5,000');

    // Type and check counter
    await textarea.fill('Testing the character counter logic.');
    await expect(counter).toHaveText('36 / 5,000');

    // Check threshold warning (4500 chars)
    const longText = 'a'.repeat(4500);
    await textarea.fill(longText);
    await expect(counter).toHaveText('4,500 / 5,000');
    await expect(counter).toHaveClass(/text-accent/);

    // Reset form and check counter
    await page.locator('#create-job-form').evaluate((form: HTMLFormElement) => form.reset());
    // The reset event has a setTimeout(..., 0) in the script
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).not.toHaveClass(/text-accent/);
  });
});
