'use client';

import React, { useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { useProducts } from '@/core/hooks/useProducts';
import DriftWall, { type DriftWallItem } from '@/components/DriftWall';
import { wordReveal } from '@/lib/wordReveal';
import styles from './GaleriaWall.module.css';

gsap.registerPlugin(ScrollTrigger);

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
    const headerRef = useRef<HTMLDivElement>(null);

    const items = useMemo<DriftWallItem[]>(() => {
        const withPhotos = products
            .filter((p) => !!p.image)
            .map((p) => ({ image: p.image, title: p.name, href: '/coleccion' }));
        return withPhotos.length >= 6 ? withPhotos : [...withPhotos, ...FALLBACK_ITEMS];
    }, [products]);

    /* ── GSAP header reveal — same treatment as the rest of the site's
       section headers (eyebrow tracking-in, words sliding up) ── */
    useGSAP(() => {
        const el = headerRef.current;
        if (!el) return;

        const eyebrow = el.querySelector('[data-eyebrow]');
        const words = el.querySelectorAll('[data-word]');

        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        })
            .fromTo(eyebrow,
                { opacity: 0, y: 18, letterSpacing: '0.25em' },
                { opacity: 1, y: 0, letterSpacing: '0.1em', duration: 0.7, ease: 'power2.out' }
            )
            .fromTo(words,
                { y: '115%' },
                { y: '0%', duration: 0.85, stagger: 0.06, ease: 'power3.out' },
                '-=0.35'
            );
    }, { scope: headerRef });

    return (
        <section className={styles.section} id="galeria">
            <Container>
                <div ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow} data-eyebrow>La colección en detalle</span>
                    <h2 className={styles.title}>
                        {wordReveal('Cada frasco,')}
                        <span className={styles.titleAccent}>
                            {wordReveal('una escena.')}
                        </span>
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
