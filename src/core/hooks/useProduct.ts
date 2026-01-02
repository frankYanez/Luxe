'use client';

/**
 * useProduct Hook
 * Custom hook para obtener un producto individual de WooCommerce
 */

import { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { fetchProductBySlug } from '../api/products.api';

interface UseProductReturn {
    product: Product | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useProduct(slug: string): UseProductReturn {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        if (!slug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await fetchProductBySlug(slug);
            setProduct(data);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar producto');
            setError(error);
            console.error('Error in useProduct:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [slug]);

    return {
        product,
        loading,
        error,
        refetch: fetchData,
    };
}
