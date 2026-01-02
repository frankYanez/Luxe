import { CTABanner } from './CTABanner';
import './BannerSectionStyles.css';

/**
 * Banners Section
 * Displays CTA banners for masculine and feminine fragrances
 */
export function BannersSection() {
    return (
        <div className="banners">
            <CTABanner
                title="Poder y Distinción"
                subtitle="Fragancias masculinas que definen tu presencia. Intensas, profundas, inolvidables."
                ctaText="Explorar Colección Masculina"
                ctaLink="#productos"
                variant="masculine"
                videoUrl="/videos/banners/masculine-banner.mp4"
            />

            <CTABanner
                title="Elegancia Atemporal"
                subtitle="Fragancias femeninas que capturan tu esencia. Delicadas, sofisticadas, cautivadoras."
                ctaText="Descubrir Colección Femenina"
                ctaLink="#productos"
                variant="feminine"
                videoUrl="/videos/banners/feminine-banner.mp4"
            />
        </div>
    );
}



