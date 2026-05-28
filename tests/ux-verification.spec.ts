import { test, expect, type Page } from '@playwright/test';

test.describe('UX Improvements Verification', () => {
  test('Functional scroll indicators', async ({ page }: { page: Page }) => {
    // Check Home page scroll indicator
    await page.goto('/');

    // Remove the dev-only ElementCaptureWidget if present
    await page.evaluate(() => {
      document.getElementById('element-capture-widget')?.remove();
    });

    const homeScrollLink = page.locator('a[href="#intro"]');
    await expect(homeScrollLink).toBeVisible();
    await expect(homeScrollLink).toHaveAttribute('aria-label', 'Scroll to intro section');
    const introSection = page.locator('#intro');
    await expect(introSection).toBeVisible();
    await expect(introSection).toHaveClass(/scroll-mt-\[64px\]/);

    // Check Project page scroll indicator
    await page.goto('/projects/khalifa-port');
    const projectScrollLink = page.locator('a[href="#overview"]');
    await expect(projectScrollLink).toBeVisible();
    await expect(projectScrollLink).toHaveAttribute('aria-label', 'Scroll to project overview');
    const overviewSection = page.locator('#overview');
    await expect(overviewSection).toBeVisible();
    await expect(overviewSection).toHaveClass(/scroll-mt-\[64px\]/);
  });
});
