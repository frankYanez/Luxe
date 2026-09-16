import React from 'react';

/**
 * Splits text into word spans for GSAP clip-path reveal animations.
 * Each word is wrapped in an overflow:hidden container so translateY(110%)→0
 * creates a "reveal from bottom" effect.
 *
 * Usage in JSX:
 *   <h2>{wordReveal('Hello World')}</h2>
 *
 * Then in useGSAP:
 *   gsap.fromTo('[data-word]', { y: '110%' }, { y: '0%', stagger: 0.07, ... })
 */
export function wordReveal(text: string): React.ReactNode[] {
    return text.split(' ').map((word, i, arr) => (
        <React.Fragment key={i}>
            <span
                style={{
                    display: 'inline-block',
                    // Hide only vertically (for the slide-up reveal) — clipping
                    // both axes cut off the trailing edge of italic words,
                    // since italic glyphs slant past their own advance width.
                    overflowX: 'visible',
                    overflowY: 'hidden',
                    verticalAlign: 'bottom',
                    lineHeight: 1.3,
                }}
            >
                <span data-word="" style={{ display: 'inline-block' }}>
                    {word}
                </span>
            </span>
            {i < arr.length - 1 && '\u00A0'}
        </React.Fragment>
    ));
}
