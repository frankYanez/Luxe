'use client';

import React from 'react';
import { Container } from '@/components/shared/ui/Container';
import { siteConfig } from '@/core/config/site';
import { wordReveal } from '@/lib/wordReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './FinalCTASection.module.css';

/**
 * Closing CTA — gold editorial card driving to WhatsApp / Instagram.
 * Sits right before the footer.
 */
export function FinalCTASection() {
    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}`;
    const igUrl = `https://instagram.com/${siteConfig.instagram.replace('@', '')}`;
    const innerRef = useScrollReveal<HTMLDivElement>();

    return (
        <section className={styles.section}>
            <span className={styles.glow} aria-hidden />
            <span className={styles.beamTrack} aria-hidden>
                <span className={styles.beam} />
            </span>
            <Container>
                <div ref={innerRef} className={styles.inner}>
                    <h2 className={styles.title}>
                        {wordReveal('Una fragancia')} <span className={styles.accent}>{wordReveal('se recuerda')}</span>
                    </h2>
                    <p className={styles.desc}>
                        Escribinos y armamos juntos tu esencia. Asesoramiento real, sin vueltas, por WhatsApp.
                    </p>
                    <div className={styles.ctaGroup}>
                        <a href={waUrl} target="_blank" rel="noreferrer" className={styles.ctaPrimary}>
                            WhatsApp {siteConfig.whatsapp}
                        </a>
                        <a href={igUrl} target="_blank" rel="noreferrer" className={styles.ctaSecondary}>
                            {siteConfig.instagram}
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
