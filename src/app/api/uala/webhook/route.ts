import { NextResponse } from 'next/server';
import { wooConfig, getWooApiUrl } from '@/core/config/woocommerce';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('🔔 Ualá webhook received:', JSON.stringify(body));

        const { external_reference, status, uuid } = body;

        if (status === 'APPROVED' && external_reference) {
            const orderId = parseInt(external_reference, 10);
            if (!isNaN(orderId)) {
                const url = `${getWooApiUrl()}/orders/${orderId}?consumer_key=${wooConfig.consumerKey}&consumer_secret=${wooConfig.consumerSecret}`;
                const wcRes = await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'processing',
                        meta_data: [{ key: '_uala_payment_uuid', value: uuid ?? '' }],
                    }),
                });
                console.log(`✅ WC order ${orderId} updated to processing:`, wcRes.status);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Ualá webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
