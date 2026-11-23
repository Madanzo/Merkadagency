import assert from 'node:assert/strict';
import {readFile,readdir,stat,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pages,origin,email} from '../../website/content.mjs';
const dir=process.argv[2] || 'dist-site';
const config=JSON.parse(await readFile('firebase.seo.json','utf8'));
assert.deepEqual(Object.keys(config),['hosting']);
assert.equal(config.hosting.site,'merkadagency-dd2aa');
assert.equal(config.hosting.public,'dist-site');
assert(!config.hosting.source && !config.hosting.frameworksBackend);
assert.deepEqual(config.hosting.rewrites,[{source:'/admin{,/**}',destination:'/private-app.html'},{source:'/sign/**',destination:'/private-app.html'}]);
const manifest=JSON.parse(await readFile(`${dir}/website-release.json`,'utf8'));
assert.equal(manifest.preview,dir==='dist-site-preview','Preview artifacts cannot be selected for live publication or fallback');
assert.equal(manifest.source,execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim());
assert.equal(manifest.hostingConfigSha256,createHash('sha256').update(await readFile('firebase.seo.json')).digest('hex'));
assert.equal(manifest.sourceTree,execFileSync('git',['rev-parse','HEAD^{tree}'],{encoding:'utf8'}).trim());
assert.equal(manifest.intake,false);assert.equal(manifest.analytics,false);assert.match(manifest.source,/^[a-f0-9]{40}$/);
const boundary=JSON.parse(await readFile(`${dir}/private-boundary.json`,'utf8'));
for(const entry of boundary.preserved)assert.equal(createHash('sha256').update(await readFile(dir+entry.path)).digest('hex'),entry.sha256);
assert.equal(createHash('sha256').update(await readFile(dir+boundary.privatePrimary.path)).digest('hex'),boundary.privatePrimary.sha256);
const privateRoutes = ['/admin{,/**}', '/sign{,/**}', '/private-app{,.html,/**}'];
const hosting = manifest.preview
 ? JSON.parse(await readFile('firebase.seo.preview.json','utf8')).hosting
 : config.hosting;
