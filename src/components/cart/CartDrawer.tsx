'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/shared/ui/Button';
import { siteConfig } from '@/core/config/site';
import styles from './CartDrawer.module.css';

/**
 * Premium Cart Drawer
 * Side panel with glassmorphism, showing cart items and WhatsApp checkout
 */
export function CartDrawer() {
    const { items, isOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [isClosing, setIsClosing] = useState(false);

    // Handle escape key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            toggleCart();
            setIsClosing(false);
        }, 400); // Match animation duration
    };

    const handleCheckout = () => {
        const phone = siteConfig.whatsapp.replace('+', '');

        let message = `*Hola Luxe Essence!* Quiero realizar el siguiente pedido:\n\n`;

        items.forEach(item => {
            message += `▫️ ${item.quantity}x *${item.name}*`;
            if (item.variant) message += ` (${item.variant})`;
            message += ` - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        });

        message += `\n*Total:* $${cartTotal.toLocaleString('es-AR')}\n\n`;
        message += `Aguardo confirmación para coordinar el pago y envío. Gracias! ✨`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleOnlineCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });

            const data = await response.json();

            if (data.success && data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                console.error('Checkout Error:', data);
                const errorMessage = data.error || 'Error al iniciar el pago.';

                if (errorMessage.includes('Missing WooCommerce credentials')) {
                    alert('⚠️ Error de Configuración: Faltan las claves de WooCommerce en el servidor (.env.local).');
                } else {
                    alert(`⚠️ ${errorMessage}\n\nPor favor intenta finalizar por WhatsApp.`);
                }
            }
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Error de conexión. Intenta nuevamente.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.fadeOut : ''}`} onClick={handleClose}>
            <div
                className={`${styles.drawer} ${isClosing ? styles.slideOut : styles.slideIn}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Tu Selección</h2>
                    <button onClick={handleClose} className={styles.closeButton}>
                        ✕
                    </button>
                </div>

                {/* Items List */}
                <div className={styles.itemsContainer}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🛍️</span>
                            <p className={styles.emptyText}>Tu carrito está vacío</p>
                            <Button variant="secondary" onClick={handleClose}>
                                Explorar Colección
                            </Button>
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
                                        />
                                    </div>

                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <p className={styles.itemVariant}>{item.variant}</p>
                                        <p className={styles.itemPrice}>
                                            ${item.price.toLocaleString('es-AR')}
                                        </p>

                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.quantityBtn}
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <button
                                                className={styles.quantityBtn}
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total Estimado</span>
                            <span className={styles.totalAmount}>
                                ${cartTotal.toLocaleString('es-AR')}
                            </span>
                        </div>

                        <p className={styles.disclaimer}>
                            El envío se calcula al coordinar por WhatsApp.
                        </p>

                        <Button
                            variant="primary"
                            className={styles.checkoutButton}
                            onClick={handleCheckout}
                        >
                            <span className={styles.whatsappIcon}>💬</span>
                            Finalizar Pedido en WhatsApp
                        </Button>

                        <div className={styles.divider}>
                            <span>O</span>
                        </div>

                        <Button
                            variant="primary"
                            className={`${styles.checkoutButton} ${styles.onlineButton}`}
                            onClick={handleOnlineCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <span className={styles.spinner}>⌛</span>
                            ) : (
                                <span className={styles.cardIcon}>💳</span>
                            )}
                            {isCheckingOut ? 'Procesando...' : 'Pagar Online (Ualá/Tarjetas)'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
