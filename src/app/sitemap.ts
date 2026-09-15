import { MetadataRoute } from 'next';
import { fetchProducts } from '@/core/api/products.api';

const SITE_URL = 'https://luxefragancias.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // /checkout is intentionally left out — it's disallowed in robots.ts,
    // so listing it here would just be a contradictory, wasted crawl entry.
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${SITE_URL}/coleccion`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    const products = await fetchProducts().catch(() => []);
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${SITE_URL}/perfume/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes];
}
