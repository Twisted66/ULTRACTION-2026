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

  test('Scroll indicators are functional links', async ({ page }: { page: Page }) => {
    // Check home page scroll indicator
    await page.goto('/');
    const homeScrollIndicator = page.locator('a.home-scroll-indicator');
    await expect(homeScrollIndicator).toHaveAttribute('href', '#intro');
    await expect(homeScrollIndicator).toHaveAttribute('aria-label', 'Scroll to introduction');

    // Check project detail page scroll indicator
    // Need a valid project slug. We'll try to find one from the home page or use a known one.
    await page.goto('/projects');
    const firstProjectLink = page.locator('.project-card a').first();
    const projectUrl = await firstProjectLink.getAttribute('href');

    if (projectUrl) {
      await page.goto(projectUrl);
      const projectScrollIndicator = page.locator('a[aria-label="Scroll to project details"]');
      await expect(projectScrollIndicator).toHaveAttribute('href', '#details');
    }
  });
});
