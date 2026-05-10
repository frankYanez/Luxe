'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './products.module.css';

interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    decant_price?: number;
    in_stock: boolean;
    stock_quantity: number;
    featured: boolean;
    image?: string;
}

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts]   = useState<Product[]>([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [importing, setImporting] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        const res = await fetch('/api/admin/products');
        if (res.status === 401) { router.push('/admin/login'); return; }
        const { data } = await res.json();
        setProducts(data ?? []);
        setLoading(false);
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`¿Eliminar "${name}"?`)) return;
        await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        setProducts(p => p.filter(x => x.id !== id));
    }

    async function toggleStock(id: string, current: boolean) {
        await fetch(`/api/admin/products/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ in_stock: !current }),
        });
        setProducts(p => p.map(x => x.id === id ? { ...x, in_stock: !current } : x));
    }

    async function importFromSheets() {
        if (!confirm('¿Importar productos desde Google Sheets? Los existentes se actualizarán por slug.')) return;
        setImporting(true);
        const res  = await fetch('/api/admin/import-sheets', { method: 'POST' });
        const data = await res.json();
        if (res.ok) {
            alert(`✅ ${data.imported} productos importados/actualizados`);
            await load();
        } else {
            alert(`❌ Error: ${data.error}`);
        }
        setImporting(false);
    }

    async function logout() {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin/login');
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.logo}>Luxe Essence</h1>
                    <nav className={styles.nav}>
                        <Link href="/admin/products" className={`${styles.navLink} ${styles.navActive}`}>Productos</Link>
                        <Link href="/admin/orders" className={styles.navLink}>Pedidos</Link>
                        <Link href="/" target="_blank" className={styles.navLink}>Ver tienda ↗</Link>
                    </nav>
                </div>
                <button className={styles.logoutBtn} onClick={logout}>Salir</button>
            </header>

            <main className={styles.main}>
                <div className={styles.toolbar}>
                    <input
                        className={styles.search}
                        placeholder="Buscar por nombre o marca..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className={styles.importBtn} onClick={importFromSheets} disabled={importing}>
                        {importing ? 'Importando...' : '↓ Sync Google Sheets'}
                    </button>
                    <Link href="/admin/products/new" className={styles.newBtn}>+ Nuevo producto</Link>
                </div>

                {loading ? (
                    <div className={styles.loading}>Cargando productos...</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>
                        {products.length === 0 ? 'No hay productos. ¡Agregá el primero!' : 'Sin resultados.'}
                    </div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Marca</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Decant</th>
                                    <th>Stock</th>
                                    <th>Destacado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} className={!p.in_stock ? styles.outOfStock : ''}>
                                        <td>
                                            {p.image ? (
                                                <div className={styles.thumbWrap}>
                                                    <Image src={p.image} alt={p.name} fill className={styles.thumb} />
                                                </div>
                                            ) : (
                                                <div className={styles.thumbEmpty}>–</div>
                                            )}
                                        </td>
                                        <td className={styles.nameCell}>{p.name}</td>
                                        <td>{p.brand}</td>
                                        <td><span className={`${styles.badge} ${styles[p.category]}`}>{p.category}</span></td>
                                        <td>${Number(p.price).toLocaleString('es-AR')}</td>
                                        <td>{p.decant_price ? `$${Number(p.decant_price).toLocaleString('es-AR')}` : '–'}</td>
                                        <td>
                                            <button
                                                className={`${styles.stockBtn} ${p.in_stock ? styles.stockOn : styles.stockOff}`}
                                                onClick={() => toggleStock(p.id, p.in_stock)}
                                            >
                                                {p.in_stock ? '✓ En stock' : '✗ Sin stock'}
                                            </button>
                                        </td>
                                        <td className={styles.center}>{p.featured ? '⭐' : '–'}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <Link href={`/admin/products/${p.id}`} className={styles.editBtn}>Editar</Link>
                                                <button className={styles.deleteBtn} onClick={() => handleDelete(p.id, p.name)}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
