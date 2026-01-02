/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
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
                hostname: '**', // Fallback para otros dominios
            },
        ],
    },
};

export default nextConfig;
