'use client';

/**
 * useProducts Hook
 * Custom hook para obtener productos desde nuestra API interna
 */

import { useState, useEffect } from 'react';
import type { Product, Category } from '../types/product';

interface UseProductsOptions {
    category?: Category | 'all';
    featured?: boolean;
    autoFetch?: boolean;
}

interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
    const { category = 'all', featured, autoFetch = true } = options;

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Construir query params
            const params = new URLSearchParams();
            if (category && category !== 'all') {
                params.append('category', category);
            }
            if (featured) {
                params.append('featured', 'true');
            }

            // Fetch desde nuestra API interna (que llama a WooCommerce server-side)
            const response = await fetch(`/api/products?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Error al cargar productos');
            }

            setProducts(result.data || []);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cargar productos');
            setError(error);
            console.error('Error in useProducts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [category, featured, autoFetch]);

    return {
        products,
        loading,
        error,
        refetch: fetchData,
    };
}
