import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { contactLabel, pages } from '../../content.mjs';

const missingPath = '/missing/public-qa-page';
const email = 'camiloreyna@merkadagency.com';

for (const [path, heading, status, lang] of [
  ...pages.map(({ path, heading, lang }) => [path, heading, 200, lang]),
  [missingPath, 'This page is not available.', 404],
]) {
  test(`renders ${path} with keyboard access and no axe violations`, async ({ page, baseURL }) => {
    const unexpected = [];
    await page.route('**/*', async route => {
      const request = route.request();
      if (new URL(request.url()).origin !== baseURL || request.method() !== 'GET') {
        unexpected.push(request.url());
        await route.abort();
        return;
      }
      await route.continue();
    });
    expect((await page.goto(path)).status()).toBe(status);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
    const skip = page.getByRole('link', { name: lang === 'es' ? 'Saltar al contenido' : 'Skip to content', exact: true });
    await expect(skip).toHaveAttribute('href', '#main');
    await expect(skip).not.toBeInViewport();
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toHaveId('main');
    await expect(page.getByRole('main')).toBeFocused();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(unexpected).toEqual([]);
  });
}

test('serves a release with intake and analytics disabled', async ({ request }) => {
  const response = await request.get('/website-release.json');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ intake: false, analytics: false });
});

test('navigates from home through the main links with a keyboard', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  for (const name of ['Home', 'Marketing', 'CRM', 'Website development', 'Website brief', 'Contact']) {
    if (name === 'Home') {
      await page.keyboard.press('Tab'); // Skip link
      await page.keyboard.press('Tab'); // Brand
    }
    await page.keyboard.press('Tab');
    const link = nav.getByRole('link', { name, exact: true });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    await expect(link).toBeInViewport();
  }
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
  await expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('aria-current', 'page');
});

test('recovers from a nested 404 through its content links', async ({ page }) => {
  expect((await page.goto(missingPath)).status()).toBe(404);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex,nofollow');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('main').getByRole('link', { name: 'website development' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'contact Camilo by email' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
});

test('focuses the webmail instructions and recovers after clipboard denial', async ({ page }) => {
  await page.addInitScript(() => {
    let denied = true;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async text => {
        if (denied) {
          denied = false;
          throw new DOMException('Clipboard denied', 'NotAllowedError');
        }
        window.publicQaCopiedText = text;
      } },
    });
  });
  await page.goto('/contact');
  await page.getByRole('link', { name: 'Copy the address and optional questions below' }).press('Enter');
  const heading = page.getByRole('heading', { name: 'If the email button does not open your app' });
  await expect(heading).toBeFocused();
  const address = page.getByRole('button', { name: 'Copy email address' });
  const brief = page.getByRole('button', { name: 'Copy brief questions' });
  await page.keyboard.press('Tab');
  await expect(address).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('copy them manually');
  await expect(address).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Email address copied');
  expect(await page.evaluate(() => window.publicQaCopiedText)).toBe(email);
  await page.keyboard.press('Tab');
  await expect(brief).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toContainText('Questions copied');
  expect(await page.evaluate(() => window.publicQaCopiedText)).toContain('What you want to improve:');
});

test('keeps mailto and manual instructions available without JavaScript', async ({ browser, baseURL }, testInfo) => {
  const { viewport, isMobile, hasTouch } = testInfo.project.use;
  const context = await browser.newContext({ baseURL, viewport, isMobile, hasTouch, javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/contact');
    const draft = page.getByRole('main').getByRole('link', { name: contactLabel }).first();
    const href = new URL(await draft.getAttribute('href'));
    expect(href.protocol).toBe('mailto:');
    expect(href.pathname).toBe(email);
    expect(href.searchParams.get('body')).toContain('Website and Google Business Profile (if available):');
    await expect(page.locator('[data-email-address]')).toHaveText(email);
    await expect(page.locator('[data-email-brief]')).toContainText('What you want to improve:');
    await expect(page.getByRole('button', { name: 'Copy email address' })).toBeHidden();
  } finally {
    await context.close();
  }
});

test('keeps keyboard fragment navigation instant with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/contact');
  const link = page.getByRole('link', { name: 'Copy the address and optional questions below' });
  await link.press('Enter');
  const heading = page.getByRole('heading', { name: 'If the email button does not open your app' });
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await expect(heading).toHaveCSS('animation-name', 'none');
  await expect(heading).toHaveCSS('transition-property', 'none');
});
