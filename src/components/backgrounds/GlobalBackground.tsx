'use client';

import ColorBends from './Blends';

/**
 * Fixed full-viewport shader background — rendered behind all pages.
 * Placed in the root layout so it persists across route changes.
 */
export function GlobalBackground() {
    return (
        <div
            aria-hidden
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
                width: '100vw',
                height: '100vh',
            }}
        >
            <ColorBends
                colors={['#C5A059', '#C5A059', '#C5A059']}
                rotation={30}
                speed={1}
                scale={0.5}
                frequency={1.4}
                warpStrength={1.2}
                mouseInfluence={0}
                parallax={0}
                noise={0.08}
                transparent
            />
        </div>
    );
}
