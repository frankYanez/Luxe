'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './PageLoader.module.css';

/**
 * Page Loader Component
 * Shows on initial page load with logo animation, then fades out
 */
export function PageLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Minimum loading time of 1.5 seconds
        const minLoadTime = 1500;
        const startTime = Date.now();

        const handleLoad = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minLoadTime - elapsed);

            setTimeout(() => {
                setFadeOut(true);
                // Remove loader after fade animation completes
                setTimeout(() => {
                    setIsLoading(false);
                }, 800); // Match CSS transition duration
            }, remaining);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`${styles.loader} ${fadeOut ? styles.fadeOut : ''}`}>
            <div className={styles.content}>
                {/* Logo */}
                <div className={styles.logoContainer}>
                    <Image
                        src="/logos/logo-black.png"
                        alt="Luxe Essence"
                        width={300}
                        height={300}
                        className={styles.logo}
                        priority
                    />
                </div>

                {/* Loading Bar */}
                <div className={styles.loadingBar}>
                    <div className={styles.loadingProgress} />
                </div>

                {/* Loading Text */}
                <p className={styles.loadingText}>Cargando experiencia premium...</p>
            </div>

            {/* Decorative Elements */}
            <div className={styles.decorativeCircle1} />
            <div className={styles.decorativeCircle2} />
        </div>
    );
}
