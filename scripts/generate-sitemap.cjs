const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');

async function generateSitemap() {
    const { sitemap } = await import('./seo/sitemap.mjs');
    const dist = path.resolve(__dirname, '../dist');
    await mkdir(dist, { recursive: true });
    const output = path.join(dist, 'sitemap.xml');
    await writeFile(output, sitemap());
    console.log(`Sitemap generated at ${output}`);
}

generateSitemap().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
