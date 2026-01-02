import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/core/config/site';
import { PageLoader } from '@/components/shared/PageLoader';
import { TopBanner } from '@/components/layout/TopBanner';

export const metadata: Metadata = {
    title: siteConfig.meta.title,
    description: siteConfig.meta.description,
    keywords: siteConfig.meta.keywords,
    authors: [{ name: 'Luxe Essence' }],
    creator: 'Luxe Essence',
    openGraph: {
        type: 'website',
        locale: siteConfig.business.locale,
        url: 'https://luxeessence.com.ar',
        title: siteConfig.meta.title,
        description: siteConfig.meta.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.meta.title,
        description: siteConfig.meta.description,
    },
    robots: {
        index: true,
        follow: true,
    },
};

import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCart } from '@/components/cart/FloatingCart';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>
                <CartProvider>
                    <PageLoader />
                    <TopBanner />
                    <CartDrawer />
                    <FloatingCart />
                    {children}
                </CartProvider>
            </body>
        </html>
    );
}
