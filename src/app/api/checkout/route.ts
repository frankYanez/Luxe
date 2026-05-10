import { NextResponse } from 'next/server';
import { createUalaPayment } from '@/core/api/uala-client';
import { getServiceClient } from '@/core/api/supabase-client';
import { sendWhatsApp } from '@/core/api/whatsapp-notify';
import { encodeOrderId } from '@/core/utils/order-code';

interface CustomerData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, customer }: { items: any[]; customer?: CustomerData } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No hay productos en el carrito.' }, { status: 400 });
        }

        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const db    = getServiceClient();

        // Create order
        const { data: order, error: orderError } = await db
            .from('orders')
            .insert({
                customer_name:    customer?.fullName    ?? '',
                customer_email:   customer?.email       ?? '',
                customer_phone:   customer?.phone       ?? '',
                customer_address: customer?.address     ?? '',
                items,
                total,
                status: 'pending',
            })
            .select('id')
            .single();

        if (orderError || !order) {
            console.error('Order insert error:', orderError);
            return NextResponse.json({ error: 'Error al crear el pedido.' }, { status: 500 });
        }

        // Decrement stock for each item
        for (const item of items) {
            const isDecant  = String(item.id).includes('-decant');
            const productId = String(item.id).replace('-decant', '');

            if (isDecant) continue; // decants share stock with main product

            const { data: product } = await db
                .from('products')
                .select('stock_quantity')
                .eq('id', productId)
                .single();

            if (product) {
                const newQty = Math.max(0, (product.stock_quantity ?? 0) - item.quantity);
                await db.from('products').update({
                    stock_quantity: newQty,
                    in_stock:       newQty > 0,
                }).eq('id', productId);
            }
        }

        // WhatsApp notification — new order
        const itemsList = items.map((i: any) =>
            `• ${i.quantity}x ${i.name}${i.variant ? ` (${i.variant})` : ''} - $${(i.price * i.quantity).toLocaleString('es-AR')}`
        ).join('\n');

        await sendWhatsApp(
            `⏳ CLIENTE POR PAGAR — ${encodeOrderId(order.id)}\n\n` +
            `👤 ${customer?.fullName ?? 'Sin nombre'}\n` +
            `📱 ${customer?.phone ?? ''}\n` +
            `📍 ${customer?.address || 'Sin dirección'}\n\n` +
            `${itemsList}\n\n` +
            `💰 Total: $${Number(total).toLocaleString('es-AR')}\n\n` +
            `⚡ Si no paga en 30 min, contactalo.`
        );

        // Ualá payment link
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ??
            (() => {
                const host  = request.headers.get('host') ?? 'localhost:3000';
                const proto = request.headers.get('x-forwarded-proto') ?? 'http';
                return `${proto}://${host}`;
            })();

        const totalNum = Number(total);
        console.log('💰 Total para Ualá:', totalNum, '| items:', JSON.stringify(items));

        let paymentUrl: string | null = null;
        let ualaError: string | null  = null;
        if (totalNum > 0 && !isNaN(totalNum)) {
            try {
                const uala = await createUalaPayment({
                    amount:      totalNum,
                    description: `Luxe Essence - Pedido #${order.id}`,
                    orderId:     Number(order.id),
                    baseUrl,
                });
                paymentUrl = uala.checkoutLink;
                await db.from('orders').update({ uala_uuid: uala.uuid, uala_payment_url: paymentUrl }).eq('id', order.id);
            } catch (ualaErr: any) {
                ualaError = ualaErr.message;
                console.error('Ualá payment creation failed:', ualaErr.message);
            }
        } else {
            ualaError = `Total inválido: ${total}`;
            console.error('Total inválido para Ualá:', total, items);
        }

        return NextResponse.json({ success: true, orderId: order.id, paymentUrl, ualaError });

    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Error interno.' }, { status: 500 });
    }
}
