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
    desktop: { dir: 'fakhar-desktop', start: 1, end: 120 },
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

            if (isMobile) {
                // Always fill the full screen width on mobile — never
                // pillarbox with black bars on the sides. Crops top/bottom
                // instead when the frame is relatively taller than the
                // screen, which reads fine for a portrait bottle shot.
                dw = width;
                dh = width / imgRatio;
                dy = (height - dh) / 2;
            } else if (imgRatio > canvasRatio) {
                // Contain fit — show the whole frame instead of cropping/zooming
                // into a cover fill.
                dw = width;
                dh = width / imgRatio;
                dy = (height - dh) / 2;
            } else {
                dh = height;
                dw = height * imgRatio;
                dx = (width - dw) / 2;
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
                ScrollTrigger.normalizeScroll(true);
            }

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
            <div className={styles.scrollCue} data-visible={ready}>
                <span>Desplazate</span>
                <span className={styles.scrollLine} />
            </div>
        </section>
    );
}
