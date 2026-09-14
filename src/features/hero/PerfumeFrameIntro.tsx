'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PerfumeFrameIntro.module.css';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 66; // last 30 of the 96 extracted frames trimmed off — shorter intro
const framePath = (i: number) => `/frames/fakhar/frame_${String(i).padStart(4, '0')}.webp`;

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

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (prefersReduced) {
                currentFrameRef.current = FRAME_COUNT - 1;
                images[FRAME_COUNT - 1].onload = () => draw(FRAME_COUNT - 1);
                return;
            }

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
                end: '+=2200', // scaled down with FRAME_COUNT so per-frame scroll pacing stays the same
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
