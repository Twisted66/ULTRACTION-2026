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

  test('Careers Admin character counter updates on input', async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');

    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initially should be 0
    await expect(counter).toHaveText(/0 \/ 5,000/);

    // Type some text
    const testText = 'Building the future of infrastructure in the UAE.';
    await textarea.fill(testText);

    // Counter should update
    const expectedCount = testText.length;
    await expect(counter).toHaveText(new RegExp(`${expectedCount} / 5,000`));

    // Test threshold feedback (90% of 5000 is 4500)
    await page.evaluate(() => {
      const el = document.getElementById('description') as HTMLTextAreaElement;
      el.value = 'a'.repeat(4500);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Check if it has the accent color class/style
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-100/);
  });
});
