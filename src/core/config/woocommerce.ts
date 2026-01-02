/**
 * WooCommerce Configuration
 * Configuración centralizada para la API de WooCommerce
 */

export const wooConfig = {
    url: process.env.NEXT_PUBLIC_WC_URL || '',
    consumerKey: process.env.WC_CONSUMER_KEY || '',
    consumerSecret: process.env.WC_CONSUMER_SECRET || '',
    version: 'wc/v3',
    debug: process.env.NEXT_PUBLIC_API_DEBUG === 'true',
} as const;

/**
 * Valida que las credenciales de WooCommerce estén configuradas
 */
export function validateWooConfig(): boolean {
    if (!wooConfig.url) {
        console.error('❌ NEXT_PUBLIC_WC_URL no está configurado en .env.local');
        return false;
    }

    if (!wooConfig.consumerKey) {
        console.error('❌ WC_CONSUMER_KEY no está configurado en .env.local');
        return false;
    }

    if (!wooConfig.consumerSecret) {
        console.error('❌ WC_CONSUMER_SECRET no está configurado en .env.local');
        return false;
    }

    return true;
}

/**
 * Obtiene la URL base de la API de WooCommerce
 */
export function getWooApiUrl(): string {
    return `${wooConfig.url}/wp-json/${wooConfig.version}`;
}
