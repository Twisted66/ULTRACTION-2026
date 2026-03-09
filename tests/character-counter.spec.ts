import { test, expect } from '@playwright/test';

test('Character counter in contact form', async ({ page }) => {
  await page.goto('/contact');

  const message = page.locator('#message');
  const counter = page.locator('#message-counter');

  await expect(counter).toHaveText('0 / 5000');

  await message.fill('Hello world');
  await expect(counter).toHaveText('11 / 5000');

  // Fill with 4500 characters to check threshold
  const longText = 'a'.repeat(4500);
  await message.fill(longText);
  await expect(counter).toHaveText('4500 / 5000');
  await expect(counter).toHaveClass(/text-accent/);

  // Fill with less than 4500
  await message.fill('a'.repeat(4499));
  await expect(counter).toHaveText('4499 / 5000');
  await expect(counter).not.toHaveClass(/text-accent/);

  // Test reset
  await message.fill('test');
  // We need to trigger the form reset logic in the real app, but here we just check if it updates on input
  await expect(counter).toHaveText('4 / 5000');
});
