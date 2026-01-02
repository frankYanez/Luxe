import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/core/config/site';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
