import nextDynamic from 'next/dynamic';

import { PerfumeFrameIntro } from '@/features/hero/PerfumeFrameIntro';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeroSection } from '@/features/hero/HeroSection';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';

// Below-fold sections — lazy loaded to reduce initial bundle
const VitrinaRail         = nextDynamic(() => import('@/features/gallery/VitrinaRail').then(m => ({ default: m.VitrinaRail })));
const FeaturedCarousel    = nextDynamic(() => import('@/features/offers/FeaturedCarousel').then(m => ({ default: m.FeaturedCarousel })));
const BrandManifesto      = nextDynamic(() => import('@/features/brand/BrandManifesto').then(m => ({ default: m.BrandManifesto })));
const DecantsCTABand      = nextDynamic(() => import('@/features/decants/DecantsCTABand').then(m => ({ default: m.DecantsCTABand })));
const BannersSection      = nextDynamic(() => import('@/features/banners/BannersSection').then(m => ({ default: m.BannersSection })));
const ProductsSection     = nextDynamic(() => import('@/features/products/ProductsSection').then(m => ({ default: m.ProductsSection })));
const AsadFeature         = nextDynamic(() => import('@/features/products/AsadFeature').then(m => ({ default: m.AsadFeature })));
const DecantsSection      = nextDynamic(() => import('@/features/decants/DecantsSection').then(m => ({ default: m.DecantsSection })));
const GaleriaWall         = nextDynamic(() => import('@/features/gallery/GaleriaWall').then(m => ({ default: m.GaleriaWall })));
const TestimonialsSection = nextDynamic(() => import('@/features/testimonials/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FAQSection          = nextDynamic(() => import('@/features/faq/FAQSection').then(m => ({ default: m.FAQSection })));
const FinalCTASection     = nextDynamic(() => import('@/features/checkout/FinalCTASection').then(m => ({ default: m.FinalCTASection })));
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
 *  1. Hero           → gancho emocional, bento spotlight + doble CTA
 *  2. ScrollVelocity → trust signals inmediatos (cuotas, envíos, originales)
 *  3. VitrinaRail    → vidriera continua de la colección
 *  4. FeaturedCarousel → aspiración / best sellers
 *  5. BrandSection   → educación / diferenciación árabe
 *  6. DecantsCTABand → puerta de entrada a los decants
 *  7. ProductsSection → catálogo completo
 *  8. AsadFeature    → banner de producto individual
 *  9. DecantsSection → puente/tripwire (convierte indecisos)
 * 10. GaleriaSection → lifestyle visual / refuerzo de lujo
 * 11. TestimonialsSection → validación social
 * 12. FAQSection     → eliminar fricciones pre-compra
 * 13. FinalCTASection → cierre editorial (WhatsApp + Instagram)
 * 14. WhatsAppCTA    → botón flotante persistente
 * 15. SocialFooter
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
            <VitrinaRail />
            <FeaturedCarousel />
            <BrandManifesto />
            <DecantsCTABand />
            {/* Temporarily commented out for review — untouched by the react-bits pass, re-enable when done reviewing */}
            {/* <BannersSection /> */}
            <ProductsSection />
            <AsadFeature />
            <DecantsSection />
            <GaleriaWall />
            <TestimonialsSection />
            {/* <FAQSection /> */}
            <FinalCTASection />
            <WhatsAppCTA />
            <SocialFooter />
        </main>
    );
}
