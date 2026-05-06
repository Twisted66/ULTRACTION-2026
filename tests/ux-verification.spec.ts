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

  test('Careers Admin form accessibility and character counter', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    // Check for legend
    const legend = page.locator('p:has-text("Fields marked with")');
    await expect(legend).toBeVisible();

    // Check for required fields aria-required
    const mandatoryFields = ['jobs-api-key', 'title', 'location', 'description'];
    for (const id of mandatoryFields) {
      const input = page.locator(`#${id}`);
      await expect(input).toHaveAttribute('aria-required', 'true');

      const label = page.locator(`label[for="${id}"]`);
      await expect(label).toContainText('*');
    }

    // Check character counter
    const description = page.locator('#description');
    const counter = page.locator('#description-counter');

    await expect(counter).toHaveText('0 / 5,000');

    await description.fill('Test character counter');
    await expect(counter).toHaveText('22 / 5,000');

    // Check color change when nearing limit (90% of 5000 is 4500)
    await description.fill('a'.repeat(4501));
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-100/);

    // Reset form and check counter resets
    await page.evaluate(() => {
      const form = document.getElementById('create-job-form');
      if (form instanceof HTMLFormElement) form.reset();
    });

    // Wait for the setTimeout(..., 0) in the reset listener
    await page.waitForTimeout(100);
    await expect(counter).toHaveText('0 / 5,000');
  });
});
