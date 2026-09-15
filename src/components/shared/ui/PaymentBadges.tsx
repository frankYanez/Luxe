import React from 'react';

/**
 * Small payment-network badges (Visa / Mastercard / Amex). Simplified
 * brand-colored marks, not the literal trademarked artwork.
 */
export function PaymentBadges({ className }: { className?: string }) {
    return (
        <div className={className} aria-label="Medios de pago: Visa, Mastercard, American Express">
            <svg width="32" height="20" viewBox="0 0 32 20" role="img" aria-label="Visa">
                <rect width="32" height="20" rx="4" fill="#1434CB" />
                <text x="16" y="14" textAnchor="middle" fontFamily="Arial, sans-serif" fontStyle="italic" fontWeight="700" fontSize="9" fill="#fff">VISA</text>
            </svg>
            <svg width="32" height="20" viewBox="0 0 32 20" role="img" aria-label="Mastercard">
                <rect width="32" height="20" rx="4" fill="#F4F4F2" />
                <circle cx="13" cy="10" r="6" fill="#EB001B" />
                <circle cx="19" cy="10" r="6" fill="#F79E1B" fillOpacity="0.9" />
            </svg>
            <svg width="32" height="20" viewBox="0 0 32 20" role="img" aria-label="American Express">
                <rect width="32" height="20" rx="4" fill="#2E77BC" />
                <text x="16" y="14" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="7.5" fill="#fff">AMEX</text>
            </svg>
        </div>
    );
}
