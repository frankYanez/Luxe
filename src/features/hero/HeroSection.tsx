'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Button } from '@/components/shared/ui/Button';
import { ShinyButton } from './ShinyButton';
import { siteConfig } from '@/core/config/site';
import styles from './HeroSection.module.css';
import Image from 'next/image';

/**
 * Hero Section
 * Dramatic GSAP entrance timeline with word-by-word title reveal,
 * followed by a bento-grid spotlight (best seller, cash discount, trust stats).
 */
export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const bentoRef = useRef<HTMLDivElement>(null);

    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent('¡Hola! Me interesa Club de Nuit Intense Man. ¿Está disponible?')}`;

    /* ── Master entrance timeline ── */
    useGSAP(() => {
        const titleWords = titleRef.current?.querySelectorAll('[data-word]');

        const tl = gsap.timeline({ delay: 0.25 });

        tl.fromTo(badgeRef.current,
            { opacity: 0, y: 24, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' }
        )
            .fromTo(titleWords ?? [],
                { y: '115%' },
                { y: '0%', duration: 0.9, stagger: 0.055, ease: 'power3.out' },
                '-=0.25'
            )
            .fromTo(descRef.current,
                { opacity: 0, y: 32 },
                { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' },
                '-=0.5'
            )
            .fromTo(ctaRef.current,
                { opacity: 0, y: 24, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' },
                '-=0.45'
            )
            .fromTo(bentoRef.current,
                { opacity: 0, y: 36 },
                { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
                '-=0.35'
            );
    }, { scope: heroRef });

    return (
        <section ref={heroRef} className={styles.hero}>
            <div className={styles.heroBackground} aria-hidden>
                <span className={styles.orb} />
                <span className={styles.orb2} />
                <span className={styles.dotGrid} />
            </div>
            <Container>
                <div className={styles.heroText}>
                    <div ref={badgeRef} className={styles.badge}>
                        <span className={styles.badgeIcon}>✦</span>
                        Exclusivo en Tandil
                    </div>

                    <h1 ref={titleRef} className={styles.heroTitle}>
                        {['Luxe', 'Essence'].map((word, i) => (
                            <span key={i} className={styles.wordMask}>
                                <span data-word className={styles.wordInline}>
                                    {word}{i === 0 ? ' ' : ''}
                                </span>
                            </span>
                        ))}

                        <span className={styles.subtitle}>
                            {['El', 'arte', 'prohibido', 'de', 'las', 'fragancias', 'árabes'].map((word, i, arr) => (
                                <span key={i} className={styles.wordMask}>
                                    <span data-word className={styles.wordInline}>
                                        {word}{i < arr.length - 1 ? ' ' : ''}
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
                </div>

                {/* Bento spotlight grid */}
                <div ref={bentoRef} className={styles.bento}>
                    <div className={styles.spotlightCard}>
                        <span className={styles.spotlightGlow} aria-hidden />
                        <div className={styles.spotlightImage}>
                            <Image
                                src="/images/club-de-nuit-intense-man.png"
                                alt="Club de Nuit Intense Man de Armaf — perfume árabe en Luxe Essence Tandil"
                                width={600}
                                height={750}
                                className={styles.spotlightImg}
                                priority
                            />
                        </div>
                        <div className={styles.spotlightCopy}>
                            <span className={styles.spotlightTag}>Más pedido</span>
                            <h3 className={styles.spotlightTitle}>Club de Nuit</h3>
                            <p className={styles.spotlightNote}>Piña, limón y abedul. La estela más reconocida.</p>
                            <a href={waUrl} target="_blank" rel="noreferrer" className={styles.spotlightCta}>
                                $75.000 &middot; Pedir &rarr;
                            </a>
                        </div>
                    </div>

                    <div className={styles.promoCard}>
                        <span className={styles.promoBeam} aria-hidden />
                        <span className={styles.promoLabel}>Beneficios</span>
                        <span className={styles.promoTitle}>10% off<br />efectivo</span>
                        <span className={styles.promoText}>3 cuotas sin interés · Envío gratis en Tandil · Envíos a todo el país.</span>
                    </div>

                    <div className={styles.statsStack}>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>Duración</span>
                            <span className={styles.statValue}>8-12H</span>
                        </div>
                        <div className={styles.statRow}>
                            <span className={styles.statLabel}>Originales</span>
                            <span className={styles.statValue}>100%</span>
                        </div>
                        <div className={`${styles.statRow} ${styles.statRowAccent}`}>
                            <span className={styles.statLabel}>WhatsApp</span>
                            <span className={styles.statValue}>24/7</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
