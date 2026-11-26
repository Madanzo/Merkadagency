import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { pages } from '../../../website/content.mjs';

const publicPaths = [...pages.map(({ path }) => path), '/404'];

for (const directory of ['dist-site', 'dist-rollback']) {
  test(`${directory} public pages have unique, non-empty titles and descriptions`, async () => {
    // Each build is checked separately. Missing URLs share the generated 404.html,
    // so its dedicated title is counted once per build.
    const titles = new Map();
    const descriptions = new Map();

    for (const path of publicPaths) {
      const file = `${directory}${path === '/' ? '/index' : path}.html`;
      const { window } = new JSDOM(await readFile(file, 'utf8'));
      const { head } = window.document;

      for (const [label, selector, attribute, seen] of [
        ['title', 'title', null, titles],
        ['meta description', 'meta[name="description" i]', 'content', descriptions],
      ]) {
        const elements = head.querySelectorAll(selector);
        assert.equal(elements.length, 1, `${path} must have exactly one ${label} in <head>`);
        const rawValue = attribute ? elements[0].getAttribute(attribute) : elements[0].textContent;
        const value = rawValue?.replace(/\s+/g, ' ').trim();
        assert.ok(value, `${path} has an empty ${label}`);
        assert.ok(!seen.has(value), `${path} shares its ${label} with ${seen.get(value)}: ${value}`);
        seen.set(value, path);
      }
      window.close();
    }
  });
}

test('localized metadata, FAQ answers and page entities match the public pages and sitemap', async () => {
  const sitemap = new JSDOM(await readFile('dist-site/sitemap.xml', 'utf8'), { contentType: 'text/xml' });
  const sitemapUrls = [...sitemap.window.document.querySelectorAll('url')];
  const hreflang = links => Object.fromEntries(
    [...links].map(link => [link.getAttribute('hreflang'), link.getAttribute('href')]),
  );

  for (const page of pages) {
    const file = `dist-site${page.path === '/' ? '/index' : page.path}.html`;
    const { window } = new JSDOM(await readFile(file, 'utf8'));
    const doc = window.document;
    const lang = page.lang ?? 'en';
    const canonical = doc.querySelector('link[rel=canonical]').href;
    assert.equal(doc.documentElement.lang, lang);
    assert.equal(canonical, 'https://merkadagency.com' + page.path);
    const sitemapEntry = sitemapUrls.find(entry => entry.querySelector('loc').textContent === canonical);
    assert.ok(sitemapEntry, `Missing sitemap entry for ${page.path}`);
    const spanish = lang === 'es' ? page : pages.find(candidate => candidate.englishPath === page.path);
    const expectedAlternates = spanish ? {
      en: 'https://merkadagency.com' + spanish.englishPath,
      es: 'https://merkadagency.com' + spanish.path,
      'x-default': 'https://merkadagency.com' + spanish.englishPath,
    } : {};
    assert.deepEqual(hreflang(doc.querySelectorAll('link[rel=alternate]')), expectedAlternates);
    assert.deepEqual(hreflang(sitemapEntry.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link')), expectedAlternates);

    const graph = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    const business = graph.find(node => node['@type'].includes('Organization'));
    assert.deepEqual(business['@type'], ['Organization', 'ProfessionalService']);
    assert.equal(business.address, undefined);
    assert.deepEqual(business.areaServed.map(area => area.name), ['United States', 'Austin']);
    const faq = [...doc.querySelectorAll('main details')].map(item => [
      item.querySelector('summary').textContent.trim(), item.querySelector('p').textContent.trim(),
    ]);
    const faqSchema = graph.find(node => node['@type'] === 'FAQPage');
    assert.deepEqual(faqSchema?.mainEntity.map(item => [item.name, item.acceptedAnswer.text]) ?? [], faq);
    const breadcrumbs = graph.find(node => node['@type'] === 'BreadcrumbList');
    const home = lang === 'es' ? '/es' : '/';
    if (page.path !== home) {
      assert.deepEqual(breadcrumbs.itemListElement.map(item => item.item), ['https://merkadagency.com' + home, canonical]);
    } else {
      assert.equal(breadcrumbs, undefined);
    }
    const software = graph.find(node => node['@type'] === 'SoftwareApplication');
    if ((page.englishPath ?? page.path) === '/services/wrap-shop-crm') {
      assert.equal(software.url, canonical);
      assert.equal(software.publisher['@id'], business['@id']);
      assert.deepEqual(software.offers.priceSpecification.map(item => item.price), [1500, 800]);
    } else {
      assert.equal(software, undefined);
    }
    window.close();
  }
  sitemap.window.close();
});
