import { siteConfig } from '@/core/config/site';

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
    }
}

export function fbTrack(event: string, params?: Record<string, unknown>) {
    if (typeof window === 'undefined' || !window.fbq) return;
    window.fbq('track', event, { currency: siteConfig.business.currency, ...params });
}
