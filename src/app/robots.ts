import { MetadataRoute } from 'next';

const SITE_URL = 'https://luxefragancias.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/checkout'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
