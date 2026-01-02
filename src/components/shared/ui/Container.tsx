import React from 'react';
import styles from './Container.module.css';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Container Component
 * Responsive container with max-width constraints
 */
export function Container({ children, className = '' }: ContainerProps) {
    return (
        <div className={`container ${className}`}>
            {children}
        </div>
    );
}
