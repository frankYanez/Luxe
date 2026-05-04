'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import styles from './page.module.css';

type Step = 'review' | 'details' | 'payment' | 'success';

interface CustomerData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

const STEPS = [
    { key: 'review'  as Step, label: 'Resumen',    num: 1 },
    { key: 'details' as Step, label: 'Tus Datos',  num: 2 },
    { key: 'payment' as Step, label: 'Pago',        num: 3 },
];

/** WooCommerce statuses that mean the payment went through */
const PAID_STATUSES = new Set(['processing', 'completed', 'on-hold']);

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [step,        setStep]        = useState<Step>('review');
    const [mounted,     setMounted]     = useState(false);
    const [customer,    setCustomer]    = useState<CustomerData>({
        fullName: '', email: '', phone: '', address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId,      setOrderId]      = useState<number | null>(null);
    const [paymentUrl,   setPaymentUrl]   = useState<string | null>(null);
    const [paymentState, setPaymentState] = useState<'idle' | 'waiting' | 'confirmed'>('idle');

    /* Refs for popup + polling cleanup */
    const popupRef        = useRef<Window | null>(null);
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { setMounted(true); }, []);

    /* ── Stop polling on unmount ── */
    useEffect(() => () => {
        stopPolling();
        popupRef.current?.close();
    }, []);

    const stepIndex = STEPS.findIndex(s => s.key === step);

    /* ── Polling helpers ── */
    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (pollTimeoutRef.current)  clearTimeout(pollTimeoutRef.current);
        pollIntervalRef.current = null;
        pollTimeoutRef.current  = null;
    }, []);

    const startPolling = useCallback((id: number) => {
        pollIntervalRef.current = setInterval(async () => {
            try {
                const res  = await fetch(`/api/order-status?id=${id}`);
                const data = await res.json();
                if (PAID_STATUSES.has(data.status)) {
                    stopPolling();
                    popupRef.current?.close();
                    setPaymentState('confirmed');
                    setStep('success');
                    clearCart();
                }
            } catch {
                /* network hiccup — keep polling */
            }
        }, 3000);

        /* Stop after 15 minutes regardless */
        pollTimeoutRef.current = setTimeout(() => {
            stopPolling();
            setPaymentState('idle');
            toast.error('Tiempo de espera agotado. Si ya pagaste, verificá tu email.');
        }, 15 * 60 * 1000);
    }, [stopPolling, clearCart]);

    /* ── Step 2 submit: create WooCommerce order ── */
    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, customer }),
            });
            const data = await response.json();
            if (data.success) {
                setOrderId(data.orderId);
                setPaymentUrl(data.paymentUrl || null);
                setStep('payment');
                toast.success(`Pedido #${data.orderId} creado`);
            } else {
                toast.error(data.error || 'Error al crear el pedido.');
            }
        } catch {
            toast.error('Error de conexión. Intentá de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Ualá popup payment ── */
    const handleOnlinePayment = useCallback(() => {
        if (!paymentUrl || !orderId) return;

        const width  = 500;
        const height = 700;
        const left   = Math.round((screen.width  - width)  / 2);
        const top    = Math.round((screen.height - height) / 2);

        const popup = window.open(
            paymentUrl,
            'luxe_uala_pay',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            /* Popup blocked → redirect same tab */
            toast('Abriendo página de pago…', { icon: '💳' });
            window.location.href = paymentUrl;
            return;
        }

        popupRef.current = popup;
        setPaymentState('waiting');
        startPolling(orderId);

        /* If user closes popup manually → stop waiting */
        const closedCheck = setInterval(() => {
            if (popup.closed) {
                clearInterval(closedCheck);
                if (paymentState !== 'confirmed') {
                    stopPolling();
                    setPaymentState('idle');
                }
            }
        }, 800);
    }, [paymentUrl, orderId, startPolling, stopPolling, paymentState]);

    /* ── WhatsApp fallback ── */
    const handleWhatsAppPayment = () => {
        const phone = siteConfig.whatsapp.replace('+', '');
        let msg = `*¡Hola Luxe Essence!* Quiero realizar el siguiente pedido:\n\n`;
        items.forEach(item => {
            msg += `▫️ ${item.quantity}x *${item.name}*`;
            if (item.variant) msg += ` (${item.variant})`;
            msg += ` - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        });
        msg += `\n*Total:* $${cartTotal.toLocaleString('es-AR')}\n`;
        if (orderId) msg += `*N° de Pedido:* #${orderId}\n`;
        msg += `\n*Nombre:* ${customer.fullName}\n`;
        if (customer.address) msg += `*Dirección:* ${customer.address}\n`;
        msg += `\nAguardo confirmación. ¡Gracias! ✨`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        clearCart();
        router.push('/');
    };

    if (!mounted) return null;

    if (items.length === 0 && step !== 'payment' && step !== 'success') {
        return (
            <div className={styles.emptyPage}>
                <p>Tu carrito está vacío.</p>
                <button className={styles.primaryBtn} onClick={() => router.push('/')}>
                    Ver Colección
                </button>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* Header */}
            <header className={styles.header}>
                <button onClick={() => router.push('/')} className={styles.backBtn}>← Volver</button>
                <span className={styles.logo}>Luxe Essence</span>
                <span className={styles.secureTag}>🔒 Pago Seguro</span>
            </header>

            {/* Step indicator — hidden on success */}
            {step !== 'success' && (
                <div className={styles.stepIndicator}>
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.key}>
                            <div className={`${styles.stepItem} ${stepIndex === i ? styles.stepActive : ''} ${stepIndex > i ? styles.stepDone : ''}`}>
                                <div className={styles.stepCircle}>
                                    {stepIndex > i ? '✓' : s.num}
                                </div>
                                <span className={styles.stepLabel}>{s.label}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`${styles.stepConnector} ${stepIndex > i ? styles.connectorDone : ''}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}

            <main className={styles.main}>

                {/* ── STEP 1: Resumen ── */}
                {step === 'review' && (
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Tu Selección</h2>
                        <ul className={styles.itemList}>
                            {items.map(item => (
                                <li key={item.id} className={styles.item}>
                                    <div className={styles.itemImgWrap}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className={styles.itemImg}
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        {item.variant && <span className={styles.itemVariant}>{item.variant}</span>}
                                        <span className={styles.itemQty}>{item.quantity} unidad{item.quantity > 1 ? 'es' : ''}</span>
                                    </div>
                                    <span className={styles.itemPrice}>
                                        ${(item.price * item.quantity).toLocaleString('es-AR')}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.divider} />
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total</span>
                            <span className={styles.totalAmount}>${cartTotal.toLocaleString('es-AR')}</span>
                        </div>
                        <button className={styles.primaryBtn} onClick={() => setStep('details')}>
                            Continuar con mis datos →
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Datos ── */}
                {step === 'details' && (
                    <form className={styles.card} onSubmit={handleDetailsSubmit} noValidate>
                        <h2 className={styles.cardTitle}>Tus Datos</h2>
                        <p className={styles.cardSubtitle}>Solo necesitamos lo básico para confirmar tu pedido.</p>

                        <div className={styles.formStack}>
                            <div className={styles.field}>
                                <Label className={styles.label} htmlFor="fullName">Nombre completo *</Label>
                                <Input id="fullName" className={styles.input} required
                                    value={customer.fullName}
                                    onChange={e => setCustomer(p => ({ ...p, fullName: e.target.value }))}
                                    placeholder="Nombre y apellido" />
                            </div>
                            <div className={styles.field}>
                                <Label className={styles.label} htmlFor="email">Email *</Label>
                                <Input id="email" className={styles.input} type="email" required
                                    value={customer.email}
                                    onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
                                    placeholder="tu@email.com" />
                            </div>
                            <div className={styles.field}>
                                <Label className={styles.label} htmlFor="phone">WhatsApp / Teléfono *</Label>
                                <Input id="phone" className={styles.input} type="tel" required
                                    value={customer.phone}
                                    onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="+54 9 249 400-0000" />
                            </div>
                            <div className={styles.field}>
                                <Label className={styles.label} htmlFor="address">Dirección de envío <span className={styles.labelOptional}>(opcional)</span></Label>
                                <Input id="address" className={styles.input}
                                    value={customer.address}
                                    onChange={e => setCustomer(p => ({ ...p, address: e.target.value }))}
                                    placeholder="Calle, número, ciudad" />
                            </div>
                        </div>

                        <div className={styles.btnRow}>
                            <button type="button" className={styles.secondaryBtn} onClick={() => setStep('review')}>
                                ← Volver
                            </button>
                            <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                                {isSubmitting ? <span className={styles.spinner} /> : 'Confirmar pedido →'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ── STEP 3: Pago ── */}
                {step === 'payment' && (
                    <div className={styles.card}>
                        <div className={styles.orderTag}>
                            <span className={styles.orderTagDot} />
                            Pedido #{orderId} reservado
                        </div>

                        <h2 className={styles.cardTitle}>Elegí cómo pagar</h2>
                        <p className={styles.cardSubtitle}>
                            Completá el pago para confirmar el envío de tu pedido.
                        </p>

                        {/* Waiting state */}
                        {paymentState === 'waiting' && (
                            <div className={styles.waitingBox}>
                                <div className={styles.waitingSpinner} />
                                <div>
                                    <p className={styles.waitingTitle}>Esperando confirmación de pago…</p>
                                    <p className={styles.waitingDesc}>
                                        Completá el pago en la ventana que se abrió. Esta página se actualizará automáticamente.
                                    </p>
                                </div>
                                <button
                                    className={styles.cancelWaitBtn}
                                    onClick={() => { stopPolling(); popupRef.current?.close(); setPaymentState('idle'); }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}

                        {/* Payment options — hidden while waiting */}
                        {paymentState === 'idle' && (
                            <div className={styles.paymentOptions}>
                                {paymentUrl && (
                                    <button
                                        className={`${styles.paymentOption} ${styles.paymentOnline}`}
                                        onClick={handleOnlinePayment}
                                    >
                                        <span className={styles.payIcon}>💳</span>
                                        <div className={styles.payInfo}>
                                            <strong>Pagar con Ualá</strong>
                                            <p>Tarjeta de crédito, débito o cuenta Ualá</p>
                                        </div>
                                        <span className={styles.payArrow}>→</span>
                                    </button>
                                )}

                                <button
                                    className={`${styles.paymentOption} ${styles.paymentWhatsApp}`}
                                    onClick={handleWhatsAppPayment}
                                >
                                    <span className={styles.payIcon}>💬</span>
                                    <div className={styles.payInfo}>
                                        <strong>Coordinar por WhatsApp</strong>
                                        <p>Transferencia, efectivo u otro acuerdo</p>
                                    </div>
                                    <span className={styles.payArrow}>→</span>
                                </button>
                            </div>
                        )}

                        <p className={styles.payNote}>
                            ¿Dudas? Escribinos al{' '}
                            <a href={`https://wa.me/${siteConfig.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className={styles.payLink}>
                                WhatsApp
                            </a>
                        </p>
                    </div>
                )}

                {/* ── SUCCESS ── */}
                {step === 'success' && (
                    <div className={`${styles.card} ${styles.successCard}`}>
                        <div className={styles.successIcon}>✓</div>
                        <h2 className={styles.successTitle}>¡Pago confirmado!</h2>
                        <p className={styles.successSubtitle}>
                            Tu pedido #{orderId} fue procesado con éxito.<br />
                            {customer.email && <>Te enviaremos los detalles a <strong>{customer.email}</strong>.</>}
                        </p>

                        <div className={styles.successDetails}>
                            <div className={styles.successRow}>
                                <span>N° de pedido</span>
                                <strong>#{orderId}</strong>
                            </div>
                            <div className={styles.successRow}>
                                <span>Total</span>
                                <strong>${cartTotal.toLocaleString('es-AR')}</strong>
                            </div>
                            <div className={styles.successRow}>
                                <span>Estado</span>
                                <strong className={styles.successStatus}>Pagado ✓</strong>
                            </div>
                        </div>

                        <button className={styles.primaryBtn} onClick={() => router.push('/')}>
                            Volver al inicio
                        </button>
                        <a
                            href={`https://wa.me/${siteConfig.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.successWa}
                        >
                            💬 Coordinar envío por WhatsApp
                        </a>
                    </div>
                )}

            </main>
        </div>
    );
}
