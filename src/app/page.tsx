import { HeroSection } from '@/features/hero/HeroSection';
import { DecantsSection } from '@/features/decants/DecantsSection';
import { ProductsSection } from '@/features/products/ProductsSection';
import { TestimonialsSection } from '@/features/testimonials/TestimonialsSection';
import { WhatsAppCTA } from '@/features/checkout/WhatsAppCTA';

/**
 * Homepage - Luxe Essence
 * Premium Arabic Perfumes E-commerce
 */
export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <DecantsSection />
            <ProductsSection />
            <TestimonialsSection />
            <WhatsAppCTA />
        </main>
    );
}
