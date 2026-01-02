import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
    error: Error | string;
    onRetry?: () => void;
}

/**
 * Error Message Component
 * Muestra mensajes de error con opción de retry
 */
export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
    const message = typeof error === 'string' ? error : error.message;

    return (
        <div className={`${styles.errorContainer} glass`}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3 className={styles.errorTitle}>Error al cargar productos</h3>
            <p className={styles.errorMessage}>{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className={styles.retryButton}
                >
                    Reintentar
                </button>
            )}

            <div className={styles.errorHint}>
                <p className={styles.hintTitle}>Posibles soluciones:</p>
                <ul className={styles.hintList}>
                    <li>Verifica que las credenciales de WooCommerce estén configuradas en <code>.env.local</code></li>
                    <li>Asegúrate que la URL del sitio WordPress sea correcta</li>
                    <li>Verifica que los permisos de la API key sean correctos (lectura/escritura)</li>
                    <li>Revisa la consola del navegador para más detalles</li>
                </ul>
            </div>
        </div>
    );
}
