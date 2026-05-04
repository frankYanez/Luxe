'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { wordReveal } from '@/lib/wordReveal';
import styles from './GaleriaSection.module.css';

gsap.registerPlugin(ScrollTrigger);

/* Gallery card definitions — mix of product images and atmospheric text cards */
const CARDS = [
    {
        type: 'image' as const,
        src: '/images/hero/khamrah-hero.png',
        alt: 'Khamrah — Lattafa',
        label: 'Khamrah · Lattafa',
        size: 'tall',          // spans 2 rows
    },
    {
        type: 'image' as const,
        src: '/images/hero/aqua.JPG',
        alt: 'Colección Aqua',
        label: 'Colección Aqua',
        size: 'normal',
    },
    {
        type: 'text' as const,
        heading: 'El arte del oud',
        body: 'La madera de agarwood fermentada durante décadas — el ingrediente más preciado del mundo árabe.',
        accent: '✦',
        size: 'normal',
    },
    {
        type: 'image' as const,
        src: '/images/Honor.png',
        alt: 'Honor — colección premium',
        label: 'Honor · Premium',
        size: 'tall',
    },
    {
        type: 'image' as const,
        src: '/images/club-de-nuit.png',
        alt: 'Club de Nuit',
        label: 'Club de Nuit · Armaf',
        size: 'normal',
    },
    {
        type: 'text' as const,
        heading: 'Probalo primero',
        body: 'Nuestros decants de 5ml te permiten descubrir la fragancia perfecta antes de invertir en el frasco completo.',
        accent: '◈',
        size: 'normal',
        cta: { text: 'Ver Decants', href: '#decants' },
    },
    {
        type: 'image' as const,
        src: '/videos/banners/masculine-banner.png',
        alt: 'Fragancias Masculinas',
        label: 'Colección Masculina',
        size: 'wide',
    },
    {
        type: 'image' as const,
        src: '/videos/banners/feminine-banner.png',
        alt: 'Fragancias Femeninas',
        label: 'Colección Femenina',
        size: 'normal',
    },
];

/**
 * Galeria Section — Visual brand story
 * Asymmetric CSS Grid masonry with GSAP ScrollTrigger.batch entrance.
 */
export function GaleriaSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

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

    /* ── Grid cards — ScrollTrigger.batch stagger ── */
    useGSAP(() => {
        const el = gridRef.current;
        if (!el) return;

        ScrollTrigger.batch(el.querySelectorAll('[data-card]'), {
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.85,
                    stagger: 0.08,
                    ease: 'power3.out',
                    overwrite: true,
                }),
            start: 'top 88%',
        });

        /* Set initial state for all cards */
        gsap.set(el.querySelectorAll('[data-card]'), {
            opacity: 0,
            y: 48,
            scale: 0.96,
        });
    }, { scope: gridRef });

    return (
        <section className={styles.section} id="galeria">
            <Container>
                {/* Header */}
                <div ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow} data-eyebrow>Nuestra colección</span>
                    <h2 className={styles.title}>
                        {wordReveal('El lujo que')}
                        <span className={styles.titleAccent}>
                            {wordReveal('se puede ver')}
                        </span>
                    </h2>
                    <p className={styles.description} data-desc>
                        Cada frasco es una obra de arte. Desde el diseño orientalista hasta la
                        caligrafía árabe — el lujo comienza antes de abrir el tapón.
                    </p>
                </div>

                {/* Masonry grid */}
                <div ref={gridRef} className={styles.grid}>
                    {CARDS.map((card, i) => (
                        <div
                            key={i}
                            data-card
                            className={`${styles.card} ${styles[`card--${card.size}`]}`}
                        >
                            {card.type === 'image' ? (
                                <div className={styles.imageCard}>
                                    <Image
                                        src={card.src}
                                        alt={card.alt}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className={styles.imageOverlay}>
                                        <span className={styles.imageLabel}>{card.label}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.textCard}>
                                    <span className={styles.textCardAccent}>{card.accent}</span>
                                    <h3 className={styles.textCardHeading}>{card.heading}</h3>
                                    <p className={styles.textCardBody}>{card.body}</p>
                                    {card.cta && (
                                        <a href={card.cta.href} className={styles.textCardCta}>
                                            {card.cta.text} →
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
