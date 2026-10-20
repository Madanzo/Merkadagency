import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, cp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pages } from '../../website/content.mjs';
const get = async (file,dir='dist-site') => readFile(`${dir}/${file}`,'utf8');
test('All public pages have useful initial HTML without JavaScript or tracking',async()=>{
 for(const p of pages){const html=await get(p.path==='/'?'index.html':p.path.slice(1)+'.html');assert.match(html,/<main[^>]*>[\s\S]*<h1>/);assert(!/<script(?! type="application\/ld\+json")/.test(html));assert(!/<(?:form|input|iframe)\b/.test(html));}
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
 assert.match(await get('404.html'),/noindex,nofollow/);
});
test('Review branch pushes cannot publish; main checks are independent of release dispatch',async()=>{
 const release=await readFile('.github/workflows/firebase-deploy.yml','utf8');
 assert(release.includes('workflow_dispatch:'));assert(!/^  (push|pull_request):/m.test(release));assert(release.includes('--config firebase.seo.json'));assert(release.includes('origin/main'));
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
