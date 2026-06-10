import dynamic from 'next/dynamic';

// 🎁 Día del Padre — para revertir: cambiar a '@/features/hero/HeroSection'
import { HeroSectionFathersDay as HeroSection } from '@/features/hero/HeroSectionFathersDay';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';

// Below-fold sections — lazy loaded to reduce initial bundle
const FathersDaySection   = dynamic(() => import('@/features/fathers-day/FathersDaySection').then(m => ({ default: m.FathersDaySection })));
const FeaturedCarousel    = dynamic(() => import('@/features/offers/FeaturedCarousel').then(m => ({ default: m.FeaturedCarousel })));
const BrandSection        = dynamic(() => import('@/features/brand/BrandSection').then(m => ({ default: m.BrandSection })));
const BannersSection      = dynamic(() => import('@/features/banners/BannersSection').then(m => ({ default: m.BannersSection })));
const ProductsSection     = dynamic(() => import('@/features/products/ProductsSection').then(m => ({ default: m.ProductsSection })));
const DecantsSection      = dynamic(() => import('@/features/decants/DecantsSection').then(m => ({ default: m.DecantsSection })));
const GaleriaSection      = dynamic(() => import('@/features/gallery/GaleriaSection').then(m => ({ default: m.GaleriaSection })));
const TestimonialsSection = dynamic(() => import('@/features/testimonials/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection          = dynamic(() => import('@/features/faq/FAQSection').then(m => ({ default: m.FAQSection })));
const WhatsAppCTA         = dynamic(() => import('@/features/checkout/WhatsAppCTA').then(m => ({ default: m.WhatsAppCTA })));
const SocialFooter        = dynamic(() => import('@/components/footer/SocialFooter').then(m => ({ default: m.SocialFooter })));

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
            {/* 🎁 TEMPORARIO: Día del Padre — remover después del 21 de junio */}
            <FathersDaySection />
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
