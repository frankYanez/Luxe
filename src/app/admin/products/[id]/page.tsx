import { getServiceClient } from '@/core/api/supabase-client';
import ProductForm from '../ProductForm';

async function getProduct(id: string) {
    const db = getServiceClient();
    const { data, error } = await db
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data;
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) return <p style={{ color: '#f87171', padding: '2rem' }}>Producto no encontrado.</p>;

    const notes = Array.isArray(product.olfactory_notes) ? product.olfactory_notes : [];
    const getNotes = (type: string) => (notes.find((n: any) => n.type === type)?.notes ?? []).join(', ');

    const initialData = {
        ...product,
        price:                   String(product.price ?? ''),
        decant_price:            product.decant_price ? String(product.decant_price) : '',
        stock_quantity:          String(product.stock_quantity ?? 0),
        olfactory_notes_salida:  getNotes('salida'),
        olfactory_notes_corazon: getNotes('corazon'),
        olfactory_notes_fondo:   getNotes('fondo'),
    };

    return <ProductForm initialData={initialData} productId={id} />;
}
