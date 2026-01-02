/**
 * Testimonial Type Definitions
 * Luxe Essence E-commerce
 */

export interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    comment: string;
    productPurchased?: string;
    date: string;
    verified: boolean;
}
