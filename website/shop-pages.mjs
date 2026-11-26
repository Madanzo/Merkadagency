export const marketingPath = '/services/marketing-for-wrap-shops';
export const crmPath = '/services/wrap-shop-crm';
export const phantomPath = '/work/phantom-wraps';
export const shopTypes = 'wrap, PPF, tint, ceramic coating and detailing shops';
export const shopTypesEs = 'talleres de rotulación, PPF, polarizado, recubrimiento cerámico y detallado';

const verticals = [
 {
  slug: 'ppf', label: 'Paint protection film (PPF)', shop: 'PPF',
  description: 'Show paint protection film coverage, answer local search questions and track PPF quotes in a CRM built for shops.',
  marketingQuestion: 'How can PPF shops get found in local search?',
  marketing: 'Give paint protection film its own page. Show which panels a partial front, full front or full-body installation covers. Use approved photos and keep your service area and hours consistent with your Google Business Profile.',
  crmQuestion: 'What should a PPF shop track in its CRM?',
  crm: 'Capture the vehicle year, make and model, requested panels and any existing film. Keep inspection notes and coverage options with the quote so the next person to follow up knows what the customer asked for.',
  faq: [
   ['What photos should a PPF shop show?', 'Use approved close-ups of edges and high-impact panels. Label the panels covered so customers can compare packages.'],
   ['Can I track different PPF coverage options for the same inquiry?', 'Keep the requested panels and alternative packages with the lead and record the coverage the customer chooses on the quote.'],
  ],
 },
 {
  slug: 'tint', label: 'Window tint', shop: 'window tint',
  description: 'Build a local window tint portfolio and use the CRM to track vehicle details, tint quotes and follow-up.',
  marketingQuestion: 'What should a window tint shop put on its website?',
  marketing: 'Show approved photos in daylight and describe the films and windows in each example. Explain what customers should ask about local tint rules and keep your service area and hours current.',
  crmQuestion: 'How can a tint shop organize quote requests?',
  crm: 'Record the vehicle, windows to tint, film preference and whether old film needs removal. Keep each quote and its follow-up together in the sales pipeline.',
  faq: [
   ['Should tint examples list the film and shade?', 'Yes. Include the film and shade when known so customers can compare real installations. Confirm locally applicable limits before quoting.'],
   ['Can I track old tint removal in the CRM?', 'Record removal as part of the inquiry and include it in the quote when the job requires it.'],
  ],
 },
 {
  slug: 'ceramic-coating', label: 'Ceramic coating', shop: 'ceramic coating',
  description: 'Explain paint preparation and ceramic coating packages on your website, then track consultations and quotes in the CRM.',
  marketingQuestion: 'How do ceramic coating shops explain their packages online?',
  marketing: 'Describe the wash, decontamination and paint correction included in each package, alongside the surfaces you coat. Show approved photos and explain maintenance so customers know how to care for the finish.',
  crmQuestion: 'What should a ceramic coating shop record before quoting?',
  crm: 'Capture the vehicle, paint condition, requested surfaces and whether you need an inspection. Use those notes to build the quote and follow up after the consultation.',
  faq: [
   ['Should I explain paint correction on my coating page?', 'Yes. Say which preparation steps are included and which depend on the paint condition and inspection.'],
   ['How can I follow up after a coating service?', 'Keep the customer and job details together. Send the agreed care instructions and use a review request when the job is complete.'],
  ],
 },
 {
  slug: 'detailing', label: 'Auto detailing', shop: 'detailing',
  description: 'Market interior and exterior detailing services locally and keep detailing inquiries, estimates and repeat-customer follow-up in one CRM.',
  marketingQuestion: 'How should an auto detailing shop market its services?',
  marketing: 'Explain what your interior, exterior and combined packages cover. Show approved before-and-after photos and list the area you serve, including where mobile detailing is available if you offer it.',
  crmQuestion: 'How can detailers handle new and repeat inquiries?',
  crm: 'Keep vehicle condition, requested work and prior service notes with the contact. Use the pipeline to follow up on estimates and email campaigns to reach customers who have agreed to hear from you.',
  faq: [
   ['What should customers tell me before I quote an interior detail?', 'Ask about the vehicle, the current interior condition and issues like pet hair, stains or odors so you can scope the work.'],
   ['Can I keep track of returning detailing customers?', 'Use the customer’s existing contact record to reference past work and create a quote for the new request.'],
  ],
 },
];

export const verticalLinks = verticals.map(({ slug, label }) => [`/services/marketing-for-${slug}-shops`, label]);
export const verticalLinksEs = [
 ['/es/servicios/marketing-para-talleres-ppf', 'Película de protección de pintura (PPF)'],
 ...verticalLinks.slice(1).map(([path], index) => [path, ['Polarizado (inglés)', 'Recubrimiento cerámico (inglés)', 'Detallado automotriz (inglés)'][index]]),
];

export function shopLinks(links) {
 return links.map(([href, label]) => `<a href="${href}">${label}</a>`);
}

export function faqSection(heading, entries) {
 return `<h2>${heading}</h2>${entries.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}`;
}

export function verticalPages(contactLink) {
 return verticals.map((vertical, index) => ({
  path: verticalLinks[index][0],
  title: `Marketing & CRM for ${vertical.label} Shops | MerkadAgency`,
  heading: `Marketing and CRM for ${vertical.shop} shops`,
  description: vertical.description,
  body: `<p class="intro">${vertical.description}</p>
${contactLink}
<h2>${vertical.marketingQuestion}</h2><p>${vertical.marketing}</p>
<p><a href="${marketingPath}">Explore shop marketing and local SEO</a></p>
<h2>${vertical.crmQuestion}</h2><p>${vertical.crm}</p>
<p><a href="${crmPath}">Explore the MerkadAgency CRM</a></p>
${faqSection('Frequently asked questions', vertical.faq)}`,
 }));
}

export function withShopPositioning(page) {
 const es = page.lang === 'es';
 const audience = es ? shopTypesEs : shopTypes;
 const includesAudience = text => text.toLowerCase().replace(' & detailing', ' and detailing').includes(audience.toLowerCase());
 const title = includesAudience(page.title)
  ? page.title
  : page.title.replace(' | MerkadAgency', ` — ${audience} | MerkadAgency`);
 const description = includesAudience(page.description)
  ? page.description
  : `${page.description} ${es ? 'Atendemos a' : 'We serve'} ${audience}.`;
 const headingAudience = includesAudience(page.heading) ? '' : `${es ? 'Para' : 'For'} ${audience}.`;
 return { ...page, title, description, headingAudience };
}
