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

  test('Hero scroll indicators are functional anchor links', async ({ page }: { page: Page }) => {
    // Check Homepage
    await page.goto('/');
    const homeScrollIndicator = page.locator('a[aria-label="Scroll to introduction"]');
    await expect(homeScrollIndicator).toBeVisible();
    await expect(homeScrollIndicator).toHaveAttribute('href', '#intro');

    // Check Project Details Page
    // Assuming there is at least one project, let's try to find a link from the projects page or go to a known slug
    await page.goto('/projects');
    const projectLink = page.locator('a[href^="/projects/"]').first();
    const projectHref = await projectLink.getAttribute('href');
    if (projectHref) {
      await page.goto(projectHref);
      const projectScrollIndicator = page.locator('a[aria-label="Scroll to project details"]');
      await expect(projectScrollIndicator).toBeVisible();
      await expect(projectScrollIndicator).toHaveAttribute('href', '#details');
    }
  });
});
