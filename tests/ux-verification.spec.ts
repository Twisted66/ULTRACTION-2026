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

  test('Home page scroll indicator is a functional link', async ({ page }) => {
    await page.goto('/');
    const scrollIndicator = page.locator('a.home-scroll-indicator');
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toHaveAttribute('href', '#intro');

    const targetSection = page.locator('#intro');
    await expect(targetSection).toBeVisible();
  });

  test('Project page scroll indicator is a functional link', async ({ page }) => {
    // Navigate to a project page. Naseem Al Bar Bridge is a known project.
    await page.goto('/projects/naseem-albar-bridge');
    const scrollIndicator = page.locator('a.animate-bounce').filter({ hasText: 'Scroll to explore' });
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toHaveAttribute('href', '#overview');

    const targetSection = page.locator('#overview');
    await expect(targetSection).toBeVisible();
  });
});
