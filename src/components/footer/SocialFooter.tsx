'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/shared/ui/Container';
import { siteConfig } from '@/core/config/site';
import styles from './SocialFooter.module.css';
import DecryptedText from '@/components/DecryptedText';

const socialLinks = [
    {
        name: 'Instagram',
        url: `https://instagram.com/${siteConfig.instagram.replace('@', '')}`,
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
            </svg>
        ),
    },
    {
        name: 'WhatsApp',
        url: `https://wa.me/${siteConfig.whatsapp.replace('+', '')}`,
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 24l-6.305 1.654 1.588-5.945A11.86 11.86 0 010 11.892C.004 5.335 5.339 0 11.893 0c2.64 0 5.122 1.03 6.988 2.898a11.821 11.821 0 013.48 8.413c-.003 6.558-5.339 11.893-11.893 11.893h-.005a11.882 11.882 0 01-5.683-1.448L12.05 24z" />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        url: 'https://facebook.com/luxeessence.tandil',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 8.5h2V5.2c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.83-4.92 5.2V13H6v3.7h3.13V24h3.72v-7.3h3l.48-3.7h-3.48v-2.4c0-1.07.29-1.8 1.85-1.8z" fill="currentColor" />
            </svg>
        ),
    },
];

/**
 * Site Footer
 * Quiet, functional footer — brand, nav, social icon row, contact, copyright.
 * The emotional CTA moment lives in FinalCTASection right above this.
 */
export function SocialFooter() {
    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <span className={styles.logo}>
                            LUXE<span className={styles.dot}>.</span>ESSENCE
                        </span>
                        <p className={styles.tagline}>
                            <DecryptedText
                                text="El arte prohibido de las fragancias árabes en Tandil"
                                animateOn="view"
                                speed={28}
                                maxIterations={9}
                                revealDirection="center"
                                sequential
                            />
                        </p>
                    </div>

                    <nav className={styles.links} aria-label="Navegación del footer">
                        <a href="#catalogo" className={styles.link}>Colección</a>
                        <a href="#decants" className={styles.link}>Decants</a>
                        <Link href="/coleccion" className={styles.link}>Ver todo</Link>
                    </nav>

                    <div className={styles.social}>
                        {socialLinks.map((s) => (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialBtn}
                                aria-label={s.name}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div className={styles.contactRow}>
                    <a href={`mailto:${siteConfig.email}`} className={styles.contactLink}>
                        {siteConfig.email}
                    </a>
                    <span className={styles.separator}>&middot;</span>
                    <span className={styles.location}>{siteConfig.location}</span>
                </div>

                <div className={styles.bottom}>
                    <span className={styles.copyright}>
                        &copy; {new Date().getFullYear()} Luxe Essence. Todos los derechos reservados.
                    </span>
                    <Link href="/admin" className={styles.adminLink}>Admin</Link>
                </div>
            </Container>
        </footer>
    );
}

