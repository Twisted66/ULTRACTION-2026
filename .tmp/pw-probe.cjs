const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://localhost:4323/projects', { waitUntil: 'domcontentloaded' });
  await page.click('button.filter-btn[data-filter="marine"]');

  const data = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('[data-category]')];
    return {
      all: nodes.length,
      hiddenAttr: nodes.filter((n) => n.getAttribute('aria-hidden') === 'true').length,
      hiddenProp: nodes.filter((n) => n.hidden).length,
      status: document.getElementById('projects-filter-status')?.textContent || '',
      marinePressed: document.querySelector('button.filter-btn[data-filter="marine"]')?.getAttribute('aria-pressed') || '',
      sampleCategories: nodes.slice(0, 5).map((n) => n.getAttribute('data-category')),
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
