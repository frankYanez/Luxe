'use client';

import React from 'react';
import styles from './ShinyButton.module.css';

interface ShinyButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
}

/**
 * Shiny Button Component
 * Luxury CTA button with shimmer effect
 */
export function ShinyButton({ children, href, onClick }: ShinyButtonProps) {
    const button = (
        <button className={styles.shinyButton} onClick={onClick}>
            <span className={styles.shinyButtonContent}>{children}</span>
            <span className={styles.shinyButtonShine} />
        </button>
    );

    if (href) {
        return (
            <a href={href} className={styles.shinyButtonLink}>
                {button}
            </a>
        );
    }

    return button;
}
