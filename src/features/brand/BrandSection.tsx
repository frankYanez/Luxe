'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { GlowingEffect } from '@/components/shared/ui/GlowingEffect';
import { wordReveal } from '@/lib/wordReveal';
import styles from './BrandSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
    {
        icon: '◎',
        stat: '12h+',
        statSub: 'duración en piel',
        title: 'Persistencia Extraordinaria',
        text: 'Los aceites esenciales de concentración ultra-alta crean una huella olfativa que perdura todo el día, sin retoques ni reapliciones.',
    },
    {
        icon: '✦',
        stat: '100%',
        statSub: 'originales de fábrica',
        title: 'Autenticidad Total',
        text: 'Trabajamos directamente con las casas perfumeras más prestigiosas de Dubai y Arabia Saudita. Cada frasco llega con sello de origen.',
    },
    {
        icon: '❋',
        stat: '+50',
        statSub: 'fragancias exclusivas',
        title: 'Ingredientes Únicos',
        text: 'Oud genuino, ámbar gris, rosa de Taif, musk oriental. Materias primas que no encontrarás en ninguna perfumería convencional.',
    },
];

/**
 * Brand Section — "¿Por qué fragancias árabes?"
 * Dark full-bleed section with animated stat pillars and a central quote.
 */
export function BrandSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const pillarsRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);

    /* ── Header reveal ── */
    useGSAP(() => {
        const el = headerRef.current;
        if (!el) return;
        const eyebrow = el.querySelector('[data-eyebrow]');
        const words = el.querySelectorAll('[data-word]');
        const desc = el.querySelector('[data-desc]');

        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        })
            .fromTo(eyebrow,
                { opacity: 0, y: 18, letterSpacing: '0.25em' },
                { opacity: 1, y: 0, letterSpacing: '0.18em', duration: 0.7, ease: 'power2.out' }
            )
            .fromTo(words,
                { y: '115%' },
                { y: '0%', duration: 0.85, stagger: 0.055, ease: 'power3.out' },
                '-=0.35'
            )
            .fromTo(desc,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
                '-=0.4'
            );
    }, { scope: headerRef });

    /* ── Pillars stagger entrance ── */
    useGSAP(() => {
        const el = pillarsRef.current;
        if (!el) return;
        const cards = el.querySelectorAll('[data-pillar]');

        gsap.fromTo(cards,
            { opacity: 0, y: 64, scale: 0.94 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                stagger: 0.13,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, { scope: pillarsRef });

    /* ── Quote line draw-in + text fade ── */
    useGSAP(() => {
        const el = quoteRef.current;
        if (!el) return;
        const line = el.querySelector('[data-line]');
        const text = el.querySelector('[data-quote-text]');

        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            },
        })
            .fromTo(line,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 1.4, ease: 'power3.inOut' }
            )
            .fromTo(text,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
                '-=0.7'
            );
    }, { scope: quoteRef });

    return (
        <section className={styles.section}>
            {/* Ambient radial glow */}
            <div className={styles.ambientGlow} aria-hidden />
            <div className={styles.ambientGlowRight} aria-hidden />

            <Container>
                {/* Header */}
                <div ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow} data-eyebrow>La diferencia árabe</span>
                    <h2 className={styles.title}>
                        {wordReveal('¿Por qué elegir')}
                        <span className={styles.titleAccent}>
                            {wordReveal('fragancias árabes?')}
                        </span>
                    </h2>
                    <p className={styles.description} data-desc>
                        El perfume árabe no es solo una fragancia — es una tradición milenaria
                        convertida en arte. Descubrí lo que lo hace verdaderamente incomparable.
                    </p>
                </div>

                {/* Pillars */}
                <div ref={pillarsRef} className={styles.pillars}>
                    {PILLARS.map(({ icon, stat, statSub, title, text }) => (
                        <div key={title} data-pillar className={styles.pillarCard}>
                            <GlowingEffect spread={200} borderWidth={1} glow />
                            <span className={styles.pillarIcon}>{icon}</span>
                            <div className={styles.statBlock}>
                                <span className={styles.statNumber}>{stat}</span>
                                <span className={styles.statSub}>{statSub}</span>
                            </div>
                            <h3 className={styles.pillarTitle}>{title}</h3>
                            <p className={styles.pillarText}>{text}</p>
                        </div>
                    ))}
                </div>

                {/* Central quote */}
                <div ref={quoteRef} className={styles.quoteBlock}>
                    <div className={styles.quoteLine} data-line />
                    <blockquote className={styles.quoteText} data-quote-text>
                        <span className={styles.quoteGlyph}>&ldquo;</span>
                        Una fragancia árabe no se usa — se vive.
                        Es memoria, identidad y presencia al mismo tiempo.
                        <span className={styles.quoteGlyph}>&rdquo;</span>
                    </blockquote>
                    <div className={styles.quoteLine} data-line style={{ marginTop: '2rem' }} />
                </div>
            </Container>
        </section>
    );
}
