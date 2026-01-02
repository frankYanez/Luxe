'use client';

import React, { useState, useEffect } from 'react';
import styles from './TopBanner.module.css';

/**
 * Top Promotional Banner
 * Fixed banner at the top of the page displaying rotating promotional messages
 */
export function TopBanner() {
    const messages = [
        {
            text: "3 CUOTAS SIN INTERÉS",
            subtext: "en todos los productos",
            icon: "💳"
        },
        {
            text: "10% DE DESCUENTO",
            subtext: "abonando en efectivo o transferencia",
            icon: "💎"
        },
        {
            text: "ENVÍOS GRATIS",
            subtext: "en compras superiores a $100.000",
            icon: "🚚"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length);
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.message} ${index === currentIndex ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{msg.icon}</span>
                        <span className={styles.text}>{msg.text}</span>
                        <span className={styles.separator}>|</span>
                        <span className={styles.subtext}>{msg.subtext}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
