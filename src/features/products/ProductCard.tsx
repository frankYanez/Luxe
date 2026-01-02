'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/ui/Button';
import type { Product } from '@/core/types/product';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
    animationDelay?: number;
}

/**
 * Product Card Component
 * Ultra-clean card with 3D hover rotation and olfactory notes reveal
 */
export function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
    const { addToCart } = useCart();
    const [showNotes, setShowNotes] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleWhatsAppClick = () => {
        const message = `Hola! Me interesa ${product.name} de ${product.brand}. ¿Está disponible?`;
        const url = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div
            className={styles.card}
            style={{ animationDelay: `${animationDelay}s` }}
            onMouseEnter={() => setShowNotes(true)}
            onMouseLeave={() => setShowNotes(false)}
        >
            {/* Badge */}
            {!product.inStock && (
                <div className={styles.badge}>Agotado</div>
            )}
            {product.featured && product.inStock && (
                <div className={`${styles.badge} ${styles.badgeFeatured}`}>Destacado</div>
            )}

            {/* Image Container */}
            <div className={styles.imageContainer}>
                <div className={styles.imageGlow} />
                {!imageError && product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={styles.productImage}
                        style={{ objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <span className={styles.imageIcon}>🌟</span>
                        <span className={styles.imageLabel}>{product.brand}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.category}>
                    {product.category === 'masculino' && '👔 Masculino'}
                    {product.category === 'femenino' && '💐 Femenino'}
                    {product.category === 'unisex' && '✨ Unisex'}
                </div>

                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.brand}>{product.brand}</p>
                <p className={styles.shortDesc}>{product.shortDescription}</p>

                {/* Olfactory Notes - Animated Reveal */}
                <div className={`${styles.notes} ${showNotes ? styles.notesVisible : ''}`}>
                    {product.olfactoryNotes.map((noteGroup) => (
                        <div key={noteGroup.type} className={styles.noteGroup}>
                            <span className={styles.noteType}>
                                {noteGroup.type === 'salida' && 'Salida'}
                                {noteGroup.type === 'corazon' && 'Corazón'}
                                {noteGroup.type === 'fondo' && 'Fondo'}:
                            </span>
                            <span className={styles.noteList}>{noteGroup.notes.join(', ')}</span>
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className={styles.pricing}>
                    <div className={styles.priceGroup}>
                        <span className={styles.priceLabel}>Frasco</span>
                        <span className={styles.price}>${product.price.toLocaleString('es-AR')}</span>
                    </div>
                    {product.decantPrice && (
                        <div className={styles.priceGroup}>
                            <span className={styles.priceLabel}>Decant</span>
                            <span className={`${styles.price} ${styles.priceDecant}`}>
                                ${product.decantPrice.toLocaleString('es-AR')}
                            </span>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className={styles.ctaGroup}>
                    <Button
                        variant="primary"
                        onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            variant: 'Frasco'
                        })}
                        disabled={!product.inStock}
                        className={styles.cta}
                    >
                        {product.inStock ? 'Agregar al Carrito 🛍️' : 'No disponible'}
                    </Button>

                    {product.decantPrice && (
                        <Button
                            variant="secondary"
                            onClick={() => addToCart({
                                id: `${product.id}-decant`,
                                name: product.name,
                                price: product.decantPrice!,
                                image: product.image,
                                variant: 'Decant'
                            })}
                            disabled={!product.inStock}
                            className={styles.ctaDecant}
                        >
                            Decant 🧴
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
