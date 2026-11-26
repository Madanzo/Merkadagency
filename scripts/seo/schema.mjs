import { JSDOM } from 'jsdom';
import { email, origin } from '../../website/content.mjs';
import { crmPath, marketingPath, shopTypes } from '../../website/shop-pages.mjs';
import { spanishCrm, spanishHome, spanishMarketing } from '../../website/spanish.mjs';

const organizationId = origin + '/#organization';
const websitePath = '/services/website-development';
const websiteOffer = {
 '@type': 'Offer',
 name: 'Website development',
 url: origin + websitePath,
 priceSpecification: { '@type': 'PriceSpecification', minPrice: 500, priceCurrency: 'USD' },
};
const crmOffer = {
 '@type': 'Offer',
 name: 'MerkadAgency CRM license',
 url: origin + crmPath,
 priceSpecification: [
  { '@type': 'UnitPriceSpecification', name: 'Setup', price: 1500, priceCurrency: 'USD' },
  { '@type': 'UnitPriceSpecification', name: 'Monthly license', price: 800, priceCurrency: 'USD', unitCode: 'MON' },
 ],
};

export function pageSchema(page, fallback) {
 const enPath = page.englishPath ?? page.path;
 const es = page.lang === 'es';
 const home = es ? spanishHome : '/';
 const url = origin + page.path;
 const offers = {
  '/': [websiteOffer, crmOffer],
  [marketingPath]: [websiteOffer],
  [crmPath]: [crmOffer],
  [websitePath]: fallback ? [] : [websiteOffer],
 }[enPath];
 const nodes = [{
  '@type': ['Organization', 'ProfessionalService'],
  '@id': organizationId,
  name: 'MerkadAgency',
  url: origin + '/',
  email,
  logo: origin + '/favicon-512.png',
  image: origin + '/social-preview.jpg',
  description: `Portfolio websites, local SEO and CRM for ${shopTypes}.`,
  contactPoint: { '@type': 'ContactPoint', name: 'Camilo Reyna', email, contactType: 'project inquiries' },
  areaServed: [
   { '@type': 'Country', name: 'United States' },
   { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
  ],
  ...(offers?.length ? { makesOffer: offers } : {}),
 }];

 if (enPath === websitePath || [marketingPath, spanishMarketing].includes(page.path)) {
  const name = enPath === websitePath ? 'Website development' : es ? 'Marketing para talleres' : 'Marketing for automotive shops';
  nodes.push({
   '@type': 'Service', name, serviceType: name, url, description: page.description,
   provider: { '@id': organizationId },
  });
 }

 if ([crmPath, spanishCrm].includes(page.path)) {
  nodes.push({
   '@type': 'SoftwareApplication',
   '@id': origin + crmPath + '#software',
   name: 'MerkadAgency CRM',
   url,
   description: page.description,
   inLanguage: page.lang ?? 'en',
   applicationCategory: 'BusinessApplication',
   publisher: { '@id': organizationId },
   offers: crmOffer,
  });
 }

 if (page.path !== home) {
  nodes.push({
   '@type': 'BreadcrumbList',
   itemListElement: [
    { '@type': 'ListItem', position: 1, name: es ? 'Inicio' : 'Home', item: origin + home },
    { '@type': 'ListItem', position: 2, name: page.heading, item: url },
   ],
  });
 }

 // Use the rendered answers, including their link text, to keep schema in sync with the page.
 const body = JSDOM.fragment(page.body);
 const questions = [...body.querySelectorAll('details')].map(details => ({
  '@type': 'Question',
  name: details.querySelector('summary').textContent.trim(),
  acceptedAnswer: { '@type': 'Answer', text: details.querySelector('p').textContent.trim() },
 }));
 if (questions.length) nodes.push({ '@type': 'FAQPage', url, inLanguage: page.lang ?? 'en', mainEntity: questions });

 return { '@context': 'https://schema.org', '@graph': nodes };
}
