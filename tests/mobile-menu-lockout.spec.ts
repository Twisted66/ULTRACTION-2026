import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } });

test('mobile menu toggle remains interactive after opening', async ({ page }) => {
  await page.goto('/');

  // Remove the capture widget
  await page.evaluate(() => document.getElementById('element-capture-widget')?.remove());

  const toggle = page.locator('#mobile-menu-toggle');
  const mobileNav = page.locator('#mobile-nav');

  // Verify initial state
  await expect(mobileNav).toBeHidden();

  // Open the menu
  await toggle.click();
  await expect(mobileNav).toBeVisible();

  // Verify toggle is NOT inert and can be clicked again to close
  // In Playwright, if an element or its ancestor is inert, click() should fail or we can check the attribute
  const appContainer = page.locator('.app-container');
  const isInert = await appContainer.evaluate(el => el.hasAttribute('inert'));

  // Currently, it should be true (the bug)
  console.log(`Is .app-container inert? ${isInert}`);

  // Try to click the toggle again (to close)
  // If it's inert, this might fail or be intercepted
  await toggle.click();

  // If the bug exists, the click might not work as expected or Playwright might throw
  await expect(mobileNav).toBeHidden();
});
