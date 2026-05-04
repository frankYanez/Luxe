'use client';

import { useEffect, useRef } from 'react';
import styles from './CursorSpotlight.module.css';

/**
 * Subtle gold cursor spotlight that follows the mouse.
 * Creates a luxury "light following you" effect across the page.
 */
export function CursorSpotlight() {
    const spotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const pos = useRef({ x: -200, y: -200 });
    const ring = useRef({ x: -200, y: -200 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            pos.current = { x: e.clientX, y: e.clientY };
        };

        const animate = () => {
            // Spot follows instantly
            if (spotRef.current) {
                spotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
            }
            // Ring has spring lag
            ring.current.x += (pos.current.x - ring.current.x) * 0.12;
            ring.current.y += (pos.current.y - ring.current.y) * 0.12;
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <>
            <div ref={spotRef} className={styles.spot} />
            <div ref={ringRef} className={styles.ring} />
        </>
    );
}
