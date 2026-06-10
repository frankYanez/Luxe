'use client';

import React, { useState, useEffect } from 'react';
import styles from './TopBannerFathersDay.module.css';
import { siteConfig } from '@/core/config/site';

const FATHER_DAY = new Date('2026-06-21T00:00:00-03:00');

function useDaysLeft(target: Date) {
    const calc = () => Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86400000));
    const [days, setDays] = useState(0);
    useEffect(() => {
        setDays(calc());
        const id = setInterval(() => setDays(calc()), 60000);
        return () => clearInterval(id);
    }, []);
    return days;
}

// SVG: gift box with animated shimmer bow
function GiftIcon() {
    return (
        <svg className={styles.giftSvg} width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            {/* box body */}
            <rect x="3" y="13" width="20" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            {/* lid */}
            <rect x="2" y="9" width="22" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            {/* vertical ribbon */}
            <line x1="13" y1="9" x2="13" y2="23" stroke="currentColor" strokeWidth="1.4"/>
            {/* horizontal ribbon on lid */}
            <line x1="2" y1="11.5" x2="24" y2="11.5" stroke="currentColor" strokeWidth="1.4"/>
            {/* bow left */}
            <path d="M13 9 C10.5 6.5 7 5.5 7.5 8.5 C8 10 10.5 9.8 13 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
            {/* bow right */}
            <path d="M13 9 C15.5 6.5 19 5.5 18.5 8.5 C18 10 15.5 9.8 13 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
            {/* shine dot */}
            <circle cx="20" cy="15" r="1" fill="currentColor" opacity="0.5"/>
        </svg>
    );
}

// SVG: father — head + shoulders + tie
function FatherIcon() {
    return (
        <svg className={styles.fatherSvg} width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true">
            {/* head */}
            <circle cx="11" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            {/* shoulders */}
            <path d="M1 26 C1 18 5 15 11 15 C17 15 21 18 21 26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
            {/* collar left */}
            <path d="M8.5 15 L11 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            {/* collar right */}
            <path d="M13.5 15 L11 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            {/* tie body */}
            <path d="M11 18 L9.5 22 L11 24.5 L12.5 22 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
        </svg>
    );
}

const MESSAGES = [
    {
        icon: '🎁',
        text: 'REGALÁ LUJO PARA PAPÁ',
        sub: 'Perfumes árabes originales · Día del Padre 21 de junio',
    },
    {
        icon: '✦',
        text: 'EL REGALO QUE NUNCA OLVIDARÁ',
        sub: 'Fragancias exclusivas con decant de muestra',
    },
    {
        icon: '⚡',
        text: 'ENVÍO EXPRESS DISPONIBLE',
        sub: 'Consultá hoy por WhatsApp',
    },
];

export function TopBanner() {
    const [idx, setIdx] = useState(0);
    const daysLeft = useDaysLeft(FATHER_DAY);

    useEffect(() => {
        const id = setInterval(() => setIdx(p => (p + 1) % MESSAGES.length), 4000);
        return () => clearInterval(id);
    }, []);

    const wa = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Hola! 🎁 Quiero elegir un perfume de regalo para el Día del Padre.')}`;

    return (
        <div className={styles.banner}>
            {/* Left: decorative icons */}
            <div className={styles.side}>
                <GiftIcon />
                <FatherIcon />
            </div>

            {/* Center: rotating messages */}
            <div className={styles.center}>
                {MESSAGES.map((msg, i) => (
                    <div
                        key={i}
                        className={`${styles.message} ${i === idx ? styles.active : ''}`}
                    >
                        <span className={styles.msgIcon}>{msg.icon}</span>
                        <span className={styles.msgText}>{msg.text}</span>
                        <span className={styles.sep}>·</span>
                        <span className={styles.msgSub}>{msg.sub}</span>
                    </div>
                ))}
            </div>

            {/* Right: days countdown + WA link */}
            <div className={styles.side}>
                {daysLeft > 0 && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className={styles.ctaChip}>
                        <span className={styles.ctaDays}>{daysLeft}d</span>
                        <span className={styles.ctaLabel}>Consultá</span>
                    </a>
                )}
                {daysLeft === 0 && (
                    <span className={styles.todayBadge}>¡HOY!</span>
                )}
            </div>

            {/* Animated gold shimmer line at bottom */}
            <div className={styles.shimmerLine} aria-hidden="true"/>
        </div>
    );
}
