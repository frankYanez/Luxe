'use client';

import React from 'react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { testimonials } from '@/core/data/testimonials';
import styles from './TestimonialsSection.module.css';

/**
 * Testimonials Section
 * Infinite scrolling marquee with customer reviews from Tandil
 */
export function TestimonialsSection() {
    return (
        <Section>
            <Container>
                <div className={styles.testimonialsContent}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className={styles.eyebrow}>Voces de Tandil</span>
                        <h2 className={styles.title}>
                            Lo que dicen
                            <span className={styles.titleAccent}> nuestros clientes</span>
                        </h2>
                    </div>

                    {/* Marquee */}
                    <div className={styles.marqueeContainer}>
                        <div className={styles.marquee}>
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                                <div key={`${testimonial.id}-${index}`} className={styles.testimonialCard}>
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
