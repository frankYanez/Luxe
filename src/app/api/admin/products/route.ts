import { NextResponse } from 'next/server';
import { getServiceClient } from '@/core/api/supabase-client';

export async function GET() {
    const db = getServiceClient();
    const { data, error } = await db
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = getServiceClient();

    const slug = body.slug || body.name
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const { data, error } = await db
        .from('products')
        .insert({ ...body, slug })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
}
