'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/core/hooks/useProducts';
import newArrivalSlugs from '@/core/data/new-arrivals.json';
import { Container } from '@/components/shared/ui/Container';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './NewArrivalsSection.module.css';

const CATEGORY_LABEL: Record<string, string> = {
    masculino: 'Masculino',
    femenino: 'Femenino',
    unisex: 'Unisex',
};

/**
 * New Arrivals — big, dramatic spotlight for the newest additions to the
 * catalog. Each card drives straight to a free-trial framing of the decant
 * (pay the decant, get it discounted off the full bottle later — see
 * DecantsSection for the full pitch).
 */
export function NewArrivalsSection() {
    const { products, loading } = useProducts({ category: 'all' });
    const headerRef = useScrollReveal<HTMLDivElement>();

    if (loading || products.length === 0) return null;

    const newest = newArrivalSlugs.flatMap((slug) => {
        const product = products.find((item) => item.slug === slug);
        return product ? [product] : [];
    });

    if (newest.length === 0) return null;

    return (
        <section className={styles.section}>
            <Container>
                <div ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow}>✦ Recién llegados</span>
                    <h2 className={styles.title}>
                        Nuevos <span className={styles.titleAccent}>Ingresos</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Lo último en sumarse a la colección. Probalo gratis: pagás el decant y, si después
                        te enamorás del frasco completo, te lo descontamos entero.
                    </p>
                </div>
            </Container>

            <div className={styles.railMask}>
                <div className={styles.rail} data-rail>
                    {newest.map((product) => (
                        <article key={product.id} className={styles.card}>
                            <span className={styles.newBadge}>Nuevo</span>
                            <div className={styles.imageWrap}>
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 700px) 78vw, 420px"
                                    />
                                ) : (
                                    <div className={styles.imageFallback}>{product.brand}</div>
                                )}
                                <span className={styles.gradient} aria-hidden />
                            </div>
                            <div className={styles.info}>
                                <span className={styles.category}>
                                    {product.brand} &middot; {CATEGORY_LABEL[product.category]}
                                </span>
                                <h3 className={styles.name}>
                                    <Link href={`/perfume/${product.id}`}>{product.name}</Link>
                                </h3>
                                <span className={styles.price}>
                                    ${product.price.toLocaleString('es-AR')}
                                </span>
                                {product.decantPrice && (
                                    <Link
                                        href={`/perfume/${product.id}${product.inStock ? '?variant=decant' : ''}`}
                                        className={styles.tryBtn}
                                    >
                                        {product.inStock ? 'Lo quiero probar gratis' : 'Ver perfume'}
                                        <span aria-hidden>&rarr;</span>
                                    </Link>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
