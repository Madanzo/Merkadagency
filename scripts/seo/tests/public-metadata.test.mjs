import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { address, addressLine, email, origin, pages } from '../../../website/content.mjs';
import { shopTypes, shopTypesEs } from '../../../website/shop-pages.mjs';

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
      const { document } = window;
      const { head } = document;
      const audience = document.documentElement.lang === 'es' ? shopTypesEs : shopTypes;
      const includesAudience = text => text.toLowerCase().replace(' & detailing', ' and detailing').includes(audience.toLowerCase());
      const title = document.title;
      const description = head.querySelector('meta[name="description"]').content;
      const heading = document.querySelector('h1').textContent;
      for (const text of [title, description, heading]) assert.ok(includesAudience(text), `Missing positioning on ${path}: ${text}`);
      for (const [network, attribute] of [['og', 'property'], ['twitter', 'name']]) {
        assert.equal(head.querySelector(`meta[${attribute}="${network}:title"]`).content, title);
        assert.equal(head.querySelector(`meta[${attribute}="${network}:description"]`).content, description);
        assert.doesNotMatch(title, /website development/i);
      }

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

  assert.deepEqual(sitemapUrls.map(entry => entry.querySelector('loc').textContent), pages.map(page => origin + page.path));
  const llms = await readFile('dist-site/llms.txt', 'utf8');
  const llmsUrls = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(([, url]) => url);
  assert.deepEqual(llmsUrls.sort(), pages.map(page => origin + page.path).sort());

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
    assert.deepEqual(business.address, { '@type': 'PostalAddress', ...address });
    assert.equal(business.email, email);
    assert.ok(doc.querySelector('footer').textContent.includes(addressLine));
    if (page.path === '/contact') assert.ok(doc.querySelector('main').textContent.includes(addressLine));
    if (page.path === '/work/phantom-wraps') {
      const main = doc.querySelector('main').textContent;
      assert.match(main, /10601 N Lamar Blvd, Austin, TX 78753/);
      assert.ok(!main.includes(addressLine));
    }
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
    const service = graph.find(node => node['@type'] === 'Service');
    if (service) {
      assert.equal(service.name, doc.querySelector('h1').textContent);
      assert.equal(service.description, doc.querySelector('main .intro').textContent);
    }
    const software = graph.find(node => node['@type'] === 'SoftwareApplication');
    if ((page.englishPath ?? page.path) === '/services/wrap-shop-crm') {
      assert.equal(software.url, canonical);
      assert.equal(software.description, doc.querySelector('main .intro').textContent);
      assert.equal(software.publisher['@id'], business['@id']);
      assert.deepEqual(software.offers.priceSpecification.map(item => item.price), [1500, 800]);
    } else {
      assert.equal(software, undefined);
    }
    window.close();
  }
  sitemap.window.close();
});

test('English and Spanish home and CRM pages publish the scoped comparison and planned features', async () => {
  for (const [path, lang] of [['index', 'en'], ['services/wrap-shop-crm', 'en'], ['es', 'es'], ['es/servicios/crm-para-talleres', 'es']]) {
    const { window } = new JSDOM(await readFile(`dist-site/${path}.html`, 'utf8'));
    const comparison = window.document.querySelector('.value-comparison');
    assert.equal(comparison.querySelector('h2').textContent, lang === 'en' ? 'Why we charge more' : 'Por qué cobramos más');
    assert.match(comparison.querySelector('p').textContent, /\$1,500.*\$800/);
    const headings = [...comparison.querySelectorAll('thead th[scope="col"]')].map(cell => cell.textContent);
    assert.deepEqual(headings.slice(1), lang === 'en' ? ['Shop software', 'Typical agency', 'MerkadAgency'] : ['Software para talleres', 'Agencia típica', 'MerkadAgency']);
    const rows = [...comparison.querySelectorAll('tbody tr')];
    assert.equal(rows.length, 10);
    for (const row of rows) {
      assert.ok(row.querySelector('th[scope="row"]'));
      assert.equal(row.querySelectorAll('td').length, 3);
    }
    const planned = rows.find(row => row.querySelector('th').textContent.match(/AI receptionist|Recepcionista con IA/));
    assert.equal(planned.lastElementChild.textContent, lang === 'en' ? 'Coming soon' : 'Próximamente');
    window.close();
  }
});
