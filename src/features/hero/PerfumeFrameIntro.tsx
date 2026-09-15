'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PerfumeFrameIntro.module.css';

gsap.registerPlugin(ScrollTrigger);

// Two separate frame sequences, shot in the aspect ratio each device
// actually needs — mobile (9:16 portrait) and desktop (16:9 landscape) —
// rather than stretching/cropping one source to fit both. Scroll distance
// per frame is kept equal (~33px/frame) so the scrub pace feels the same.
const PX_PER_FRAME = 2200 / 66;
const FRAME_SETS = {
    // Starts at frame 31 — the first 30 (bottle just sitting there, closed)
    // got trimmed so the mobile intro opens already mid-motion.
    mobile: { dir: 'fakhar', start: 31, end: 66 },
    // Same idea on desktop: frames 1-20 (static) and 95-120 (fully open,
    // holding still) trimmed off both ends — only files 21-94 exist on disk.
    desktop: { dir: 'fakhar-desktop', start: 21, end: 94 },
} as const;
const MOBILE_BREAKPOINT = 768;

/**
 * Full-viewport pinned frame-sequence intro. Scrubs through the perfume
 * disassembly frames as the user scrolls, then releases the pin so the
 * rest of the page (header, hero copy, sections) scrolls into view.
 */
export function PerfumeFrameIntro() {
    const sectionRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const word1Ref = useRef<HTMLSpanElement>(null);
    const word2Ref = useRef<HTMLSpanElement>(null);
    const currentFrameRef = useRef(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
        const { dir, start, end } = isMobile ? FRAME_SETS.mobile : FRAME_SETS.desktop;
        const FRAME_COUNT = end - start + 1;
        // i is the 1-based index into the active sequence; map it to the
        // real file number (offset by `start`) on disk.
        const framePath = (i: number) => `/frames/${dir}/frame_${String(start + i - 1).padStart(4, '0')}.webp`;
        const scrollDistance = Math.round(PX_PER_FRAME * FRAME_COUNT);

        const images: HTMLImageElement[] = [];

        const draw = (idx: number) => {
            const canvas = canvasRef.current;
            const img = images[idx];
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return;

            const { width, height } = canvas;
            const imgRatio = img.naturalWidth / img.naturalHeight;
            const canvasRatio = width / height;
            let dw = width;
            let dh = height;
            let dx = 0;
            let dy = 0;

            // Cover fit on both mobile and desktop — always fill the full
            // viewport, cropping whichever dimension overflows. Desktop now
            // has its own 16:9 sequence shot for this, so cropping is
            // minor (only kicks in when the window isn't exactly 16:9)
            // instead of leaving black pillarbox bars on the sides.
            if (imgRatio > canvasRatio) {
                dh = height;
                dw = height * imgRatio;
                dx = (width - dw) / 2;
            } else {
                dw = width;
                dh = width / imgRatio;
                dy = (height - dh) / 2;
            }

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, dx, dy, dw, dh);
        };

        const resize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw(currentFrameRef.current);
        };

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.decoding = 'async';
            if (i <= 2) img.setAttribute('fetchpriority', 'high');
            img.src = framePath(i);
            if (i === 1) {
                img.onload = () => {
                    resize();
                    setReady(true);
                };
            }
            images.push(img);
        }

        window.addEventListener('resize', resize);

        // This is a scroll-scrubbed reveal, not autoplaying motion — the user
        // already controls pace and direction via their own scroll input, so
        // we run it regardless of prefers-reduced-motion (which otherwise
        // made the intro jump straight to the last frame with no scrub at
        // all on any machine with OS-level "reduce motion" / animation
        // effects turned off, Chromium's own toggle or not).
        const ctx = gsap.context(() => {
            // Mobile browsers resize the viewport as the address bar hides/shows
            // while scrolling, which throws off the pin's height calculations
            // mid-scroll (the pinned section visibly shrinks and the page
            // underneath bleeds through). Lock scroll to the JS thread so the
            // viewport stays put for the whole pin duration.
            const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
            if (isCoarsePointer) {
                // allowNestedScroll — without it, normalizeScroll swallows
                // touch-drag on horizontally-scrolling children (product
                // carousels) since it grabs touchmove for the vertical
                // normalization itself.
                ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
            }

            // "Perfumes" and "Árabes" fade in one after the other in the
            // last stretch of the pinned scroll, then both hold on screen
            // until the pin itself releases right at the very end — that's
            // the moment the page content slides up and covers the intro.
            const WORD1_RANGE: [number, number] = [0.72, 0.85];
            const WORD2_RANGE: [number, number] = [0.85, 0.96];
            const revealProgress = (p: number, [from, to]: [number, number]) =>
                gsap.utils.clamp(0, 1, (p - from) / (to - from));

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: `+=${scrollDistance}`,
                pin: true,
                scrub: 0.6,
                onUpdate: (self) => {
                    const idx = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * FRAME_COUNT));
                    if (idx !== currentFrameRef.current || !images[idx]?.complete) {
                        currentFrameRef.current = idx;
                        draw(idx);
                    }

                    const w1 = revealProgress(self.progress, WORD1_RANGE);
                    const w2 = revealProgress(self.progress, WORD2_RANGE);
                    if (word1Ref.current) {
                        word1Ref.current.style.opacity = String(w1);
                        word1Ref.current.style.transform = `translateY(${(1 - w1) * 18}px)`;
                    }
                    if (word2Ref.current) {
                        word2Ref.current.style.opacity = String(w2);
                        word2Ref.current.style.transform = `translateY(${(1 - w2) * 18}px)`;
                    }
                },
            });
        }, sectionRef);

        return () => {
            window.removeEventListener('resize', resize);
            ctx.revert();
            ScrollTrigger.normalizeScroll(false);
        };
    }, []);

    return (
        <section ref={sectionRef} className={styles.intro}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.vignette} aria-hidden />
            <h2 className={styles.introTitle} aria-hidden="true">
                <span ref={word1Ref} className={styles.introWord}>Perfumes</span>
                <span ref={word2Ref} className={`${styles.introWord} ${styles.introWordAccent}`}>Árabes</span>
            </h2>
            <div className={styles.scrollCue} data-visible={ready}>
                <span>Desplazate</span>
                <span className={styles.scrollLine} />
            </div>
        </section>
    );
}
