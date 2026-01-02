import { NextResponse } from 'next/server';
import { wooConfig, getWooApiUrl } from '@/core/config/woocommerce';

export async function POST(request: Request) {
    try {
        // Validate configuration first
        if (!wooConfig.url || !wooConfig.consumerKey || !wooConfig.consumerSecret) {
            console.error('WooCommerce configuration missing');
            return NextResponse.json(
                { error: 'Server configuration error: Missing WooCommerce credentials' },
                { status: 500 }
            );
        }

        const { items } = await request.json();

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Format line items for WooCommerce
        const line_items = items.map((item: any) => {
            const isDecant = item.id.includes('-decant');
            const productId = parseInt(item.id.replace('-decant', ''));

            if (isNaN(productId)) {
                throw new Error(`Invalid product ID: ${item.id}`);
            }

            const lineItem: any = {
                product_id: productId,
                quantity: item.quantity,
            };

            // Add metadata for variants (important for Decants)
            if (item.variant) {
                lineItem.meta_data = [
                    {
                        key: 'Tamaño',
                        value: item.variant
                    }
                ];
            }

            return lineItem;
        });

        const data = {
            payment_method: 'bacs', // Default, user can change on checkout page
            payment_method_title: 'Transferencia Bancaria / Ualá',
            set_paid: false,
            line_items,
            status: 'pending' // Order created as pending payment
        };

        console.log('📦 Creating WooCommerce Order:', JSON.stringify(data, null, 2));

        const url = `${getWooApiUrl()}/orders?consumer_key=${wooConfig.consumerKey}&consumer_secret=${wooConfig.consumerSecret}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        });

        // Handle non-JSON responses (like critical WP errors)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            const htmlText = await response.text();
            console.error('❌ WordPress Critical Error (HTML):', htmlText);
            throw new Error('Error crítico en WordPress. Revisa los logs de tu servidor o desactiva plugins conflictivos.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ WooCommerce API Error:', errorData);
            throw new Error(errorData.message || 'Error creating order');
        }

        const order = await response.json();

        // Check if we got a payment URL (usually only for some gateways or requires specific plugin settings)
        // Standard WC 'order-pay' logic: /checkout/order-pay/:id/?pay_for_order=true&key=:order_key
        // But if WC is headless, we might need to direct to standard checkout page.

        // Actually, easiest way is to use the order key to construct the Pay URL manually if not provided,
        // OR standard "pay" link from response if available.
        // WC API v3 response usually has 'payment_url' field.

        let paymentUrl = order.payment_url;

        // Fallback if payment_url is empty (common in some configs)
        if (!paymentUrl && order.id && order.order_key) {
            // Construct standard WP checkout pay link
            // Adjust domain as needed
            paymentUrl = `${wooConfig.url}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
        }

        return NextResponse.json({
            success: true,
            paymentUrl,
            orderId: order.id
        });

    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
