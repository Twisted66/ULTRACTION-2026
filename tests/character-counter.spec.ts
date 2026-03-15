import { test, expect, type Page } from '@playwright/test';

test.describe('Character Counter UX Improvement', () => {
  test('Contact page message field has a character counter', async ({ page }: { page: Page }) => {
    await page.goto('/contact');

    // Initial check: counter should exist and show 0 or pre-filled length
    const counter = page.locator('#message-counter');
    await expect(counter).toBeVisible();

    const textarea = page.locator('textarea#message');
    const initialValue = await textarea.inputValue();
    const initialLength = initialValue.length;

    await expect(counter).toHaveText(`${initialLength} / 5000`);

    // Type some text and check if counter updates
    const addedText = 'Testing character counter.';
    await textarea.fill(initialValue + addedText);
    const newLength = initialLength + addedText.length;
    await expect(counter).toHaveText(`${newLength} / 5000`);

    // Check threshold warning (4500 characters)
    await textarea.evaluate((el: HTMLTextAreaElement) => {
      el.value = 'a'.repeat(4501);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await expect(counter).toHaveText('4501 / 5000');
    await expect(counter).toHaveClass(/text-accent/);

    // Reset form and check if counter resets
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.reset();
    });

    // The prefill logic might kick in on reset if it's careers subject,
    // but for default it should be 0.
    // However, our script will need to handle reset event.
    const resetValue = await textarea.inputValue();
    await expect(counter).toHaveText(`${resetValue.length} / 5000`);
  });
});
