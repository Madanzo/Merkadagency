import { build } from 'vite';
import { mkdir, readFile, writeFile, rm, cp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { pages, origin } from '../../website/content.mjs';
const preview = process.argv.includes('--preview');
const dirty = execFileSync('git', ['status','--porcelain','--untracked-files=all'], {encoding:'utf8'}).trim();
if (dirty) throw new Error('Commit the reviewable source and evidence before building a release artifact');
const source = execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim();
if (process.env.GITHUB_SHA && process.env.GITHUB_SHA !== source) throw new Error('Build SHA differs from checked-out source');
process.env.VITE_CONTACT_INTAKE_ENABLED = 'false';
process.env.VITE_ANALYTICS_ENABLED = 'false';
await build({configFile:'website/private.config.mjs'});
const escape = x => x.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const nav = '<nav aria-label="Main"><a href="/services/website-development">Website development</a><a href="/resources/website-brief">Website brief</a><a href="/contact">Contact</a></nav>';
function html(page, fallback = false) {
 const schema = [{ '@context':'https://schema.org','@type':'Organization',name:'MerkadAgency',url:origin,email:'camiloreyna@merkadagency.com' }];
 if(page.path === '/services/website-development') schema.push({'@context':'https://schema.org','@type':'Service',name:'Website development',serviceType:'Website development',url:origin+page.path,provider:{'@type':'Organization',name:'MerkadAgency',url:origin}});
 if(page.path !== '/' && page.path !== '/404') schema.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'MerkadAgency',item:origin+'/'},{'@type':'ListItem',position:2,name:page.heading,item:origin+page.path}]});
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="${preview || page.path==='/404' ? 'noindex,nofollow' : 'index,follow'}">${page.path==='/404' ? '' : `<link rel="canonical" href="${origin+page.path}">`}<meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${origin+page.path}"><meta property="og:type" content="website"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script></head><body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="/">MerkadAgency</a>${nav}</header><main id="main" tabindex="-1">${page.path==='/' ? '' : '<p class="breadcrumbs"><a href="/">Home</a> / '+escape(page.heading)+'</p>'}<p class="eyebrow">Website development</p><h1>${escape(page.heading)}</h1>${page.body}</main><footer><p>MerkadAgency · Website development</p><a href="mailto:camiloreyna@merkadagency.com">camiloreyna@merkadagency.com</a><nav aria-label="Legal"><a href="/legal/privacy">Privacy</a><a href="/legal/terms">Website terms</a></nav></footer></body></html>`;
}
const outputs = preview ? [['dist-site-preview',false]] : [['dist-site',false],['dist-rollback',true]];
for (const [dir, fallback] of outputs) {
 await rm(dir,{recursive:true,force:true}); await mkdir(dir,{recursive:true});
 await cp('dist-private/assets',`${dir}/assets`,{recursive:true});
 await cp('dist-private/website/private.html',`${dir}/private-app.html`);
 await cp('website/site.css',`${dir}/site.css`);
 for (const page of pages) {
   const output = page.path==='/' ? `${dir}/index.html` : `${dir}${page.path}.html`;
   await mkdir(output.slice(0,output.lastIndexOf('/')),{recursive:true});
   // Compatible fallback retains all approved URLs, email-only contact and no tracking.
   // It omits the new detailed service/guide copy while preserving truthful destinations.
   const safePage = fallback && ['/services/website-development','/resources/website-brief'].includes(page.path)
     ? {...page,body:'<p>MerkadAgency offers website development. For project information, email <a href="mailto:camiloreyna@merkadagency.com">camiloreyna@merkadagency.com</a>.</p><p><a href="/contact">Contact Camilo</a></p>'} : page;
   await writeFile(output,html(safePage,fallback));
 }
 await writeFile(`${dir}/404.html`,html({path:'/404',title:'Page Not Available | MerkadAgency',description:'This page is not available. Explore website development or contact MerkadAgency by email.',heading:'This page is not available.',body:'<p>Find current information about <a href="/services/website-development">website development</a>, or <a href="/contact">contact Camilo by email</a>.</p>'}));
 await writeFile(`${dir}/robots.txt`,preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /sign/\nDisallow: /private-app.html\n\nSitemap: ${origin}/sitemap.xml\n`);
 await writeFile(`${dir}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${origin+p.path}</loc></url>`).join('')}</urlset>\n`);
 await writeFile(`${dir}/website-release.json`,JSON.stringify({source,intake:false,analytics:false,preview,fallback,publicRoutes:pages.map(p=>p.path)},null,2)+'\n');
}
console.log(`Static public site and compatible fallback built from ${source}; intake=false analytics=false preview=${preview}`);
