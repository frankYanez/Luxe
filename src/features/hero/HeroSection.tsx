'use client';

import React from 'react';
import { Container } from '@/components/shared/ui/Container';
import { Button } from '@/components/shared/ui/Button';
import { ShinyButton } from './ShinyButton';
import styles from './HeroSection.module.css';
import Image from 'next/image';
import ColorBends from '@/components/backgrounds/Blends';
import globalStyles from '@/styles/global.module.css';

/**
 * Hero Section Component
 * Immersive 3D hero with luxury aesthetics and emotional copy
 */
export function HeroSection() {
    return (
        <section className={styles.hero}>
            {/* Prism Animated Background */}
            <ColorBends
                className={styles.heroBackground}
                colors={["#C5A059", "#C5A059", "#C5A059"]}
                rotation={30}
                speed={1}
                scale={0.5}
                frequency={1.4}
                warpStrength={1.2}
                mouseInfluence={0.8}
                parallax={0.1}
                noise={0.08}
                transparent
            />

            {/* Gradient Overlay */}
            {/* <div className={styles.gradientOverlay} /> */}

            <Container>
                <div className={styles.heroContent}>
                    {/* Left Content */}
                    <div className={styles.heroText}>
                        <div className={styles.badge}>
                            <span className={styles.badgeIcon}>✦</span>
                            Exclusivo en Tandil
                        </div>

                        <h1 className={styles.heroTitle}>
                            Luxe Essence
                            <span className={styles.subtitle}>
                                El arte prohibido de las fragancias árabes
                            </span>
                        </h1>

                        <p className={styles.heroDescription}>
                            Descubrí el misticismo de Oriente a través de perfumes que cuentan historias milenarias.
                            Fragancias intensas, seductoras y únicas que transforman tu presencia.
                        </p>

                        <div className={styles.ctaGroup}>
                            <ShinyButton href="#catalogo">
                                Descubrí tu Esencia
                            </ShinyButton>

                            <Button variant="secondary" href="#decants">
                                ¿Qué son los Decants?
                            </Button>
                        </div>

                        <div className={styles.heroStats}>
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

                    {/* Right Content - 3D Perfume Showcase */}
                    <div className={styles.heroVisual}>
                        {/* <PerfumeShowcase3D /> */}
                        <Image
                            src="/images/Honor.png"
                            alt="Perfume Showcase"
                            width={800}
                            height={800}
                            className={styles.heroImage2}
                        />
                        <Image
                            src="/images/club-de-nuit.png"
                            alt="Perfume Showcase"
                            width={500}
                            height={500}
                            className={styles.heroImage}
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

            {/* Scroll Indicator */}
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollMouse}>
                    <div className={styles.scrollWheel} />
                </div>
                <span className={styles.scrollText}>Deslizá para explorar</span>
            </div>
        </section>
    );
}
