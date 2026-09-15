'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { LoadingSkeleton } from '@/components/shared/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/shared/ui/ErrorMessage';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/core/hooks/useProducts';
import styles from './ProductsSection.module.css';
import { wordReveal } from '@/lib/wordReveal';
import BlurText from '@/components/BlurText';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS_PER_PAGE = 6;

/**
 * Products Catalog Section
 * Premium product showcase with WooCommerce integration and Load More
 */
export function ProductsSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const { products, loading, error, refetch } = useProducts({
        category: 'all',
        autoFetch: true,
    });

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
            '-=0.45'
        );
    }, { scope: headerRef });

    const displayedProducts = products.slice(0, PRODUCTS_PER_PAGE);
    const hasMore = products.length > PRODUCTS_PER_PAGE;

    /* ── Mobile: horizontal carousel with a parallax focus effect ──
       Cards nearer the viewport center sit at full scale/opacity; cards
       drifting toward the sides shrink and fade slightly, instead of
       stacking vertically and costing a huge amount of scroll. */
    useEffect(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const grid = gridRef.current;
        if (!isMobile || !grid || loading) return;

        let raf = 0;
        const items = () => grid.querySelectorAll<HTMLElement>('[data-carousel-item]');

        const update = () => {
            const rect = grid.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            items().forEach((item) => {
                const r = item.getBoundingClientRect();
                const itemCenter = r.left + r.width / 2;
                const dist = Math.abs(center - itemCenter);
                const norm = Math.min(1, dist / (rect.width * 0.65));
                item.style.transform = `scale(${1 - norm * 0.14})`;
                item.style.opacity = String(1 - norm * 0.5);
            });
        };

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(update);
        };

        grid.addEventListener('scroll', onScroll, { passive: true });
        update();

        return () => {
            grid.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, [loading, displayedProducts.length]);

    return (
        <Section id="catalogo">
            <Container>
                <div className={styles.productsContent}>
                    {/* Header */}
                    <div ref={headerRef} className={styles.header}>
                        <span className={styles.eyebrow} data-eyebrow>Catálogo Premium</span>
                        <h2 className={styles.title}>
                            {wordReveal('Fragancias que')}
                            <span className={styles.titleAccent}>
                                {wordReveal('transforman tu presencia')}
                            </span>
                        </h2>
                        <div data-desc>
                            <BlurText
                                text="Cada perfume es una obra maestra olfativa. Intensos, duraderos y memorables."
                                className={styles.description}
                                animateBy="words"
                                delay={40}
                            />
                        </div>
                    </div>

                    {/* Product Grid — horizontal parallax carousel on mobile, 3-col grid on desktop */}
                    <div ref={gridRef} className={styles.productGrid}>
                        {loading && <LoadingSkeleton count={6} />}
                        {error && !loading && <ErrorMessage error={error} onRetry={refetch} />}
                        {!loading && !error && displayedProducts.length > 0 && displayedProducts.map((product, index) => (
                            <div key={product.id} data-carousel-item className={styles.carouselItem}>
                                <ProductCard
                                    product={product}
                                    animationDelay={index * 0.1}
                                />
                            </div>
                        ))}
                        {!loading && !error && products.length === 0 && (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyText}>
                                    No se encontraron productos en esta categoría.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {!loading && !error && hasMore && (
                        <div className={styles.loadMoreContainer}>
                            <Link className={styles.loadMoreButton} href="/coleccion">
                                <span>Ver Más Productos</span>
                                <span className={styles.loadMoreCount}>
                                    ({products.length - PRODUCTS_PER_PAGE} restantes)
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
}
