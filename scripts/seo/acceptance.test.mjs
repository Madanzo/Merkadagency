import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat, mkdtemp, cp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pages } from '../../website/content.mjs';
const get = async (file,dir='dist-site') => readFile(`${dir}/${file}`,'utf8');
test('All public pages have useful initial HTML without JavaScript or tracking',async()=>{
 for(const p of pages){const html=await get(p.path==='/'?'index.html':p.path.slice(1)+'.html');assert.match(html,/<main[^>]*>[\s\S]*<h1>/);const withoutHelper=p.path==='/contact'?html.replace('<script src="/email-brief.js" defer></script>',''):html;assert(!/<script(?! type="application\/ld\+json")/.test(withoutHelper));assert(!/<(?:form|input|iframe)\b/.test(html));}
 assert((await get('resources/website-brief.html')).length>7000);
});
test('Compatible fallback keeps routes and disabled features without new long-form copy',async()=>{
 const manifest=JSON.parse(await get('website-release.json','dist-rollback'));assert(manifest.fallback);assert.equal(manifest.intake,false);assert.equal(manifest.analytics,false);
 for(const p of pages)assert((await get(p.path==='/'?'index.html':p.path.slice(1)+'.html','dist-rollback')).includes('camiloreyna@merkadagency.com'));
 assert(!(await get('resources/website-brief.html','dist-rollback')).includes('Inventory the existing site'));
 execFileSync('node',['scripts/seo/verify.mjs','dist-rollback']);
});
test('Only retained URLs are emitted; obsolete proof and resources cannot be fetched from this artifact',async()=>{
 assert.deepEqual((await readdir('dist-site/resources')),['website-brief.html']);
 assert(!((await readdir('dist-site')).includes('case-studies')));
 const errorPage = await get('404.html');
 assert.match(errorPage, /noindex,nofollow/);
 assert.match(errorPage, /<meta http-equiv="Content-Security-Policy" content="default-src 'none';/);
 assert.match(errorPage, /<main id="main" tabindex="-1">[\s\S]*?<h1>This page is not available\.<\/h1>/);
 assert.match(errorPage, /<main[\s\S]*?href="\/services\/website-development"[\s\S]*?href="\/contact"[\s\S]*?<\/main>/);
 assert.doesNotMatch(errorPage, /<script\b|rel="canonical"/);
});
test('Hero artwork fits the mobile and desktop page-weight budgets', async () => {
 for (const [width, budget] of [[480, 16_000], [640, 24_000]]) {
  const file = await stat(`dist-site/visuals/folded-glass-${width}.webp`);
  assert(file.size <= budget, `${width}px artwork exceeds ${budget} bytes`);
 }
});

test('Preview and production enforce the same security policy on public documents only', async () => {
 const configs = await Promise.all(['firebase.seo.json', 'firebase.seo.preview.json'].map(async file =>
  JSON.parse(await readFile(file, 'utf8')).hosting.headers.filter(rule =>
   rule.headers.some(header => header.key === 'Content-Security-Policy'))));
 assert.equal(configs[0].length, 1);
 assert.deepEqual(configs[0], configs[1]);
 const [rule] = configs[0];
 const matches = new RegExp(rule.regex);
 for (const path of [...pages.map(page => page.path), '/index.html', '/404']) {
  assert(matches.test(path), `Missing public security headers on ${path}`);
  if (path !== '/') assert(matches.test(path + (path.endsWith('.html') ? '' : '.html')));
 }
 for (const path of ['/admin', '/admin/quotes', '/sign/example', '/private-app.html', '/assets/app.js']) {
  assert(!matches.test(path), `Public document policy matched ${path}`);
 }
 const headers = Object.fromEntries(rule.headers.map(({key, value}) => [key, value]));
 for (const directive of ["default-src 'none'", "form-action 'none'", "frame-ancestors 'self'"]) {
  assert(headers['Content-Security-Policy'].split('; ').includes(directive));
 }
 assert.match(headers['Permissions-Policy'], /payment=\(\)/);
});

test('Review branch pushes cannot publish; main checks are independent of release dispatch',async()=>{
 const release=await readFile('.github/workflows/firebase-deploy.yml','utf8');
 assert(release.includes('workflow_dispatch:'));assert(!/^  (push|pull_request):/m.test(release));assert(release.includes('node scripts/seo/publish.mjs'));assert(release.includes('origin/main'));
 const review=await readFile('.github/workflows/seo-review.yml','utf8');assert(review.includes('branches: [main, codex/seo-informational-oct20]'));assert(!review.includes('deploy --'));
});

test('Publication verification rejects a preview artifact',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'merkad-preview-rejection-'));
 try {
  await cp('dist-site',temp,{recursive:true});
  const manifest=JSON.parse(await readFile(join(temp,'website-release.json'),'utf8'));
  manifest.preview=true;
  await writeFile(join(temp,'website-release.json'),JSON.stringify(manifest));
  assert.throws(()=>execFileSync('node',['scripts/seo/verify.mjs',temp],{stdio:'pipe'}),error=>error.stderr.toString().includes('Preview artifacts cannot be selected'));
 } finally { await rm(temp,{recursive:true,force:true}); }
});

test('Publication rejects unreviewed scripts, helper on another page, and a changed clipboard payload',async()=>{
 for(const kind of ['extra-script','wrong-page','changed-helper']){
  const temp=await mkdtemp(join(tmpdir(),'merkad-script-rejection-'));
  try{
   await cp('dist-site',temp,{recursive:true});
   if(kind==='changed-helper')await writeFile(join(temp,'email-brief.js'),'throw new Error("unreviewed");');
   else{const file=join(temp,kind==='wrong-page'?'index.html':'contact.html');const html=await readFile(file,'utf8');await writeFile(file,html.replace('</body>',(kind==='wrong-page'?'<script src="/email-brief.js" defer></script>':'<script src="https://unreviewed.invalid/script.js"></script>')+'</body>'));}
   assert.throws(()=>execFileSync('node',['scripts/seo/verify.mjs',temp],{stdio:'pipe'}));
  }finally{await rm(temp,{recursive:true,force:true});}
 }
});
