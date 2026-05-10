'use client';

import React, { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { encodeOrderId } from '@/core/utils/order-code';
import styles from './page.module.css';

gsap.registerPlugin(useGSAP);

type Step = 'review' | 'details' | 'payment' | 'success';

interface CustomerData { fullName: string; email: string; phone: string; address: string; }

const STEPS = [
    { key: 'review'  as Step, label: 'Resumen',   num: 1 },
    { key: 'details' as Step, label: 'Tus Datos', num: 2 },
    { key: 'payment' as Step, label: 'Pago',       num: 3 },
];

const SESSION_KEY = 'luxe_pending_order';

const CONFETTI_COLORS = ['#C5A059', '#e8c97a', '#a8854a', '#ffffff', '#d4af6a', '#8B6914'];

function Confetti() {
    const wrapRef  = useRef<HTMLDivElement>(null);
    const pieces   = useRef(
        Array.from({ length: 60 }, (_, i) => ({
            id:    i,
            x:     `${Math.random() * 100}%`,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            size:  4 + Math.random() * 6,
            delay: Math.random() * 1.5,
        }))
    ).current;

    useGSAP(() => {
        const els = wrapRef.current?.querySelectorAll('[data-piece]');
        if (!els) return;
        els.forEach((el, i) => {
            gsap.to(el, {
                y:        `${90 + Math.random() * 20}vh`,
                rotation: `${360 + Math.random() * 720}`,
                x:        `${(Math.random() - 0.5) * 200}px`,
                opacity:  0,
                duration: 2.5 + Math.random() * 1.5,
                delay:    pieces[i].delay,
                ease:     'power1.in',
                onStart:  () => { gsap.set(el, { opacity: 1 }); },
            });
        });
    }, { scope: wrapRef });

    return (
        <div ref={wrapRef} className={styles.confettiWrap}>
            {pieces.map(p => (
                <div
                    key={p.id}
                    data-piece
                    className={styles.confettiPiece}
                    style={{
                        left:            p.x,
                        width:           p.size,
                        height:          p.size,
                        background:      p.color,
                        borderRadius:    Math.random() > 0.5 ? '50%' : '2px',
                        transform:       `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
        </div>
    );
}

function CheckoutInner() {
    const { items, cartTotal, clearCart } = useCart();
    const router       = useRouter();
    const searchParams = useSearchParams();

    const [step,         setStep]         = useState<Step>('review');
    const [mounted,      setMounted]      = useState(false);
    const [customer,     setCustomer]     = useState<CustomerData>({ fullName: '', email: '', phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId,      setOrderId]      = useState<number | null>(null);
    const [paymentUrl,   setPaymentUrl]   = useState<string | null>(null);
    const [savedTotal,   setSavedTotal]   = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef      = useRef<HTMLDivElement>(null);
    const headerRef    = useRef<HTMLElement>(null);
    const stepBarRef   = useRef<HTMLDivElement>(null);
    const checkRef     = useRef<SVGCircleElement>(null);
    const checkMarkRef = useRef<SVGPathElement>(null);

    /* ── Detect return from Ualá ── */
    useEffect(() => {
        setMounted(true);
        const payment = searchParams.get('payment');
        if (!payment) return;
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (payment === 'success') {
            setOrderId(saved.orderId);
            setCustomer(saved.customer);
            setSavedTotal(saved.total);
            clearCart();
            sessionStorage.removeItem(SESSION_KEY);
            setStep('success');
        } else if (payment === 'failed') {
            toast.error('El pago fue rechazado. Intentá de nuevo o coordiná por WhatsApp.');
            sessionStorage.removeItem(SESSION_KEY);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Page entrance animation ── */
    useGSAP(() => {
        const tl = gsap.timeline();

        // Header slides down
        tl.from(headerRef.current, {
            y: -40, opacity: 0, duration: 0.6, ease: 'power3.out',
        }, 0.1);

        // Step bar
        tl.from(stepBarRef.current, {
            y: -20, opacity: 0, duration: 0.5, ease: 'power3.out',
        }, 0.25);

        // Card
        tl.from(cardRef.current, {
            y: 40, opacity: 0, scale: 0.97, duration: 0.7, ease: 'power3.out',
        }, 0.3);

    }, { scope: containerRef });

    /* ── Success animations ── */
    useGSAP(() => {
        if (step !== 'success' || !checkRef.current || !checkMarkRef.current) return;

        setShowConfetti(true);

        const tl = gsap.timeline({ delay: 0.2 });

        // Circle draws
        tl.to(checkRef.current, {
            strokeDashoffset: 0, duration: 0.8, ease: 'power2.out',
        });

        // Checkmark draws
        tl.to(checkMarkRef.current, {
            strokeDashoffset: 0, duration: 0.4, ease: 'power2.out',
        }, '-=0.2');

        // Card content staggers in
        tl.from(cardRef.current?.querySelectorAll('[data-reveal]') ?? [], {
            y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out',
        }, '-=0.1');

    }, { scope: containerRef, dependencies: [step] });

    /* ── Animated card transition ── */
    const goToStep = useCallback((newStep: Step) => {
        if (!cardRef.current) { setStep(newStep); return; }
        gsap.to(cardRef.current, {
            opacity: 0, y: -16, scale: 0.98, duration: 0.22, ease: 'power2.in',
            onComplete: () => {
                setStep(newStep);
                gsap.fromTo(cardRef.current,
                    { opacity: 0, y: 28, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
                );
            },
        });
    }, []);

    /* ── Step 2 submit → create order ── */
    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res  = await fetch('/api/checkout', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ items, customer }),
            });
            const data = await res.json();
            if (data.success) {
                setOrderId(data.orderId);
                setPaymentUrl(data.paymentUrl || null);
                goToStep('payment');
                toast.success(`Pedido ${encodeOrderId(data.orderId)} creado`);
            } else {
                toast.error(data.error || 'Error al crear el pedido.');
            }
        } catch {
            toast.error('Error de conexión. Intentá de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Ualá redirect ── */
    const handleOnlinePayment = () => {
        if (!paymentUrl || !orderId) return;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ orderId, customer, total: cartTotal, items }));
        window.location.href = paymentUrl;
    };

    /* ── WhatsApp ── */
    const handleWhatsAppPayment = () => {
        const phone = siteConfig.whatsapp.replace('+', '');
        let msg = `*¡Hola Luxe Essence!* Quiero realizar el siguiente pedido:\n\n`;
        items.forEach(item => {
            msg += `▫️ ${item.quantity}x *${item.name}*`;
            if (item.variant) msg += ` (${item.variant})`;
            msg += ` - $${(item.price * item.quantity).toLocaleString('es-AR')}\n`;
        });
        msg += `\n*Total:* $${cartTotal.toLocaleString('es-AR')}\n`;
        if (orderId) msg += `*Pedido:* ${encodeOrderId(orderId)}\n`;
        msg += `\n*Nombre:* ${customer.fullName}\n`;
        if (customer.address) msg += `*Dirección:* ${customer.address}\n`;
        msg += `\nAguardo confirmación. ¡Gracias! ✨`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        clearCart();
        router.push('/');
    };

    const displayTotal  = savedTotal || cartTotal;
    const stepIndex     = STEPS.findIndex(s => s.key === step);
    const orderCode     = orderId ? encodeOrderId(orderId) : null;

    if (!mounted) return null;

    if (items.length === 0 && step !== 'payment' && step !== 'success') {
        return (
            <div className={styles.emptyPage}>
                <p>Tu carrito está vacío.</p>
                <button className={styles.primaryBtn} style={{ maxWidth: 200 }} onClick={() => router.push('/')}>
                    Ver Colección
                </button>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={styles.page}>

            {/* Confetti */}
            {showConfetti && <Confetti />}

            {/* Header */}
            <header ref={headerRef} className={styles.header}>
                <button onClick={() => router.push('/')} className={styles.backBtn}>← Volver</button>
                <span className={styles.logo}>Luxe Essence</span>
                <span className={styles.secureTag}>🔒 Pago Seguro</span>
            </header>

            <div className={styles.layout}>

                {/* Left: form side */}
                <div className={styles.formSide}>

                    {/* Step bar */}
                    {step !== 'success' && (
                        <div ref={stepBarRef} className={styles.stepBar}>
                            {STEPS.map((s, i) => (
                                <React.Fragment key={s.key}>
                                    <div className={`${styles.stepItem} ${stepIndex === i ? styles.stepActive : ''} ${stepIndex > i ? styles.stepDone : ''}`}>
                                        <div className={styles.stepCircle}>{stepIndex > i ? '✓' : s.num}</div>
                                        <span className={styles.stepLabel}>{s.label}</span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className={`${styles.stepConnector} ${stepIndex > i ? styles.connectorDone : ''}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    <div ref={cardRef} className={styles.card}>

                    {/* ── STEP 1: Resumen ── */}
                    {step === 'review' && (
                        <>
                            <h2 className={styles.cardTitle}>Tu Selección</h2>
                            <ul className={styles.itemList}>
                                {items.map(item => (
                                    <li key={item.id} className={styles.item}>
                                        <div className={styles.itemImgWrap}>
                                            <Image src={item.image} alt={item.name} fill className={styles.itemImg}
                                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
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
                                <span className={styles.totalLabel}>Total a pagar</span>
                                <span className={styles.totalAmount}>${cartTotal.toLocaleString('es-AR')}</span>
                            </div>
                            <button className={styles.primaryBtn} onClick={() => goToStep('details')}>
                                Continuar →
                            </button>
                        </>
                    )}

                    {/* ── STEP 2: Datos ── */}
                    {step === 'details' && (
                        <form onSubmit={handleDetailsSubmit} noValidate>
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
                                    <Label className={styles.label} htmlFor="address">
                                        Dirección de envío <span className={styles.labelOptional}>(opcional)</span>
                                    </Label>
                                    <Input id="address" className={styles.input}
                                        value={customer.address}
                                        onChange={e => setCustomer(p => ({ ...p, address: e.target.value }))}
                                        placeholder="Calle, número, ciudad" />
                                </div>
                            </div>

                            <div className={styles.btnRow}>
                                <button type="button" className={styles.secondaryBtn} onClick={() => goToStep('review')}>
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
                        <>
                            <div className={styles.orderTag}>
                                <span className={styles.orderTagDot} />
                                Pedido {orderCode} reservado
                            </div>

                            <h2 className={styles.cardTitle}>Elegí cómo pagar</h2>
                            <p className={styles.cardSubtitle}>
                                Total: <strong style={{ color: '#C5A059' }}>${cartTotal.toLocaleString('es-AR')}</strong>
                                {' '}— Completá el pago para confirmar tu envío.
                            </p>

                            <div className={styles.paymentOptions}>
                                {paymentUrl && (
                                    <button className={`${styles.paymentOption} ${styles.paymentOnline}`} onClick={handleOnlinePayment}>
                                        <span className={styles.payIcon}>💳</span>
                                        <div className={styles.payInfo}>
                                            <strong>Pagar con Ualá</strong>
                                            <p>Tarjeta de crédito, débito o cuenta Ualá · Acreditación inmediata</p>
                                        </div>
                                        <span className={styles.payArrow}>→</span>
                                    </button>
                                )}
                                <button className={`${styles.paymentOption} ${styles.paymentWhatsApp}`} onClick={handleWhatsAppPayment}>
                                    <span className={styles.payIcon}>💬</span>
                                    <div className={styles.payInfo}>
                                        <strong>Coordinar por WhatsApp</strong>
                                        <p>Transferencia, efectivo u otro acuerdo · Respuesta inmediata</p>
                                    </div>
                                    <span className={styles.payArrow}>→</span>
                                </button>
                            </div>

                            <div className={styles.trustRow}>
                                <span className={styles.trustItem}>🔒 SSL encriptado</span>
                                <span className={styles.trustItem}>✓ Datos protegidos</span>
                                <span className={styles.trustItem}>🇦🇷 Pago local</span>
                            </div>

                            <p className={styles.payNote}>
                                ¿Dudas? Escribinos al{' '}
                                <a href={`https://wa.me/${siteConfig.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className={styles.payLink}>
                                    WhatsApp
                                </a>
                            </p>
                        </>
                    )}

                    {/* ── SUCCESS ── */}
                    {step === 'success' && (
                        <>
                            {/* Animated checkmark */}
                            <div className={styles.checkWrap}>
                                <svg className={styles.checkSvg} viewBox="0 0 80 80">
                                    <circle className={styles.checkCircleBg} cx="40" cy="40" r="36" />
                                    <circle ref={checkRef} className={styles.checkCircleFill} cx="40" cy="40" r="36" />
                                    <path ref={checkMarkRef} className={styles.checkMark} d="M24 40 L34 51 L56 29" />
                                </svg>
                            </div>

                            <h2 data-reveal className={styles.successTitle}>¡Tu fragancia está reservada!</h2>
                            <p data-reveal className={styles.successTagline}>Gracias por elegir Luxe Essence</p>
                            <p data-reveal className={styles.successSubtitle}>
                                Recibimos tu pedido con éxito.{' '}
                                {customer.email && <>Te enviaremos los detalles a <strong style={{ color: '#C5A059' }}>{customer.email}</strong>.</>}
                                {' '}Nos pondremos en contacto para coordinar el envío.
                            </p>

                            <div data-reveal className={styles.successDetails}>
                                <div className={styles.successRow}>
                                    <span>N° de pedido</span>
                                    <strong className={styles.successCode}>{orderCode}</strong>
                                </div>
                                <div className={styles.successRow}>
                                    <span>Total</span>
                                    <strong>${displayTotal.toLocaleString('es-AR')}</strong>
                                </div>
                                <div className={styles.successRow}>
                                    <span>Estado</span>
                                    <strong className={styles.successStatus}>✓ Confirmado</strong>
                                </div>
                            </div>

                            <div data-reveal className={styles.successMarketing}>
                                <p>
                                    "Cada fragancia es una historia. La tuya acaba de comenzar." — Preparamos tu pedido con el mismo cuidado con el que elegiste tu perfume. Pronto vas a recibir tu fragancia árabe premium.
                                </p>
                            </div>

                            <div data-reveal className={styles.successActions}>
                                <button className={styles.primaryBtn} onClick={() => router.push('/')}>
                                    Seguir explorando la colección
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
                        </>
                    )}

                    </div>{/* end card */}

                </div>{/* end formSide */}

                {/* Right: perfume image */}
                <div className={styles.imageSide}>
                    <div className={styles.imageWrap}>
                        <Image
                            src="/images/club-de-nuit.png"
                            alt="Luxe Essence"
                            fill
                            priority
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                    </div>
                    <div className={styles.imageOverlay} />
                    <div className={styles.imageQuote}>
                        <p>"Cada fragancia es una historia que el tiempo no borra."</p>
                        <span>— Luxe Essence</span>
                    </div>
                </div>

            </div>{/* end layout */}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense>
            <CheckoutInner />
        </Suspense>
    );
}
