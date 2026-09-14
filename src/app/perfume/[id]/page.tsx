import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductById } from '@/core/api/products.api';
import { ProductDetail } from '@/features/products/ProductDetail';
import videos from '@/core/data/product-videos.json';

export const dynamic = 'force-dynamic';
const getProduct = cache(async (id: string) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
    return fetchProductById(id);
});
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const product = await getProduct((await params).id);
    if (!product) return { title: 'Perfume no encontrado', robots: { index: false } };
    return {
        title: `${product.name} de ${product.brand}`,
        description: product.shortDescription || product.description,
        alternates: { canonical: `/perfume/${product.id}` },
        openGraph: { title: product.name, description: product.shortDescription || product.description, images: product.image ? [product.image] : [] },
    };
}

export default async function PerfumePage({ params }: Props) {
    const product = await getProduct((await params).id);
    if (!product) notFound();
    return <ProductDetail key={product.id} product={product} videoSrc={(videos as Record<string, string>)[product.id]} />;
}
