'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/shared/ui/Container';
import { siteConfig } from '@/core/config/site';
import styles from './SocialFooter.module.css';

/**
 * Social Footer Component
 * Eye-catching footer with social media links and contact info
 */
export function SocialFooter() {
    const socialLinks = [
        {
            name: 'Instagram',
            icon: '📸',
            url: `https://instagram.com/${siteConfig.instagram.replace('@', '')}`,
            color: '#E4405F',
            handle: siteConfig.instagram,
        },
        {
            name: 'WhatsApp',
            icon: '💬',
            url: `https://wa.me/${siteConfig.whatsapp.replace('+', '')}`,
            color: '#25D366',
            handle: siteConfig.whatsapp,
        },
        {
            name: 'Facebook',
            icon: '👥',
            url: 'https://facebook.com/luxeessence.tandil',
            color: '#1877F2',
            handle: '@luxeessence.tandil',
        },
    ];

    return (
        <footer className={styles.footer}>

            <Container>
                <div className={styles.content}>
                    {/* Main CTA */}
                    <div className={styles.ctaSection}>
                        <h2 className={styles.title}>
                            ¿Listo para descubrir tu <span className={styles.titleAccent}>fragancia perfecta?</span>
                        </h2>
                        <p className={styles.subtitle}>
                            Conectate con nosotros en redes sociales y descubrí ofertas exclusivas
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className={styles.socialGrid}>
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialCard}
                                style={{ '--social-color': social.color } as React.CSSProperties}
                            >
                                <div className={styles.iconContainer}>
                                    <span className={styles.icon}>{social.icon}</span>
                                    <div className={styles.pulse} />
                                </div>

                                <div className={styles.socialInfo}>
                                    <h3 className={styles.socialName}>{social.name}</h3>
                                    <p className={styles.socialHandle}>{social.handle}</p>
                                </div>

                                <svg
                                    className={styles.arrow}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M7 17L17 7M17 7H7M17 7V17"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        ))}
                    </div>

                    {/* Brand Info */}
                    <div className={styles.brandSection}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>✦</span>
                            <span className={styles.logoText}>Luxe Essence</span>
                        </div>

                        <p className={styles.tagline}>
                            El arte prohibido de las fragancias árabes en Tandil
                        </p>

                        <div className={styles.contact}>
                            <a href={`mailto:${siteConfig.email}`} className={styles.contactLink}>
                                {siteConfig.email}
                            </a>
                            <span className={styles.separator}>•</span>
                            <span className={styles.location}>{siteConfig.location}</span>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className={styles.copyright}>
                        <p>© {new Date().getFullYear()} Luxe Essence. Todos los derechos reservados.</p>
                        <Link href="/admin" className={styles.adminLink}>Admin</Link>
                    </div>
                </div>
            </Container>

            {/* Decorative Elements */}
            <div className={styles.decorativeOrb1} />
            <div className={styles.decorativeOrb2} />
        </footer>
    );
}
