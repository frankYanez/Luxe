'use client';

/**
 * useProducts Hook
 * Custom hook para obtener productos desde nuestra API interna
 */

import { useState, useEffect } from 'react';
import type { Product, Category } from '../types/product';

// Module-level cache — survives re-renders, deduplicates concurrent requests
const _cache = new Map<string, { data: Product[]; ts: number }>();
const _inflight = new Map<string, Promise<Product[]>>();
const TTL = 60_000;

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
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (featured) params.append('featured', 'true');
        const key = params.toString();

        // Return cached data instantly if fresh
        const cached = _cache.get(key);
        if (cached && Date.now() - cached.ts < TTL) {
            setProducts(cached.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Deduplicate concurrent fetches for the same key
            let promise = _inflight.get(key);
            if (!promise) {
                promise = fetch(`/api/products?${key}`)
                    .then(r => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json(); })
                    .then(result => {
                        if (!result.success) throw new Error(result.error || 'Error al cargar productos');
                        const data: Product[] = result.data || [];
                        _cache.set(key, { data, ts: Date.now() });
                        _inflight.delete(key);
                        return data;
                    })
                    .catch(err => { _inflight.delete(key); throw err; });
                _inflight.set(key, promise);
            }

            const data = await promise;
            setProducts(data);
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
