import { test, expect } from '@playwright/test';

test('homepage scroll indicator is functional and accessible', async ({ page }) => {
  await page.goto('/');

  // Find the scroll indicator
  const scrollIndicator = page.locator('a.home-scroll-indicator');

  // Verify it is an anchor link with correct href
  await expect(scrollIndicator).toHaveAttribute('href', '#intro');

  // Verify accessibility label
  await expect(scrollIndicator).toHaveAttribute('aria-label', 'Scroll to introduction');

  // Verify target section exists
  const targetSection = page.locator('#intro');
  await expect(targetSection).toBeVisible();

  // Verify scroll-mt classes are present (approximate check via class attribute)
  const classes = await targetSection.getAttribute('class');
  expect(classes).toContain('scroll-mt-[64px]');
  expect(classes).toContain('sm:scroll-mt-[72px]');
  expect(classes).toContain('xl:scroll-mt-[104px]');
});
