const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://merkadagency.com';

// Keep the route inventory shared with browser metadata. Review-only content
// remains reachable, but is not advertised to search engines before approval.
const titles = require('../src/pages/public/route-titles.json');
const reviewOnlyRoutes = require('../src/pages/public/review-only-routes.json');
const routes = Object.keys(titles).filter(route => !reviewOnlyRoutes.includes(route));

const generateSitemap = () => {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
            .map(route => {
                return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
            })
            .join('\n')}
</urlset>`;

    // Write to dist folder to ensure it exists in the final build artifact
    const outputPath = path.resolve(__dirname, '../dist/sitemap.xml');

    // Ensure dist directory exists
    const distDir = path.dirname(outputPath);
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated at ${outputPath}`);
};

generateSitemap();
