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

  test('Home page scroll indicator is a functional link', async ({ page }: { page: Page }) => {
    await page.goto('/');

    const scrollIndicator = page.locator('a.home-scroll-indicator');

    // Should be an anchor link pointing to #intro
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toHaveAttribute('href', '#intro');
    await expect(scrollIndicator).toHaveAttribute('aria-label', 'Scroll to intro section');

    // Target section should exist
    const targetSection = page.locator('#intro');
    await expect(targetSection).toBeVisible();
  });

  test('Project detail page scroll indicator is a functional link', async ({ page }: { page: Page }) => {
    // Using one of the existing projects from src/content/projects
    await page.goto('/projects/dubai-marina-tower');

    const scrollIndicator = page.locator('a.project-scroll-indicator');

    // Should be an anchor link pointing to #overview
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toHaveAttribute('href', '#overview');
    await expect(scrollIndicator).toHaveAttribute('aria-label', 'Scroll to overview section');

    // Target section should exist
    const targetSection = page.locator('#overview');
    await expect(targetSection).toBeVisible();
  });
});
