'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { wordReveal } from '@/lib/wordReveal';
import styles from './FAQSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
    {
        q: '¿Los perfumes son 100% originales?',
        a: 'Sí. Trabajamos directamente con distribuidores oficiales de casas perfumeras de Dubai, Sharjah y Arabia Saudita. Todos nuestros productos son originales de fábrica — nunca trabajamos con imitaciones ni fragancias alteradas. Podés solicitarnos información sobre la procedencia de cualquier producto.',
    },
    {
        q: '¿Qué es un decant y cuánto líquido tiene?',
        a: 'Un decant es una porción de perfume extraída directamente del frasco original y transferida a un atomizador de vidrio premium de 5ml. Es idéntico al perfume del frasco de fábrica — misma fórmula, misma concentración, mismo resultado. 5ml equivalen a aproximadamente 50-70 aplicaciones, lo que suele ser varias semanas de uso.',
    },
    {
        q: '¿Hacen envíos a todo el país?',
        a: 'Sí, enviamos a toda la Argentina a través de Andreani y Correo Argentino. El costo de envío varía según la zona y el peso del paquete. Los envíos a Tandil y alrededores pueden coordinar entrega o retiro personal sin costo adicional.',
    },
    {
        q: '¿Cuánto tarda en llegar mi pedido?',
        a: 'Los pedidos se procesan en 24-48hs hábiles. El tiempo de entrega promedio es de 2 a 5 días hábiles para el interior del país, y 1 a 3 días para GBA y CABA. Te enviamos el número de seguimiento en cuanto el paquete es despachado.',
    },
    {
        q: '¿Puedo recibir asesoramiento personalizado para elegir mi fragancia?',
        a: 'Absolutamente. Esta es una de nuestras ventajas más valoradas. Contanos tu estilo, las fragancias que usaste antes o la ocasión para la que la querés, y te recomendamos la fragancia perfecta. Escribinos por WhatsApp y respondemos en el día.',
    },
    {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Aceptamos transferencia bancaria, pago en efectivo (retiro local), y pago online mediante tarjeta de crédito o débito a través de nuestra plataforma segura con Ualá. Los pagos en efectivo tienen un 10% de descuento adicional.',
    },
    {
        q: '¿Cuánto dura la fragancia en piel?',
        a: 'Las fragancias árabes tienen una persistencia extraordinaria: entre 8 y 14 horas en piel, dependiendo de la fragancia y tu tipo de piel. Aplicadas en zonas de calor (muñecas, cuello, detrás de las orejas) y sobre piel hidratada, su duración es máxima. Muchas notas de fondo permanecen en la ropa por días.',
    },
];

/**
 * FAQ Section — Preguntas frecuentes accordion
 * GSAP scroll-entrance + CSS transition for accordion expand/collapse.
 */
export function FAQSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    /* ── Header reveal ── */
    useGSAP(() => {
        const el = headerRef.current;
        if (!el) return;
        const eyebrow = el.querySelector('[data-eyebrow]');
        const words = el.querySelectorAll('[data-word]');
        const desc = el.querySelector('[data-desc]');

        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        })
            .fromTo(eyebrow,
                { opacity: 0, y: 18, letterSpacing: '0.25em' },
                { opacity: 1, y: 0, letterSpacing: '0.18em', duration: 0.7, ease: 'power2.out' }
            )
            .fromTo(words,
                { y: '115%' },
                { y: '0%', duration: 0.85, stagger: 0.055, ease: 'power3.out' },
                '-=0.35'
            )
            .fromTo(desc,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
                '-=0.4'
            );
    }, { scope: headerRef });

    /* ── FAQ items stagger-in ── */
    useGSAP(() => {
        const el = listRef.current;
        if (!el) return;
        const items = el.querySelectorAll('[data-faq-item]');

        gsap.fromTo(items,
            { opacity: 0, x: -32 },
            {
                opacity: 1,
                x: 0,
                duration: 0.75,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, { scope: listRef });

    const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

    return (
        <Section id="faq">
            <Container>
                <div className={styles.faqContent}>
                    {/* Header */}
                    <div ref={headerRef} className={styles.header}>
                        <span className={styles.eyebrow} data-eyebrow>Todo lo que querés saber</span>
                        <h2 className={styles.title}>
                            {wordReveal('Preguntas')}
                            <span className={styles.titleAccent}>
                                {wordReveal('frecuentes')}
                            </span>
                        </h2>
                        <p className={styles.description} data-desc>
                            Resolvemos las dudas más comunes. Si no encontrás lo que buscás,
                            escribinos por WhatsApp — respondemos en el día.
                        </p>
                    </div>

                    {/* Accordion */}
                    <div ref={listRef} className={styles.list}>
                        {FAQS.map(({ q, a }, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div
                                    key={i}
                                    data-faq-item
                                    className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
                                >
                                    <button
                                        className={styles.question}
                                        onClick={() => toggle(i)}
                                        aria-expanded={isOpen}
                                    >
                                        <span className={styles.questionNum}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className={styles.questionText}>{q}</span>
                                        <span className={styles.chevron} aria-hidden>
                                            {isOpen ? '−' : '+'}
                                        </span>
                                    </button>

                                    <div className={`${styles.answer} ${isOpen ? styles.answerOpen : ''}`}>
                                        <p className={styles.answerText}>{a}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className={styles.bottomCta}>
                        <p className={styles.bottomCtaText}>¿Tenés alguna otra pregunta?</p>
                        <a
                            href="https://wa.me/5492494640012?text=Hola%2C%20tengo%20una%20consulta%20sobre%20Luxe%20Essence"
                            target="_blank"
                            rel="noreferrer"
                            className={styles.bottomCtaBtn}
                        >
                            Escribinos por WhatsApp →
                        </a>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
