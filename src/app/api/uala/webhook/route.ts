import { NextResponse } from 'next/server';
import { getServiceClient } from '@/core/api/supabase-client';

export const dynamic = 'force-dynamic';
import { sendWhatsApp } from '@/core/api/whatsapp-notify';
import { encodeOrderId } from '@/core/utils/order-code';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('🔔 Ualá webhook received:', JSON.stringify(body));

        const { external_reference, status, uuid } = body;

        if (status === 'APPROVED' && external_reference) {
            const db = getServiceClient();

            const { data: order } = await db
                .from('orders')
                .update({ status: 'processing', uala_uuid: uuid ?? null })
                .eq('id', external_reference)
                .select('id, customer_name, customer_phone, total, items')
                .single();

            if (order) {
                console.log(`✅ Order ${order.id} updated to processing`);

                const itemsList = (order.items ?? []).map((i: any) =>
                    `• ${i.quantity}x ${i.name}`
                ).join('\n');

                await sendWhatsApp(
                    `✅ PAGO CONFIRMADO — ${encodeOrderId(order.id)}\n\n` +
                    `👤 ${order.customer_name}\n` +
                    `📱 ${order.customer_phone}\n\n` +
                    `${itemsList}\n\n` +
                    `💰 $${Number(order.total).toLocaleString('es-AR')} · Pagado con Ualá 💳`
                );
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Ualá webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
