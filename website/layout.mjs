import {addressLine, contactLink, email} from './content.mjs';

const escape = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const navigation = [['/','Home'],['/services/marketing-for-wrap-shops','Wrap-shop marketing'],['/services/wrap-shop-crm','Wrap-shop CRM'],['/services/website-development','Website development'],['/resources/website-brief','Website brief'],['/contact','Contact']];
const copy = body => `<!--copy:start-->${body}<!--copy:end-->`;

export function header(path) {
 const links = navigation.map(([href,label])=>`<a href="${href}"${path===href?' aria-current="page"':''}>${label}</a>`).join('');
 return `<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="MerkadAgency home"><img src="/favicon.png" width="48" height="48" alt=""><span>MerkadAgency</span></a><nav aria-label="Main">${links}</nav><div class="header-contact">${contactLink}</div></div></header>`;
}

export function footer() {
 return `<footer class="site-footer"><div class="footer-inner"><div><p class="footer-brand">MerkadAgency <span>· Marketing and CRM for wrap shops</span></p><a href="mailto:${email}">${email}</a><p>${addressLine}</p></div><nav aria-label="Legal"><a href="/legal/privacy">Privacy</a><a href="/legal/terms">Website terms</a></nav></div></footer>`;
}

function heading(page) {
 const accent = page.path==='/' ? 'Follow up on wrap quotes.' : page.path==='/services/website-development' ? 'for wrap shops.' : '';
 return `<h1>${accent?escape(page.heading.slice(0,-accent.length))+`<span>${accent}</span>`:escape(page.heading)}</h1>`;
}

function planningVisual() {
 // Match the artwork slot in site.css and cap the mobile source at 480px.
 return `<figure class="planning-visual" aria-labelledby="planning-title"><figcaption id="planning-title">Website planning concept</figcaption><div class="planning-composition"><picture><source media="(max-width: 800px)" srcset="/visuals/folded-glass-320.webp 320w, /visuals/folded-glass-480.webp 480w" sizes="min(calc(82vw - 1.64rem), 426px)"><img class="planning-artwork" src="/visuals/folded-glass-640.webp" srcset="/visuals/folded-glass-320.webp 320w, /visuals/folded-glass-480.webp 480w, /visuals/folded-glass-640.webp 640w" sizes="(max-width: 1100px) calc(44.1vw - 2.205rem), min(calc(44.1vw - 3.969rem), 541px)" width="640" height="640" alt="" decoding="async" fetchpriority="high"></picture><div class="coordinate-grid" aria-hidden="true"></div><svg class="planning-connections" viewBox="0 0 600 570" aria-hidden="true" focusable="false"><path d="M145 148H259L283 105H430M455 126V247L475 271V341M435 363H327L305 386V477H188"/></svg><ol class="planning-labels" aria-label="Illustrated project stages" role="list"><li class="stage-plan"><span aria-hidden="true">01</span>Plan</li><li class="stage-content"><span aria-hidden="true">02</span>Content</li><li class="stage-build"><span aria-hidden="true">03</span>Build</li><li class="stage-review"><span aria-hidden="true">04</span>Review</li></ol></div><p class="planning-caption">Plan the pages, shape the content, build and review.<small>Concept illustration — not a client project or a result.</small></p></figure>`;
}

export function pageLayout(page, fallback=false) {
 const breadcrumb = ['/','/404'].includes(page.path)?'':`<p class="breadcrumbs"><a href="/">Home</a> <span aria-hidden="true">/</span> ${escape(page.heading)}</p>`;
 const isHero = !fallback && ['/','/services/website-development'].includes(page.path);
 const eyebrow = '<p class="eyebrow">MerkadAgency / Wrap-shop marketing and CRM</p>';
 if(isHero) {
  // Move the existing lead into the hero without changing, omitting or duplicating its copy.
  const match = /^(\s*<p class="intro">[\s\S]*?<\/p>\s*<a class="cta"[\s\S]*?<\/a>(?:\s*<p class="small">[\s\S]*?<\/p>)?)([\s\S]*)$/.exec(page.body);
  if(!match || match[1]+match[2]!==page.body)throw new Error('Public lead must preserve exact source copy');
  return `${breadcrumb}<section class="hero" aria-label="Service introduction"><div class="hero-copy">${eyebrow}${heading(page)}${copy(match[1])}</div>${planningVisual()}</section><div class="page-content">${copy(match[2])}</div>`;
 }
 return `${breadcrumb}<div class="page-heading">${eyebrow}${heading(page)}</div><div class="page-content reading-page">${copy(page.body)}</div>`;
}
