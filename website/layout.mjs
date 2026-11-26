import {addressLine, contactLink, email, pages} from './content.mjs';
import {crmPath, marketingPath, shopLinks, verticalLinks, verticalLinksEs} from './shop-pages.mjs';
import {spanishContact, spanishCrm, spanishHome, spanishMarketing, spanishPhantom} from './spanish.mjs';

const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const navigation = [['/','Home'],[marketingPath,'Marketing'],[crmPath,'CRM'],['/services/website-development','Website development'],['/resources/website-brief','Website brief'],['/contact','Contact']];
const navigationEs = [[spanishHome, 'Inicio'], [spanishMarketing, 'Marketing'], [spanishCrm, 'CRM'], [spanishPhantom, 'Proyecto Phantom']];
const copy = body => `<!--copy:start-->${body}<!--copy:end-->`;

export function alternates(page) {
 const spanish = page.lang === 'es' ? page : pages.find(candidate => candidate.englishPath === page.path);
 return spanish ? { en: spanish.englishPath, es: spanish.path } : null;
}

export function header(page) {
 const es = page.lang === 'es';
 const translations = alternates(page);
 const links = (es ? navigationEs : navigation).map(([href,label])=>`<a href="${href}"${page.path===href?' aria-current="page"':''}>${label}</a>`).join('');
 const language = es
  ? `<a href="${translations.en}" lang="en" hreflang="en">English</a>`
  : `<a href="${translations?.es ?? spanishHome}" lang="es" hreflang="es">${translations ? 'Español' : 'Inicio en español'}</a>`;
 return `<header class="site-header"><div class="header-inner"><a class="brand" href="${es ? spanishHome : '/'}" aria-label="${es ? 'MerkadAgency, inicio' : 'MerkadAgency home'}"><img src="/favicon.png" width="48" height="48" alt=""><span>MerkadAgency</span></a><nav aria-label="${es ? 'Principal' : 'Main'}">${links}${language}</nav><div class="header-contact">${es ? spanishContact(email) : contactLink}</div></div></header>`;
}

export function footer(page) {
 const es = page.lang === 'es';
 const specialties = shopLinks(es ? verticalLinksEs : verticalLinks).join('');
 return `<footer class="site-footer"><div class="footer-inner"><div><p class="footer-brand">MerkadAgency <span>· ${es ? 'Marketing y CRM para talleres' : 'Marketing and CRM for automotive shops'}</span></p><a href="mailto:${email}">${email}</a><p>${addressLine}</p></div><nav aria-label="${es ? 'Especialidades' : 'Shop specialties'}">${specialties}</nav><nav aria-label="${es ? 'Información legal' : 'Legal'}"><a href="/legal/privacy" hreflang="en">${es ? 'Privacidad (inglés)' : 'Privacy'}</a><a href="/legal/terms" hreflang="en">${es ? 'Términos (inglés)' : 'Website terms'}</a></nav></div></footer>`;
}

function heading(page) {
 const { accent, headingAudience } = page;
 const primary = accent ? escape(page.heading.slice(0,-accent.length))+`<span>${escape(accent)}</span>` : escape(page.heading);
 return `<h1>${primary}${headingAudience ? ` <span class="heading-audience">${escape(headingAudience)}</span>` : ''}</h1>`;
}

function planningVisual(es) {
 // Match the artwork slot in site.css and cap the mobile source at 480px.
 return `<figure class="planning-visual" aria-labelledby="planning-title"><figcaption id="planning-title">${es ? 'Concepto de planificación web' : 'Website planning concept'}</figcaption><div class="planning-composition"><picture><source media="(max-width: 800px)" srcset="/visuals/folded-glass-320.webp 320w, /visuals/folded-glass-480.webp 480w" sizes="min(calc(82vw - 1.64rem), 426px)"><img class="planning-artwork" src="/visuals/folded-glass-640.webp" srcset="/visuals/folded-glass-320.webp 320w, /visuals/folded-glass-480.webp 480w, /visuals/folded-glass-640.webp 640w" sizes="(max-width: 1100px) calc(44.1vw - 2.205rem), min(calc(44.1vw - 3.969rem), 541px)" width="640" height="640" alt="" decoding="async" fetchpriority="high"></picture><div class="coordinate-grid" aria-hidden="true"></div><svg class="planning-connections" viewBox="0 0 600 570" aria-hidden="true" focusable="false"><path d="M145 148H259L283 105H430M455 126V247L475 271V341M435 363H327L305 386V477H188"/></svg><ol class="planning-labels" aria-label="${es ? 'Etapas del proyecto' : 'Illustrated project stages'}" role="list"><li class="stage-plan"><span aria-hidden="true">01</span>Plan</li><li class="stage-content"><span aria-hidden="true">02</span>${es ? 'Contenido' : 'Content'}</li><li class="stage-build"><span aria-hidden="true">03</span>${es ? 'Desarrollo' : 'Build'}</li><li class="stage-review"><span aria-hidden="true">04</span>${es ? 'Revisión' : 'Review'}</li></ol></div><p class="planning-caption">${es ? 'Define las páginas, prepara el contenido, desarrolla el sitio y revísalo.' : 'Plan the pages, shape the content, build and review.'}<small>${es ? 'Ilustración conceptual de un proyecto web.' : 'Concept illustration — not a client project or a result.'}</small></p></figure>`;
}

export function pageLayout(page, fallback=false) {
 const es = page.lang === 'es';
 const home = es ? spanishHome : '/';
 const breadcrumb = [home,'/404'].includes(page.path) ? '' : `<p class="breadcrumbs"><a href="${home}">${es ? 'Inicio' : 'Home'}</a> <span aria-hidden="true">/</span> ${escape(page.heading)}</p>`;
 const isHero = !fallback && [home,'/services/website-development'].includes(page.path);
 const eyebrow = `<p class="eyebrow">MerkadAgency / ${es ? 'Marketing y CRM para talleres' : 'Marketing and CRM for automotive shops'}</p>`;
 if(isHero) {
  // Move the existing lead into the hero without changing, omitting or duplicating its copy.
  const match = /^(\s*<p class="intro">[\s\S]*?<\/p>\s*<a class="cta"[\s\S]*?<\/a>(?:\s*<p class="small">[\s\S]*?<\/p>)?)([\s\S]*)$/.exec(page.body);
  if(!match || match[1]+match[2]!==page.body)throw new Error('Public lead must preserve exact source copy');
  return `${breadcrumb}<section class="hero" aria-label="${es ? 'Presentación del servicio' : 'Service introduction'}"><div class="hero-copy">${eyebrow}${heading(page)}${copy(match[1])}</div>${planningVisual(es)}</section><div class="page-content">${copy(match[2])}</div>`;
 }
 return `${breadcrumb}<div class="page-heading">${eyebrow}${heading(page)}</div><div class="page-content reading-page">${copy(page.body)}</div>`;
}
