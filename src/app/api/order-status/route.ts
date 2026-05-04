import { NextResponse } from 'next/server';
import { wooConfig, getWooApiUrl } from '@/core/config/woocommerce';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId || isNaN(Number(orderId))) {
        return NextResponse.json({ error: 'ID de orden inválido' }, { status: 400 });
    }

    if (!wooConfig.url || !wooConfig.consumerKey || !wooConfig.consumerSecret) {
        return NextResponse.json({ error: 'Configuración de WooCommerce faltante' }, { status: 500 });
    }

    try {
        const url = `${getWooApiUrl()}/orders/${orderId}?consumer_key=${wooConfig.consumerKey}&consumer_secret=${wooConfig.consumerSecret}`;
        const response = await fetch(url, {
            headers: { Accept: 'application/json' },
            // No cache — always get fresh status
            cache: 'no-store',
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Error consultando WooCommerce' }, { status: response.status });
        }

        const order = await response.json();

        return NextResponse.json({
            orderId: order.id,
            status: order.status, // pending, processing, completed, cancelled, failed
            total: order.total,
            currency: order.currency,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
