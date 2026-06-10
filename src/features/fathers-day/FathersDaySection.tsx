'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './FathersDaySection.module.css';
import { siteConfig } from '@/core/config/site';

// Fixed positions — avoids SSR/hydration mismatch
const PARTICLES = [
    { id: 0,  x: 8,  y: 12, s: 3, dur: 5.2, del: 0   },
    { id: 1,  x: 18, y: 68, s: 2, dur: 4.1, del: 0.8  },
    { id: 2,  x: 28, y: 25, s: 4, dur: 6.0, del: 0.3  },
    { id: 3,  x: 38, y: 82, s: 2, dur: 3.8, del: 1.2  },
    { id: 4,  x: 48, y: 10, s: 5, dur: 5.5, del: 0.6  },
    { id: 5,  x: 55, y: 55, s: 3, dur: 4.7, del: 1.8  },
    { id: 6,  x: 63, y: 30, s: 2, dur: 6.2, del: 0.1  },
    { id: 7,  x: 72, y: 75, s: 4, dur: 5.0, del: 2.0  },
    { id: 8,  x: 82, y: 18, s: 3, dur: 4.4, del: 0.9  },
    { id: 9,  x: 90, y: 60, s: 2, dur: 5.8, del: 1.5  },
    { id: 10, x: 15, y: 90, s: 3, dur: 4.9, del: 0.4  },
    { id: 11, x: 32, y: 45, s: 2, dur: 5.3, del: 2.2  },
    { id: 12, x: 50, y: 88, s: 4, dur: 3.6, del: 0.7  },
    { id: 13, x: 68, y: 5,  s: 2, dur: 6.5, del: 1.1  },
    { id: 14, x: 78, y: 42, s: 3, dur: 4.2, del: 1.9  },
    { id: 15, x: 5,  y: 50, s: 2, dur: 5.1, del: 0.2  },
    { id: 16, x: 22, y: 5,  s: 4, dur: 4.8, del: 1.6  },
    { id: 17, x: 88, y: 85, s: 3, dur: 5.6, del: 0.5  },
    { id: 18, x: 44, y: 62, s: 2, dur: 4.3, del: 2.5  },
    { id: 19, x: 95, y: 30, s: 3, dur: 5.9, del: 1.3  },
];

const FATHER_DAY = new Date('2026-06-21T00:00:00-03:00');

function useCountdown(target: Date) {
    const calc = () => {
        const diff = target.getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days:    Math.floor(diff / 86400000),
            hours:   Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
        };
    };
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        setTime(calc());
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, []);
    return time;
}

export function FathersDaySection() {
    const ref       = useRef<HTMLElement>(null);
    const inView    = useInView(ref, { once: true, amount: 0.2 });
    const countdown = useCountdown(FATHER_DAY);

    const msg = encodeURIComponent('Hola! 🎁 Estoy buscando un regalo para el Día del Padre. ¿Me ayudás a elegir un perfume?');
    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${msg}`;

    return (
        <section ref={ref} className={styles.section}>
            {/* Ambient background */}
            <div className={styles.bg} />
            <div className={styles.bgGlow} />

            {/* Floating gold particles */}
            <div className={styles.particles} aria-hidden="true">
                {PARTICLES.map(p => (
                    <motion.span
                        key={p.id}
                        className={styles.particle}
                        style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
                        animate={{ y: ['-18px', '18px', '-18px'], opacity: [0.15, 0.7, 0.15] }}
                        transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            {/* Huge watermark */}
            <div className={styles.watermark} aria-hidden="true">PAPÁ</div>

            {/* Main content */}
            <div className={styles.inner}>

                {/* Badge */}
                <motion.div
                    className={styles.badge}
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <span className={styles.badgePulse} />
                    DÍA DEL PADRE &nbsp;·&nbsp; 21 DE JUNIO
                </motion.div>

                {/* Headline */}
                <motion.h2
                    className={styles.headline}
                    initial={{ opacity: 0, y: 44 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                    El regalo que
                    <br />
                    <em className={styles.headlineGold}>nunca olvidará.</em>
                </motion.h2>

                {/* Subheading */}
                <motion.p
                    className={styles.sub}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
                >
                    Perfumes árabes de lujo. La fragancia que define a un hombre.
                </motion.p>

                {/* Countdown */}
                <motion.div
                    className={styles.countdown}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                >
                    {(
                        [
                            { val: countdown.days,    label: 'Días'  },
                            { val: countdown.hours,   label: 'Horas' },
                            { val: countdown.minutes, label: 'Min'   },
                            { val: countdown.seconds, label: 'Seg'   },
                        ] as const
                    ).map(({ val, label }, i) => (
                        <div key={label} className={styles.countGroup}>
                            <div className={styles.countBox}>
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={val}
                                        className={styles.countNum}
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0,   opacity: 1 }}
                                        exit={{    y:  20, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                                    >
                                        {String(val).padStart(2, '0')}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                            <span className={styles.countLabel}>{label}</span>
                            {i < 3 && <span className={styles.colon}>:</span>}
                        </div>
                    ))}
                </motion.div>

                {/* Trust pills */}
                <motion.div
                    className={styles.pills}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.68 }}
                >
                    {['✦ 100% Originales', '✦ Decant de muestra', '✦ Envío a todo el país'].map(t => (
                        <span key={t} className={styles.pill}>{t}</span>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    className={styles.ctas}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.82, ease: 'easeOut' }}
                >
                    <Link href="/coleccion" className={styles.btnPrimary}>
                        Ver colección masculina
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </Link>

                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.btnWa}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Consultar regalo ideal
                    </a>
                </motion.div>

            </div>

            {/* Bottom decorative line */}
            <motion.div
                className={styles.bottomLine}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
        </section>
    );
}
