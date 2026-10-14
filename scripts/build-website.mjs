import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
const env = { ...process.env, VITE_CONTACT_INTAKE_ENABLED: 'false', VITE_ANALYTICS_ENABLED: 'false' };
for (const args of [['node_modules/vite/bin/vite.js', 'build'], ['scripts/generate-sitemap.cjs']]) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
// Vite 5 rewrites link href, but not imagesrcset. Resolve those source paths
// against emitted bytes so responsive preloads cannot point at missing files.
const assets = readdirSync('dist/assets').filter(name => name.endsWith('.webp'));
const html = readFileSync('dist/index.html', 'utf8').replace(
  /\/src\/pages\/concepts\/assets\/(folded-glass-artwork(?:-(?:480|640|960))?)\.webp/g,
  (_match, stem) => {
    const original = readFileSync(`src/pages/concepts/assets/${stem}.webp`);
    const emitted = assets.find(name => readFileSync(`dist/assets/${name}`).equals(original));
    if (!emitted) throw new Error(`Missing emitted artwork: ${stem}`);
    return `/assets/${emitted}`;
  },
);
writeFileSync('dist/index.html', html);
writeFileSync('dist/website-release.json', JSON.stringify({ intake: false, analytics: false, source: process.env.GITHUB_SHA || 'local' }, null, 2));
await import('./verify-website.mjs');
