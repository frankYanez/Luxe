/**
 * Product Mock Data
 * Luxe Essence Premium Arabic Perfumes
 */

import { Product } from '../types/product';

export const products: Product[] = [
    {
        id: 'khamrah',
        name: 'Khamrah',
        brand: 'Lattafa',
        category: 'unisex',
        price: 85000,
        decantPrice: 15000,
        description: 'Una fragancia oriental amaderada cautivadora que evoca las noches místicas del desierto árabe. Khamrah combina especias exóticas con maderas preciosas, creando una experiencia olfativa profundamente seductora y lujosa.',
        shortDescription: 'Oriental amaderada | Seductora y profunda',
        image: '/images/products/khamrah.jpg',
        olfactoryNotes: [
            {
                type: 'salida',
                notes: ['Canela', 'Nuez moscada', 'Bergamota'],
            },
            {
                type: 'corazon',
                notes: ['Dátiles', 'Praliné', 'Tuberosa', 'Mahonial'],
            },
            {
                type: 'fondo',
                notes: ['Ámbar', 'Cedro', 'Madera de Oud', 'Vainilla', 'Almizcle', 'Tonka'],
            },
        ],
        inStock: true,
        featured: true,
        intensity: 'intensa',
        longevity: '8-12 horas',
    },
    {
        id: 'asad',
        name: 'Asad',
        brand: 'Lattafa',
        category: 'masculino',
        price: 78000,
        decantPrice: 13000,
        description: 'Fragancia masculina poderosa inspirada en el león del desierto. Asad transmite fuerza y elegancia con su composición aromática especiada que deja una estela inolvidable.',
        shortDescription: 'Aromática especiada | Poderosa y elegante',
        image: '/images/products/asad.jpg',
        olfactoryNotes: [
            {
                type: 'salida',
                notes: ['Limón', 'Pimienta rosa', 'Pimienta negra'],
            },
            {
                type: 'corazon',
                notes: ['Iris', 'Salvia', 'Pachulí'],
            },
            {
                type: 'fondo',
                notes: ['Ámbar gris', 'Vetiver', 'Cedro'],
            },
        ],
        inStock: true,
        featured: true,
        intensity: 'intensa',
        longevity: '10-14 horas',
    },
    {
        id: 'yara',
        name: 'Yara',
        brand: 'Lattafa',
        category: 'femenino',
        price: 82000,
        decantPrice: 14000,
        description: 'Dulce, cautivadora y sofisticada. Yara es la esencia de la feminidad árabe moderna, combinando notas gourmand con un toque floral delicado que encanta y seduce.',
        shortDescription: 'Floral gourmand | Dulce y sofisticada',
        image: '/images/products/yara.jpg',
        olfactoryNotes: [
            {
                type: 'salida',
                notes: ['Heliotropo', 'Orquídea', 'Mandarina'],
            },
            {
                type: 'corazon',
                notes: ['Notas gourmand', 'Frutas tropicales'],
            },
            {
                type: 'fondo',
                notes: ['Vainilla', 'Almizcle', 'Sándalo'],
            },
        ],
        inStock: true,
        featured: true,
        intensity: 'moderada',
        longevity: '6-8 horas',
    },
    {
        id: 'badee-al-oud',
        name: "Bade'e Al Oud Amethyst",
        brand: 'Lattafa',
        category: 'unisex',
        price: 88000,
        decantPrice: 15500,
        description: 'La quintaesencia del lujo oriental. Esta fragancia celebra el Oud con una interpretación contemporánea, fusionando la tradición árabe con la elegancia moderna.',
        shortDescription: 'Oud contemporáneo | Lujoso y misterioso',
        image: '/images/products/badee-al-oud.jpg',
        olfactoryNotes: [
            {
                type: 'salida',
                notes: ['Bergamota', 'Fresia'],
            },
            {
                type: 'corazon',
                notes: ['Oud', 'Azafrán', 'Geranio'],
            },
            {
                type: 'fondo',
                notes: ['Ámbar', 'Pachulí', 'Musgo de roble'],
            },
        ],
        inStock: true,
        intensity: 'intensa',
        longevity: '12+ horas',
    },
    {
        id: 'qaed-al-fursan',
        name: 'Qaed Al Fursan',
        brand: 'Lattafa',
        category: 'masculino',
        price: 76000,
        decantPrice: 12500,
        description: 'Para el hombre audaz y conquistador. Una fragancia especiada y amaderada que refleja el espíritu de los antiguos guerreros árabes con un toque contemporáneo.',
        shortDescription: 'Especiada amaderada | Audaz y conquistadora',
        image: '/images/products/qaed-al-fursan.jpg',
        olfactoryNotes: [
            {
                type: 'salida',
                notes: ['Lavanda', 'Menta', 'Frutas'],
            },
            {
                type: 'corazon',
                notes: ['Canela', 'Naranja', 'Iris'],
            },
            {
                type: 'fondo',
                notes: ['Vainilla', 'Ámbar', 'Cedro', 'Sándalo'],
            },
        ],
        inStock: true,
        intensity: 'moderada',
        longevity: '8-10 horas',
    },
    {
        id: 'velvet-oud',
        name: 'Velvet Oud',
        brand: 'Al Haramain',
        category: 'unisex',
        price: 92000,
        decantPrice: 16000,
        description: 'Suavidad aterciopelada en su máxima expresión. Velvet Oud combina la riqueza del Oud con notas cremosas y especiadas para crear una experiencia sensorial inolvidable.',
        shortDescription: 'Oud especiado | Aterciopelado y rico',
        image: '/images/products/velvet-oud.jpg',
        olfactoryNotes: [
            {
                type: 'salida',
                notes: ['Azafrán', 'Cardamomo'],
            },
            {
                type: 'corazon',
                notes: ['Oud', 'Rosa búlgara', 'Pachulí'],
            },
            {
                type: 'fondo',
                notes: ['Ámbar', 'Cuero', 'Musgo'],
            },
        ],
        inStock: false,
        intensity: 'intensa',
        longevity: '10-12 horas',
    },
];

// Helper functions
export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getProductsByCategory = (category: Product['category']) =>
    products.filter(p => p.category === category);
export const getProductById = (id: string) =>
    products.find(p => p.id === id);
