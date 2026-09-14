import Link from 'next/link';
export default function PerfumeNotFound() {
    return <main style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1>Perfume no encontrado</h1>
        <p>Este perfume no está en nuestro catálogo.</p>
        <Link href="/coleccion">Volver a la colección</Link>
    </main>;
}
