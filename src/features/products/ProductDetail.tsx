'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Pause, Play } from 'lucide-react';
import type { Product } from '@/core/types/product';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/core/config/site';
import styles from './ProductDetail.module.css';

const categories = { masculino: 'Masculino', femenino: 'Femenino', unisex: 'Unisex' };
const noteLabels = { salida: 'Salida', corazon: 'Corazón', fondo: 'Fondo' };

export function ProductDetail({ product, videoSrc }: { product: Product; videoSrc?: string }) {
    const { addToCart } = useCart();
    const [variant, setVariant] = useState<'Frasco' | 'Decant'>('Frasco');
    const [mobile, setMobile] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(true);
    const [videoFailed, setVideoFailed] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const price = variant === 'Decant' ? product.decantPrice! : product.price;
    const activeImage = variant === 'Decant'
        ? `/images/decants/${product.slug}.png`
        : product.image;
    const waUrl = `https://wa.me/${siteConfig.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hola! Me interesa ${product.name} de ${product.brand}, presentación ${variant}. ¿Está disponible?`)}`;

    useEffect(() => {
        const screen = window.matchMedia('(max-width: 767px)');
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => { setMobile(screen.matches); setReducedMotion(motion.matches); };
        sync(); screen.addEventListener('change', sync); motion.addEventListener('change', sync);
        return () => { screen.removeEventListener('change', sync); motion.removeEventListener('change', sync); };
    }, []);

    const showVideo = !!videoSrc && !videoFailed;
    useEffect(() => {
        const video = videoRef.current;
        if (!showVideo || !video) return;
        if (reducedMotion) { video.pause(); return; }
        void video.play().catch(() => setPlaying(false));
    }, [showVideo, reducedMotion]);

    const toggleVideo = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) void video.play().catch(() => setPlaying(false));
        else video.pause();
    };

    return <main className={styles.page}>
        <div className={styles.media} data-video={showVideo}>
            {activeImage && !imageFailed ? <Image src={activeImage} alt={variant === 'Decant' ? `${product.name} decant` : product.name} fill priority sizes="(max-width: 767px) 100vw, 55vw" className={styles.photo} onError={() => setImageFailed(true)} /> : <div className={styles.imageFallback}>{product.brand}</div>}
            {showVideo && <video ref={videoRef} className={`${styles.video} ${playing ? styles.videoPlaying : ''}`} src={videoSrc} muted loop playsInline autoPlay={!reducedMotion} preload={reducedMotion ? 'none' : 'metadata'} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setVideoFailed(true); setPlaying(false); }} aria-hidden="true" />}
        </div>
        <nav className={styles.nav} aria-label="Navegación del perfume">
            <Link href="/coleccion" className={styles.back}><ArrowLeft size={18} /> Colección</Link>
            <Link href="/" className={styles.logo}>LUXE ESSENCE</Link>
        </nav>
        {showVideo && <button type="button" className={styles.videoControl} onClick={toggleVideo} aria-label={playing ? 'Pausar video de fondo' : 'Reproducir video de fondo'}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>}
        <section className={styles.content} aria-labelledby="perfume-title">
            <div className={styles.identity}><span>{product.brand}</span><span>{categories[product.category]}</span></div>
            <h1 id="perfume-title">{product.name}</h1>
            {product.shortDescription && <p className={styles.summary}>{product.shortDescription}</p>}
            <div className={styles.purchase}>
                <div className={styles.priceRow}><strong>${price.toLocaleString('es-AR')}</strong><span>{product.inStock ? 'Disponible' : 'Sin stock'}</span></div>
                {product.decantPrice && <fieldset className={styles.variants}>
                    <legend>Presentación</legend>
                    {(['Frasco', 'Decant'] as const).map(option => <label key={option}><input type="radio" name="presentation" value={option} checked={variant === option} onChange={() => setVariant(option)} /><span>{option}</span></label>)}
                </fieldset>}
                <div className={styles.actions}>
                    <button type="button" disabled={!product.inStock} onClick={() => {
                        if (!product.inStock) return;
                        addToCart({ id: variant === 'Decant' ? `${product.id}-decant` : product.id, name: product.name, price, image: activeImage, variant });
                    }}>{product.inStock ? 'Agregar al carrito' : 'Sin stock'}</button>
                    <a href={waUrl} target="_blank" rel="noreferrer">Consultar <ArrowUpRight size={18} /></a>
                </div>
            </div>
            <details className={styles.details}>
                <summary>Conocer la fragancia</summary>
                {product.description && <p>{product.description}</p>}
                <dl className={styles.facts}>
                    {product.intensity && <div><dt>Intensidad</dt><dd>{product.intensity}</dd></div>}
                    {product.longevity && <div><dt>Duración</dt><dd>{product.longevity}</dd></div>}
                    {product.olfactoryNotes.filter(note => note.notes?.length).map((note, i) => <div key={`${note.type}-${i}`}><dt>{noteLabels[note.type]}</dt><dd>{note.notes.join(', ')}</dd></div>)}
                </dl>
            </details>
        </section>
    </main>;
}
