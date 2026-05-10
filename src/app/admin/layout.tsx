import type { Metadata } from 'next';
import styles from './admin.module.css';

export const metadata: Metadata = { title: 'Admin — Luxe Essence' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className={styles.shell}>{children}</div>;
}
