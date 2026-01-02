'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { useProducts } from '@/core/hooks/useProducts';
import { siteConfig } from '@/core/config/site';
import styles from './FeaturedCarousel.module.css';

/**
 * Featured Products Carousel
 * Auto-playing carousel showcasing featured perfumes with fade edges
 */
export function FeaturedCarousel() {
    const [isPaused, setIsPaused] = useState(false);
    const { products, loading } = useProducts({ featured: true });

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
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Productos Destacados</span>
                    <h2 className={styles.title}>
                        Las fragancias más <span className={styles.titleAccent}>exclusivas</span>
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
                                {/* Product Image */}
                                <div className={styles.imageContainer}>
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className={styles.productImage}
                                            style={{ objectFit: 'cover' }}
                                            sizes="(max-width: 768px) 300px, 350px"
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <span className={styles.placeholderIcon}>✨</span>
                                        </div>
                                    )}

                                    {/* Featured Badge */}
                                    <div className={styles.featuredBadge}>
                                        <span>⭐</span> Destacado
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className={styles.imageOverlay} />
                                </div>

                                {/* Product Info */}
                                <div className={styles.productInfo}>
                                    <div className={styles.category}>
                                        {product.category === 'masculino' && '👔 Masculino'}
                                        {product.category === 'femenino' && '💐 Femenino'}
                                        {product.category === 'unisex' && '✨ Unisex'}
                                    </div>

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
                                        <span>Comprar</span>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                        >
                                            <path
                                                d="M7.5 15L12.5 10L7.5 5"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
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
