'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
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

const NOTE_LABEL: Record<string, string> = {
    salida: 'Salida',
    corazon: 'Corazón',
    fondo: 'Fondo',
};

type Variant = 'frasco' | 'decant';

export const ProductCard = React.memo(function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
    const { addToCart } = useCart();
    const [imageError, setImageError] = useState(false);
    const [variant, setVariant] = useState<Variant>('frasco');
    const [added, setAdded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const addedTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const hasDecant = !!product.decantPrice;
    const activePrice = variant === 'decant' && product.decantPrice ? product.decantPrice : product.price;

    const notesLine = useMemo(() => {
        if (!product.olfactoryNotes?.length) return '';
        return product.olfactoryNotes
            .map(g => `${NOTE_LABEL[g.type]}: ${g.notes.join(', ')}`)
            .join('  ·  ');
    }, [product.olfactoryNotes]);

    /* ── GSAP scroll entrance ── */
    useGSAP(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        gsap.fromTo(
            cardRef.current,
            reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 70, scale: 0.94, filter: 'blur(8px)' },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: reduce ? 0.4 : 1.05,
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

    /* ── 3D tilt + cursor light (desktop, mouse only) ── */
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
            const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
            card.style.transform = `perspective(900px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateY(-4px)`;
            card.style.transition = 'transform 0.06s linear';
            card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        const card = cardRef.current;
        if (card) {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
        }
    }, []);

    /* ── Cart handlers ── */
    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product.inStock || added) return;
        if (variant === 'decant' && product.decantPrice) {
            addToCart({ id: `${product.id}-decant`, name: product.name, price: product.decantPrice, image: product.image, variant: 'Decant' });
        } else {
            addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, variant: 'Frasco' });
        }
        setAdded(true);
        clearTimeout(addedTimeout.current);
        addedTimeout.current = setTimeout(() => setAdded(false), 1800);
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const msg = `Hola! Me interesa *${product.name}* de ${product.brand}. ¿Está disponible?`;
        window.open(`https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <article
            ref={cardRef}
            className={`${styles.card} ${!product.inStock ? styles.cardOut : ''}`}
            data-card
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <GlowingEffect spread={160} borderWidth={1.5} glow />
            <span className={styles.ring} aria-hidden="true" />
            <div className={styles.cursorLight} />

            {/* ── Media ── */}
            <div className={styles.media}>
                <div className={styles.mediaGlow} aria-hidden="true" />

                <div className={styles.badges}>
                    {!product.inStock && <span className={styles.badge}>Sin Stock</span>}
                    {product.featured && product.inStock && (
                        <span className={`${styles.badge} ${styles.badgeFeatured}`}>✦ Destacado</span>
                    )}
                </div>

                <span className={styles.categoryChip}>{CATEGORY_LABEL[product.category]}</span>

                <div className={styles.imageWrap}>
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
                            <span aria-hidden="true">🌟</span>
                            <span className={styles.placeholderBrand}>{product.brand}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Info (always visible — no hidden-on-mobile content) ── */}
            <div className={styles.info}>
                <span className={styles.brand}>{product.brand}</span>
                <h3 className={styles.name}>{product.name}</h3>

                {product.shortDescription && (
                    <p className={styles.desc}>{product.shortDescription}</p>
                )}

                {(product.intensity || product.longevity) && (
                    <div className={styles.meta}>
                        <span className={styles.metaItem}>{product.intensity}</span>
                        {product.longevity && (
                            <>
                                <span className={styles.metaDot}>·</span>
                                <span className={styles.metaItem}>{product.longevity}</span>
                            </>
                        )}
                    </div>
                )}

                {notesLine && <p className={styles.notes}>{notesLine}</p>}

                <div className={styles.footer}>
                    <div className={styles.priceRow}>
                        <span className={styles.price}>${activePrice.toLocaleString('es-AR')}</span>

                        {hasDecant && (
                            <div className={styles.toggle} role="tablist" aria-label="Presentación">
                                <span
                                    className={styles.toggleThumb}
                                    style={{ transform: variant === 'decant' ? 'translateX(100%)' : 'translateX(0%)' }}
                                    aria-hidden="true"
                                />
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={variant === 'frasco'}
                                    className={styles.toggleBtn}
                                    onClick={(e) => { e.stopPropagation(); setVariant('frasco'); }}
                                >
                                    Frasco
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={variant === 'decant'}
                                    className={styles.toggleBtn}
                                    onClick={(e) => { e.stopPropagation(); setVariant('decant'); }}
                                >
                                    Decant
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.ctas}>
                        <button
                            className={`${styles.btnMain} ${added ? styles.btnDone : ''}`}
                            onClick={handleAdd}
                            disabled={!product.inStock}
                        >
                            {added
                                ? <><span className={styles.check}>✓</span> Agregado</>
                                : product.inStock ? 'Agregar al carrito' : 'Sin stock'
                            }
                            {!added && <span className={styles.btnShine} />}
                        </button>

                        <button className={styles.btnWa} onClick={handleWhatsApp} aria-label="Consultar por WhatsApp">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}, (prev, next) => prev.product.id === next.product.id && prev.animationDelay === next.animationDelay);
