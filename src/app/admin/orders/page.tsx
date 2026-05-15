'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './orders.module.css';

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending:    { label: 'Pendiente',  cls: 'pending' },
    processing: { label: 'Pagado',     cls: 'processing' },
    completed:  { label: 'Completado', cls: 'completed' },
    cancelled:  { label: 'Cancelado',  cls: 'cancelled' },
    failed:     { label: 'Fallido',    cls: 'failed' },
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
    const router = useRouter();
    const [orders, setOrders]   = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter]   = useState('all');
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

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

    function toggleExpand(id: number) {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    }

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const stats = {
        total:   orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        paid:    orders.filter(o => o.status === 'processing').length,
        revenue: orders
            .filter(o => ['processing', 'completed'].includes(o.status))
            .reduce((s, o) => s + Number(o.total), 0),
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.logo}>Luxe</h1>
                    <nav className={styles.nav}>
                        <Link href="/admin/products" className={styles.navLink}>Productos</Link>
                        <Link href="/admin/orders" className={`${styles.navLink} ${styles.navActive}`}>Pedidos</Link>
                        <Link href="/" target="_blank" className={styles.navLink}>Tienda ↗</Link>
                    </nav>
                </div>
                <button className={styles.logoutBtn} onClick={logout}>Salir</button>
            </header>

            <main className={styles.main}>
                {/* Stats */}
                <div className={styles.statsRow}>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>{stats.total}</span>
                        <span className={styles.statLabel}>Total</span>
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
                        <span className={styles.statLabel}>Ingresos</span>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className={styles.filterBar}>
                    {['all', 'pending', 'processing', 'completed', 'cancelled'].map(s => (
                        <button
                            key={s}
                            className={`${styles.filterBtn} ${filter === s ? styles.filterActive : ''}`}
                            onClick={() => setFilter(s)}
                        >
                            {s === 'all' ? 'Todos' : STATUS_LABELS[s]?.label ?? s}
                            {s !== 'all' && (
                                <span className={styles.filterCount}>
                                    {orders.filter(o => o.status === s).length}
                                </span>
                            )}
                        </button>
                    ))}
                    <button className={styles.refreshBtn} onClick={load}>↻</button>
                </div>

                {/* Order cards */}
                {loading ? (
                    <div className={styles.loading}>Cargando pedidos...</div>
                ) : filtered.length === 0 ? (
                    <div className={styles.empty}>No hay pedidos{filter !== 'all' ? ' con este estado' : ''}.</div>
                ) : (
                    <div className={styles.cardList}>
                        {filtered.map(o => {
                            const st      = STATUS_LABELS[o.status] ?? { label: o.status, cls: 'pending' };
                            const isOpen  = expanded[o.id];
                            const itemCount = (o.items ?? []).length;
                            const date    = new Date(o.created_at).toLocaleDateString('es-AR', {
                                day: '2-digit', month: '2-digit', year: '2-digit',
                                hour: '2-digit', minute: '2-digit',
                            });

                            return (
                                <div key={o.id} className={`${styles.card} ${styles[`card_${st.cls}`]}`}>
                                    {/* Card header — always visible */}
                                    <div className={styles.cardHead} onClick={() => toggleExpand(o.id)} role="button">
                                        <div className={styles.cardHeadLeft}>
                                            <span className={styles.orderId}>#{o.id}</span>
                                            <span className={styles.orderDate}>{date}</span>
                                        </div>
                                        <div className={styles.cardHeadRight}>
                                            <span className={`${styles.statusBadge} ${styles[st.cls]}`}>{st.label}</span>
                                            <span className={styles.expandIcon}>{isOpen ? '▲' : '▼'}</span>
                                        </div>
                                    </div>

                                    {/* Summary row */}
                                    <div className={styles.cardSummary}>
                                        <div className={styles.customerBlock}>
                                            <span className={styles.customerName}>
                                                {o.customer_name || <em className={styles.noName}>Sin nombre</em>}
                                            </span>
                                            {o.customer_phone && <span className={styles.customerDetail}>{o.customer_phone}</span>}
                                            {o.customer_address && <span className={styles.customerDetail}>{o.customer_address}</span>}
                                        </div>
                                        <div className={styles.orderMeta}>
                                            <span className={styles.orderTotal}>${Number(o.total).toLocaleString('es-AR')}</span>
                                            <span className={styles.itemCount}>{itemCount} producto{itemCount !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {isOpen && (
                                        <div className={styles.cardDetail}>
                                            <ul className={styles.itemList}>
                                                {(o.items ?? []).map((item: any, i: number) => (
                                                    <li key={i} className={styles.item}>
                                                        <span className={styles.itemQty}>{item.quantity}×</span>
                                                        <span className={styles.itemName}>{item.name}{item.variant ? ` · ${item.variant}` : ''}</span>
                                                        <span className={styles.itemPrice}>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {o.customer_email && (
                                                <p className={styles.emailRow}>{o.customer_email}</p>
                                            )}

                                            <div className={styles.statusRow}>
                                                <span className={styles.statusRowLabel}>Estado:</span>
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
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
