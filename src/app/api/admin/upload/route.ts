import { NextResponse } from 'next/server';
import { getServiceClient } from '@/core/api/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ext      = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());

    const db = getServiceClient();
    const { error } = await db.storage
        .from('product-images')
        .upload(fileName, buffer, { contentType: file.type, upsert: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: { publicUrl } } = db.storage
        .from('product-images')
        .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
}
