import type { Metadata } from 'next';
import './globals.css';
import '@/styles/tailwind.css';
import { siteConfig } from '@/core/config/site';
import { PageLoader } from '@/components/shared/PageLoader';
import { TopBanner } from '@/components/layout/TopBanner';

const SITE_URL = 'https://luxefragancias.com';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: siteConfig.meta.title,
        template: `%s | Luxe Essence`,
    },
    description: siteConfig.meta.description,
    keywords: siteConfig.meta.keywords,
    authors: [{ name: 'Luxe Essence' }],
    creator: 'Luxe Essence',
    openGraph: {
        type: 'website',
        locale: siteConfig.business.locale,
        url: SITE_URL,
        title: siteConfig.meta.title,
        description: siteConfig.meta.description,
        siteName: siteConfig.name,
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Luxe Essence — Perfumes Árabes Premium',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.meta.title,
        description: siteConfig.meta.description,
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: SITE_URL,
    },
};

import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { CursorSpotlight } from '@/components/shared/ui/CursorSpotlight';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Anton&family=Jost:wght@200;300;400;500;600;700&display=swap"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1044839991768381');
fbq('track', 'PageView');
`
                    }}
                />
            </head>
            <body>
                <noscript>
                    <img 
                        height="1" 
                        width="1" 
                        style={{ display: 'none' }}
                        src="https://www.facebook.com/tr?id=1044839991768381&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'LocalBusiness',
                            name: 'Luxe Essence',
                            description: siteConfig.meta.description,
                            url: SITE_URL,
                            telephone: siteConfig.whatsapp,
                            email: siteConfig.email,
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Tandil',
                                addressRegion: 'Buenos Aires',
                                addressCountry: 'AR',
                            },
                            geo: {
                                '@type': 'GeoCoordinates',
                                latitude: -37.3217,
                                longitude: -59.1332,
                            },
                            sameAs: [
                                'https://www.instagram.com/luxe.essence.tandil',
                            ],
                            priceRange: '$$',
                            image: `${SITE_URL}/og-image.jpg`,
                        }),
                    }}
                />
                <CartProvider>
                    <CursorSpotlight />
                    <PageLoader />
                    <TopBanner />
                    <CartDrawer />
                    <FloatingCart />
                    {children}
                    <Toaster position="bottom-right" richColors />
                </CartProvider>
            </body>
        </html>
    );
}
