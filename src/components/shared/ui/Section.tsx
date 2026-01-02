import React from 'react';
import styles from './Section.module.css';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

/**
 * Section Component
 * Semantic section wrapper with spacing
 */
export function Section({ children, className = '', id }: SectionProps) {
    return (
        <section id={id} className={`section ${className}`}>
            {children}
        </section>
    );
}
