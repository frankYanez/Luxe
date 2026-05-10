'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch('/api/admin/auth', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ password }),
        });
        if (res.ok) {
            router.push('/admin/products');
        } else {
            setError('Contraseña incorrecta');
        }
        setLoading(false);
    }

    return (
        <div className={styles.page}>

            {/* Animated background */}
            <div className={styles.bg}>
                <div className={styles.orb1} />
                <div className={styles.orb2} />
                <div className={styles.orb3} />
                <div className={styles.noise} />
            </div>

            {/* Back to site */}
            <Link href="/" className={styles.backBtn}>
                ← Volver a la web
            </Link>

            {/* Login card */}
            <div className={styles.card}>
                <div className={styles.brandMark}>
                    <span className={styles.brandIcon}>✦</span>
                    <h1 className={styles.title}>Luxe Essence</h1>
                    <p className={styles.subtitle}>Panel de administración</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.inputWrap}>
                        <span className={styles.inputIcon}>🔑</span>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={styles.input}
                            autoFocus
                            required
                        />
                    </div>

                    {error && (
                        <p className={styles.error}>
                            ⚠ {error}
                        </p>
                    )}

                    <button type="submit" className={styles.btn} disabled={loading}>
                        {loading ? <span className={styles.spinner} /> : 'Ingresar al panel'}
                    </button>
                </form>

                <p className={styles.footerNote}>ACCESO RESTRINGIDO · LUXE ESSENCE</p>
            </div>
        </div>
    );
}
