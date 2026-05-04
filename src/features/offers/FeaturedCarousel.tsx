'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { useProducts } from '@/core/hooks/useProducts';
import { siteConfig } from '@/core/config/site';
import styles from './FeaturedCarousel.module.css';
import { GlowingEffect } from '@/components/shared/ui/GlowingEffect';
import { wordReveal } from '@/lib/wordReveal';

gsap.registerPlugin(ScrollTrigger);

/**
 * Featured Products Carousel
 * Auto-playing carousel showcasing featured perfumes with fade edges
 */
export function FeaturedCarousel() {
    const [isPaused, setIsPaused] = useState(false);
    const { products, loading } = useProducts({ featured: true });
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

    // Si está cargando, mostrar placeholders
    const displayProducts = loading ? [] : products;

    // Duplicar productos para loop infinito
    const loopProducts = [...displayProducts, ...displayProducts];

    const handleWhatsAppClick = (productName: string, brand: string) => {
        const message = `¡Hola! Me interesa ${productName} de ${brand}. ¿Está disponible?`;
        const url = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading || displayProducts.length === 0) {
        return null; // O mostrar skeleton
    }

    return (
        <Section>
            <Container>
                <div ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow} data-eyebrow>Productos Destacados</span>
                    <h2 className={styles.title}>
                        {wordReveal('Las fragancias más')}
                        {' '}
                        <span className={styles.titleAccent}>
                            {wordReveal('exclusivas')}
                        </span>
                    </h2>
                </div>

                <div
                    className={styles.carouselContainer}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Fade edges */}
                    <div className={`${styles.fadeEdge} ${styles.fadeLeft}`} />
                    <div className={`${styles.fadeEdge} ${styles.fadeRight}`} />

                    {/* Carousel track */}
                    <div className={`${styles.carouselTrack} ${isPaused ? styles.paused : ''}`}>
                        {loopProducts.map((product, index) => (
                            <div
                                key={`${product.id}-${index}`}
                                className={styles.productCard}
                            >
                                <GlowingEffect spread={220} borderWidth={1.5} glow />

                                {/* Featured Badge */}
                                <div className={styles.featuredBadge}>
                                    ✦ Destacado
                                </div>

                                {/* Full-bleed image */}
                                <div className={styles.imageContainer}>
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className={styles.productImage}
                                            style={{ objectFit: 'contain' }}
                                            sizes="(max-width: 768px) 260px, 320px"
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <span className={styles.placeholderIcon}>🌟</span>
                                        </div>
                                    )}
                                    <div className={styles.imageOverlay} />
                                </div>

                                {/* Product Info */}
                                <div className={styles.productInfo}>
                                    <span className={styles.category}>
                                        {product.category === 'masculino' ? 'Masculino' : product.category === 'femenino' ? 'Femenino' : 'Unisex'}
                                    </span>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <p className={styles.brand}>{product.brand}</p>

                                    <div className={styles.pricing}>
                                        <div className={styles.priceGroup}>
                                            <span className={styles.priceLabel}>Frasco</span>
                                            <span className={styles.price}>${product.price.toLocaleString('es-AR')}</span>
                                        </div>
                                        {product.decantPrice && (
                                            <div className={styles.priceGroup}>
                                                <span className={styles.priceLabel}>Decant</span>
                                                <span className={styles.priceDecant}>
                                                    ${product.decantPrice.toLocaleString('es-AR')}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className={styles.ctaButton}
                                        onClick={() => handleWhatsAppClick(product.name, product.brand)}
                                    >
                                        <span>Consultar</span>
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
