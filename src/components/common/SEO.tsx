import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    image?: string;
}

export function SEO({ title, description, canonical, image }: SEOProps) {
    const siteTitle = 'MerkadAgency';
    const fullTitle = `${title} | ${siteTitle}`;

    // Ensure absolute URL for social images
    const siteUrl = 'https://merkadagency.com';
    const defaultImage = `${siteUrl}/favicon.png`;
    const ogImage = image
        ? (image.startsWith('http') ? image : `${siteUrl}${image}`)
        : defaultImage;

    // Default canonical to current URL if not provided
    const url = canonical || window.location.href;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
}
