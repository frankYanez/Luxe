'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Product } from '@/core/types/product';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import styles from './ProductCard.module.css';
import { GlowingEffect } from '@/components/shared/ui/GlowingEffect';

gsap.registerPlugin(ScrollTrigger);

interface ProductCardProps {
    product: Product;
    animationDelay?: number;
}

const CATEGORY_LABEL: Record<string, string> = {
    masculino: 'Masculino',
    femenino: 'Femenino',
    unisex: 'Unisex',
};

export const ProductCard = React.memo(function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
    const { addToCart } = useCart();
    const [imageError, setImageError] = useState(false);
    const [addedBottle, setAddedBottle] = useState(false);
    const [addedDecant, setAddedDecant] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    /* ── GSAP scroll entrance ── */
    useGSAP(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: 80, scale: 0.92, rotationX: 6 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 1.1,
                delay: Math.min(animationDelay * 0.8, 0.55),
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top 91%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, { scope: cardRef });

    /* ── Enhanced 3D tilt + cursor light ── */
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
            const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
            card.style.transform = `perspective(800px) rotateX(${-dy * 12}deg) rotateY(${dx * 12}deg) translateZ(30px) scale(1.02)`;
            card.style.transition = 'transform 0.06s linear';
            card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        const card = cardRef.current;
        if (card) {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
            card.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
        }
    }, []);

    /* ── Cart handlers ── */
    const handleAddBottle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product.inStock || addedBottle) return;
        addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, variant: 'Frasco' });
        setAddedBottle(true);
        setTimeout(() => setAddedBottle(false), 2000);
    };

    const handleAddDecant = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product.inStock || addedDecant) return;
        addToCart({ id: `${product.id}-decant`, name: product.name, price: product.decantPrice!, image: product.image, variant: 'Decant' });
        setAddedDecant(true);
        setTimeout(() => setAddedDecant(false), 2000);
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const msg = `Hola! Me interesa *${product.name}* de ${product.brand}. ¿Está disponible?`;
        window.open(`https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <article
            ref={cardRef}
            className={styles.card}
            data-card
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* ── Glowing border ── */}
            <GlowingEffect spread={160} borderWidth={1.5} glow />

            {/* ── Cursor light ── */}
            <div className={styles.cursorLight} />

            {/* ── Badges ── */}
            {!product.inStock && <span className={styles.badge}>Sin Stock</span>}
            {product.featured && product.inStock && (
                <span className={`${styles.badge} ${styles.badgeFeatured}`}>✦ Destacado</span>
            )}

            {/* ── Full-bleed image ── */}
            <div className={styles.imageArea}>
                {!imageError && product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={styles.image}
                        onError={() => setImageError(true)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <span>🌟</span>
                        <span className={styles.placeholderBrand}>{product.brand}</span>
                    </div>
                )}
                <div className={styles.imageGradient} />
            </div>

            {/* ── Base info (always visible) ── */}
            <div className={styles.baseInfo}>
                <span className={styles.category}>{CATEGORY_LABEL[product.category]}</span>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.basePrice}>
                    <span>${product.price.toLocaleString('es-AR')}</span>
                    {product.decantPrice && (
                        <span className={styles.decantPill}>
                            Decant ${product.decantPrice.toLocaleString('es-AR')}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Hover panel — slides up ── */}
            <div className={styles.panel}>
                <div className={styles.panelDrag} />

                <p className={styles.desc}>{product.shortDescription}</p>

                {product.olfactoryNotes.length > 0 && (
                    <div className={styles.notes}>
                        {product.olfactoryNotes.map(g => (
                            <div key={g.type} className={styles.noteRow}>
                                <span className={styles.noteType}>
                                    {g.type === 'salida' ? 'Salida' : g.type === 'corazon' ? 'Corazón' : 'Fondo'}
                                </span>
                                <span className={styles.noteList}>{g.notes.join(' · ')}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.meta}>
                    <span className={styles.metaItem}>{product.intensity}</span>
                    <span className={styles.metaDot}>·</span>
                    <span className={styles.metaItem}>{product.longevity}</span>
                </div>

                <div className={styles.pricing}>
                    <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>Frasco</span>
                        <span className={styles.priceValue}>${product.price.toLocaleString('es-AR')}</span>
                    </div>
                    {product.decantPrice && (
                        <div className={styles.priceBlock}>
                            <span className={styles.priceLabel}>Decant</span>
                            <span className={`${styles.priceValue} ${styles.priceGold}`}>
                                ${product.decantPrice.toLocaleString('es-AR')}
                            </span>
                        </div>
                    )}
                </div>

                <div className={styles.ctas}>
                    <button
                        className={`${styles.btnMain} ${addedBottle ? styles.btnDone : ''}`}
                        onClick={handleAddBottle}
                        disabled={!product.inStock}
                    >
                        {addedBottle
                            ? <><span className={styles.check}>✓</span> Agregado</>
                            : product.inStock ? 'Agregar al carrito' : 'Sin stock'
                        }
                        {!addedBottle && <span className={styles.btnShine} />}
                    </button>

                    <div className={styles.secondaryRow}>
                        {product.decantPrice && product.inStock && (
                            <button
                                className={`${styles.btnDecant} ${addedDecant ? styles.btnDone : ''}`}
                                onClick={handleAddDecant}
                            >
                                {addedDecant ? '✓' : 'Decant'}
                            </button>
                        )}
                        <button className={styles.btnWa} onClick={handleWhatsApp} aria-label="WhatsApp">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}, (prev, next) => prev.product.id === next.product.id && prev.animationDelay === next.animationDelay);
