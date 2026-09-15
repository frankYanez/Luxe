'use client';

import React, { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CreditCard, MessageCircle, LockKeyhole, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useCart, type CartItem } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { encodeOrderId } from '@/core/utils/order-code';
import { fbTrack } from '@/lib/fbpixel';
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

const CONFETTI_COLORS = ['#C9A84C', '#e8c97a', '#a8854a', '#ffffff', '#d4af6a', '#8B6914'];

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
    const { items, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
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
    const [submitError, setSubmitError] = useState('');

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
        if (!payment) {
            if (items.length > 0) {
                fbTrack('InitiateCheckout', {
                    value: cartTotal,
                    content_ids: items.map(i => i.id),
                    contents: items.map(i => ({ id: i.id, quantity: i.quantity })),
                    num_items: items.reduce((n, i) => n + i.quantity, 0),
                });
            }
            return;
        }
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (payment === 'success') {
            setOrderId(saved.orderId);
            setCustomer(saved.customer);
            setSavedTotal(saved.total);
            fbTrack('Purchase', {
                value: saved.total,
                content_ids: (saved.items || []).map((i: CartItem) => i.id),
                contents: (saved.items || []).map((i: CartItem) => ({ id: i.id, quantity: i.quantity })),
                num_items: (saved.items || []).reduce((n: number, i: CartItem) => n + i.quantity, 0),
            });
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
        if (isSubmitting) return;
        setSubmitError('');
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
                setSubmitError(data.error || 'No pudimos crear tu pedido. Intentá nuevamente.');
            }
        } catch {
            setSubmitError('No pudimos conectar. Revisá tu conexión e intentá nuevamente.');
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
        fbTrack('Purchase', {
            value: cartTotal,
            content_ids: items.map(i => i.id),
            contents: items.map(i => ({ id: i.id, quantity: i.quantity })),
            num_items: items.reduce((n, i) => n + i.quantity, 0),
        });
        setSavedTotal(cartTotal);
        clearCart();
        goToStep('success');
    };

    const displayTotal  = savedTotal || cartTotal;
    const stepIndex     = STEPS.findIndex(s => s.key === step);
    const orderCode     = orderId ? encodeOrderId(orderId) : null;

    if (!mounted) return null;

    if (items.length === 0 && step !== 'payment' && step !== 'success') {
        return (
            <div className={styles.emptyPage}>
                <ShoppingBag size={36} strokeWidth={1.2} />
                <span className={styles.eyebrow}>Luxe Essence</span>
                <h1>Tu próxima fragancia<br />te espera.</h1>
                <p>Todavía no agregaste perfumes a tu selección.</p>
                <button className={styles.primaryBtn} onClick={() => router.push('/coleccion')}>
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
                <Link href="/coleccion" className={styles.backBtn}><ArrowLeft size={16} /> Colección</Link>
                <Link href="/" className={styles.logo}>LUXE<span>ESSENCE</span></Link>
                <span className={styles.secureTag}><LockKeyhole size={14} /> Tu compra</span>
            </header>

            <div className={styles.intro}><span className={styles.eyebrow}>El siguiente paso es tuyo</span><h1>Hacé tuya<br /><span>esa fragancia.</span></h1><p>Revisá tu selección, completá tus datos y elegí cómo pagar.</p></div>
            <div className={styles.layout}>

                {/* Left: form side */}
                <div className={styles.formSide}>

                    {/* Step bar */}
                    {step !== 'success' && (
                        <div ref={stepBarRef} className={styles.stepBar}>
                            {STEPS.map((s, i) => (
                                <React.Fragment key={s.key}>
                                    <div aria-current={stepIndex === i ? 'step' : undefined} className={`${styles.stepItem} ${stepIndex === i ? styles.stepActive : ''} ${stepIndex > i ? styles.stepDone : ''}`}>
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
                            <h2 className={styles.cardTitle}>Tu selección</h2>
                            <p className={styles.cardSubtitle}>Revisá tus perfumes antes de continuar.</p>
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
                                            <div className={styles.quantityControls}>
                                                <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Quitar una unidad de ${item.name}`}><Minus size={14} /></button>
                                                <span aria-live="polite">{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Sumar una unidad de ${item.name}`}><Plus size={14} /></button>
                                                <button type="button" className={styles.removeItem} onClick={() => removeFromCart(item.id)} aria-label={`Eliminar ${item.name}`}><Trash2 size={14} /></button>
                                            </div>
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
                        <form onSubmit={handleDetailsSubmit}>
                            <h2 className={styles.cardTitle}>Tus datos</h2>
                            <p className={styles.cardSubtitle}>Solo necesitamos lo básico para confirmar tu pedido.</p>

                            <div className={styles.formStack}>
                                <div className={styles.field}>
                                    <Label className={styles.label} htmlFor="fullName">Nombre completo *</Label>
                                    <Input id="fullName" autoComplete="name" className={styles.input} required pattern=".*\S.*"
                                        value={customer.fullName}
                                        onChange={e => setCustomer(p => ({ ...p, fullName: e.target.value }))}
                                        placeholder="Nombre y apellido" />
                                </div>
                                <div className={styles.field}>
                                    <Label className={styles.label} htmlFor="email">Email *</Label>
                                    <Input id="email" autoComplete="email" className={styles.input} type="email" required
                                        value={customer.email}
                                        onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))}
                                        placeholder="tu@email.com" />
                                </div>
                                <div className={styles.field}>
                                    <Label className={styles.label} htmlFor="phone">WhatsApp / Teléfono *</Label>
                                    <Input id="phone" autoComplete="tel" className={styles.input} type="tel" required
                                        value={customer.phone}
                                        onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="+54 9 249 400-0000" />
                                </div>
                                <div className={styles.field}>
                                    <Label className={styles.label} htmlFor="address">
                                        Dirección de envío <span className={styles.labelOptional}>(opcional)</span>
                                    </Label>
                                    <Input id="address" autoComplete="street-address" className={styles.input}
                                        value={customer.address}
                                        onChange={e => setCustomer(p => ({ ...p, address: e.target.value }))}
                                        placeholder="Calle, número, ciudad" />
                                </div>
                            </div>

                            {submitError && <p className={styles.formError} role="alert">{submitError}</p>}
                            <div className={styles.btnRow}>
                                <button type="button" className={styles.secondaryBtn} onClick={() => goToStep('review')}>
                                    ← Volver
                                </button>
                                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                                    {isSubmitting ? <><span className={styles.spinner} aria-hidden="true" /> Preparando pedido…</> : 'Confirmar pedido →'}
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
                                Total: <strong className={styles.highlight}>${cartTotal.toLocaleString('es-AR')}</strong>
                                {' '}— Completá el pago para confirmar tu envío.
                            </p>

                            <div className={styles.paymentOptions}>
                                {paymentUrl && (
                                    <button className={`${styles.paymentOption} ${styles.paymentOnline}`} onClick={handleOnlinePayment}>
                                        <span className={styles.payIcon}><CreditCard size={24} strokeWidth={1.5} /></span>
                                        <div className={styles.payInfo}>
                                            <strong>Pagar con Ualá</strong>
                                            <p>Continuá en Ualá para completar tu pago</p>
                                        </div>
                                        <span className={styles.payArrow}>→</span>
                                    </button>
                                )}
                                <button className={`${styles.paymentOption} ${styles.paymentWhatsApp}`} onClick={handleWhatsAppPayment}>
                                    <span className={styles.payIcon}><MessageCircle size={24} strokeWidth={1.5} /></span>
                                    <div className={styles.payInfo}>
                                        <strong>Coordinar por WhatsApp</strong>
                                        <p>Coordiná el pago y la entrega con nuestro equipo</p>
                                    </div>
                                    <span className={styles.payArrow}>→</span>
                                </button>
                            </div>

                            <div className={styles.trustRow}>
                                <span className={styles.trustItem}><LockKeyhole size={14} /> Pago con Ualá</span>
                                <span className={styles.trustItem}>Atención personalizada</span>
                                <span className={styles.trustItem}>Precios en pesos</span>
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
                                {customer.email && <>Te enviaremos los detalles a <strong className={styles.highlight}>{customer.email}</strong>.</>}
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
                                    Vamos a preparar tu selección. Si necesitás ajustar los datos de entrega, escribinos con tu número de pedido.
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
                                    Coordinar envío por WhatsApp
                                </a>
                            </div>
                        </>
                    )}

                    </div>{/* end card */}

                </div>{/* end formSide */}

                <aside className={styles.orderSummary} aria-label="Resumen de tu pedido">
                    <span className={styles.eyebrow}>Tu selección Luxe</span>
                    <h2>Buen gusto.<br />Buena elección.</h2>
                    {items.length > 0 && <div className={styles.summaryProducts}>
                        {items.map(item => <div className={styles.summaryProduct} key={item.id}>
                            <div className={styles.summaryImage}><Image src={item.image} alt={item.name} fill sizes="64px" /></div>
                            <div><strong>{item.name}</strong><span>{item.variant || 'Frasco'} · Cantidad: {item.quantity}</span></div>
                            <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                        </div>)}
                    </div>}
                    <div className={styles.summaryTotal}><span>Total del pedido</span><strong>${displayTotal.toLocaleString('es-AR')}</strong></div>
                    <p className={styles.summaryNote}>Precios en pesos argentinos. Coordinamos la entrega personalmente.</p>
                    <a className={styles.summaryHelp} href={`https://wa.me/${siteConfig.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer">¿Necesitás una mano? <ArrowUpRight size={16} /></a>
                </aside>

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
