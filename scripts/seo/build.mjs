import { build } from 'vite';
import { mkdir, readFile, writeFile, rm, cp } from 'node:fs/promises';
import {createHash} from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {verifyPrivate} from './verify-private.mjs';
import { address, contactLink, pages, origin, email } from '../../website/content.mjs';
import {header,footer,pageLayout} from '../../website/layout.mjs';
const preview = process.argv.includes('--preview');
const dirty = execFileSync('git', ['status','--porcelain','--untracked-files=all'], {encoding:'utf8'}).trim();
if (dirty) throw new Error('Commit the reviewable source and evidence before building a release artifact');
const source = execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim();
if (process.env.GITHUB_SHA && process.env.GITHUB_SHA !== source) throw new Error('Build SHA differs from checked-out source');
process.env.VITE_CONTACT_INTAKE_ENABLED = 'false';
process.env.VITE_ANALYTICS_ENABLED = 'false';
await build({configFile:'website/private.config.mjs'});
await cp('website/private-baseline/assets/index-DxLjU7W-.css','dist-private/assets/index-DxLjU7W-.css');
await cp('public/favicon.png','dist-private/favicon.png');
const privateFile='dist-private/website/private.html';
const privateHTML=(await readFile(privateFile,'utf8')).replace('</head>','<link rel="stylesheet" href="/assets/index-DxLjU7W-.css"></head>');
await writeFile(privateFile,privateHTML);
await verifyPrivate();
const hostingConfigSha256=createHash('sha256').update(await readFile('firebase.seo.json')).digest('hex');
const sourceTree=execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim();
const escape = x => x.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const iconFiles = ['favicon.ico', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'favicon-192.png', 'favicon-512.png'];
const iconLinks = '<link rel="icon" type="image/x-icon" sizes="16x16 32x32" href="/favicon.ico"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png"><link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png">';
function html(page, fallback = false) {
 const notFound = page.path === '/404';
 // Hosting matches headers against the requested URL, so unknown paths need a document-level policy.
 const errorPolicy = notFound ? `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'">` : '';
 const mobileContact = ['/services/website-development','/contact'].includes(page.path);
 const organization = {
  '@context':'https://schema.org',
  '@type':'Organization',
  '@id':origin+'/#organization',
  name:'MerkadAgency',
  url:origin,
  email,
  address:{'@type':'PostalAddress',...address},
 };
 const websiteOffer = {
  '@type':'Offer',
  name:'Website development',
  url:origin+'/services/website-development',
  priceSpecification:{'@type':'PriceSpecification',minPrice:500,priceCurrency:'USD'},
 };
 const crmOffer = {
  '@type':'Offer',
  name:'Wrap-shop CRM license',
  url:origin+'/services/wrap-shop-crm',
  priceSpecification:[
   {'@type':'UnitPriceSpecification',name:'Setup',price:1500,priceCurrency:'USD'},
   {'@type':'UnitPriceSpecification',name:'Monthly license',price:800,priceCurrency:'USD',unitCode:'MON'},
  ],
 };
 const schema = [organization];
 const offers = {
  '/':[websiteOffer,crmOffer],
  '/services/marketing-for-wrap-shops':[websiteOffer],
  '/services/wrap-shop-crm':[crmOffer],
  '/services/website-development':fallback ? [] : [websiteOffer],
 };
 if (offers[page.path]) {
  schema[0] = {
   ...organization,
   '@type':['Organization','ProfessionalService'],
   description:'Marketing, website development and CRM for vehicle wrap shops.',
   ...(offers[page.path].length ? {makesOffer:offers[page.path]} : {}),
  };
 }
 if(page.path === '/services/website-development') {
  schema.push({'@context':'https://schema.org','@type':'Service',name:'Website development',serviceType:'Website development',url:origin+page.path,provider:{'@id':organization['@id']}});
 }
 if(page.path !== '/' && page.path !== '/404') schema.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'MerkadAgency',item:origin+'/'},{'@type':'ListItem',position:2,name:page.heading,item:origin+page.path}]});
 return `<!doctype html><html lang="en"><head><meta charset="utf-8">${errorPolicy}<meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="${preview || page.path==='/404' ? 'noindex,nofollow' : 'index,follow'}">${page.path==='/404' ? '' : `<link rel="canonical" href="${origin+page.path}">`}<meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${origin+page.path}"><meta property="og:type" content="website"><meta property="og:image" content="${origin}/social-preview.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="MerkadAgency · Website development"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${origin}/social-preview.jpg"><meta name="twitter:image:alt" content="MerkadAgency · Website development">${iconLinks}<link rel="stylesheet" href="/site.css">${notFound ? '' : `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`}</head><body><a class="skip" href="#main">Skip to content</a>${header(page.path)}<main id="main" tabindex="-1">${pageLayout(page,fallback)}${mobileContact ? `<div class="mobile-contact">${contactLink}</div>` : ''}</main>${footer()}${page.path==='/contact'?'<script src="/email-brief.js" defer></script>':''}</body></html>`;
}
const outputs = preview ? [['dist-site-preview',false]] : [['dist-site',false],['dist-rollback',true]];
for (const [dir, fallback] of outputs) {
 await rm(dir,{recursive:true,force:true}); await mkdir(dir,{recursive:true});
 await cp('dist-private/assets',`${dir}/assets`,{recursive:true});
 await cp('dist-private/website/private.html',`${dir}/private-app.html`);
 await cp('dist-private/favicon.png',`${dir}/favicon.png`);
 for (const icon of iconFiles) await cp(`public/${icon}`,`${dir}/${icon}`);
 await cp('public/social-preview.jpg',`${dir}/social-preview.jpg`);
 await cp('dist-private/private-boundary.json',`${dir}/private-boundary.json`);
 await cp('public/llms.txt',`${dir}/llms.txt`);
 await cp('website/site.css',`${dir}/site.css`);
 await cp('website/email-brief.js',`${dir}/email-brief.js`);
 await cp('website/visuals',`${dir}/visuals`,{recursive:true});
 for (const page of pages) {
   const output = page.path==='/' ? `${dir}/index.html` : `${dir}${page.path}.html`;
   await mkdir(output.slice(0,output.lastIndexOf('/')),{recursive:true});
   // Compatible fallback retains all approved URLs, email-only contact and no tracking.
   // It omits the new detailed service/guide copy while preserving truthful destinations.
   const safePage = fallback && ['/services/website-development','/resources/website-brief'].includes(page.path)
     ? {...page,body:`<p>MerkadAgency offers website development. For project information, email <a href="mailto:${email}">${email}</a>.</p><p><a href="/contact">Contact Camilo</a></p>`} : page;
   await writeFile(output,html(safePage,fallback));
 }
 await writeFile(`${dir}/404.html`,html({path:'/404',title:'Page Not Available | MerkadAgency',description:'This page is not available. Explore website development or contact MerkadAgency by email.',heading:'This page is not available.',body:'<p>Find current information about <a href="/services/website-development">website development</a>, or <a href="/contact">contact Camilo by email</a>.</p>'}));
 await writeFile(`${dir}/robots.txt`,preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /sign/\nDisallow: /private-app$\nDisallow: /private-app.html\nDisallow: /private-boundary.json\nDisallow: /website-release.json\n\nSitemap: ${origin}/sitemap.xml\n`);
 await writeFile(`${dir}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${origin+p.path}</loc></url>`).join('')}<url><loc>${origin}/llms.txt</loc></url></urlset>\n`);
 await writeFile(`${dir}/website-release.json`,JSON.stringify({source,sourceTree,hostingConfigSha256,intake:false,analytics:false,preview,fallback,publicRoutes:pages.map(p=>p.path)},null,2)+'\n');
}
console.log(`Static public site and compatible fallback built from ${source}; intake=false analytics=false preview=${preview}`);
