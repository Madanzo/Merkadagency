const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://merkadagency.com';

const routes = [
    '/',
    '/services',
    '/services/ai-lead-capture',
    '/services/crm-automation',
    '/services/seo-content',
    '/services/paid-advertising',
    '/industries',
    '/industries/medspas',
    '/industries/cannabis',
    '/industries/construction',
    '/industries/ecommerce',
    '/results',
    '/portfolio',
    '/case-studies',
    '/case-studies/kravings',
    '/case-studies/teonanacatl',
    '/case-studies/gridnguard',
    '/resources/free-audit',
    '/resources/roi-calculator',
    '/resources/medspa-automation-checklist',
    '/resources/cannabis-marketing-playbook',
    '/resources/contractor-lead-gen-guide',
    '/resources/ecommerce-automation-blueprint',
    '/about',
    '/about/method',
    '/book',
    '/contact',
    '/blog',
    '/legal/privacy',
    '/legal/terms'
];

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
