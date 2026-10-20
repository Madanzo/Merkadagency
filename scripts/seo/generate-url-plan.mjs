import {readFile,writeFile}from 'node:fs/promises';
import {pages}from '../../website/content.mjs';
const baseline=JSON.parse(await readFile('website/private-baseline/manifest.json','utf8'));
const current=new Set(pages.map(p=>p.path));
const privatePaths=new Set(baseline.privateRoutes);
const preserved=new Set(['/assets/index-DxLjU7W-.css','/assets/html2canvas.esm-QH1iLAAe.js','/assets/purify.es-B9ZVCkUG.js','/favicon.png']);
const sources=new Set([...baseline.liveRouterPaths,...baseline.versionFiles.map(f=>f.path),...current]);
const rows=[...sources].map(path=>{
 let result,reason;
 if(path==='/services'){result='301 → /services/website-development';reason='One commercial service URL';}
 else if(path==='/book'){result='302 → /contact';reason='Email-only contact; scheduling withheld';}
 else if(privatePaths.has(path)){result='200 private shell';reason='Retained route, auth/signing behavior isolated and verified';}
 else if(path.startsWith('/__/')){result='Platform-managed reserved endpoint';reason='Not a new static artifact file; not loaded by informational pages';}
 else if(current.has(path)){result='200 static HTML';reason=baseline.liveRouterPaths.includes(path)?'Approved informational replacement':'New distinct service or educational intent';}
 else if(preserved.has(path)){result='200 identical live bytes';reason='Fingerprint enforced by build';}
 else if(path==='/robots.txt'||path==='/sitemap.xml'){result='200 replaced';reason='Six informational destinations; private exclusions';}
 else if(path==='/index.html'){result='301 → /';reason='Hosting cleanUrls canonical root';}
 else {result='404 safe noindex';reason=path==='*'?'All other application URLs, except Hosting reserved and private rewrite patterns':'Retired unsupported content or incompatible legacy asset';}
 return {path,result,reason};
});
const additional=[
 {path:'/admin/** and /sign/** outside the three named routes',result:'200 noindex private fallback',reason:'Existing private rewrite scopes; React renders only a return-to-website link for unmatched paths'},
 {path:'/private-app.html',result:'301 → /private-app',reason:'cleanUrls alias; noindex shell, fallback link outside named private routes'},
 {path:'/private-app',result:'200 noindex shell',reason:'Private named routes only; no public marketing'},
 {path:'/website-release.json',result:'200 release metadata',reason:'Source/OFF/config hashes, no secret values'},
 {path:'/private-boundary.json',result:'200 boundary metadata',reason:'Non-sensitive fingerprints only'},
 {path:'/site.css',result:'200 informational stylesheet',reason:'Self-hosted'},
 {path:'/{six retained pages}.html',result:'301 → extensionless canonical',reason:'Hosting cleanUrls; /index.html → /'},
 {path:'/{retained URL}/',result:'301 → URL without trailing slash',reason:'Hosting trailingSlash:false'},
 {path:'/assets/{new-private-primary,new-private-PDF}.js',result:'200 source-pinned generated files',reason:'Old primary cannot be preserved with OFF/proof requirements; old PDF imports it'},
 {path:'/__/auth/* and other Hosting reserved URLs',result:'Platform-managed',reason:'Not overridden; existing Firebase Auth hosting behavior retained'},
];
await writeFile('docs/seo-oct20/evidence/complete-url-plan.json',JSON.stringify({baselineVersion:baseline.version,rows,additional},null,2)+'\n');
await writeFile('docs/seo-oct20/URL-PLAN.md','# Complete public URL and asset disposition\n\nProposed only; wording and retirements require Camilo approval. Includes all 34 captured live-router patterns and all 16 version-file paths, deduplicated. Reserved Hosting endpoints are distinguished from application 404s. No customer story is republished by listing a retired URL.\n\n| URL/path | Candidate response | Reason |\n|---|---|---|\n'+[...rows,...additional].map(r=>`| \`${r.path}\` | ${r.result} | ${r.reason} |`).join('\n')+'\n\nBoth candidate and compatible fallback use this same configuration. Old copies in browser caches cannot be revoked by this release.\n');
console.log(`URL plan: ${rows.length} explicit existing/new paths plus ${additional.length} alias/platform/generated-file rules.`);
