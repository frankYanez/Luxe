/**
 * WooCommerce API Client
 * Cliente axios configurado para WooCommerce REST API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { wooConfig, getWooApiUrl, validateWooConfig } from '../config/woocommerce';

/**
 * Crea instancia de axios configurada para WooCommerce
 */
function createWooCommerceClient(): AxiosInstance {
    const client = axios.create({
        baseURL: getWooApiUrl(),
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
        },
        auth: {
            username: wooConfig.consumerKey,
            password: wooConfig.consumerSecret,
        },
    });

    // Request Interceptor
    client.interceptors.request.use(
        (config) => {
            if (wooConfig.debug) {
                console.log('🔵 WooCommerce Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    params: config.params,
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
