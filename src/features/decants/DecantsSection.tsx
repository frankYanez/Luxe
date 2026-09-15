'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import styles from './DecantsSection.module.css';
import { wordReveal } from '@/lib/wordReveal';
import MagicBento from '@/components/MagicBento';
import DecryptedText from '@/components/DecryptedText';

const LUXE_GOLD_RGB = '201, 168, 76';

gsap.registerPlugin(ScrollTrigger);

const BENEFITS = [
    { icon: '✦', title: '100% Original', text: 'Misma fragancia del frasco de fábrica. Sin diluciones ni alteraciones.' },
    { icon: '◈', title: 'Te sale gratis', text: 'Comprás el frasco después y te descontamos cada peso que pagaste por el decant.' },
    { icon: '◎', title: 'Cero Riesgo', text: 'Lo probás en tu piel antes de gastar en el frasco completo. Sin apuros.' },
    { icon: '❋', title: 'Variedad', text: 'Armá tu colección con múltiples fragancias para cada ocasión.' },
];

const STEPS = [
    { num: '01', title: 'Elegís tu decant', text: 'Pagás solo 5ml del perfume 100% original en un atomizador premium. Sin compromiso, sin letra chica.' },
    { num: '02', title: 'Lo probás en tu piel', text: 'Nada de tester en papel: vivís la fragancia real, en tu piel, las veces que quieras antes de decidir.' },
    { num: '03', title: 'Si te enamorás, comprás el frasco', text: 'Te descontamos el 100% de lo que pagaste por el decant. Tu prueba termina saliendo gratis.' },
];

/**
 * Decants Educational Section
 * Explains the decant concept with scroll-animated timeline and benefits grid.
 */
export function DecantsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

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

    return (
        <Section id="decants">
            <Container>
                <div ref={sectionRef} className={styles.decantsContent}>
                    {/* Header */}
                    <div ref={headerRef} className={styles.header}>
                        <span className={styles.eyebrow} data-eyebrow>Probá sin arriesgar</span>
                        <h2 className={styles.title}>
                            {wordReveal('Lujo fraccionado:')}
                            <span className={styles.titleAccent}>
                                {wordReveal('tu decant sale gratis')}
                            </span>
                        </h2>
                        <p className={styles.description} data-desc>
                            Pagás solo el decant: 5ml del perfume original, extraído del frasco de fábrica.
                            ¿Te enamoraste? Comprás el frasco completo y te descontamos <strong>el 100%</strong> de
                            lo que ya pagaste por el decant. Así, probar una fragancia de lujo termina saliéndote gratis.
                        </p>
                    </div>

                    {/* Process Timeline */}
                    <div ref={timelineRef} className={styles.timeline}>
                        {/* Animated vertical line */}
                        <span data-timeline-line className={styles.timelineLine} />

                        {STEPS.map(({ num, title, text }) => (
                            <div key={num} data-timeline-item className={styles.timelineItem}>
                                <div className={styles.timelineIcon}>
                                    <DecryptedText
                                        text={num}
                                        className={styles.iconNumber}
                                        encryptedClassName={styles.iconNumber}
                                        animateOn="view"
                                        speed={40}
                                        maxIterations={8}
                                    />
                                </div>
                                <div className={styles.timelineContent}>
                                    <h3 className={styles.timelineTitle}>{title}</h3>
                                    <p className={styles.timelineText}>{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Benefits Grid — react-bits MagicBento */}
                    <div className={styles.benefitsGrid}>
                        <MagicBento
                            cards={BENEFITS.map(({ icon, title, text }) => ({ icon, title, description: text }))}
                            glowColor={LUXE_GOLD_RGB}
                            spotlightRadius={260}
                            particleCount={8}
                            enableTilt
                            enableBorderGlow
                            enableStars
                            clickEffect
                            enableMagnetism
                        />
                    </div>
                </div>
            </Container>
        </Section>
    );
}
