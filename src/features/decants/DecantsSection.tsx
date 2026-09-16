'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import styles from './DecantsSection.module.css';
import { wordReveal } from '@/lib/wordReveal';
import DecryptedText from '@/components/DecryptedText';

gsap.registerPlugin(ScrollTrigger);

// Real bottle+decant product shots — reused here (instead of a generic
// icon grid) so the "how it works" step actually shows what a decant is.
const SHOWCASE_IMAGE = { src: '/images/decants/asad.png', alt: 'Frasco y decant de 5ml de Asad, Lattafa' };

// Same idea for the closing banner: a spread of real products, not a
// stock photo, on the light background the catalog shots already share.
const BANNER_IMAGES = [
    { src: '/images/decants/khamrah.png', alt: 'Khamrah, Lattafa' },
    { src: '/images/decants/club-de-nuit-woman.png', alt: 'Club de Nuit Woman, Armaf' },
    { src: '/images/decants/bharara-king.png', alt: 'Bharara King' },
    { src: '/images/decants/fakhar-rose.png', alt: 'Fakhar Rose, Lattafa' },
    { src: '/images/decants/asad-bourbon.png', alt: 'Asad Bourbon, Lattafa' },
];

const STEPS = [
    { num: '01', title: 'Elegís tu decant', text: 'Pagás solo 5ml del perfume 100% original en un atomizador premium. Sin compromiso, sin letra chica.' },
    { num: '02', title: 'Lo probás en tu piel', text: 'Nada de tester en papel: vivís la fragancia real, en tu piel, las veces que quieras antes de decidir.' },
    { num: '03', title: 'Si te enamorás, comprás el frasco', text: 'Te descontamos el 100% de lo que pagaste por el decant. Tu prueba termina saliendo gratis.' },
];

/**
 * Decants Educational Section
 * Explains the decant concept with a scroll-animated timeline next to a real
 * product shot, then closes with a banner spreading several real decants
 * and perfumes across a light background.
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

                    {/* Process — real product shot alongside the steps */}
                    <div className={styles.showcase}>
                        <div className={styles.showcaseVisual}>
                            <Image
                                src={SHOWCASE_IMAGE.src}
                                alt={SHOWCASE_IMAGE.alt}
                                fill
                                sizes="(max-width: 900px) 100vw, 440px"
                                className={styles.showcaseImage}
                            />
                        </div>

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
                    </div>

                    {/* Closing banner — spread of real decants + perfumes */}
                    <div className={styles.banner}>
                        <div className={styles.bannerGlow} aria-hidden />
                        <div className={styles.bannerCollage}>
                            {BANNER_IMAGES.map(({ src, alt }, i) => (
                                <div key={src} className={styles.bannerItem} data-index={i}>
                                    <Image src={src} alt={alt} fill sizes="200px" />
                                </div>
                            ))}
                        </div>
                        <div className={styles.bannerCopy}>
                            <h3>Toda la colección, también en decant</h3>
                            <p>Cada perfume de Luxe Essence tiene su versión de 5ml. Elegí, probá en tu piel, enamorate.</p>
                            <Link href="/coleccion" className={styles.bannerCta}>
                                Ver todos los decants <span aria-hidden>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
