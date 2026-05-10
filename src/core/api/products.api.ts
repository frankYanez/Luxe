import { getServiceClient } from './supabase-client';
import type { Product, Category } from '../types/product';

function mapRow(row: any): Product {
    return {
        id:               String(row.id),
        slug:             row.slug,
        name:             row.name,
        brand:            row.brand,
        category:         row.category as Category,
        price:            Number(row.price),
        decantPrice:      row.decant_price ? Number(row.decant_price) : undefined,
        description:      row.description ?? '',
        shortDescription: row.short_description ?? '',
        image:            row.image ?? '',
        olfactoryNotes:   Array.isArray(row.olfactory_notes) ? row.olfactory_notes : [],
        inStock:          row.in_stock ?? true,
        featured:         row.featured ?? false,
        intensity:        row.intensity ?? 'moderada',
        longevity:        row.longevity ?? '',
    };
}

export async function fetchProducts(params?: {
    category?: Category;
    featured?: boolean;
    perPage?: number;
    page?: number;
}): Promise<Product[]> {
    const client = getServiceClient();
    let query = client
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

    if (params?.category) query = query.eq('category', params.category);
    if (params?.featured)  query = query.eq('featured', true);
    if (params?.perPage)   query = query.limit(params.perPage);

    const { data, error } = await query;
    if (error) { console.error('Supabase fetchProducts error:', error); return []; }
    return (data ?? []).map(mapRow);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    const client = getServiceClient();
    const { data, error } = await client
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
    if (error || !data) return null;
    return mapRow(data);
}

export async function fetchProductById(id: string): Promise<Product | null> {
    const client = getServiceClient();
    const { data, error } = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return mapRow(data);
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
    return fetchProducts({ featured: true });
}

export async function fetchProductsByCategory(category: Category): Promise<Product[]> {
    return fetchProducts({ category });
}
