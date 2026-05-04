'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import styles from './DecantsSection.module.css';
import { GlowingEffect } from '@/components/shared/ui/GlowingEffect';
import { wordReveal } from '@/lib/wordReveal';

gsap.registerPlugin(ScrollTrigger);

const BENEFITS = [
    { icon: '✦', title: '100% Original', text: 'Misma fragancia del frasco de fábrica. Sin diluciones ni alteraciones.' },
    { icon: '◈', title: 'Accesible', text: 'Probá fragancias de lujo sin invertir en el frasco completo.' },
    { icon: '◎', title: 'Sin Riesgos', text: 'Descubrí tu fragancia perfecta antes de comprometerte con un frasco completo.' },
    { icon: '❋', title: 'Variedad', text: 'Armá tu colección con múltiples fragancias para cada ocasión.' },
];

const STEPS = [
    { num: '01', title: 'Frasco Original', text: 'Comenzamos con perfumes 100% originales de las casas más prestigiosas de Medio Oriente.' },
    { num: '02', title: 'Extracción Cuidadosa', text: 'Con técnicas profesionales, transferimos el perfume preservando cada nota intacta.' },
    { num: '03', title: 'Atomizador Premium', text: 'Empaquetado en frascos de vidrio de alta calidad con atomizador profesional.' },
];

/**
 * Decants Educational Section
 * Explains the decant concept with scroll-animated timeline and benefits grid.
 */
export function DecantsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const benefitsRef = useRef<HTMLDivElement>(null);

    /* ── GSAP header reveal ── */
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
            { opacity: 1, y: 0, letterSpacing: '0.1em', duration: 0.7, ease: 'power2.out' }
        )
        .fromTo(words,
            { y: '115%' },
            { y: '0%', duration: 0.85, stagger: 0.06, ease: 'power3.out' },
            '-=0.35'
        )
        .fromTo(desc,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            '-=0.4'
        );
    }, { scope: headerRef });

    /* ── GSAP timeline items — alternate slide in ── */
    useGSAP(() => {
        const el = timelineRef.current;
        if (!el) return;

        const items = el.querySelectorAll('[data-timeline-item]');

        items.forEach((item, i) => {
            gsap.fromTo(item,
                {
                    opacity: 0,
                    x: -60,
                    scale: 0.96,
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                    delay: i * 0.08,
                }
            );
        });

        /* Animate the vertical line drawing in */
        const line = el.querySelector('[data-timeline-line]');
        if (line) {
            gsap.fromTo(line,
                { scaleY: 0, transformOrigin: 'top center' },
                {
                    scaleY: 1,
                    duration: 1.2,
                    ease: 'power2.inOut',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 75%',
                        toggleActions: 'play none none none',
                    },
                }
            );
        }
    }, { scope: timelineRef });

    /* ── GSAP benefits grid stagger ── */
    useGSAP(() => {
        const el = benefitsRef.current;
        if (!el) return;

        const cards = el.querySelectorAll('[data-benefit]');

        gsap.fromTo(cards,
            { opacity: 0, y: 50, scale: 0.92 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, { scope: benefitsRef });

    return (
        <Section id="decants">
            <Container>
                <div ref={sectionRef} className={styles.decantsContent}>
                    {/* Header */}
                    <div ref={headerRef} className={styles.header}>
                        <span className={styles.eyebrow} data-eyebrow>La Puerta de Entrada</span>
                        <h2 className={styles.title}>
                            {wordReveal('Lujo fraccionado:')}
                            <span className={styles.titleAccent}>
                                {wordReveal('¿Qué son los Decants?')}
                            </span>
                        </h2>
                        <p className={styles.description} data-desc>
                            Un decant es una porción de perfume original extraída directamente del frasco de fábrica
                            y transferida a un atomizador de vidrio premium. Es la forma perfecta de experimentar
                            fragancias de lujo sin comprometer la calidad ni la autenticidad.
                        </p>
                    </div>

                    {/* Process Timeline */}
                    <div ref={timelineRef} className={styles.timeline}>
                        {/* Animated vertical line */}
                        <span data-timeline-line className={styles.timelineLine} />

                        {STEPS.map(({ num, title, text }) => (
                            <div key={num} data-timeline-item className={styles.timelineItem}>
                                <div className={styles.timelineIcon}>
                                    <span className={styles.iconNumber}>{num}</span>
                                </div>
                                <div className={styles.timelineContent}>
                                    <h3 className={styles.timelineTitle}>{title}</h3>
                                    <p className={styles.timelineText}>{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benefits Grid */}
                    <div ref={benefitsRef} className={styles.benefitsGrid}>
                        {BENEFITS.map(({ icon, title, text }) => (
                            <div key={title} data-benefit className={styles.benefitCard}>
                                <GlowingEffect spread={160} borderWidth={1} glow />
                                <div className={styles.benefitIcon}>{icon}</div>
                                <h4 className={styles.benefitTitle}>{title}</h4>
                                <p className={styles.benefitText}>{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
