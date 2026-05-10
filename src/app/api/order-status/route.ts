import { NextResponse } from 'next/server';
import { getServiceClient } from '@/core/api/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
        return NextResponse.json({ error: 'ID de orden inválido' }, { status: 400 });
    }

    const db = getServiceClient();
    const { data, error } = await db
        .from('orders')
        .select('id, status, total')
        .eq('id', orderId)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    return NextResponse.json({
        orderId: data.id,
        status:  data.status,
        total:   data.total,
        currency: 'ARS',
    });
}
