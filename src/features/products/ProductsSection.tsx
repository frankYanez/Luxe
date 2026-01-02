'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { LoadingSkeleton } from '@/components/shared/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/shared/ui/ErrorMessage';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/core/hooks/useProducts';
import type { Category } from '@/core/types/product';
import styles from './ProductsSection.module.css';

/**
 * Products Catalog Section
 * Premium product showcase with WooCommerce integration
 */
export function ProductsSection() {
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

    // Fetch productos desde WooCommerce
    const { products, loading, error, refetch } = useProducts({
        category: selectedCategory,
        autoFetch: true,
    });

    // Refetch cuando cambia la categoría
    useEffect(() => {
        refetch();
    }, [selectedCategory]);

    return (
        <Section id="catalogo">
            <Container>
                <div className={styles.productsContent}>
                    {/* Header */}
                    <div className={styles.header}>
                        <span className={styles.eyebrow}>Catálogo Premium</span>
                        <h2 className={styles.title}>
                            Fragancias que
                            <span className={styles.titleAccent}> transforman tu presencia</span>
                        </h2>
                        <p className={styles.description}>
                            Cada perfume es una obra maestra olfativa. Intensos, duraderos y memorables.
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className={styles.filterBar}>
                        <button
                            className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('all')}
                            disabled={loading}
                        >
                            Todos
                        </button>
                        <button
                            className={`${styles.filterButton} ${selectedCategory === 'masculino' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('masculino')}
                            disabled={loading}
                        >
                            Masculin os
                        </button>
                        <button
                            className={`${styles.filterButton} ${selectedCategory === 'femenino' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('femenino')}
                            disabled={loading}
                        >
                            Femeninos
                        </button>
                        <button
                            className={`${styles.filterButton} ${selectedCategory === 'unisex' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('unisex')}
                            disabled={loading}
                        >
                            Unisex
                        </button>
                    </div>

                    {/* Product Grid */}
                    <div className={styles.productGrid}>
                        {/* Loading State */}
                        {loading && <LoadingSkeleton count={6} />}

                        {/* Error State */}
                        {error && !loading && (
                            <ErrorMessage error={error} onRetry={refetch} />
                        )}

                        {/* Products */}
                        {!loading && !error && products.length > 0 && products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                animationDelay={index * 0.1}
                            />
                        ))}

                        {/* Empty State */}
                        {!loading && !error && products.length === 0 && (
                            <div className={styles.emptyState}>
                                <p className={styles.emptyText}>
                                    No se encontraron productos en esta categoría.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
