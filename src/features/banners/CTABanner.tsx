'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/ui/Button';
import styles from './CTABanner.module.css';

interface CTABannerProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    videoUrl?: string;
    imageUrl?: string;
    variant: 'masculine' | 'feminine';
}

/**
 * CTA Banner Component
 * Futuristic minimalist banner with scroll animations, glitch effects, and video support
 */
export function CTABanner({
    title,
    subtitle,
    ctaText,
    ctaLink,
    videoUrl,
    imageUrl,
    variant
}: CTABannerProps) {
    const bannerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Play video when visible
                    if (videoRef.current) {
                        videoRef.current.play().catch(() => {
                            // Autoplay might be blocked, that's ok
                        });
                    }
                } else {
                    // Pause video when not visible to save resources
                    if (videoRef.current) {
                        videoRef.current.pause();
                    }
                }
            },
            { threshold: 0.3 }
        );

        if (bannerRef.current) {
            observer.observe(bannerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Glitch effect trigger
    useEffect(() => {
        if (isVisible) {
            const interval = setInterval(() => {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 200);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isVisible]);

    return (
        <div
            ref={bannerRef}
            className={`${styles.banner} ${styles[variant]} ${isVisible ? styles.visible : ''}`}
        >
            {/* Fade Edges */}
            <div className={styles.fadeTop} />
            <div className={styles.fadeBottom} />

            {/* Background Media (Video or Image) */}
            <div className={styles.imageContainer}>
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        className={styles.backgroundVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                    >
                        <source src={videoUrl} type="video/mp4" />
                        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                    </video>
                ) : imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className={styles.backgroundImage}
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                ) : null}
                <div className={styles.imageOverlay} />
            </div>

            {/* Content */}
            <div className={styles.content}>
                <div className={styles.textContainer}>
                    <h2 className={`${styles.title} ${glitchActive ? styles.glitch : ''}`} data-text={title}>
                        {title}
                    </h2>

                    <p className={styles.subtitle}>
                        {subtitle}
                    </p>

                    <Button
                        variant="primary"
                        href={ctaLink}
                        className={styles.ctaButton}
                    >
                        {ctaText}
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className={styles.arrow}
                        >
                            <path
                                d="M7.5 15L12.5 10L7.5 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Button>
                </div>

                {/* Decorative Elements */}
                <div className={styles.decorLine} />
            </div>
        </div>
    );
}
