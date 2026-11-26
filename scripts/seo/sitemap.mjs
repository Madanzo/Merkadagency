import { origin, pages } from '../../website/content.mjs';
import { alternates } from '../../website/layout.mjs';

export function sitemap() {
 const entries = pages.map(page => {
  const locales = alternates(page);
  const links = locales ? Object.entries({ ...locales, 'x-default': locales.en }).map(
   ([lang, path]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${origin + path}"/>`,
  ).join('') : '';
  return `<url><loc>${origin + page.path}</loc>${links}</url>`;
 });
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}
