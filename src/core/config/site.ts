/**
 * Site Configuration
 * Luxe Essence Business Information
 */

export const siteConfig = {
    name: 'Luxe Essence',
    tagline: 'El arte prohibido de las fragancias árabes',
    description: 'Descubrí el lujo de las fragancias árabes premium en Tandil. Perfumes originales y decants exclusivos.',
    location: 'Tandil, Buenos Aires, Argentina',
    whatsapp: '+5492494640012', // TODO: Replace with actual number
    email: 'luxe.essence.tandil@gmail.com',
    instagram: '@luxe.essence.tandil',

    meta: {
        title: 'Luxe Essence | Perfumes Árabes Premium en Tandil',
        description: 'Explorá el mundo de las fragancias árabes de lujo. Perfumes originales y decants exclusivos en Tandil, Argentina.',
        keywords: 'perfumes árabes, fragancias de lujo, decants, Tandil, Argentina, Khamrah, perfumes premium',
    },

    business: {
        currency: 'ARS',
        locale: 'es-AR',
        timezone: 'America/Argentina/Buenos_Aires',
    },
} as const;
