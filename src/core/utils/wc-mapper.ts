/**
 * WooCommerce to Internal Product Mapper
 * Convierte productos de WooCommerce a nuestro formato interno
 */

import type { WCProduct, WCMetaData } from '../types/woocommerce';
import type { Product, OlfactoryNote, Category } from '../types/product';

/**
 * Extrae el valor de un meta field de WooCommerce
 */
function getMetaValue(metaData: WCMetaData[], key: string): string {
    const meta = metaData.find(m => m.key === key);
    return meta ? String(meta.value) : '';
}

/**
 * Parsea notas olfativas desde un string separado por comas
 */
function parseNotes(notesString: string): string[] {
    if (!notesString) return [];
    return notesString.split(',').map(note => note.trim()).filter(Boolean);
}

/**
 * Mapea categoría de WooCommerce a nuestro formato
 */
function mapCategory(wcCategories: any[]): Category {
    if (!wcCategories || wcCategories.length === 0) {
        return 'unisex';
    }

    const categoryName = wcCategories[0].name.toLowerCase();

    if (categoryName.includes('masculino') || categoryName.includes('hombre')) {
        return 'masculino';
    }
    if (categoryName.includes('femenino') || categoryName.includes('mujer')) {
        return 'femenino';
    }
    return 'unisex';
}

/**
 * Convierte precio de WooCommerce a número
 */
function parsePrice(priceString: string): number {
    const price = parseFloat(priceString);
    return isNaN(price) ? 0 : price;
}

/**
 * Mapea un producto de WooCommerce a nuestro formato interno
 */
export function mapWooProductToProduct(wcProduct: WCProduct): Product {
    const metaData = wcProduct.meta_data || [];

    // Extraer notas olfativas de custom fields
    const salidaString = getMetaValue(metaData, '_olfactory_notes_salida');
    const corazonString = getMetaValue(metaData, '_olfactory_notes_corazon');
    const fondoString = getMetaValue(metaData, '_olfactory_notes_fondo');

    const olfactoryNotes: OlfactoryNote[] = [
        {
            type: 'salida',
            notes: parseNotes(salidaString),
        },
        {
            type: 'corazon',
            notes: parseNotes(corazonString),
        },
        {
            type: 'fondo',
            notes: parseNotes(fondoString),
        },
    ].filter(note => note.notes.length > 0);

    // Extraer marca desde atributos o meta data
    const brand = getMetaValue(metaData, '_brand') ||
        wcProduct.attributes.find(attr => attr.name.toLowerCase() === 'brand')?.options[0] ||
        'Luxe Essence';

    // Extraer precio de decant
    const decantPriceString = getMetaValue(metaData, '_decant_price');
    const decantPrice = decantPriceString ? parsePrice(decantPriceString) : undefined;

    // Intensidad y longevidad
    const intensity = getMetaValue(metaData, '_intensity') as Product['intensity'] || 'moderada';
    const longevity = getMetaValue(metaData, '_longevity') || '6-8 horas';

    // Imagen principal
    const mainImage = wcProduct.images && wcProduct.images.length > 0
        ? wcProduct.images[0].src
        : '/images/products/placeholder.jpg';

    return {
        id: String(wcProduct.id),
        slug: wcProduct.slug,
        name: wcProduct.name,
        brand,
        category: mapCategory(wcProduct.categories),
        price: parsePrice(wcProduct.price),
        decantPrice,
        description: wcProduct.description.replace(/<[^>]*>/g, ''), // Remove HTML tags
        shortDescription: wcProduct.short_description.replace(/<[^>]*>/g, ''),
        image: mainImage,
        olfactoryNotes,
        inStock: wcProduct.stock_status === 'instock',
        featured: wcProduct.featured,
        intensity,
        longevity,
    };
}

/**
 * Mapea un array de productos de WooCommerce
 */
export function mapWooProducts(wcProducts: WCProduct[]): Product[] {
    return wcProducts.map(mapWooProductToProduct);
}
