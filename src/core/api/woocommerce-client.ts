/**
 * WooCommerce API Client
 * Cliente axios configurado para WooCommerce REST API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { wooConfig, getWooApiUrl, validateWooConfig } from '../config/woocommerce';

function redactWooParams(params: Record<string, any> | undefined) {
    if (!params) return params;
    const { consumer_secret, ...rest } = params;
    return {
        ...rest,
        ...(consumer_secret ? { consumer_secret: '[redacted]' } : {}),
    };
}

/**
 * Crea instancia de axios configurada para WooCommerce
 */
function createWooCommerceClient(): AxiosInstance {
    const client = axios.create({
        baseURL: getWooApiUrl(),
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            // Some security layers block unknown/empty User-Agent values.
            'User-Agent': 'LuxeEssence/1.0 (+https://luxefragancias.com)',
        },
        // Prefer query-string auth for compatibility with hosts/WAFs
        // that reject the Authorization header and respond with 403.
        // Strip injected content (e.g. malware <script> tags) after the JSON payload
        transformResponse: [(data: string) => {
            if (typeof data !== 'string') return data;
            const first = data[0];
            if (first !== '[' && first !== '{') return JSON.parse(data);
            const open = first === '[' ? '[' : '{';
            const close = first === '[' ? ']' : '}';
            let depth = 0;
            let inString = false;
            let escape = false;
            for (let i = 0; i < data.length; i++) {
                const c = data[i];
                if (escape) { escape = false; continue; }
                if (c === '\\' && inString) { escape = true; continue; }
                if (c === '"') { inString = !inString; continue; }
                if (inString) continue;
                if (c === open) depth++;
                else if (c === close) { depth--; if (depth === 0) return JSON.parse(data.slice(0, i + 1)); }
            }
            return JSON.parse(data);
        }],
    });

    // Request Interceptor
    client.interceptors.request.use(
        (config) => {
            // Ensure credentials are always passed server-side.
            // (WooCommerce supports both Basic Auth and query params; query params
            // tends to work more reliably on shared hosting and behind security plugins.)
            config.params = {
                ...(config.params || {}),
                consumer_key: (config.params as any)?.consumer_key ?? wooConfig.consumerKey,
                consumer_secret: (config.params as any)?.consumer_secret ?? wooConfig.consumerSecret,
            };

            if (wooConfig.debug) {
                console.log('🔵 WooCommerce Request:', {
                    method: config.method?.toUpperCase(),
                    baseURL: config.baseURL,
                    url: config.url,
                    params: redactWooParams(config.params as any),
                });
            }
            return config;
        },
        (error) => {
            if (wooConfig.debug) {
                console.error('🔴 Request Error:', error);
            }
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    client.interceptors.response.use(
        (response) => {
            if (wooConfig.debug) {
                console.log('🟢 WooCommerce Response:', {
                    status: response.status,
                    data: response.data,
                });
            }
            return response;
        },
        (error: AxiosError) => {
            if (wooConfig.debug) {
                console.error('🔴 Response Error:', {
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }

            // Manejo específico de errores de WooCommerce
            if (error.response) {
                const status = error.response.status;
                const data: any = error.response.data;

                switch (status) {
                    case 401:
                        console.error('❌ Error de autenticación de WooCommerce. Verifica tus credenciales.');
                        break;
                    case 403:
                        console.error('❌ Acceso denegado. Verifica los permisos de la API key.');
                        break;
                    case 404:
                        console.error('❌ Recurso no encontrado en WooCommerce.');
                        break;
                    case 500:
                        console.error('❌ Error del servidor de WordPress/WooCommerce.');
                        break;
                    default:
                        console.error(`❌ Error ${status}:`, data?.message || error.message);
                }
            } else if (error.request) {
                console.error('❌ No se recibió respuesta del servidor. Verifica la URL y la conexión.');
            } else {
                console.error('❌ Error configurando la petición:', error.message);
            }

            return Promise.reject(error);
        }
    );

    return client;
}

/**
 * Cliente WooCommerce singleton
 */
let wooClient: AxiosInstance | null = null;

export function getWooClient(): AxiosInstance {
    if (!wooClient) {
        // Validar configuración antes de crear el cliente
        if (!validateWooConfig()) {
            throw new Error(
                'WooCommerce no está configurado correctamente. ' +
                'Por favor, configura las variables de entorno en .env.local'
            );
        }
        wooClient = createWooCommerceClient();
    }
    return wooClient;
}

/**
 * Helper para construir query params de WooCommerce
 */
export function buildWooParams(params: Record<string, any> = {}): Record<string, any> {
    return {
        per_page: 100, // Máximo permitido por WooCommerce
        ...params,
    };
}
