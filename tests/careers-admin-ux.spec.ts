import { test, expect } from '@playwright/test';

test.describe('Careers Admin UX', () => {
  test('should verify essential UX improvements', async ({ page }) => {
    await page.goto('/careers-admin');
    await expect(page.locator('p:has-text("Fields marked with")')).toBeVisible();
    await expect(page.locator('label:has-text("Jobs API Key *")')).toBeVisible();
    await expect(page.locator('#description')).toHaveAttribute('aria-required', 'true');
    const counter = page.locator('#description-counter');
    await expect(counter).toHaveText('0 / 5,000');
    await page.fill('#description', 'Test text');
    await expect(counter).toHaveText('9 / 5,000');
  });
});
