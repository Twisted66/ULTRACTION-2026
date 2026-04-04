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

  test('Scroll indicator is a functional anchor link', async ({ page }: { page: Page }) => {
    await page.goto('/');

    const scrollIndicator = page.locator('a.home-scroll-indicator');

    // Verify it's an anchor link pointing to #intro
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toHaveAttribute('href', '#intro');
    await expect(scrollIndicator).toHaveAttribute('aria-label', 'Scroll to content');

    const introSection = page.locator('#intro');
    await expect(introSection).toBeVisible();

    // Scroll to top first to be sure
    await page.evaluate(() => window.scrollTo(0, 0));

    // Click the scroll indicator
    // Using { force: true } because animate-bounce might make it "unstable" for Playwright
    await scrollIndicator.click({ force: true });

    // Verify the intro section is now in view (or at least we scrolled)
    await page.waitForTimeout(1000); // Wait for smooth scroll
    const isVisibleInViewport = await introSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight;
    });

    expect(isVisibleInViewport).toBe(true);
  });
});
