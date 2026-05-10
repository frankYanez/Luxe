'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './orders.module.css';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending:    { label: 'Pendiente',   cls: 'pending' },
    processing: { label: 'Pagado',      cls: 'processing' },
    completed:  { label: 'Completado',  cls: 'completed' },
    cancelled:  { label: 'Cancelado',   cls: 'cancelled' },
    failed:     { label: 'Fallido',     cls: 'failed' },
};

interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    items: any[];
    total: number;
    status: string;
    uala_uuid?: string;
    created_at: string;
}

export default function OrdersPage() {
    const router  = useRouter();
    const [orders,  setOrders]  = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState('all');

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        const res = await fetch('/api/admin/orders');
        if (res.status === 401) { router.push('/admin/login'); return; }
        const { data } = await res.json();
        setOrders(data ?? []);
        setLoading(false);
    }

    async function updateStatus(id: number, status: string) {
        await fetch('/api/admin/orders', {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id, status }),
        });
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }

    async function logout() {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin/login');
    }

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const stats = {
        total:     orders.length,
        pending:   orders.filter(o => o.status === 'pending').length,
        paid:      orders.filter(o => o.status === 'processing').length,
        revenue:   orders.filter(o => ['processing', 'completed'].includes(o.status))
                        .reduce((s, o) => s + Number(o.total), 0),
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.logo}>Luxe Essence</h1>
                    <nav className={styles.nav}>
                        <Link href="/admin/products" className={styles.navLink}>Productos</Link>
                        <Link href="/admin/orders" className={`${styles.navLink} ${styles.navActive}`}>Pedidos</Link>
                        <Link href="/" target="_blank" className={styles.navLink}>Ver tienda ↗</Link>
                    </nav>
                </div>
                <button className={styles.logoutBtn} onClick={logout}>Salir</button>
            </header>

            <main className={styles.main}>
                <div className={styles.statsRow}>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>{stats.total}</span>
                        <span className={styles.statLabel}>Total pedidos</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statNum} ${styles.pendingNum}`}>{stats.pending}</span>
                        <span className={styles.statLabel}>Pendientes</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statNum} ${styles.paidNum}`}>{stats.paid}</span>
                        <span className={styles.statLabel}>Pagados</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={`${styles.statNum} ${styles.revenueNum}`}>
                            ${stats.revenue.toLocaleString('es-AR')}
                        </span>
                        <span className={styles.statLabel}>Ingresos confirmados</span>
                    </div>
                </div>

                <div className={styles.filterRow}>
                    {['all', 'pending', 'processing', 'completed', 'cancelled'].map(s => (
                        <button
                            key={s}
                            className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ''}`}
                            onClick={() => setFilter(s)}
                        >
                            {s === 'all' ? 'Todos' : STATUS_LABELS[s]?.label ?? s}
                        </button>
                    ))}
                    <button className={styles.refreshBtn} onClick={load}>↻ Actualizar</button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Cargando pedidos...</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>No hay pedidos{filter !== 'all' ? ' con este estado' : ''}.</div>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Contacto</th>
                                    <th>Productos</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(o => {
                                    const st = STATUS_LABELS[o.status] ?? { label: o.status, cls: 'pending' };
                                    return (
                                        <tr key={o.id}>
                                            <td className={styles.idCell}>#{o.id}</td>
                                            <td className={styles.dateCell}>
                                                {new Date(o.created_at).toLocaleDateString('es-AR', {
                                                    day: '2-digit', month: '2-digit', year: '2-digit',
                                                    hour: '2-digit', minute: '2-digit',
                                                })}
                                            </td>
                                            <td>
                                                <div className={styles.customerName}>{o.customer_name}</div>
                                                {o.customer_address && <div className={styles.customerAddr}>{o.customer_address}</div>}
                                            </td>
                                            <td>
                                                <div className={styles.contact}>{o.customer_email}</div>
                                                <div className={styles.contact}>{o.customer_phone}</div>
                                            </td>
                                            <td>
                                                <ul className={styles.itemList}>
                                                    {(o.items ?? []).map((item: any, i: number) => (
                                                        <li key={i}>{item.quantity}x {item.name}{item.variant ? ` (${item.variant})` : ''}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td className={styles.total}>${Number(o.total).toLocaleString('es-AR')}</td>
                                            <td>
                                                <span className={`${styles.badge} ${styles[st.cls]}`}>{st.label}</span>
                                            </td>
                                            <td>
                                                <select
                                                    className={styles.statusSelect}
                                                    value={o.status}
                                                    onChange={e => updateStatus(o.id, e.target.value)}
                                                >
                                                    <option value="pending">Pendiente</option>
                                                    <option value="processing">Pagado</option>
                                                    <option value="completed">Completado</option>
                                                    <option value="cancelled">Cancelado</option>
                                                    <option value="failed">Fallido</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
