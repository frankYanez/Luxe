'use client';

import { useEffect, useState, useRef } from 'react';
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
    cost_usd?: number;
    discount_percentage?: number;
}

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts]   = useState<Product[]>([]);
    const [loading, setLoading]     = useState(true);
    const [search, setSearch]       = useState('');
    const [importing, setImporting] = useState(false);
    const [dolarRate, setDolarRate] = useState<number | null>(null);
    const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        load();
        fetch('/api/admin/dolar-rate')
            .then(r => r.json())
            .then(d => { if (d.venta) setDolarRate(d.venta); })
            .catch(() => {});
    }, []);

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

    function changeStock(id: string, delta: number) {
        setProducts(prev => prev.map(p => {
            if (p.id !== id) return p;
            const qty = Math.max(0, (p.stock_quantity ?? 0) + delta);
            scheduleStockSave(id, qty);
            return { ...p, stock_quantity: qty, in_stock: qty > 0 };
        }));
    }

    function setStockDirect(id: string, qty: number) {
        const safe = Math.max(0, isNaN(qty) ? 0 : qty);
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, stock_quantity: safe, in_stock: safe > 0 } : p
        ));
        scheduleStockSave(id, safe);
    }

    function scheduleStockSave(id: string, qty: number) {
        clearTimeout(saveTimers.current[id]);
        saveTimers.current[id] = setTimeout(() => {
            fetch(`/api/admin/products/${id}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ stock_quantity: qty, in_stock: qty > 0 }),
            });
        }, 700);
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
                    <h1 className={styles.logo}>Luxe</h1>
                    <nav className={styles.nav}>
                        <Link href="/admin/products" className={`${styles.navLink} ${styles.navActive}`}>Productos</Link>
                        <Link href="/admin/orders" className={styles.navLink}>Pedidos</Link>
                        <Link href="/" target="_blank" className={styles.navLink}>Tienda ↗</Link>
                    </nav>
                </div>
                <div className={styles.headerRight}>
                    {dolarRate && (
                        <span className={styles.dolarBadge}>
                            💵 ${dolarRate.toLocaleString('es-AR')}
                        </span>
                    )}
                    <button className={styles.logoutBtn} onClick={logout}>Salir</button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.toolbar}>
                    <input
                        className={styles.search}
                        placeholder="Buscar producto o marca..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button className={styles.importBtn} onClick={importFromSheets} disabled={importing}>
                        {importing ? 'Importando...' : '↓ Sheets'}
                    </button>
                    <Link href="/admin/products/new" className={styles.newBtn}>+ Nuevo</Link>
                </div>

                {loading ? (
                    <div className={styles.loading}>Cargando productos...</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>
                        {products.length === 0 ? 'No hay productos.' : 'Sin resultados.'}
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filtered.map(p => (
                            <div key={p.id} className={`${styles.card} ${!p.in_stock ? styles.cardOutOfStock : ''}`}>

                                {/* Top: image + info */}
                                <div className={styles.cardTop}>
                                    {p.image ? (
                                        <div className={styles.thumbWrap}>
                                            <Image src={p.image} alt={p.name} fill className={styles.thumb} />
                                        </div>
                                    ) : (
                                        <div className={styles.thumbEmpty}>🧴</div>
                                    )}
                                    <div className={styles.cardInfo}>
                                        <p className={styles.cardName}>{p.name}</p>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.cardBrand}>{p.brand}</span>
                                            <span className={`${styles.badge} ${styles[p.category]}`}>{p.category}</span>
                                        </div>
                                        <div className={styles.cardPrices}>
                                            <span className={styles.cardPrice}>${Number(p.price).toLocaleString('es-AR')}</span>
                                            {p.decant_price && (
                                                <span className={styles.cardDecant}>Decant ${Number(p.decant_price).toLocaleString('es-AR')}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Cost row (if set) */}
                                {p.cost_usd ? (
                                    <div className={styles.cardCost}>
                                        <span className={styles.costLabel}>Costo</span>
                                        <span className={styles.costUsd}>${Number(p.cost_usd).toFixed(2)} USD</span>
                                        {dolarRate && (
                                            <span className={styles.costArs}>≈ ${Math.round(p.cost_usd * dolarRate).toLocaleString('es-AR')} ARS</span>
                                        )}
                                    </div>
                                ) : null}

                                {/* Bottom: stock control + badges + actions */}
                                <div className={styles.cardBottom}>
                                    <div className={styles.stockControl}>
                                        <button
                                            className={styles.stockStep}
                                            onClick={() => changeStock(p.id, -1)}
                                            disabled={p.stock_quantity <= 0}
                                        >−</button>
                                        <input
                                            className={`${styles.stockInput} ${p.stock_quantity === 0 ? styles.stockZero : ''}`}
                                            type="number"
                                            min="0"
                                            value={p.stock_quantity}
                                            onChange={e => setStockDirect(p.id, parseInt(e.target.value))}
                                        />
                                        <button
                                            className={styles.stockStep}
                                            onClick={() => changeStock(p.id, 1)}
                                        >+</button>
                                    </div>

                                    <div className={styles.cardRight}>
                                        {p.featured && <span className={styles.featuredBadge}>⭐</span>}
                                        {p.discount_percentage && p.discount_percentage > 0
                                            ? <span className={styles.promoBadge}>−{p.discount_percentage}%</span>
                                            : null
                                        }
                                        <div className={styles.actions}>
                                            <Link href={`/admin/products/${p.id}`} className={styles.editBtn}>Editar</Link>
                                            <button className={styles.deleteBtn} onClick={() => handleDelete(p.id, p.name)}>✕</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
