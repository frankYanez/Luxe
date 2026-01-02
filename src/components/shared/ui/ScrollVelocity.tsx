'use client';

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";

// Utility to wrap value within a range
const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
import styles from './ScrollVelocity.module.css';

interface ParallaxProps {
    children: string;
    baseVelocity: number;
    className?: string;
}

function ParallaxText({ children, baseVelocity = 100, className }: ParallaxProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Removed useSpring to improve scroll performance
    const velocityFactor = useTransform(scrollVelocity, [0, 500], [0, 1], {
        clamp: false
    });

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 4000);

        // Dynamic direction change based on scroll
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    /**
     * The number of times to repeat the child text should be dynamic based on
     * screen width to prevent whitespace. using 4 is a safe bet for now.
     */
    return (
        <div className={styles.parallax}>
            <motion.div className={`${styles.scroller} ${className}`} style={{ x }}>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
                <span>{children} </span>
            </motion.div>
        </div>
    );
}

interface ScrollVelocityProps {
    text: string;
    velocity?: number;
    className?: string;
    variant?: 'outline' | 'solid';
}

export function ScrollVelocity({
    text = "3 CUOTAS SIN INTERÉS",
    velocity = 1,
    className = "",
    variant = 'outline'
}: ScrollVelocityProps) {
    return (
        <section>
            <ParallaxText baseVelocity={velocity} className={variant === 'solid' ? styles.solid : ''}>
                {text}
            </ParallaxText>
            <ParallaxText baseVelocity={-velocity} className={variant === 'solid' ? styles.solid : ''}>
                {text}
            </ParallaxText>
        </section>
    );
}
