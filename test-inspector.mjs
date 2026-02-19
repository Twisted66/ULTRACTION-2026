#!/usr/bin/env node

// Direct test of Element Inspector with Playwright

const basePath = '/mnt/c/Users/NeilEdwardBaja/Desktop/CLONE/mcp/element-inspector/node_modules';
const playwrightUrl = 'file://' + basePath + '/playwright/index.mjs';

console.log('Loading Playwright...');

const playwright = await import(playwrightUrl);
const { chromium } = playwright.default || playwright;

console.log('Playwright loaded successfully');

// Create a simple browser test
const browser = await chromium.launch({
  headless: false,
  args: ['--start-maximized']
});

console.log('Browser launched');

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});

const page = await context.newPage();

console.log('Navigating to http://localhost:4321/ ...');
await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });

console.log('Page loaded!');
console.log('Page title:', await page.title());

// Get page info
const elements = await page.evaluate(() => {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const hero = document.querySelector('section');
  const h1 = document.querySelector('h1');

  return {
    hasHeader: !!header,
    hasNav: !!nav,
    hasHero: !!hero,
    h1Text: h1?.textContent || '',
    bodyClasses: document.body.className,
    url: location.href
  };
});

console.log('\n=== Page Structure ===');
console.log(JSON.stringify(elements, null, 2));

// Take a screenshot
await page.screenshot({ path: 'test-screenshot.png' });
console.log('\nScreenshot saved to test-screenshot.png');

// Now inject the element inspector script
console.log('\n=== Injecting Element Inspector ===');

const inspectorScript = `
(() => {
  window.__testInspector = {
    clicks: [],
    active: true
  };

  const overlay = document.createElement("div");
  overlay.id = "__ei_overlay";
  overlay.style.position = "fixed";
  overlay.style.pointerEvents = "none";
  overlay.style.border = "2px solid #2dd4bf";
  overlay.style.background = "rgba(45, 212, 191, 0.12)";
  overlay.style.zIndex = "2147483647";
  overlay.style.display = "none";

  const label = document.createElement("div");
  label.id = "__ei_label";
  label.style.position = "fixed";
  label.style.pointerEvents = "none";
  label.style.padding = "4px 6px";
  label.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
  label.style.fontSize = "12px";
  label.style.background = "#0f172a";
  label.style.color = "#e2e8f0";
  label.style.border = "1px solid #334155";
  label.style.borderRadius = "6px";
  label.style.zIndex = "2147483647";
  label.style.display = "none";

  document.documentElement.appendChild(overlay);
  document.documentElement.appendChild(label);

  function simpleSelector(el) {
    if (!(el instanceof Element)) return "";
    let selector = el.tagName.toLowerCase();
    if (el.id) selector += "#" + CSS.escape(el.id);
    if (el.classList.length) {
      selector += "." + Array.from(el.classList).slice(0, 4).map((c) => CSS.escape(c)).join(".");
    }
    return selector;
  }

  function showHover(el, event) {
    if (!el || !(el instanceof Element) || el.id === "__ei_overlay" || el.id === "__ei_label") {
      overlay.style.display = "none";
      label.style.display = "none";
      return;
    }
    const rect = el.getBoundingClientRect();
    overlay.style.display = "block";
    overlay.style.left = rect.left + "px";
    overlay.style.top = rect.top + "px";
    overlay.style.width = rect.width + "px";
    overlay.style.height = rect.height + "px";

    label.style.display = "block";
    label.textContent = simpleSelector(el);
    label.style.left = Math.max(0, event.clientX + 12) + "px";
    label.style.top = Math.max(0, event.clientY + 12) + "px";
  }

  document.addEventListener("mousemove", (event) => {
    if (!window.__testInspector.active) return;
    const el = document.elementFromPoint(event.clientX, event.clientY);
    showHover(el, event);
  }, true);

  document.addEventListener("click", (event) => {
    if (!window.__testInspector.active) return;
    const el = event.target;
    if (!(el instanceof Element)) return;
    if (el.closest && el.closest("#__ei_overlay")) return;

    const payload = {
      selector: simpleSelector(el),
      tagName: el.tagName,
      id: el.id,
      classes: Array.from(el.classList),
      text: el.textContent?.slice(0, 100) || '',
      x: event.clientX,
      y: event.clientY
    };

    window.__testInspector.clicks.push(payload);
    console.log("Element Inspector: Clicked", payload);
  }, true);

  console.log("Element Inspector injected successfully");
})();
`;

await page.evaluate(inspectorScript);
console.log('Element Inspector injected!');

console.log('\n=== Element Inspector Active ===');
console.log('Move your mouse over elements to see highlights.');
console.log('Click on elements to capture them.');
console.log('Captured clicks will be logged to console.');
console.log('\nWaiting 15 seconds for interaction...\n');

await page.waitForTimeout(15000);

// Get captured clicks
const captured = await page.evaluate(() => {
  return window.__testInspector?.clicks || [];
});

console.log('\n=== Captured Clicks ===');
console.log(JSON.stringify(captured, null, 2));

// Take final screenshot
await page.screenshot({ path: 'test-screenshot-final.png' });
console.log('\nFinal screenshot saved to test-screenshot-final.png');

await browser.close();
console.log('\nTest complete!');
