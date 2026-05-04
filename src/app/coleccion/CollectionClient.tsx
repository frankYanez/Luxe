'use client';

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useProducts } from '@/core/hooks/useProducts';
import { ProductCard } from '@/features/products/ProductCard';
import { LoadingSkeleton } from '@/components/shared/ui/LoadingSkeleton';
import { ErrorMessage } from '@/components/shared/ui/ErrorMessage';
import type { Product } from '@/core/types/product';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─────────────────────────────────────────────────── */
type FilterKey = 'todos' | 'masculino' | 'femenino' | 'decant-masculino' | 'decant-femenino';
type SortKey   = 'featured' | 'price-asc' | 'price-desc' | 'name';

interface FilterDef {
    key: FilterKey;
    label: string;
    shortLabel: string;
    icon: string;
}

const FILTERS: FilterDef[] = [
    { key: 'todos',            label: 'Todos',            shortLabel: 'Todos',    icon: '◈' },
    { key: 'masculino',        label: 'Masculinos',       shortLabel: 'Masc.',    icon: '◎' },
    { key: 'femenino',         label: 'Femeninas',        shortLabel: 'Fem.',     icon: '❋' },
    { key: 'decant-masculino', label: 'Decants Masc.',    shortLabel: 'D. Masc.', icon: '✦' },
    { key: 'decant-femenino',  label: 'Decants Fem.',     shortLabel: 'D. Fem.',  icon: '✦' },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'featured',    label: 'Destacados' },
    { key: 'price-asc',   label: 'Precio ↑' },
    { key: 'price-desc',  label: 'Precio ↓' },
    { key: 'name',        label: 'Nombre A–Z' },
];

/* ─── Filter / sort helpers ──────────────────────────────────── */
function applyFilter(products: Product[], filter: FilterKey): Product[] {
    switch (filter) {
        case 'todos':            return products;
        case 'masculino':        return products.filter(p => p.category === 'masculino');
        case 'femenino':         return products.filter(p => p.category === 'femenino');
        case 'decant-masculino': return products.filter(p => p.category === 'masculino' && !!p.decantPrice);
        case 'decant-femenino':  return products.filter(p => p.category === 'femenino' && !!p.decantPrice);
    }
}

