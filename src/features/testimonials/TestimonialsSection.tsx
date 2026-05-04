'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { testimonials } from '@/core/data/testimonials';
import styles from './TestimonialsSection.module.css';
import { GlowingEffect } from '@/components/shared/ui/GlowingEffect';
import { wordReveal } from '@/lib/wordReveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Testimonials Section
 * Infinite scrolling marquee with GSAP-animated header.
 */
export function TestimonialsSection() {
    const headerRef = useRef<HTMLDivElement>(null);

    /* ── GSAP header reveal ── */
    useGSAP(() => {
        const el = headerRef.current;
        if (!el) return;

        const eyebrow = el.querySelector('[data-eyebrow]');
        const words = el.querySelectorAll('[data-word]');

        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 82%',
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
        <Section>
            <Container>
                <div className={styles.testimonialsContent}>
                    {/* Header */}
                    <div ref={headerRef} className={styles.header}>
                        <span className={styles.eyebrow} data-eyebrow>Voces de Tandil</span>
                        <h2 className={styles.title}>
                            {wordReveal('Lo que dicen')}
                            <span className={styles.titleAccent}>
                                {wordReveal('nuestros clientes')}
                            </span>
                        </h2>
                    </div>

                    {/* Marquee */}
                    <div className={styles.marqueeContainer}>
                        <div className={styles.marquee}>
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                                <div key={`${testimonial.id}-${index}`} className={styles.testimonialCard}>
                                    <GlowingEffect spread={160} borderWidth={1} glow />
                                    <div className={styles.cardHeader}>
                                        <div className={styles.avatar}>
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className={styles.customerInfo}>
                                            <h4 className={styles.customerName}>{testimonial.name}</h4>
                                            <p className={styles.customerLocation}>📍 {testimonial.location}</p>
                                        </div>
                                    </div>

                                    <div className={styles.rating}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className={styles.star}>★</span>
                                        ))}
                                    </div>

                                    <p className={styles.comment}>"{testimonial.comment}"</p>

                                    {testimonial.productPurchased && (
                                        <div className={styles.productTag}>
                                            🌟 {testimonial.productPurchased}
                                        </div>
                                    )}

                                    {testimonial.verified && (
                                        <div className={styles.verified}>
                                            ✓ Compra verificada
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
