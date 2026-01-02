'use client';

import React from 'react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import styles from './DecantsSection.module.css';

/**
 * Decants Educational Section
 * Explains the decant concept with asymmetric layout and animated timeline
 */
export function DecantsSection() {
    return (
        <Section id="decants">
            <Container>
                <div className={styles.decantsContent}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className={styles.eyebrow}>La Puerta de Entrada</span>
                        <h2 className={styles.title}>
                            Lujo fraccionado:
                            <span className={styles.titleAccent}> ¿Qué son los Decants?</span>
                        </h2>
                        <p className={styles.description}>
                            Un decant es una porción de perfume original extraída directamente del frasco de fábrica
                            y transferida a un atomizador de vidrio premium. Es la forma perfecta de experimentar
                            fragancias de lujo sin comprometer la calidad ni la autenticidad.
                        </p>
                    </div>

                    {/* Process Timeline */}
                    <div className={styles.timeline}>
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>
                                <span className={styles.iconNumber}>01</span>
                            </div>
                            <div className={styles.timelineContent}>
                                <h3 className={styles.timelineTitle}>Frasco Original</h3>
                                <p className={styles.timelineText}>
                                    Comenzamos con perfumes 100% originales de las casas más prestigiosas de Medio Oriente.
                                </p>
                            </div>
                        </div>

                        <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>
                                <span className={styles.iconNumber}>02</span>
                            </div>
                            <div className={styles.timelineContent}>
                                <h3 className={styles.timelineTitle}>Extracción Cuidadosa</h3>
                                <p className={styles.timelineText}>
                                    Con técnicas profesionales, transferimos el perfume preservando cada nota intacta.
                                </p>
                            </div>
                        </div>

                        <div className={styles.timelineItem}>
                            <div className={styles.timelineIcon}>
                                <span className={styles.iconNumber}>03</span>
                            </div>
                            <div className={styles.timelineContent}>
                                <h3 className={styles.timelineTitle}>Atomizador Premium</h3>
                                <p className={styles.timelineText}>
                                    Empaquetado en frascos de vidrio de alta calidad con atomizador profesional.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefits Grid */}
                    <div className={styles.benefitsGrid}>
                        <div className={`${styles.benefitCard} glass`}>
                            <div className={styles.benefitIcon}>✦</div>
                            <h4 className={styles.benefitTitle}>100% Original</h4>
                            <p className={styles.benefitText}>
                                Misma fragancia del frasco de fábrica. Sin diluciones ni alteraciones.
                            </p>
                        </div>

                        <div className={`${styles.benefitCard} glass`}>
                            <div className={styles.benefitIcon}>💰</div>
                            <h4 className={styles.benefitTitle}>Accesible</h4>
                            <p className={styles.benefitText}>
                                Probá fragancias de lujo sin invertir en el frasco completo.
                            </p>
                        </div>

                        <div className={`${styles.benefitCard} glass`}>
                            <div className={styles.benefitIcon}>🎯</div>
                            <h4 className={styles.benefitTitle}>Sin Riesgos</h4>
                            <p className={styles.benefitText}>
                                Descubrí tu fragancia perfecta antes de comprometerte con un frasco completo.
                            </p>
                        </div>

                        <div className={`${styles.benefitCard} glass`}>
                            <div className={styles.benefitIcon}>🌟</div>
                            <h4 className={styles.benefitTitle}>Variedad</h4>
                            <p className={styles.benefitText}>
                                Armá tu colección con múltiples fragancias para cada ocasión.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
