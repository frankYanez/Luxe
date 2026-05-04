import { NextResponse } from 'next/server';
import { wooConfig, getWooApiUrl } from '@/core/config/woocommerce';
import { createUalaPayment } from '@/core/api/uala-client';

interface CustomerData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
}

export async function POST(request: Request) {
    try {
        if (!wooConfig.url || !wooConfig.consumerKey || !wooConfig.consumerSecret) {
            console.error('WooCommerce configuration missing');
            return NextResponse.json(
                { error: 'Error de configuración del servidor: faltan credenciales de WooCommerce.' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { items, customer }: { items: any[]; customer?: CustomerData } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'No hay productos en el carrito.' }, { status: 400 });
        }

        // Build line items
        const line_items = items.map((item: any) => {
            const isDecant = String(item.id).includes('-decant');
            const productId = parseInt(String(item.id).replace('-decant', ''));

            if (isNaN(productId)) {
                throw new Error(`ID de producto inválido: ${item.id}`);
            }

            const lineItem: any = {
                product_id: productId,
                quantity: item.quantity,
            };

            if (item.variant) {
                lineItem.meta_data = [
                    { key: 'Tamaño', value: item.variant },
                    ...(isDecant ? [{ key: 'Tipo', value: 'Decant' }] : []),
                ];
            }

            return lineItem;
        });

        // Build billing/shipping from customer data
        const billing = customer ? (() => {
            const parts = (customer.fullName || '').trim().split(' ');
            const firstName = parts[0] || '';
            const lastName = parts.slice(1).join(' ') || '';
            return {
                first_name: firstName,
                last_name: lastName,
                email: customer.email,
                phone: customer.phone,
                address_1: customer.address || '',
                city: 'Tandil',
                state: 'Buenos Aires',
                country: 'AR',
                postcode: '',
            };
        })() : {};

        const orderData: any = {
            set_paid: false,
            status: 'pending',
            line_items,
            billing,
            shipping: billing,
            meta_data: [
                { key: '_created_via', value: 'luxe-essence-web' },
            ],
        };

        console.log('📦 Creando orden WooCommerce:', JSON.stringify(orderData, null, 2));

        const url = `${getWooApiUrl()}/orders?consumer_key=${wooConfig.consumerKey}&consumer_secret=${wooConfig.consumerSecret}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        // Detect WordPress HTML error pages
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
            const html = await response.text();
            console.error('❌ WordPress devolvió HTML en lugar de JSON:', html.slice(0, 500));
            throw new Error('Error en WordPress. Revisá los logs del servidor o plugins conflictivos.');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ WooCommerce API Error:', errorData);

            // Provide clearer messages for common errors
            let msg = errorData.message || 'Error al crear el pedido.';
            if (response.status === 401 || response.status === 403) {
                msg = 'Credenciales de WooCommerce inválidas. Verificá las claves en .env.local.';
            } else if (response.status === 404) {
                msg = 'No se encontró la URL de WooCommerce. Verificá NEXT_PUBLIC_WC_URL.';
            }
            throw new Error(msg);
        }

        const order = await response.json();
        console.log('✅ WC orden creada:', order.id);

        // Compute total from items for Ualá
        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        // Derive base URL from the incoming request
        const host  = request.headers.get('host') ?? 'localhost:3000';
        const proto = request.headers.get('x-forwarded-proto') ?? 'http';
        const baseUrl = `${proto}://${host}`;

        let paymentUrl: string | null = null;
        try {
            const uala = await createUalaPayment({
                amount:      total,
                description: `Luxe Essence - Pedido #${order.id}`,
                orderId:     order.id,
                baseUrl,
            });
            paymentUrl = uala.checkoutLink;
            console.log('💳 Ualá checkout link:', paymentUrl, '| UUID:', uala.uuid);
        } catch (ualaErr: any) {
            console.error('⚠️ Ualá payment creation failed, proceeding without payment URL:', ualaErr.message);
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderKey: order.order_key,
            paymentUrl,
        });

    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor.' },
            { status: 500 }
        );
    }
}