function applySort(products: Product[], sort: SortKey): Product[] {
    const list = [...products];
    switch (sort) {
        case 'featured':   return list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
        case 'price-asc':  return list.sort((a, b) => a.price - b.price);
        case 'price-desc': return list.sort((a, b) => b.price - a.price);
        case 'name':       return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
}

function getCounts(products: Product[]): Record<FilterKey, number> {
    return {
        todos:            products.length,
        masculino:        products.filter(p => p.category === 'masculino').length,
        femenino:         products.filter(p => p.category === 'femenino').length,
        'decant-masculino': products.filter(p => p.category === 'masculino' && !!p.decantPrice).length,
        'decant-femenino':  products.filter(p => p.category === 'femenino' && !!p.decantPrice).length,
    };
}

/* ─── Main component ─────────────────────────────────────────── */
export function CollectionClient() {
    const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
    const [sortBy,       setSortBy]       = useState<SortKey>('featured');
    const [mounted,      setMounted]      = useState(false);

    const { products, loading, error, refetch } = useProducts({ category: 'all' });

    /* Refs */
    const pageRef       = useRef<HTMLDivElement>(null);
    const heroRef       = useRef<HTMLDivElement>(null);
    const filterBarRef  = useRef<HTMLDivElement>(null);
    const indicatorRef  = useRef<HTMLDivElement>(null);
    const pillsRef      = useRef<(HTMLButtonElement | null)[]>([]);
    const gridRef       = useRef<HTMLDivElement>(null);
    const countRef      = useRef<HTMLSpanElement>(null);

    useEffect(() => { setMounted(true); }, []);

    /* Computed */
    const counts = useMemo(() => getCounts(products), [products]);
    const filtered = useMemo(() => applySort(applyFilter(products, activeFilter), sortBy), [products, activeFilter, sortBy]);

    /* ── Sliding pill indicator ─────────────────────────────── */
    const moveIndicator = useCallback((filterKey: FilterKey) => {
        const idx = FILTERS.findIndex(f => f.key === filterKey);
        const pill = pillsRef.current[idx];
        const indicator = indicatorRef.current;
        if (!pill || !indicator) return;
        indicator.style.width  = `${pill.offsetWidth}px`;
        indicator.style.left   = `${pill.offsetLeft}px`;
    }, []);

    useEffect(() => {
        if (mounted) {
            // Give DOM time to paint before measuring
            requestAnimationFrame(() => moveIndicator(activeFilter));
        }
    }, [mounted, activeFilter, moveIndicator]);

    /* Update indicator on window resize */
    useEffect(() => {
        const onResize = () => moveIndicator(activeFilter);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [activeFilter, moveIndicator]);

    /* ── GSAP hero entrance ─────────────────────────────────── */
    useGSAP(() => {
        const el = heroRef.current;
        if (!el) return;
        const words   = el.querySelectorAll('[data-word]');
        const eyebrow = el.querySelector('[data-eyebrow]');
        const sub     = el.querySelector('[data-sub]');
        const back    = el.querySelector('[data-back]');

        gsap.timeline({ delay: 0.1 })
            .fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
            .fromTo(words,   { y: '110%' }, { y: '0%', duration: 0.85, stagger: 0.06, ease: 'power3.out' }, '-=0.3')
            .fromTo(sub,     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.4')
            .fromTo(back,    { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');
    }, { scope: heroRef });

    /* ── GSAP grid batch entrance (initial load) ────────────── */
    useGSAP(() => {
        const el = gridRef.current;
        if (!el || loading) return;
        const cards = el.querySelectorAll('[data-card]');
        gsap.set(cards, { opacity: 0, y: 40, scale: 0.96 });
        ScrollTrigger.batch(cards, {
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, scale: 1,
                duration: 0.75, stagger: 0.06, ease: 'power3.out', overwrite: true,
            }),
            start: 'top 92%',
        });
    }, { scope: gridRef, dependencies: [loading, filtered.length] });

    /* ── Filter change: GSAP fade out → state → fade in ─────── */
    const handleFilterChange = useCallback((key: FilterKey) => {
        if (key === activeFilter) return;
        const grid = gridRef.current;
        if (!grid) { setActiveFilter(key); return; }
        gsap.to(grid, {
            opacity: 0, y: 10, duration: 0.18, ease: 'power2.in',
            onComplete: () => {
                setActiveFilter(key);
                gsap.fromTo(grid,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.32, ease: 'power3.out', delay: 0.04 }
                );
            },
        });
    }, [activeFilter]);

    /* ── Sort change: fast fade ─────────────────────────────── */
    const handleSortChange = useCallback((key: SortKey) => {
        const grid = gridRef.current;
        if (!grid) { setSortBy(key); return; }
        gsap.to(grid, {
            opacity: 0, duration: 0.15, ease: 'power2.in',
            onComplete: () => {
                setSortBy(key);
                gsap.to(grid, { opacity: 1, duration: 0.25, ease: 'power2.out', delay: 0.04 });
            },
        });
    }, []);

    /* Decant filter label decoration */
    const isDecantFilter = activeFilter.startsWith('decant');

    return (
        <div ref={pageRef} className={styles.page}>
            {/* ── Hero header ── */}
            <header ref={heroRef} className={styles.hero}>
                <Link href="/" data-back className={styles.backLink}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Volver
                </Link>

                <div className={styles.heroCenter}>
                    <span className={styles.heroEyebrow} data-eyebrow>Luxe Essence · Tandil</span>
                    <h1 className={styles.heroTitle}>
                        {['Colección', 'Completa'].map((word, i) => (
                            <span key={i} className={styles.heroTitleWrap}>
                                <span data-word className={i === 1 ? styles.heroTitleAccent : ''}>
                                    {word}{i === 0 ? '\u00A0' : ''}
                                </span>
                            </span>
                        ))}
                    </h1>
                    <p className={styles.heroSub} data-sub>
                        {loading
                            ? 'Cargando fragancias…'
                            : `${products.length} fragancias · Frascos originales y decants de 5ml`
                        }
                    </p>
                </div>

                {/* Logo mark */}
                <div className={styles.logoMark}>
                    <Image src="/logos/logo.png" alt="Luxe Essence" width={40} height={40} />
                </div>
            </header>

            {/* ── Controls bar (filter + sort) ── */}
            <div className={styles.controlsBar}>
                {/* Filter pills */}
                <div ref={filterBarRef} className={styles.filterBar}>
                    {/* Sliding indicator */}
                    <div ref={indicatorRef} className={styles.filterIndicator} />

                    {FILTERS.map((f, i) => (
                        <button
                            key={f.key}
                            ref={el => { pillsRef.current[i] = el; }}
                            className={`${styles.filterPill} ${activeFilter === f.key ? styles.filterPillActive : ''}`}
                            onClick={() => handleFilterChange(f.key)}
                            data-short={f.shortLabel}
                        >
                            <span className={styles.pillIcon}>{f.icon}</span>
                            <span className={styles.pillLabel}>{f.label}</span>
                            {counts[f.key] > 0 && (
                                <span className={styles.pillCount}>{counts[f.key]}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sort select */}
                <div className={styles.sortWrapper}>
                    <svg className={styles.sortIcon} width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <select
                        className={styles.sortSelect}
                        value={sortBy}
                        onChange={e => handleSortChange(e.target.value as SortKey)}
                        aria-label="Ordenar por"
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.key} value={o.key}>{o.label}</option>
                        ))}
                    </select>
                    <svg className={styles.sortChevron} width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            {/* ── Results info ── */}
            {!loading && !error && (
                <div className={styles.resultsBar}>
                    <span className={styles.resultsCount}>
                        <span ref={countRef}>{filtered.length}</span> fragancia{filtered.length !== 1 ? 's' : ''}
                        {isDecantFilter && (
                            <span className={styles.decantBadge}>· Solo con Decant disponible</span>
                        )}
                    </span>
                    {isDecantFilter && (
                        <span className={styles.decantInfo}>
                            ✦ Frasco 100ml · Decant 5ml
                        </span>
                    )}
                </div>
            )}

            {/* ── Product Grid ── */}
            <main className={styles.main}>
                <div ref={gridRef} className={styles.grid}>
                    {loading && <LoadingSkeleton count={9} />}

                    {error && !loading && (
                        <div className={styles.errorWrap}>
                            <ErrorMessage error={error} onRetry={refetch} />
                        </div>
                    )}

                    {!loading && !error && filtered.map((product, i) => (
                        <div key={product.id} data-card>
                            <ProductCard product={product} animationDelay={i * 0.04} />
                        </div>
                    ))}

                    {!loading && !error && filtered.length === 0 && (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>◈</span>
                            <h3 className={styles.emptyTitle}>Sin fragancias en esta categoría</h3>
                            <p className={styles.emptyText}>
                                Probá con otro filtro o escribinos por WhatsApp para consultar disponibilidad.
                            </p>
                            <button
                                className={styles.emptyBtn}
                                onClick={() => handleFilterChange('todos')}
                            >
                                Ver todas las fragancias
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* ── Footer strip ── */}
            <footer className={styles.footer}>
                <span className={styles.footerText}>
                    Luxe Essence · Fragancias Árabes Premium · Tandil, Buenos Aires
                </span>
                <Link href="/" className={styles.footerLink}>
                    Volver al inicio →
                </Link>
            </footer>
        </div>
    );
}
