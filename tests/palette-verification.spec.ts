import { test, expect } from '@playwright/test';

test.describe('Careers Admin Character Counter', () => {
  test('Character counter updates correctly and changes color at threshold', async ({ page }) => {
    await page.goto('/careers-admin');

    const textarea = page.locator('#description');
    const counter = page.locator('#description-counter');

    // Initial state
    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).toHaveClass(/opacity-60/);

    // Type some text
    await textarea.fill('Hello world');
    await expect(counter).toHaveText('11 / 5000');

    // Reach 90% threshold (4500 characters)
    const thresholdText = 'a'.repeat(4500);
    await textarea.fill(thresholdText);
    await expect(counter).toHaveText('4500 / 5000');
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).not.toHaveClass(/opacity-60/);

    // Go back below threshold
    await textarea.fill('a'.repeat(4499));
    await expect(counter).toHaveText('4499 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-60/);
  });
});
