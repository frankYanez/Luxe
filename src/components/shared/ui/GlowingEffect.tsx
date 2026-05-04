'use client';

import { useEffect, useRef } from 'react';
import styles from './GlowingEffect.module.css';

interface GlowingEffectProps {
    /** Size of the glow spotlight in px */
    spread?: number;
    /** Width of the glowing border in px */
    borderWidth?: number;
    /** Glow color */
    color?: string;
    /** Extra blur on the glow */
    glow?: boolean;
    disabled?: boolean;
}

/**
 * Drop inside any `position: relative` card.
 * Renders a glowing border that follows the mouse cursor.
 * Uses CSS mask to reveal only the border area.
 */
export function GlowingEffect({
    spread = 200,
    borderWidth = 2,
    color = 'rgba(197, 160, 89, 0.85)',
    glow = true,
    disabled = false,
}: GlowingEffectProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) return;

        const el = ref.current;
        const parent = el?.parentElement;
        if (!el || !parent) return;

        const onMove = (e: MouseEvent) => {
            const rect = parent.getBoundingClientRect();
            el.style.setProperty('--x', `${e.clientX - rect.left}px`);
            el.style.setProperty('--y', `${e.clientY - rect.top}px`);
            el.style.setProperty('--opacity', '1');
        };

        const onLeave = () => {
            el.style.setProperty('--opacity', '0');
        };

        parent.addEventListener('mousemove', onMove);
        parent.addEventListener('mouseleave', onLeave);

        return () => {
            parent.removeEventListener('mousemove', onMove);
            parent.removeEventListener('mouseleave', onLeave);
        };
    }, [disabled]);

    if (disabled) return null;

    return (
        <div
            ref={ref}
            className={`${styles.glow} ${glow ? styles.withGlow : ''}`}
            style={{
                '--spread': `${spread}px`,
                '--bw': `${borderWidth}px`,
                '--color': color,
                '--opacity': '0',
            } as React.CSSProperties}
        />
    );
}
