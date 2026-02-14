const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:4323';

test('header desktop label consistency', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const contactDesktop = page.locator('header .md\\:flex a[href="/contact"] span').first();
  await expect(contactDesktop).toHaveText(/CONTACT$/);
});

test('header mobile toggle aria behavior', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });

  const toggle = page.locator('#mobile-menu-toggle');
  const mobileNav = page.locator('#mobile-nav');

  await expect(toggle).toHaveAttribute('aria-controls', 'mobile-nav');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Open navigation menu');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Close navigation menu');
  await expect(mobileNav).not.toHaveClass(/hidden/);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toHaveAttribute('aria-label', 'Open navigation menu');
});

test('projects filter a11y semantics and state updates', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(`${BASE}/projects`, { waitUntil: 'domcontentloaded' });

  const infraBtn = page.locator('button.filter-btn[data-filter="infrastructure"]');
  const allBtn = page.locator('button.filter-btn[data-filter="all"]');
  const status = page.locator('#projects-filter-status');

  await expect(allBtn).toHaveAttribute('type', 'button');
  await expect(allBtn).toHaveAttribute('aria-controls', 'projects-grid');
  await expect(allBtn).toHaveAttribute('aria-pressed', 'true');

  await infraBtn.click();
  await expect(infraBtn).toHaveAttribute('aria-pressed', 'true');
  await expect(allBtn).toHaveAttribute('aria-pressed', 'false');
  await expect(status).toContainText(/Showing infrastructure projects/i);

  const hiddenCount = await page.locator('[data-category][aria-hidden="true"]').count();
  expect(hiddenCount).toBeGreaterThan(0);
});

test('contact form controls have focus-visible ring classes', async ({ page }) => {
  await page.goto(`${BASE}/contact`, { waitUntil: 'domcontentloaded' });

  const controls = ['#name', '#email', '#subject', '#message', '#attachment'];
  for (const sel of controls) {
    const cls = await page.locator(sel).getAttribute('class');
    expect(cls || '').toContain('focus-visible:ring-2');
    expect(cls || '').toContain('focus-visible:ring-ring');
  }

  const submitCls = await page.locator('[data-submit-button]').getAttribute('class');
  expect(submitCls || '').toContain('focus-visible:ring-2');
});
