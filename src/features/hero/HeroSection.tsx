'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Button } from '@/components/shared/ui/Button';
import { ShinyButton } from './ShinyButton';
import styles from './HeroSection.module.css';
import Image from 'next/image';

/**
 * Hero Section
 * Dramatic GSAP entrance timeline with word-by-word title reveal.
 */
export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    /* ── Master entrance timeline ── */
    useGSAP(() => {
        const titleWords = titleRef.current?.querySelectorAll('[data-word]');

        const tl = gsap.timeline({ delay: 0.25 });

        /* Badge */
        tl.fromTo(badgeRef.current,
            { opacity: 0, y: 24, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' }
        )

            /* Title words — clip reveal from bottom */
            .fromTo(titleWords ?? [],
                { y: '115%' },
                { y: '0%', duration: 0.9, stagger: 0.055, ease: 'power3.out' },
                '-=0.25'
            )

            /* Description */
            .fromTo(descRef.current,
                { opacity: 0, y: 32 },
                { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
                '-=0.5'
            )

            /* CTAs */
            .fromTo(ctaRef.current,
                { opacity: 0, y: 24, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' },
                '-=0.45'
            )

            /* Stats */
            .fromTo(statsRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                '-=0.35'
            )

            /* Visual images */
            .fromTo(visualRef.current,
                { opacity: 0, x: 60, scale: 0.92 },
                { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
                '-=0.8'
            );
    }, { scope: heroRef });

    return (
        <section ref={heroRef} className={styles.hero}>
            <Container>
                <div className={styles.heroContent}>
                    {/* Left: text */}
                    <div className={styles.heroText}>
                        <div ref={badgeRef} className={styles.badge}>
                            <span className={styles.badgeIcon}>✦</span>
                            Exclusivo en Tandil
                        </div>

                        <h1 ref={titleRef} className={styles.heroTitle}>
                            {/* "Luxe Essence" — word-by-word reveal */}
                            {['Luxe', 'Essence'].map((word, i) => (
                                <span
                                    key={i}
                                    style={{
                                        display: 'inline-block',
                                        overflow: 'hidden',
                                        verticalAlign: 'bottom',
                                        lineHeight: 1.15,
                                    }}
                                >
                                    <span data-word style={{ display: 'inline-block' }}>
                                        {word}{i === 0 ? '\u00A0' : ''}
                                    </span>
                                </span>
                            ))}

                            <span className={styles.subtitle}>
                                {/* Subtitle line — also word-by-word */}
                                {['El', 'arte', 'prohibido', 'de', 'las', 'fragancias', 'árabes'].map((word, i, arr) => (
                                    <span
                                        key={i}
                                        style={{
                                            display: 'inline-block',
                                            overflow: 'hidden',
                                            verticalAlign: 'bottom',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        <span data-word style={{ display: 'inline-block' }}>
                                            {word}{i < arr.length - 1 ? '\u00A0' : ''}
                                        </span>
                                    </span>
                                ))}
                            </span>
                        </h1>

                        <p ref={descRef} className={styles.heroDescription}>
                            Descubrí el misticismo de Oriente a través de perfumes que cuentan historias milenarias.
                            Fragancias intensas, seductoras y únicas que transforman tu presencia.
                        </p>

                        <div ref={ctaRef} className={styles.ctaGroup}>
                            <ShinyButton href="#catalogo">
                                Descubrí tu Esencia
                            </ShinyButton>
                            <Button variant="secondary" href="/coleccion">
                                Ver Colección Completa
                            </Button>
                        </div>

                        <div ref={statsRef} className={styles.heroStats}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>8-12h</span>
                                <span className={styles.statLabel}>Duración</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>Originales</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>24/7</span>
                                <span className={styles.statLabel}>WhatsApp</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: images */}
                    <div ref={visualRef} className={styles.heroVisual}>
                        <Image
                            src="/images/Honor.png"
                            alt="Perfume Showcase"
                            width={800}
                            height={800}
                            className={styles.heroImage2}
                            priority
                        />
                        <Image
                            src="/images/club-de-nuit.png"
                            alt="Perfume Showcase"
                            width={500}
                            height={500}
                            className={styles.heroImage}
                            priority
                        />

                        {/* Floating Badges */}
                        <div className={`${styles.floatingBadge} ${styles.badgeOriginal}`}>
                            <span>✨</span> 100% Original
                        </div>
                        <div className={`${styles.floatingBadge} ${styles.badgeDiscount}`}>
                            <span>💵</span> 10% OFF Efectivo
                        </div>
                    </div>
                </div>
            </Container>


        </section>
    );
}
