import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const env = { ...process.env, VITE_CONTACT_INTAKE_ENABLED: 'false', VITE_ANALYTICS_ENABLED: 'false' };
for (const args of [['node_modules/vite/bin/vite.js', 'build'], ['scripts/generate-sitemap.cjs']]) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
writeFileSync('dist/website-release.json', JSON.stringify({ intake: false, analytics: false, source: process.env.GITHUB_SHA || 'local' }, null, 2));
await import('./verify-website.mjs');
