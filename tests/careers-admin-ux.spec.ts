import { test, expect, type Page } from '@playwright/test';

test.describe('Careers Admin UX Verification', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/careers-admin');
    // Remove the dev-only ElementCaptureWidget to prevent it from intercepting clicks
    await page.evaluate(() => {
      const widget = document.getElementById('element-capture-widget');
      if (widget) widget.remove();
    });
  });

  test('Required fields have asterisks and aria-required', async ({ page }: { page: Page }) => {
    const legend = page.locator('text=Fields marked with * are required');
    await expect(legend).toBeVisible();

    const requiredInputs = [
      { id: 'jobs-api-key', label: 'Jobs API Key *' },
      { id: 'title', label: 'Role Title *' },
      { id: 'location', label: 'Location *' },
      { id: 'description', label: 'Description *' },
    ];

    for (const input of requiredInputs) {
      const label = page.locator(`label[for="${input.id}"]`);
      await expect(label).toContainText('*');

      const field = page.locator(`#${input.id}`);
      await expect(field).toHaveAttribute('aria-required', 'true');
      await expect(field).toHaveAttribute('required', '');
    }
  });

  test('Description character counter updates in real-time', async ({ page }: { page: Page }) => {
    const description = page.locator('#description');
    const counter = page.locator('#description-counter');

    await expect(counter).toHaveText('0 / 5,000');

    const testText = 'Developing high-performance civil construction projects.';
    await description.fill(testText);

    const expectedCount = testText.length.toLocaleString();
    await expect(counter).toHaveText(`${expectedCount} / 5,000`);

    // Test threshold feedback (90% of 5,000 is 4,500)
    // We can use a large string to trigger it
    const longText = 'a'.repeat(4501);
    await description.fill(longText);
    await expect(counter).toHaveClass(/text-accent/);
    await expect(counter).toHaveClass(/opacity-100/);

    // Test reset
    await page.locator('button#refresh-jobs').click(); // Just as a placeholder for a reset if there was one, but we can trigger form reset directly
    await page.evaluate(() => {
      (document.getElementById('create-job-form') as HTMLFormElement).reset();
    });
    // Wait for the reset event to be handled (setTimeout in script)
    await page.waitForTimeout(100);
    await expect(counter).toHaveText('0 / 5,000');
    await expect(counter).not.toHaveClass(/text-accent/);
  });
});
