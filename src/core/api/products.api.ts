/**
 * Products API
 * Funciones para interactuar con la API de productos de WooCommerce
 */

import { getWooClient, buildWooParams } from './woocommerce-client';
import type { WCProduct } from '../types/woocommerce';
import type { Product, Category } from '../types/product';
import { mapWooProducts, mapWooProductToProduct } from '../utils/wc-mapper';

/**
 * Obtiene todos los productos de WooCommerce
 */
export async function fetchProducts(params?: {
    category?: Category;
    featured?: boolean;
    perPage?: number;
    page?: number;
}): Promise<Product[]> {
    try {
        const client = getWooClient();



        const queryParams = buildWooParams({
            per_page: params?.perPage || 100,
            page: params?.page || 1,
            status: 'publish',
            ...(params?.featured && { featured: true }),
        });

        const response = await client.get<WCProduct[]>('/products', {
            params: queryParams,
        });

        let products = mapWooProducts(response.data);

        // Filtrar por categoría si se especifica
        if (params?.category) {
            products = products.filter(p => p.category === params.category);
        }

        return products;
    } catch (error) {
        console.error('Error fetching products from WooCommerce:', error);
        // Retornar array vacío en caso de error para evitar crashes
        return [];
    }
}

/**
 * Obtiene un producto por su ID o slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
    try {
        const client = getWooClient();

        // Primero intentar buscar por slug
        const response = await client.get<WCProduct[]>('/products', {
            params: { slug, per_page: 1 },
        });

        if (response.data.length === 0) {
            console.warn(`Producto con slug "${slug}" no encontrado`);
            return null;
        }

        return mapWooProductToProduct(response.data[0]);
    } catch (error) {
        console.error(`Error fetching product ${slug}:`, error);
        return null;
    }
}

/**
 * Obtiene un producto por su ID numérico
 */
export async function fetchProductById(id: number): Promise<Product | null> {
    try {
        const client = getWooClient();
        const response = await client.get<WCProduct>(`/products/${id}`);
        return mapWooProductToProduct(response.data);
    } catch (error) {
        console.error(`Error fetching product ID ${id}:`, error);
        return null;
    }
}

/**
 * Obtiene productos destacados
 */
export async function fetchFeaturedProducts(): Promise<Product[]> {
    return fetchProducts({ featured: true });
}

/**
 * Obtiene productos por categoría
 */
export async function fetchProductsByCategory(category: Category): Promise<Product[]> {
    return fetchProducts({ category });
}
