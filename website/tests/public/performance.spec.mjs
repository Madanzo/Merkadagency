import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pages } from '../../content.mjs';

const require = createRequire(import.meta.url);
const vitals = readFileSync(join(dirname(require.resolve('web-vitals')), 'web-vitals.iife.js'), 'utf8');
const KiB = 1024;
const samplesPerPage = 3;
const missingPath = '/__performance_missing_page__';

test.describe.configure({ timeout: 60_000 });

function observeVitals() {
  window.labVitals = { cls: 0 };
  const report = ({ name, value }) => { window.labVitals[name.toLowerCase()] = value; };
  for (const observe of [webVitals.onLCP, webVitals.onINP, webVitals.onCLS]) {
    observe(report, { reportAllChanges: true });
  }
}

for (const { path } of [...pages, { path: missingPath }]) {
  test(`public performance budget for ${path}`, async ({ browser, baseURL }, testInfo) => {
    const mobile = testInfo.project.name === 'mobile';
    const samples = [];
    for (let run = 0; run < samplesPerPage; run++) {
      const context = await browser.newContext({
        baseURL,
        viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        isMobile: mobile,
        hasTouch: mobile,
      });
      try {
        const page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        const requests = new Map();
        const transferred = { total: 0, image: 0, font: 0 };
        cdp.on('Network.responseReceived', ({ requestId, type }) => requests.set(requestId, type));
        cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
          transferred.total += encodedDataLength;
          if (requests.get(requestId) === 'Image') transferred.image += encodedDataLength;
          if (requests.get(requestId) === 'Font') transferred.font += encodedDataLength;
        });
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750,
        });
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        // Inject the lab observers only in Chromium. Nothing is bundled or sent from the site.
        await page.addInitScript({ content: `${vitals}\n;(${observeVitals})();` });
        const response = await page.goto(path);
        expect(response.status()).toBe(path === missingPath ? 404 : 200);
        await page.waitForFunction(() => window.labVitals?.lcp > 0, undefined, { timeout: 5_000 });
        // Allow the CLS session and any deferred initial requests to settle before input.
        await page.waitForTimeout(1_100);
        const weight = { ...transferred };
        // Every page has a keyboard-accessible skip link. Also exercise the service FAQ.
        await page.keyboard.press('Tab');
        await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.locator('main')).toBeFocused();
        if (path === '/services/website-development') {
          await page.locator('summary').first().click();
          await expect(page.locator('details').first()).toHaveAttribute('open', '');
        }
        await page.waitForFunction(() => window.labVitals?.inp > 0, undefined, { timeout: 5_000 });
        samples.push({ ...await page.evaluate(() => window.labVitals), ...weight });
      } finally {
        await context.close();
      }
    }

    const median = key => samples.map(sample => sample[key]).sort((a, b) => a - b)[1];
    const result = {
      lcp: median('lcp'),
      inp: median('inp'),
      cls: Math.max(...samples.map(sample => sample.cls)),
      total: Math.max(...samples.map(sample => sample.total)),
      image: Math.max(...samples.map(sample => sample.image)),
      font: Math.max(...samples.map(sample => sample.font)),
    };
    console.log(`[${testInfo.project.name}] ${path} ${JSON.stringify(result)}`);
    await testInfo.attach('lab-performance.json', {
      body: JSON.stringify({ path, profile: testInfo.project.name, result, samples }, null, 2),
      contentType: 'application/json',
    });

    const hero = path === '/' || path === '/services/website-development';
    expect.soft(result.lcp, 'median LCP (ms)').toBeLessThanOrEqual(2500);
    expect.soft(result.inp, 'median scripted INP (ms)').toBeLessThanOrEqual(200);
    expect.soft(result.cls, 'maximum initial CLS').toBeLessThanOrEqual(0.1);
    const totalBudget = hero ? (mobile ? 26 : 38) : 20;
    const imageBudget = hero ? (mobile ? 10 : 22) : 4;
    expect.soft(result.total, 'maximum initial wire bytes').toBeLessThanOrEqual(totalBudget * KiB);
    expect.soft(result.image, 'maximum initial image wire bytes').toBeLessThanOrEqual(imageBudget * KiB);
    expect.soft(result.font, 'maximum initial font wire bytes').toBe(0);
  });
}

test('contact reserves space before clipboard support initializes', async ({ page }) => {
  let releaseScript;
  const waitForRelease = new Promise(resolve => { releaseScript = resolve; });
  await page.route('**/email-brief.js', async route => {
    await waitForRelease;
    await route.continue();
  });
  const footer = page.locator('.site-footer');
  const copyButton = page.getByRole('button', { name: 'Copy email address' });
  let before;
  try {
    await page.goto('/contact', { waitUntil: 'commit' });
    await expect(footer).toHaveCSS('border-top-width', '1px');
    await expect(copyButton).toBeHidden();
    before = await footer.evaluate(element => element.offsetTop);
  } finally {
    releaseScript();
  }
  await expect(copyButton).toBeVisible();
  expect(await footer.evaluate(element => element.offsetTop)).toBe(before);
});

test('chooses the bounded artwork candidate at the device’s default pixel density', async ({ page }, testInfo) => {
  await page.goto('/');
  const artwork = page.locator('.planning-artwork');
  const width = testInfo.project.name === 'mobile' ? 480 : 640;
  expect(await artwork.evaluate(image => new URL(image.currentSrc).pathname))
    .toBe(`/visuals/folded-glass-${width}.webp`);
});
