'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './FloatingCart.module.css';

/**
 * Floating Cart Button
 * Sticky button (FAB) that opens the cart drawer
 */
export function FloatingCart() {
    const { toggleCart, itemCount } = useCart();
    const pathname = usePathname();

    if (itemCount === 0 || pathname === '/checkout') return null;

    return (
        <button
            className={styles.floatingBtn}
            onClick={toggleCart}
            aria-label="Abrir carrito"
        >
            <div className={styles.iconContainer}>
                <span className={styles.icon}>🛍️</span>
                <span className={styles.badge}>{itemCount}</span>
            </div>

            {/* Ripple effect rings */}
            <div className={styles.ripple1} />
            <div className={styles.ripple2} />
        </button>
    );
}
