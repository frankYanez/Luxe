import { NextResponse } from 'next/server';
import { createUalaPayment } from '@/core/api/uala-client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ??
        (() => {
            const host  = request.headers.get('host') ?? 'localhost:3000';
            const proto = request.headers.get('x-forwarded-proto') ?? 'http';
            return `${proto}://${host}`;
        })();

    try {
        const result = await createUalaPayment({
            amount:      100,
            description: 'Test Luxe Essence',
            orderId:     9999,
            baseUrl,
        });
        return NextResponse.json({ ok: true, ...result });
    } catch (err: any) {
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
}
