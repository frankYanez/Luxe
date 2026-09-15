import nextDynamic from 'next/dynamic';

import { PerfumeFrameIntro } from '@/features/hero/PerfumeFrameIntro';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeroSection } from '@/features/hero/HeroSection';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';

// Below-fold sections — lazy loaded to reduce initial bundle
const NewArrivalsSection  = nextDynamic(() => import('@/features/products/NewArrivalsSection').then(m => ({ default: m.NewArrivalsSection })));
const VitrinaRail         = nextDynamic(() => import('@/features/gallery/VitrinaRail').then(m => ({ default: m.VitrinaRail })));
const DecantsCTABand      = nextDynamic(() => import('@/features/decants/DecantsCTABand').then(m => ({ default: m.DecantsCTABand })));
const ProductsSection     = nextDynamic(() => import('@/features/products/ProductsSection').then(m => ({ default: m.ProductsSection })));
const AsadFeature         = nextDynamic(() => import('@/features/products/AsadFeature').then(m => ({ default: m.AsadFeature })));
const DecantsSection      = nextDynamic(() => import('@/features/decants/DecantsSection').then(m => ({ default: m.DecantsSection })));
const GaleriaWall         = nextDynamic(() => import('@/features/gallery/GaleriaWall').then(m => ({ default: m.GaleriaWall })));
const TestimonialsSection = nextDynamic(() => import('@/features/testimonials/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FinalCTASection     = nextDynamic(() => import('@/features/checkout/FinalCTASection').then(m => ({ default: m.FinalCTASection })));
const WhatsAppCTA         = nextDynamic(() => import('@/features/checkout/WhatsAppCTA').then(m => ({ default: m.WhatsAppCTA })));
const SocialFooter        = nextDynamic(() => import('@/components/footer/SocialFooter').then(m => ({ default: m.SocialFooter })));

// Product data is live from Supabase and several below-fold sections use
// browser-only libs (GSAP/OGL/canvas) that can't be statically prerendered —
// render this route per-request instead of at build time.
export const dynamic = 'force-dynamic';

/**
 * Homepage — Luxe Essence
 * Matches the "luxe-essence-blanco" mockup end to end. The only holdover
 * from the previous page is GaleriaWall (the image wall) — everything
 * else here comes from the new design.
 * Sales funnel order:
 *  0. PerfumeFrameIntro → pinned frame-scrub, perfume first, site reveals on scroll
 *  1. Hero           → gancho emocional, bento spotlight + doble CTA
 *  2. ScrollVelocity → trust signals inmediatos (cuotas, envíos, originales)
 *  3. NewArrivalsSection → spotlight de nuevos ingresos, prueba gratis
 *  4. VitrinaRail    → vidriera continua de la colección
 *  5. DecantsCTABand → puerta de entrada a los decants
 *  6. ProductsSection → catálogo completo
 *  7. AsadFeature    → banner de producto individual
 *  8. DecantsSection → puente/tripwire (convierte indecisos)
 *  9. GaleriaWall    → muro de imágenes (única sección heredada de la web anterior)
 * 10. TestimonialsSection → validación social
 * 11. FinalCTASection → cierre editorial (WhatsApp + Instagram)
 * 12. WhatsAppCTA    → botón flotante persistente
 * 13. SocialFooter
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
            <NewArrivalsSection />
            <VitrinaRail />
            <DecantsCTABand />
            <ProductsSection />
            <AsadFeature />
            <DecantsSection />
            <GaleriaWall />
            <TestimonialsSection />
            <FinalCTASection />
            <WhatsAppCTA />
            <SocialFooter />
        </main>
    );
}
