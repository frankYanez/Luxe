import nextDynamic from 'next/dynamic';

import { PerfumeFrameIntro } from '@/features/hero/PerfumeFrameIntro';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeroSection } from '@/features/hero/HeroSection';
import { ScrollVelocity } from '@/components/shared/ui/ScrollVelocity';
import styles from './page.module.css';

// Below-fold sections — lazy loaded to reduce initial bundle
const NewArrivalsSection  = nextDynamic(() => import('@/features/products/NewArrivalsSection').then(m => ({ default: m.NewArrivalsSection })));
const DecantsCTABand      = nextDynamic(() => import('@/features/decants/DecantsCTABand').then(m => ({ default: m.DecantsCTABand })));
const ProductsSection     = nextDynamic(() => import('@/features/products/ProductsSection').then(m => ({ default: m.ProductsSection })));
const AsadFeature         = nextDynamic(() => import('@/features/products/AsadFeature').then(m => ({ default: m.AsadFeature })));
const DecantsSection      = nextDynamic(() => import('@/features/decants/DecantsSection').then(m => ({ default: m.DecantsSection })));
const GaleriaWall         = nextDynamic(() => import('@/features/gallery/GaleriaWall').then(m => ({ default: m.GaleriaWall })));
const TestimonialsSection = nextDynamic(() => import('@/features/testimonials/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const FinalCTASection     = nextDynamic(() => import('@/features/checkout/FinalCTASection').then(m => ({ default: m.FinalCTASection })));
const WhatsAppCTA         = nextDynamic(() => import('@/features/checkout/WhatsAppCTA').then(m => ({ default: m.WhatsAppCTA })));
const SocialFooter        = nextDynamic(() => import('@/components/footer/SocialFooter').then(m => ({ default: m.SocialFooter })));

// Every section below the fold is a 'use client' component that fetches
// its own data in the browser (useProducts etc.) — the server-rendered
// shell has no per-request data dependency, so it can be fully static
// and served from cache/CDN instead of re-rendered on every request.

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
 *  4. DecantsCTABand → puerta de entrada a los decants
 *  5. ProductsSection → catálogo completo
 *  6. AsadFeature    → banner de producto individual
 *  7. DecantsSection → puente/tripwire (convierte indecisos)
 *  8. GaleriaWall    → muro de imágenes (única sección heredada de la web anterior)
 *  9. TestimonialsSection → validación social
 * 10. FinalCTASection → cierre editorial (WhatsApp + Instagram)
 * 11. WhatsAppCTA    → botón flotante persistente
 * 12. SocialFooter
 */
export default function HomePage() {
    return (
        <main>
            <PerfumeFrameIntro />
            {/* Own stacking context, above the (fixed) intro — scrolls up
                over it like a sheet once the frame scrub ends. */}
            <div className={styles.contentSheet}>
                <SiteHeader />
                <HeroSection />
                <ScrollVelocity
                    text="3 CUOTAS SIN INTERÉS • ENVÍOS A TODO EL PAÍS • 100% ORIGINALES • "
                    velocity={1}
                />
                <NewArrivalsSection />
                <DecantsCTABand />
                <ProductsSection />
                <AsadFeature />
                <DecantsSection />
                <GaleriaWall />
                <TestimonialsSection />
                <FinalCTASection />
                <WhatsAppCTA />
                <SocialFooter />
            </div>
        </main>
    );
}
