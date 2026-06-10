/**
 * WooCommerce Products API Route
 * Server-side endpoint para fetch de productos
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/core/api/products.api';

export const revalidate = 60;
import type { Category } from '@/core/types/product';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category') as Category | 'all' | null;
        const featured = searchParams.get('featured') === 'true';

        const params = {
            ...(category && category !== 'all' && { category }),
            ...(featured && { featured }),
        };

        const products = await fetchProducts(params);

        return NextResponse.json(
            { success: true, data: products, count: products.length },
            { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
        );
    } catch (error) {
        console.error('API Route Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Error al obtener productos',
            },
            { status: 500 }
        );
    }
}
