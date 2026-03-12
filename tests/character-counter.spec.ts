import { test, expect } from '@playwright/test';

test.describe('Character Counter Verification', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));
  });

  test('Contact page message counter updates correctly', async ({ page }) => {
    await page.goto('/contact');

    // Wait for the form and character counter to be ready
    const messageInput = page.locator('#message');
    const counter = page.locator('#message-counter');

    await expect(counter).toBeVisible();
    await expect(counter).toHaveText('0 / 5000');

    // Type some text and check the counter
    await messageInput.fill('Hello ULTRACTION');
    await expect(counter).toHaveText('16 / 5000');

    // Verify threshold warning (90% of 5000 = 4500)
    // We'll fill it with 4500 characters
    const longText = 'a'.repeat(4500);
    await messageInput.fill(longText);
    await expect(counter).toHaveText('4500 / 5000');
    await expect(counter).toHaveClass(/text-accent/);

    // Verify it clears when form is reset (though form reset is manual after success, we can check initial state)
    await messageInput.fill('');
    await expect(counter).toHaveText('0 / 5000');
    await expect(counter).not.toHaveClass(/text-accent/);
  });

  test('Contact page message counter updates on subject change', async ({ page }) => {
    await page.goto('/contact');

    const messageInput = page.locator('#message');
    const counter = page.locator('#message-counter');
    const subjectSelect = page.locator('#subject');

    await expect(counter).toBeVisible();
    await expect(counter).toHaveText('0 / 5000');

    // Change subject to careers (role pre-fill won't happen without query param, but subject change should work)
    await subjectSelect.selectOption('careers');

    // Type and check
    await messageInput.fill('Applying for a job');
    await expect(counter).toHaveText('18 / 5000');
  });
});
