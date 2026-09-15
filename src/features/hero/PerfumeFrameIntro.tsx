'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PerfumeFrameIntro.module.css';

gsap.registerPlugin(ScrollTrigger);
// Mobile browsers fire `resize` when the address bar hides/shows mid-scroll
// (height-only change, no rotation). Without this, ScrollTrigger's own
// auto-refresh recalculates positions on every one of those and the scroll
// visibly snaps/rubber-bands.
ScrollTrigger.config({ ignoreMobileResize: true });

// Two separate frame sequences, shot in the aspect ratio each device
// actually needs — mobile (9:16 portrait) and desktop (16:9 landscape) —
// rather than stretching/cropping one source to fit both. Scroll distance
// per frame is kept equal (~33px/frame) so the scrub pace feels the same.
const PX_PER_FRAME = 2200 / 66;
const FRAME_SETS = {
    // Frames 1-10 were trimmed (pure duplicate statics) — 11 is the first
    // frame on disk, bottle fully closed. Start there so mobile doesn't
    // open mid-motion.
    mobile: { dir: 'fakhar', start: 11, end: 66 },
    // Same idea on desktop: frames 1-20 (static) and 95-120 (fully open,
    // holding still) trimmed off both ends — only files 21-94 exist on disk.
    desktop: { dir: 'fakhar-desktop', start: 21, end: 94 },
} as const;
const MOBILE_BREAKPOINT = 768;

/**
 * Full-viewport frame-sequence intro, fixed behind the rest of the page.
 * Scrubs through the perfume disassembly frames as the user scrolls, holds
 * on the last frame, then the page content (header, hero copy, sections)
 * scrolls up over it like a sheet, covering it for good.
 */
export function PerfumeFrameIntro() {
    const sectionRef = useRef<HTMLElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);
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
        const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
        let lastWidth = window.innerWidth;
        let sized = false;

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
            // Canvas sizing is always safe to redo — it's inside the fixed,
            // out-of-flow section, so it can never affect document/scroll
            // height, unlike the spacer below.
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                draw(currentFrameRef.current);
            }

            const widthChanged = window.innerWidth !== lastWidth;
            lastWidth = window.innerWidth;
            // On mobile, a height-only change is the address bar hiding/showing
            // while the user scrolls — not a real resize. Resizing the spacer
            // in response (while the user is scrolled partway through it) is
            // what caused the scroll to snap back. Only react to real width
            // changes (rotation, actual resize) once past the initial mount.
            if (sized && isCoarsePointer && !widthChanged) return;
            sized = true;

            // Spacer reserves the scroll room the fixed intro no longer
            // takes up in the flow: one viewport's worth to hold the frozen
            // last frame while the page content sheet slides over it, plus
            // the frame-scrub distance itself.
            if (spacerRef.current) {
                spacerRef.current.style.height = `${window.innerHeight + scrollDistance}px`;
            }
        };
        resize();

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
            // while scrolling, which used to throw off the pinned section's
            // height calculations mid-scroll. The intro is now plain
            // position: fixed (see CSS) instead of a GSAP pin, which sidesteps
            // that class of bug entirely, but touch-drag on horizontally
            // scrolling children (product carousels) still needs this.
            if (isCoarsePointer) {
                // allowNestedScroll — without it, normalizeScroll swallows
                // touch-drag on horizontally-scrolling children (product
                // carousels) since it grabs touchmove for the vertical
                // normalization itself.
                ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
            }

            // "Perfumes" and "Árabes" fade in early — well before the scrub
            // finishes — then hold on screen through the rest of the frame
            // sequence and the trailing hold, right up until the content
            // sheet below covers the (now fixed, frozen-on-last-frame) intro.
            const WORD1_RANGE: [number, number] = [0.32, 0.46];
            const WORD2_RANGE: [number, number] = [0.46, 0.6];
            const revealProgress = (p: number, [from, to]: [number, number]) =>
                gsap.utils.clamp(0, 1, (p - from) / (to - from));

            // Trigger is the spacer, not the (fixed, out-of-flow) intro
            // section itself — no pin: the intro just stays fixed in place
            // the whole time, and scrolling through the spacer both drives
            // the frame scrub (first `scrollDistance` px) and, after that,
            // lets the page content underneath scroll up and cover it.
            ScrollTrigger.create({
                trigger: spacerRef.current,
                start: 'top top',
                end: `+=${scrollDistance}`,
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
        <>
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
            {/* Reserves the scroll room the now-fixed intro no longer takes
                up in the flow — see resize() above. */}
            <div ref={spacerRef} aria-hidden />
        </>
    );
}
