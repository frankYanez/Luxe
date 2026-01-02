/**
 * Product Type Definitions
 * Luxe Essence E-commerce
 */

export type Category = 'masculino' | 'femenino' | 'unisex';

export interface OlfactoryNote {
    type: 'salida' | 'corazon' | 'fondo';
    notes: string[];
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    category: Category;
    price: number;
    decantPrice?: number;
    description: string;
    shortDescription: string;
    image: string;
    olfactoryNotes: OlfactoryNote[];
    inStock: boolean;
    featured?: boolean;
    intensity: 'ligera' | 'moderada' | 'intensa';
    longevity: string;
}
