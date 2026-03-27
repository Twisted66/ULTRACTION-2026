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

  test('Hero section links have focus-visible styles', async ({ page }) => {
    await page.goto('/');
    // Use more specific selectors for hero links to avoid matching header links
    const heroSection = page.locator('section.hero-fullscreen');
    const contactBtn = heroSection.locator('a[href="/contact"]');
    const aboutBtn = heroSection.locator('a[href="/about"]');

    await expect(contactBtn).toHaveClass(/focus-visible:outline-accent/);
    await expect(aboutBtn).toHaveClass(/focus-visible:outline-accent/);
  });

  test('Scroll indicator is a functional link', async ({ page }) => {
    await page.goto('/');
    const scrollLink = page.locator('a[aria-label="Scroll to introduction"]');

    await expect(scrollLink).toBeVisible();
    await expect(scrollLink).toHaveAttribute('href', '#intro');

    // Check for focus styles
    await expect(scrollLink).toHaveClass(/focus-visible:outline-accent/);

    const introSection = page.locator('#intro');
    await expect(introSection).toBeVisible();

    // Use { force: true } because it's an animated/bouncing element
    await scrollLink.click({ force: true });
    await page.waitForTimeout(1000);

    const isIntersecting = await introSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      // On mobile/narrow views it might be different, but it should be near the top
      return rect.top >= -10 && rect.top <= 200;
    });
    expect(isIntersecting).toBeTruthy();
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
});
