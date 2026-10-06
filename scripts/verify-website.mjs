import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
const walk = dir => readdirSync(dir).flatMap(name => { const path = `${dir}/${name}`; return statSync(path).isDirectory() ? walk(path) : [path]; });
const files = walk('dist');
const marker = JSON.parse(readFileSync('dist/website-release.json', 'utf8'));
if (marker.intake !== false || marker.analytics !== false) throw new Error('Activation gates must be OFF');
const forbidden = /turnstile\/v0|contact-intake\/config|googletagmanager|clarity\.ms|google-analytics\.com|Kravings|Teonanacatl|Grid N Guard/i;
for (const path of files) {
  if (/\.(js|html|json|xml|css|txt)$/.test(path) && forbidden.test(readFileSync(path, 'utf8'))) throw new Error(`Unapproved runtime content in ${path}`);
  if (/\.map$|acceptance|axe\.min|fixture/i.test(path)) throw new Error(`Non-release artifact: ${path}`);
}
const digest = createHash('sha256');
for (const path of files.sort()) digest.update(path).update(readFileSync(path));
console.log(`Verified website-only artifact: ${files.length} files; intake OFF; analytics OFF; SHA256 ${digest.digest('hex')}`);
