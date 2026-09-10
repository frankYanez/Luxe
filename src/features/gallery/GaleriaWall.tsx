'use client';

import React, { useMemo } from 'react';
import { Container } from '@/components/shared/ui/Container';
import { useProducts } from '@/core/hooks/useProducts';
import DriftWall, { type DriftWallItem } from '@/components/DriftWall';
import BlurText from '@/components/BlurText';
import styles from './GaleriaWall.module.css';

const FALLBACK_ITEMS: DriftWallItem[] = [
    { image: '/images/Honor.png', title: 'Honor' },
    { image: '/images/club-de-nuit.png', title: 'Club de Nuit Intense Man' },
];

/**
 * Product gallery wall — react-bits DriftWall, drifting columns of real
 * product photography, tilted in perspective, lifting on hover.
 */
export function GaleriaWall() {
    const { products } = useProducts({ autoFetch: true });

    const items = useMemo<DriftWallItem[]>(() => {
        const withPhotos = products
            .filter((p) => !!p.image)
            .map((p) => ({ image: p.image, title: p.name, href: '/coleccion' }));
        return withPhotos.length >= 6 ? withPhotos : [...withPhotos, ...FALLBACK_ITEMS];
    }, [products]);

    return (
        <section className={styles.section} id="galeria">
            <Container>
                <div className={styles.header}>
                    <span className={styles.eyebrow}>La colección en detalle</span>
                    <h2 className={styles.title}>
                        <BlurText text="Cada frasco, una escena." animateBy="words" delay={50} />
                    </h2>
                </div>
            </Container>

            <div className={styles.wallWrap}>
                <DriftWall
                    items={items}
                    columns={5}
                    tileWidth={210}
                    tileHeight={280}
                    gap={16}
                    radius={18}
                    tilt={14}
                    turn={-12}
                    depth={140}
                    speed={30}
                    variance={0.4}
                    parallax={0.5}
                    pauseOnHover
                    lift={40}
                    dim={0.95}
                    fade={0.85}
                    overlayColor="#0f0f0f"
                />
            </div>
        </section>
    );
}
