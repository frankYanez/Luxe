'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { LoadingSkeleton } from '@/components/shared/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/shared/ui/ErrorMessage';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/core/hooks/useProducts';
import type { Category } from '@/core/types/product';
import styles from './ProductsSection.module.css';
import { wordReveal } from '@/lib/wordReveal';

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS_PER_PAGE = 6;

/**
 * Products Catalog Section
 * Premium product showcase with WooCommerce integration and Load More
 */
export function ProductsSection() {
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
    const headerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    const { products, loading, error, refetch } = useProducts({
        category: selectedCategory,
        autoFetch: true,
    });

    useEffect(() => {
        setDisplayCount(PRODUCTS_PER_PAGE);
        refetch();
    }, [selectedCategory]);

    /* ── GSAP header reveal ── */
    useGSAP(() => {
        const el = headerRef.current;
        if (!el) return;

        const eyebrow = el.querySelector('[data-eyebrow]');
        const words = el.querySelectorAll('[data-word]');
        const desc = el.querySelector('[data-desc]');
        const filter = filterRef.current;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        tl.fromTo(eyebrow,
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

        if (filter) {
            tl.fromTo(filter,
                { opacity: 0, y: 20, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' },
                '-=0.3'
            );
        }
    }, { scope: headerRef });

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
    };

    const displayedProducts = products.slice(0, displayCount);
    const hasMore = displayCount < products.length;

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
                        <p className={styles.description} data-desc>
                            Cada perfume es una obra maestra olfativa. Intensos, duraderos y memorables.
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div ref={filterRef} className={styles.filterBar}>
                        {(['all', 'masculino', 'femenino', 'unisex'] as const).map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.filterButton} ${selectedCategory === cat ? styles.filterActive : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                                disabled={loading}
                            >
                                {cat === 'all' ? 'Todos' : cat === 'masculino' ? 'Masculinos' : cat === 'femenino' ? 'Femeninos' : 'Unisex'}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className={styles.productGrid}>
                        {loading && <LoadingSkeleton count={6} />}
                        {error && !loading && <ErrorMessage error={error} onRetry={refetch} />}
                        {!loading && !error && displayedProducts.length > 0 && displayedProducts.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                animationDelay={index * 0.1}
                            />
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
                            <button className={styles.loadMoreButton} onClick={handleLoadMore}>
                                <span>Ver Más Productos</span>
                                <span className={styles.loadMoreCount}>
                                    ({products.length - displayCount} restantes)
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
}
