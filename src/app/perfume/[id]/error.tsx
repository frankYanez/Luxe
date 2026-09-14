'use client';
import Link from 'next/link';
export default function PerfumeError({ reset }: { reset: () => void }) {
    return <main style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1>No pudimos cargar el perfume</h1>
        <button onClick={reset}>Reintentar</button>
        <p><Link href="/coleccion">Volver a la colección</Link></p>
    </main>;
}