for (const route of privateRoutes) {
 assert(hosting.headers.some(rule => rule.source===route && rule.headers.some(
  ({key,value}) => key==='X-Robots-Tag' && value==='noindex,nofollow'
 )), `Missing noindex header for ${route}`);
}
assert.match(await readFile(`${dir}/private-app.html`,'utf8'), /<meta name="robots" content="noindex,nofollow">/);
const robots = await readFile(`${dir}/robots.txt`,'utf8');
assert.equal(/^Disallow: ./m.test(robots),manifest.preview,'Production crawlers must be able to see the private-route noindex directives');
const iconFiles = ['favicon.ico', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'favicon-192.png', 'favicon-512.png'];
const favicon = await readFile(`${dir}/favicon.png`);
assert(favicon.length < 4096,'Favicon exceeds 4 KiB');
assert.deepEqual(favicon,await readFile('public/favicon.png'));
let iconBytes = favicon.length;
for (const icon of iconFiles) {
 const asset = await readFile(`${dir}/${icon}`);
 assert.deepEqual(asset,await readFile(`public/${icon}`));
 iconBytes += asset.length;
}
assert(iconBytes < 50_000,'Favicon assets exceed 50 KB');
assert.deepEqual(await readFile(`${dir}/social-preview.jpg`),await readFile('public/social-preview.jpg'));
const titleSet=new Set(),descriptionSet=new Set();
assert.equal(await readFile(`${dir}/email-brief.js`,'utf8'),await readFile('website/email-brief.js','utf8'),'Optional clipboard asset must match the reviewed source exactly');
const emailScript='<script src="/email-brief.js" defer></script>';
for(const p of pages){
 const html=await readFile(`${dir}${p.path==='/'?'/index':p.path}.html`,'utf8');
 const recipients = [...html.matchAll(/href="mailto:([^"?]+)(?:[?"])/gi)].map(match => match[1]);
 assert.deepEqual([...new Set(recipients)],[email],`Unexpected email recipient on ${p.path}`);
 assert(html.includes(`<meta property="og:image" content="${origin}/social-preview.jpg">`));
 assert(html.includes('<meta name="twitter:card" content="summary_large_image">'));
 assert(html.includes(`<meta name="twitter:image" content="${origin}/social-preview.jpg">`));
 const title = /<title>(.*?)<\/title>/.exec(html)?.[1];
 const description = /<meta name="description" content="([^"]+)">/.exec(html)?.[1];
 assert(title && html.includes(`<meta property="og:title" content="${title}">`));
 assert(description && html.includes(`<meta property="og:description" content="${description}">`));
 for (const icon of iconFiles) assert(html.includes(`href="/${icon}">`));
 const heading=/<h1>([\s\S]*?)<\/h1>/.exec(html);assert(heading);assert.equal(heading[1].replace(/<[^>]*>/g,''),p.heading);
 const bodyChunks=[...html.matchAll(/<!--copy:start-->([\s\S]*?)<!--copy:end-->/g)].map(m=>m[1]).join('');
 assert.equal(bodyChunks,manifest.fallback&&['/services/website-development','/resources/website-brief'].includes(p.path)?`<p>MerkadAgency offers website development. For project information, email <a href="mailto:${email}">${email}</a>.</p><p><a href="/contact">Contact Camilo</a></p>`:p.body,'Every source body byte must be retained in initial HTML');
 for (const [image] of html.matchAll(/<(?:img|source)\b[^>]*>/g)) {
  for (const [, attribute, value] of image.matchAll(/\b(src|srcset)="([^"]+)"/g)) {
   const candidates = attribute === 'srcset' ? value.split(',').map(candidate => candidate.trim()) : [value];
   for (const candidate of candidates) {
    const [url, width] = candidate.split(/\s+/);
    assert(/^\/(?:favicon\.png|visuals\/folded-glass-(?:320|480|640)\.webp)$/.test(url),'Public artwork must be a retained local asset');
    if (attribute === 'srcset') assert.equal(width, url.match(/-(\d+)\.webp$/)?.[1] + 'w');
    assert((await stat(dir+url)).isFile(),'Public artwork must exist in the release');
   }
  }
 }
 assert(html.includes(`rel="canonical" href="${origin+p.path}"`));
 assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
 assert(html.includes(manifest.preview?'noindex,nofollow':'index,follow'));
 const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
 assert.equal((html.match(/<script\b/gi)||[]).length,scripts.length,'Every public script must have a complete reviewed tag');
 const executable=scripts.filter(match=>match[1]!==' type="application/ld+json"');
 assert.deepEqual(executable.map(match=>match[0]),p.path==='/contact'?[emailScript]:[],'Only the exact local clipboard helper on Contact is allowed');
 assert(!/<(?:form|input|iframe)\b|\son[a-z]+\s*=/i.test(html));
 assert(!/googletagmanager|clarity\.ms|cal\.com|turnstile|one year of free CRM|150-200%|Kravings|Teonanacatl|Grid.?N.?Guard/i.test(html));
 for(const match of html.matchAll(/href="(\/[^"#]*)"/g)){
  const href=match[1];assert((href==='/site.css'||iconFiles.includes(href.slice(1)))||pages.some(x=>x.path===href),`Broken internal link ${href}`);
 }
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))JSON.parse(match[1]);
 assert(!titleSet.has(p.title));titleSet.add(p.title);assert(!descriptionSet.has(p.description));descriptionSet.add(p.description);
}
const map=await readFile(`${dir}/sitemap.xml`,'utf8');assert.deepEqual([...map.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]),[...pages.map(p=>origin+p.path),origin+'/llms.txt']);
assert.deepEqual(await readFile(`${dir}/llms.txt`),await readFile('public/llms.txt'));
const notfound=await readFile(`${dir}/404.html`,'utf8');assert(notfound.includes('noindex,nofollow'));assert(!notfound.includes('rel="canonical"'));
const hash=createHash('sha256');const fileHashes=[];let count=0,bytes=0;
async function walk(path=''){for(const name of (await readdir(`${dir}/${path}`)).sort()){const key=path+name;const s=await stat(`${dir}/${key}`);if(s.isDirectory())await walk(key+'/');else{
 assert(!key.endsWith('.map'));const b=await readFile(`${dir}/${key}`);const text=b.toString();
 assert(!/googletagmanager\.com|clarity\.ms|Kravings|Teonanacatl|Grid.?N.?Guard|BEGIN PRIVATE KEY|sk_live_/i.test(text),`Disallowed content in ${key}`);
 hash.update(key+'\0');hash.update(b);fileHashes.push(createHash('sha256').update(b).digest('hex')+'  '+key);count++;bytes+=b.length;
}}}
await walk();await writeFile(`${dir}.sha256`,fileHashes.join('\n')+'\n');console.log(JSON.stringify({dir,source:manifest.source,intake:false,analytics:false,publicPages:pages.length,files:count,bytes,sha256:hash.digest('hex')},null,2));
