'use client';

import { useEffect, useRef } from 'react';

interface Options {
    threshold?: number;
    rootMargin?: string;
    delay?: number;
}

/**
 * Attach to any element to fade+slide it in when it enters the viewport.
 * Usage: const ref = useScrollReveal();
 *        <div ref={ref}>...</div>
 */
export function useScrollReveal<T extends HTMLElement>(opts: Options = {}) {
    const ref = useRef<T>(null);
    const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', delay = 0 } = opts;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, delay]);

    return ref;
}
