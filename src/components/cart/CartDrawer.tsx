'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
    const { items, isOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [isClosing, setIsClosing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            toggleCart();
            setIsClosing(false);
        }, 400);
    };

    const handleGoToCheckout = () => {
        handleClose();
        setTimeout(() => router.push('/checkout'), 420);
    };

    const handleWhatsApp = () => {
        const phone = siteConfig.whatsapp.replace('+', '');
        let msg = `*¡Hola Luxe Essence!* Quiero realizar el siguiente pedido:\n\n`;
        items.forEach(item => {
            msg += `▫️ ${item.quantity}x *${item.name}*`;
            if (item.variant) msg += ` (${item.variant})`;
            msg += ` - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        });
        msg += `\n*Total:* $${cartTotal.toLocaleString('es-AR')}\n\nAguardo confirmación. ¡Gracias! ✨`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div
            className={`${styles.overlay} ${isClosing ? styles.fadeOut : ''}`}
            onClick={handleClose}
        >
            <div
                className={`${styles.drawer} ${isClosing ? styles.slideOut : styles.slideIn}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Tu Selección</h2>
                        {items.length > 0 && (
                            <p className={styles.itemCount}>{items.reduce((s, i) => s + i.quantity, 0)} artículo{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}</p>
                        )}
                    </div>
                    <button onClick={handleClose} className={styles.closeButton} aria-label="Cerrar carrito">
                        ✕
                    </button>
                </div>

                {/* Items */}
                <div className={styles.itemsContainer}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🌿</span>
                            <p className={styles.emptyTitle}>Tu carrito está vacío</p>
                            <p className={styles.emptyText}>Explorá nuestra colección de fragancias árabes.</p>
                            <button className={styles.exploreBtn} onClick={handleClose}>
                                Ver Colección
                            </button>
                        </div>
                    ) : (
                        <ul className={styles.itemList}>
                            {items.map(item => (
                                <li key={item.id} className={styles.item}>
                                    <div className={styles.itemImageContainer}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className={styles.itemImage}
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>

                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        {item.variant && (
                                            <p className={styles.itemVariant}>{item.variant}</p>
                                        )}
                                        <p className={styles.itemPrice}>
                                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                                        </p>

                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.quantityBtn}
                                                onClick={() => updateQuantity(item.id, -1)}
                                                aria-label="Reducir cantidad"
                                            >
                                                −
                                            </button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <button
                                                className={styles.quantityBtn}
                                                onClick={() => updateQuantity(item.id, 1)}
                                                aria-label="Aumentar cantidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label="Eliminar producto"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total estimado</span>
                            <span className={styles.totalAmount}>
                                ${cartTotal.toLocaleString('es-AR')}
                            </span>
                        </div>

                        {/* Primary CTA → checkout page */}
                        <button className={styles.checkoutBtn} onClick={handleGoToCheckout}>
                            <span>Finalizar compra</span>
                            <span className={styles.btnArrow}>→</span>
                        </button>

                        {/* Quick WhatsApp option */}
                        <button className={styles.whatsappBtn} onClick={handleWhatsApp}>
                            <span className={styles.waIcon}>💬</span>
                            Consultar por WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
