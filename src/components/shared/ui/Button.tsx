import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
    href?: string;
}

/**
 * Button Component
 * Luxury-styled button with multiple variants
 */
export function Button({
    variant = 'primary',
    children,
    className = '',
    href,
    ...props
}: ButtonProps) {
    const classes = `btn btn-${variant} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
