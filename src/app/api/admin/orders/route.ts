import { NextResponse } from 'next/server';
import { getServiceClient } from '@/core/api/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const db = getServiceClient();
    const { data, error } = await db
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
}

export async function PUT(request: Request) {
    const { id, status } = await request.json();
    const db = getServiceClient();
    const { error } = await db
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
