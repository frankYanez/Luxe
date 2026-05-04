import { HeroSection } from '@/features/hero/HeroSection';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';
import { FeaturedCarousel } from '@/features/offers/FeaturedCarousel';
import { BrandSection } from '@/features/brand/BrandSection';
import { BannersSection } from '@/features/banners/BannersSection';
import { ProductsSection } from '@/features/products/ProductsSection';
import { DecantsSection } from '@/features/decants/DecantsSection';
import { GaleriaSection } from '@/features/gallery/GaleriaSection';
import { TestimonialsSection } from '@/features/testimonials/TestimonialsSection';
import { FAQSection } from '@/features/faq/FAQSection';
import { WhatsAppCTA } from '@/features/checkout/WhatsAppCTA';
import { SocialFooter } from '@/components/footer/SocialFooter';

/**
 * Homepage — Luxe Essence
 * Sales funnel order:
 *  1. Hero           → gancho emocional + doble CTA
 *  2. ScrollVelocity → trust signals inmediatos (cuotas, envíos, originales)
 *  3. FeaturedCarousel → aspiración / best sellers
 *  4. BrandSection   → educación / diferenciación árabe
 *  5. BannersSection → segmentación masc/fem
 *  6. ProductsSection → catálogo completo
 *  7. DecantsSection → puente/tripwire (convierte indecisos)
 *  8. GaleriaSection → lifestyle visual / refuerzo de lujo
 *  9. TestimonialsSection → validación social
 * 10. FAQSection     → eliminar fricciones pre-compra
 * 11. WhatsAppCTA    → cierre con asesoramiento personalizado
 * 12. SocialFooter
 */
export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <ScrollVelocity
                text="3 CUOTAS SIN INTERÉS • ENVÍOS A TODO EL PAÍS • 100% ORIGINALES • "
                velocity={1}
            />
            <FeaturedCarousel />
            <BrandSection />
            <BannersSection />
            <ProductsSection />
            <DecantsSection />
            <GaleriaSection />
            <TestimonialsSection />
            <FAQSection />
            <WhatsAppCTA />
            <SocialFooter />
        </main>
    );
}
