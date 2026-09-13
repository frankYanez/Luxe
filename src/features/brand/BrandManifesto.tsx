'use client';

import React from 'react';
import { Container } from '@/components/shared/ui/Container';
import Particles from '@/components/Particles';
import SplitText from '@/components/SplitText';
import CountUp from '@/components/CountUp';
import styles from './BrandManifesto.module.css';

const GOLD_PARTICLES = ['#D4B576', '#C9A84C', '#9D7E3F'];

/**
 * Brand Manifesto — Apple-style full-bleed statement section.
 * One headline, one line of copy, one CTA. Gold particle field behind,
 * three CountUp stats below. No eyebrow, no clutter.
 */
export function BrandManifesto() {
    return (
        <section className={styles.section}>
            <div className={styles.particlesLayer}>
                <Particles
                    particleColors={GOLD_PARTICLES}
                    particleCount={140}
                    particleSpread={12}
                    speed={0.06}
                    particleBaseSize={140}
                    alphaParticles
                    disableRotation
                />
            </div>

            <Container>
                <div className={styles.content}>
                    <h2 className={styles.headline}>
                        <SplitText
                            text="Una fragancia no se usa."
                            tag="span"
                            splitType="words"
                            duration={1}
                            delay={40}
                        />
                        <br />
                        <SplitText
                            text="Se recuerda."
                            tag="span"
                            splitType="words"
                            duration={1}
                            delay={40}
                            className={styles.accentSplit}
                        />
                    </h2>

                    <p className={styles.subtext}>
                        Composiciones árabes de autor, seleccionadas para quedarse en la piel
                        y en la memoria mucho después de la primera impresión.
                    </p>

                    <a href="#catalogo" className={styles.cta}>
                        Descubrir la colección
                    </a>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>
                                <CountUp to={500} duration={2} />
                                <span className={styles.statSuffix}>+</span>
                            </span>
                            <span className={styles.statLabel}>Clientes en Tandil</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>
                                <CountUp to={100} duration={2} />
                                <span className={styles.statSuffix}>%</span>
                            </span>
                            <span className={styles.statLabel}>Originales</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statNumber}>
                                <CountUp to={48} duration={2} />
                                <span className={styles.statSuffix}>h</span>
                            </span>
                            <span className={styles.statLabel}>Envío express</span>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
