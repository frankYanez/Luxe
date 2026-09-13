'use client';

import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/shared/ui/Container';
import { Section } from '@/components/shared/ui/Section';
import { wordReveal } from '@/lib/wordReveal';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import styles from './VitrinaRail.module.css';

const VITRINA = [
    { nombre: 'Club de Nuit', categoria: 'Masculino', img: '/images/club-de-nuit-intense-man.png' },
    { nombre: 'Asad Bourbon', categoria: 'Masculino', img: '/images/asad-bourbon.jpg' },
    { nombre: 'Amber Oud', categoria: 'Unisex', img: '/images/amber-oud-aqua-dubai.jpg' },
    { nombre: 'Yara', categoria: 'Femenino', img: '/images/yara.jpg' },
];

const LOOP = [...VITRINA, ...VITRINA];

/**
 * Vitrina Rail — continuous auto-scrolling showcase of the collection.
 * Pure CSS marquee (no JS), fade-masked edges, no interaction required.
 */
export function VitrinaRail() {
    const headerRef = useScrollReveal<HTMLDivElement>();

    return (
        <Section>
            <Container>
                <div ref={headerRef} className={styles.header}>
                    <span className={styles.eyebrow}>La colección en detalle</span>
                    <h2 className={styles.title}>
                        {wordReveal('Cada frasco,')}{' '}
                        <span className={styles.titleAccent}>{wordReveal('una escena')}</span>
                    </h2>
                </div>
            </Container>

            <div className={styles.railMask}>
                <div className={styles.rail}>
                    {LOOP.map((v, i) => (
                        <div key={`${v.nombre}-${i}`} className={styles.tile}>
                            <div className={styles.imageBox}>
                                <Image
                                    src={v.img}
                                    alt={`${v.nombre} — perfume árabe original en Luxe Essence Tandil`}
                                    width={340}
                                    height={425}
                                    className={styles.image}
                                    loading="lazy"
                                />
                            </div>
                            <div className={styles.caption}>
                                <span className={styles.name}>{v.nombre}</span>
                                <span className={styles.category}>{v.categoria}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
