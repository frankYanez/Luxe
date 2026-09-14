'use client';

import Link from 'next/link';
import { siteConfig } from '@/core/config/site';
import styles from './SiteHeader.module.css';

/**
 * Sticky site header — logo, section nav, WhatsApp CTA.
 * Sits below the pinned perfume frame intro; scrolls into view once it releases.
 */
export function SiteHeader() {
    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}`;

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                LUXE<span className={styles.dot}>.</span>ESSENCE
            </Link>
            <nav className={styles.nav}>
                <Link href="/coleccion" className={styles.navLink}>Colección</Link>
                <a href="#decants" className={styles.navLink}>Decants</a>
                <a href={waUrl} target="_blank" rel="noreferrer" className={styles.cta}>
                    <span className={styles.ctaDot} />
                    Comprar
                </a>
            </nav>
            <div className={styles.beamTrack} aria-hidden>
                <div className={styles.beam} />
            </div>
        </header>
    );
}

