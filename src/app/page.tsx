import nextDynamic from 'next/dynamic';

import { PerfumeFrameIntro } from '@/features/hero/PerfumeFrameIntro';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeroSection } from '@/features/hero/HeroSection';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';

// Below-fold sections — lazy loaded to reduce initial bundle
const FeaturedCarousel    = nextDynamic(() => import('@/features/offers/FeaturedCarousel').then(m => ({ default: m.FeaturedCarousel })));
const BrandManifesto      = nextDynamic(() => import('@/features/brand/BrandManifesto').then(m => ({ default: m.BrandManifesto })));
const DecantsCTABand      = nextDynamic(() => import('@/features/decants/DecantsCTABand').then(m => ({ default: m.DecantsCTABand })));
const BannersSection      = nextDynamic(() => import('@/features/banners/BannersSection').then(m => ({ default: m.BannersSection })));
const ProductsSection     = nextDynamic(() => import('@/features/products/ProductsSection').then(m => ({ default: m.ProductsSection })));
const DecantsSection      = nextDynamic(() => import('@/features/decants/DecantsSection').then(m => ({ default: m.DecantsSection })));
const GaleriaWall         = nextDynamic(() => import('@/features/gallery/GaleriaWall').then(m => ({ default: m.GaleriaWall })));
const TestimonialsSection = nextDynamic(() => import('@/features/testimonials/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection          = nextDynamic(() => import('@/features/faq/FAQSection').then(m => ({ default: m.FAQSection })));
const WhatsAppCTA         = nextDynamic(() => import('@/features/checkout/WhatsAppCTA').then(m => ({ default: m.WhatsAppCTA })));
const SocialFooter        = nextDynamic(() => import('@/components/footer/SocialFooter').then(m => ({ default: m.SocialFooter })));

// Product data is live from Supabase and several below-fold sections use
// browser-only libs (GSAP/OGL/canvas) that can't be statically prerendered —
// render this route per-request instead of at build time.
export const dynamic = 'force-dynamic';

/**
 * Homepage — Luxe Essence
 * Sales funnel order:
 *  0. PerfumeFrameIntro → pinned frame-scrub, perfume first, site reveals on scroll
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
            <PerfumeFrameIntro />
            <SiteHeader />
            <HeroSection />
            <ScrollVelocity
                text="3 CUOTAS SIN INTERÉS • ENVÍOS A TODO EL PAÍS • 100% ORIGINALES • "
                velocity={1}
            />
            <FeaturedCarousel />
            <BrandManifesto />
            <DecantsCTABand />
            {/* Temporarily commented out for review — untouched by the react-bits pass, re-enable when done reviewing */}
            {/* <BannersSection /> */}
            <ProductsSection />
            <DecantsSection />
            <GaleriaWall />
            <TestimonialsSection />
            {/* <FAQSection /> */}
            <WhatsAppCTA />
            <SocialFooter />
        </main>
    );
}
