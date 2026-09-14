'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/shared/ui/Container';
import { siteConfig } from '@/core/config/site';
import { wordReveal } from '@/lib/wordReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './AsadFeature.module.css';

/**
 * Single-product feature banner — Asad Bourbon.
 * Pure visual break between the catalog grid and the decants explainer.
 */
export function AsadFeature() {
    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent('¡Hola! Me interesa Asad Bourbon. ¿Está disponible?')}`;
    const gridRef = useScrollReveal<HTMLDivElement>();

    return (
        <section className={styles.section}>
            <Container>
                <div ref={gridRef} className={styles.grid}>
                    <Image
                        src="/images/asad-bourbon-banner-v1.png"
                        alt="Asad Bourbon de Lattafa"
                        fill
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className={styles.image}
                    />
                    <div className={styles.copy}>
                        <span className={styles.eyebrow}>Asad Bourbon &middot; Lattafa</span>
                        <h2 className={styles.title}>
                            <span className={styles.titleLine}>{wordReveal('Dura todo')}</span>
                            <span className={styles.accent}>{wordReveal('el día')}</span>
                        </h2>
                        <p className={styles.desc}>
                            Bourbon, canela y tabaco sobre un fondo ambarino. La estela que se queda en el
                            ambiente después de que te fuiste.
                        </p>
                        <a href={waUrl} target="_blank" rel="noreferrer" className={styles.cta}>
                            Consultar disponibilidad
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
