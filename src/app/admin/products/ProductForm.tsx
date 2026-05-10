'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './form.module.css';

export interface ProductFormData {
    name: string;
    slug: string;
    brand: string;
    category: 'masculino' | 'femenino' | 'unisex';
    price: string;
    decant_price: string;
    description: string;
    short_description: string;
    image: string;
    in_stock: boolean;
    stock_quantity: string;
    featured: boolean;
    intensity: 'ligera' | 'moderada' | 'intensa';
    longevity: string;
    olfactory_notes_salida: string;
    olfactory_notes_corazon: string;
    olfactory_notes_fondo: string;
}

const EMPTY: ProductFormData = {
    name: '', slug: '', brand: '', category: 'masculino',
    price: '', decant_price: '', description: '', short_description: '',
    image: '', in_stock: true, stock_quantity: '0', featured: false,
    intensity: 'moderada', longevity: '',
    olfactory_notes_salida: '', olfactory_notes_corazon: '', olfactory_notes_fondo: '',
};

interface Props {
    initialData?: Partial<ProductFormData>;
    productId?: string;
}

function buildOlfactoryNotes(data: ProductFormData) {
    const parse = (s: string) => s.split(',').map(x => x.trim()).filter(Boolean);
    const notes = [];
    if (data.olfactory_notes_salida)   notes.push({ type: 'salida',   notes: parse(data.olfactory_notes_salida) });
    if (data.olfactory_notes_corazon)  notes.push({ type: 'corazon',  notes: parse(data.olfactory_notes_corazon) });
    if (data.olfactory_notes_fondo)    notes.push({ type: 'fondo',    notes: parse(data.olfactory_notes_fondo) });
    return notes;
}

function autoSlug(name: string) {
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function ProductForm({ initialData, productId }: Props) {
    const router = useRouter();
    const [form, setForm]       = useState<ProductFormData>({ ...EMPTY, ...initialData });
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState('');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    function set(field: keyof ProductFormData, value: any) {
        setForm(prev => {
            const next = { ...prev, [field]: value };
            if (field === 'name' && !productId) next.slug = autoSlug(value);
            return next;
        });
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const { url, error: err } = await res.json();
        if (err) { setError(err); } else { set('image', url); }
        setUploading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        const payload = {
            name:              form.name,
            slug:              form.slug,
            brand:             form.brand,
            category:          form.category,
            price:             parseFloat(form.price) || 0,
            decant_price:      form.decant_price ? parseFloat(form.decant_price) : null,
            description:       form.description,
            short_description: form.short_description,
            image:             form.image,
            in_stock:          form.in_stock,
            stock_quantity:    parseInt(form.stock_quantity) || 0,
            featured:          form.featured,
            intensity:         form.intensity,
            longevity:         form.longevity,
            olfactory_notes:   buildOlfactoryNotes(form),
        };

        const url    = productId ? `/api/admin/products/${productId}` : '/api/admin/products';
        const method = productId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok) {
            setError(json.error || 'Error al guardar');
        } else {
            router.push('/admin/products');
        }
        setSaving(false);
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => router.push('/admin/products')}>
                    ← Productos
                </button>
                <h1 className={styles.title}>{productId ? 'Editar producto' : 'Nuevo producto'}</h1>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.grid}>

                    {/* Left column */}
                    <div className={styles.col}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Información básica</h2>
                            <Field label="Nombre *">
                                <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} required />
                            </Field>
                            <Field label="Slug (URL)">
                                <input className={styles.input} value={form.slug} onChange={e => set('slug', e.target.value)} />
                            </Field>
                            <Field label="Marca *">
                                <input className={styles.input} value={form.brand} onChange={e => set('brand', e.target.value)} required />
                            </Field>
                            <Field label="Categoría">
                                <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value as any)}>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="unisex">Unisex</option>
                                </select>
                            </Field>
                            <Field label="Descripción corta">
                                <input className={styles.input} value={form.short_description} onChange={e => set('short_description', e.target.value)} />
                            </Field>
                            <Field label="Descripción completa">
                                <textarea className={styles.textarea} rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
                            </Field>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Notas olfativas <span className={styles.hint}>(separadas por coma)</span></h2>
                            <Field label="Salida">
                                <input className={styles.input} placeholder="Bergamota, Limón, Pimienta" value={form.olfactory_notes_salida} onChange={e => set('olfactory_notes_salida', e.target.value)} />
                            </Field>
                            <Field label="Corazón">
                                <input className={styles.input} placeholder="Rosa, Jazmín, Iris" value={form.olfactory_notes_corazon} onChange={e => set('olfactory_notes_corazon', e.target.value)} />
                            </Field>
                            <Field label="Fondo">
                                <input className={styles.input} placeholder="Sándalo, Almizcle, Ámbar" value={form.olfactory_notes_fondo} onChange={e => set('olfactory_notes_fondo', e.target.value)} />
                            </Field>
                        </section>
                    </div>

                    {/* Right column */}
                    <div className={styles.col}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Imagen</h2>
                            {form.image && (
                                <div className={styles.imagePreviewWrap}>
                                    <Image src={form.image} alt="preview" fill className={styles.imagePreview} />
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className={styles.hidden} onChange={handleImageUpload} />
                            <button type="button" className={styles.uploadBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>
                                {uploading ? 'Subiendo...' : form.image ? 'Cambiar imagen' : 'Subir imagen'}
                            </button>
                            {form.image && (
                                <input className={`${styles.input} ${styles.mt}`} value={form.image} onChange={e => set('image', e.target.value)} placeholder="O pegá la URL directamente" />
                            )}
                            {!form.image && (
                                <input className={`${styles.input} ${styles.mt}`} value={form.image} onChange={e => set('image', e.target.value)} placeholder="O pegá la URL directamente" />
                            )}
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Precios</h2>
                            <Field label="Precio frasco (ARS) *">
                                <input className={styles.input} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} required />
                            </Field>
                            <Field label="Precio decant (ARS)">
                                <input className={styles.input} type="number" min="0" value={form.decant_price} onChange={e => set('decant_price', e.target.value)} placeholder="Dejar vacío si no hay decant" />
                            </Field>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Stock y visibilidad</h2>
                            <div className={styles.checkRow}>
                                <label className={styles.checkLabel}>
                                    <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} />
                                    En stock
                                </label>
                                <label className={styles.checkLabel}>
                                    <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                                    Destacado
                                </label>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Características</h2>
                            <Field label="Intensidad">
                                <select className={styles.select} value={form.intensity} onChange={e => set('intensity', e.target.value as any)}>
                                    <option value="ligera">Ligera</option>
                                    <option value="moderada">Moderada</option>
                                    <option value="intensa">Intensa</option>
                                </select>
                            </Field>
                            <Field label="Duración">
                                <input className={styles.input} placeholder="6-8 horas" value={form.longevity} onChange={e => set('longevity', e.target.value)} />
                            </Field>
                        </section>
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.footer}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.push('/admin/products')}>Cancelar</button>
                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                        {saving ? 'Guardando...' : productId ? 'Guardar cambios' : 'Crear producto'}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '0.875rem' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.35rem' }}>{label}</label>
            {children}
        </div>
    );
}
