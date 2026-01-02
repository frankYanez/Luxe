'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './PerfumeShowcase3D.module.css';

/**
 * 3D Perfume Showcase Component
 * Interactive 3D tilt effect with mouse tracking
 */
export function PerfumeShowcase3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div
            ref={containerRef}
            className={styles.showcase}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={styles.showcaseCard}
                style={{
                    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`,
                }}
            >
                {/* Glow Effect */}
                <div className={styles.showcaseGlow} />

                {/* Perfume Image */}
                <div className={styles.showcaseImage}>
                    <Image
                        src="/images/hero/khamrah-hero.png"
                        alt="Khamrah Premium Arabic Perfume"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                {/* Floating Particles */}
                <div className={styles.particles}>
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.particle}
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Reflection Effect */}
                <div className={styles.showcaseReflection} />
            </div>
        </div>
    );
}
