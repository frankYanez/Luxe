/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 3600,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'luxefragancias.com',
            },
            {
                protocol: 'https',
                hostname: 'www.luxefragancias.com',
            },
            {
                protocol: 'https',
                hostname: 'wp.luxefragancias.com',
            },
            {
                protocol: 'https',
                hostname: '**', // Fallback para otros dominios
            },
        ],
    },
};

export default nextConfig;
