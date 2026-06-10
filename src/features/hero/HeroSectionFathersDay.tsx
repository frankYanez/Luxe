'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { ShinyButton } from './ShinyButton';
import styles from './HeroSectionFathersDay.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/core/config/site';

const FATHER_DAY = new Date('2026-06-21T00:00:00-03:00');

function useDaysLeft(target: Date) {
    const calc = () => Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000));
    const [days, setDays] = useState(0);
    useEffect(() => {
        setDays(calc());
        const id = setInterval(() => setDays(calc()), 60000);
        return () => clearInterval(id);
    }, []);
    return days;
}

/**
 * Hero — Día del Padre edition
 * Para revertir: en page.tsx reemplazar <HeroSectionFathersDay /> por <HeroSection />
 *
 * Fondo (opcional): colocá tu imagen en /images/hero/fathers-day-bg.jpg
 * y descomentá la línea bgImage en el JSX.
 */
export function HeroSectionFathersDay() {
    const heroRef    = useRef<HTMLElement>(null);
    const badgeRef   = useRef<HTMLDivElement>(null);
    const titleRef   = useRef<HTMLHeadingElement>(null);
    const descRef    = useRef<HTMLParagraphElement>(null);
    const ctaRef     = useRef<HTMLDivElement>(null);
    const statsRef   = useRef<HTMLDivElement>(null);
    const visualRef  = useRef<HTMLDivElement>(null);
    const glowRef    = useRef<HTMLDivElement>(null);

    const daysLeft = useDaysLeft(FATHER_DAY);
    const waMsg = encodeURIComponent('Hola! 🎁 Quiero elegir un perfume de regalo para el Día del Padre. ¿Me ayudás a elegir?');
    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${waMsg}`;

    /* ── Master entrance timeline ── */
    useGSAP(() => {
        const titleWords = titleRef.current?.querySelectorAll('[data-word]');
        const tl = gsap.timeline({ delay: 0.2 });

        tl.fromTo(glowRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1.4, ease: 'power2.out' }
        )
        .fromTo(badgeRef.current,
            { opacity: 0, y: 24, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' },
            '-=1.0'
        )
        .fromTo(titleWords ?? [],
            { y: '115%' },
            { y: '0%', duration: 0.85, stagger: 0.06, ease: 'power3.out' },
            '-=0.3'
        )
        .fromTo(descRef.current,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
            '-=0.45'
        )
        .fromTo(ctaRef.current,
            { opacity: 0, y: 22, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
        )
        .fromTo(statsRef.current,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
            '-=0.3'
        )
        .fromTo(visualRef.current,
            { opacity: 0, x: 55, scale: 0.93 },
            { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
            '-=0.9'
        );

        /* Continuous glow pulse */
        gsap.to(glowRef.current, {
            scale: 1.08,
            opacity: 0.75,
            duration: 4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
    }, { scope: heroRef });

    const titleParts = [
        { text: 'Para el hombre', cls: '' },
        { text: 'que lo merece todo.', cls: styles.titleGold },
    ];

    return (
        <section ref={heroRef} className={styles.hero}>

            {/* ── Background layers ── */}
            <div className={styles.bgBase} />

            {/*
              Background image (optional):
              Generá la imagen con el prompt de abajo y guardala en /public/images/hero/fathers-day-bg.jpg
              Luego descomentá este bloque:

              <Image
                  src="/images/hero/fathers-day-bg.jpg"
                  alt=""
                  fill
                  className={styles.bgImage}
                  priority
                  quality={90}
              />
            */}

            <div ref={glowRef} className={styles.bgGlow} />
            <div className={styles.bgGrid} aria-hidden="true" />

            {/* Floating particles (CSS-driven) */}
            <div className={styles.particles} aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className={`${styles.particle} ${styles[`p${i}`]}`} />
                ))}
            </div>

            <Container>
                <div className={styles.heroContent}>

                    {/* ── Left: text ── */}
                    <div className={styles.heroText}>

                        <div ref={badgeRef} className={styles.badge}>
                            <span className={styles.badgeDot} />
                            DÍA DEL PADRE &nbsp;·&nbsp; 21 DE JUNIO
                        </div>

                        <h1 ref={titleRef} className={styles.heroTitle}>
                            {titleParts.map(({ text, cls }, lineIdx) => (
                                <span key={lineIdx} className={`${styles.titleLine} ${cls}`}>
                                    {text.split(' ').map((word, wi, arr) => (
                                        <span
                                            key={wi}
                                            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', lineHeight: 1.12 }}
                                        >
                                            <span data-word style={{ display: 'inline-block' }}>
                                                {word}{wi < arr.length - 1 ? ' ' : ''}
                                            </span>
                                        </span>
                                    ))}
                                </span>
                            ))}
                            <em className={styles.titleTagline}>El regalo que perdura.</em>
                        </h1>

                        <p ref={descRef} className={styles.heroDesc}>
                            Sorprendé a papá con una fragancia árabe de lujo. Perfumes originales
                            que definen carácter, intensidad y elegancia — el regalo que nunca olvidará.
                        </p>

                        <div ref={ctaRef} className={styles.ctaGroup}>
                            <ShinyButton href="/coleccion">
                                🎁 Regalá perfume a papá
                            </ShinyButton>
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.btnWa}>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Consultá por WhatsApp
                            </a>
                        </div>

                        <div ref={statsRef} className={styles.heroStats}>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>{daysLeft > 0 ? daysLeft : '🎉'}</span>
                                <span className={styles.statLbl}>{daysLeft > 0 ? 'Días restantes' : '¡Hoy!'}</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNum}>100%</span>
                                <span className={styles.statLbl}>Originales</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNum}>24/7</span>
                                <span className={styles.statLbl}>WhatsApp</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: product visuals ── */}
                    <div ref={visualRef} className={styles.heroVisual}>
                        {/* Back product */}
                        <Image
                            src="/images/bharara.png"
                            alt="Bharara King"
                            width={600}
                            height={700}
                            className={styles.imgBack}
                            priority
                            sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 600px"
                        />
                        <Image
                            src="/images/asad.jpg"
                            alt="Lattafa Asad"
                            width={480}
                            height={560}
                            className={styles.imgFront}
                            priority
                            sizes="(max-width: 768px) 240px, (max-width: 1024px) 320px, 480px"
                        />

                        {/* Floating badges */}
                        <div className={`${styles.floatBadge} ${styles.badge1}`}>
                            <span>🎁</span> Regalo Perfecto
                        </div>
                        <div className={`${styles.floatBadge} ${styles.badge2}`}>
                            <span>⚡</span> Envío Express
                        </div>

                        {/* Decorative ring */}
                        <div className={styles.visualRing} aria-hidden="true" />
                    </div>

                </div>
            </Container>

            {/* Bottom fade */}
            <div className={styles.bottomFade} aria-hidden="true" />
        </section>
    );
}
