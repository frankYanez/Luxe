import { HeroSection } from '@/features/hero/HeroSection';
import { FeaturedCarousel } from '@/features/offers/FeaturedCarousel';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';
import { DecantsSection } from '@/features/decants/DecantsSection';
import { ProductsSection } from '@/features/products/ProductsSection';
import { BannersSection } from '@/features/banners/BannersSection';
import { TestimonialsSection } from '@/features/testimonials/TestimonialsSection';
import { WhatsAppCTA } from '@/features/checkout/WhatsAppCTA';
import { SocialFooter } from '@/components/footer/SocialFooter';

/**
 * Homepage - Luxe Essence
 * Premium Arabic Perfumes E-commerce
 */
export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <FeaturedCarousel />
            <DecantsSection />
            <ProductsSection />
            <ScrollVelocity text="3 CUOTAS SIN INTERÉS • ENVÍOS GRATIS • " velocity={1} />
            <BannersSection />
            <TestimonialsSection />
            <WhatsAppCTA />
            <SocialFooter />
        </main>
    );
}
