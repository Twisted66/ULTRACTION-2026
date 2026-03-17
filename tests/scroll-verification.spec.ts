import { test, expect } from '@playwright/test';

test.describe('Home Page Scroll Indicator', () => {
  test('Scroll down indicator has correct attributes and target exists', async ({ page }) => {
    await page.goto('/');

    const scrollLink = page.locator('a.home-scroll-indicator');

    // Check if it's an anchor link
    await expect(scrollLink).toBeVisible();
    await expect(scrollLink).toHaveAttribute('href', '#intro');
    await expect(scrollLink).toHaveAttribute('aria-label', 'Scroll to introduction');

    // Check if target section exists
    const introSection = page.locator('#intro');
    await expect(introSection).toBeVisible();

    // Check for scroll-margin-top classes (Tailwind)
    // scroll-mt-[64px] sm:scroll-mt-[72px] xl:scroll-mt-[104px]
    await expect(introSection).toHaveClass(/scroll-mt-\[64px\]/);
  });
});
