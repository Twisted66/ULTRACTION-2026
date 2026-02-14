const { chromium } = require('playwright');

(async () => {
  const base = 'http://localhost:4323';
  const results = [];
  const fail = (name, msg) => { throw new Error(`${name}: ${msg}`); };

  const browser = await chromium.launch({ headless: true });
  try {
    // 1) Desktop CONTACT label
    {
      const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
      const name = 'Header desktop CONTACT label';
      await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
      const text = await page.locator('header .md\\:flex a[href="/contact"] span').first().innerText();
      if (text.trim() !== 'CONTACT') fail(name, `expected CONTACT, got ${text}`);
      results.push({ name, status: 'PASS' });
      await page.close();
    }

    // 2) Mobile toggle ARIA behavior
    {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const name = 'Header mobile toggle ARIA';
      await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
      const t = page.locator('#mobile-menu-toggle');
      const nav = page.locator('#mobile-nav');

      if ((await t.getAttribute('aria-controls')) !== 'mobile-nav') fail(name, 'aria-controls missing/incorrect');
      if ((await t.getAttribute('aria-expanded')) !== 'false') fail(name, 'initial aria-expanded not false');
      if ((await t.getAttribute('aria-label')) !== 'Open navigation menu') fail(name, 'initial aria-label incorrect');

      await t.click();
      if ((await t.getAttribute('aria-expanded')) !== 'true') fail(name, 'aria-expanded not true after open');
      if ((await t.getAttribute('aria-label')) !== 'Close navigation menu') fail(name, 'aria-label not close after open');
      if (!(await nav.isVisible())) fail(name, 'mobile nav not visible after open');

      await t.click();
      if ((await t.getAttribute('aria-expanded')) !== 'false') fail(name, 'aria-expanded not false after close');
      results.push({ name, status: 'PASS' });
      await page.close();
    }

    // 3) Projects filter semantics/state
    {
      const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
      const name = 'Projects filter semantics';
      await page.goto(`${base}/projects`, { waitUntil: 'domcontentloaded' });

      const allBtn = page.locator('button.filter-btn[data-filter="all"]');
      const marineBtn = page.locator('button.filter-btn[data-filter="marine"]');
      const status = page.locator('#projects-filter-status');

      if ((await allBtn.getAttribute('type')) !== 'button') fail(name, 'all button type not button');
      if ((await allBtn.getAttribute('aria-controls')) !== 'projects-grid') fail(name, 'aria-controls incorrect');
      if ((await allBtn.getAttribute('aria-pressed')) !== 'true') fail(name, 'all not initially pressed');

      await marineBtn.click();
      if ((await marineBtn.getAttribute('aria-pressed')) !== 'true') fail(name, 'marine not pressed after click');
      if ((await allBtn.getAttribute('aria-pressed')) !== 'false') fail(name, 'all still pressed after marine click');

      const sText = (await status.textContent()) || '';
      if (!/Showing marine projects/i.test(sText)) fail(name, `live region text unexpected: ${sText}`);

      const hiddenCount = await page.locator('[data-category][aria-hidden="true"]').count();
      if (hiddenCount < 1) fail(name, 'no filtered sections marked aria-hidden');

      results.push({ name, status: 'PASS' });
      await page.close();
    }

    // 4) Contact focus-visible classes
    {
      const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
      const name = 'Contact focus-visible classes';
      await page.goto(`${base}/contact`, { waitUntil: 'domcontentloaded' });
      const selectors = ['#name', '#email', '#subject', '#message', '#attachment', '[data-submit-button]'];
      for (const sel of selectors) {
        const cls = (await page.locator(sel).getAttribute('class')) || '';
        if (!cls.includes('focus-visible:ring-2')) fail(name, `${sel} missing focus-visible:ring-2`);
      }
      results.push({ name, status: 'PASS' });
      await page.close();
    }

    console.log('PLAYWRIGHT_VALIDATION_RESULTS');
    for (const r of results) console.log(`PASS: ${r.name}`);
    process.exit(0);
  } catch (err) {
    console.error('PLAYWRIGHT_VALIDATION_FAILED');
    console.error(err.message || err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
