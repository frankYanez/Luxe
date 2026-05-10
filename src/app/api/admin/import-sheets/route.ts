import { NextResponse } from 'next/server';
import { getServiceClient } from '@/core/api/supabase-client';

export const dynamic = 'force-dynamic';

const SHEET_ID = '1zTK5lsrm5gzdx80-PytZ-qLhbKXawgwjfyDMTXQyOHE';

function toSlug(name: string) {
    return name
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function guessCategory(name: string): 'masculino' | 'femenino' | 'unisex' {
    const n = name.toLowerCase();
    if (n.includes('woman') || n.includes('rose') || n.includes('candy') ||
        n.includes('florence') || n.includes('eclaire') || n.includes('mayar') ||
        n.includes('yara') || n.includes('feminin')) return 'femenino';
    if (n.includes('man') || n.includes('king') || n.includes('asad') ||
        n.includes('masculino') || n.includes('fakhar black') || n.includes('9pm') ||
        n.includes('9am') || n.includes('rebel') || n.includes('fursan') ||
        n.includes('aqua') || n.includes('honor') || n.includes('oud for') ||
        n.includes('bharara')) return 'masculino';
    return 'unisex';
}

function guessBrand(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('lattafa') || n.includes('khamrah') || n.includes('asad') ||
        n.includes('fakhar') || n.includes('yara') || n.includes('mayar') ||
        n.includes('fursan') || n.includes('hayaati') || n.includes('eclaire') ||
        n.includes('hayaati')) return 'Lattafa';
    if (n.includes('afnan')) return 'Afnan';
    if (n.includes('club de nuit') || n.includes('armaf')) return 'Armaf';
    if (n.includes('bharara')) return 'Bharara';
    if (n.includes('sublime') || n.includes('honor') || n.includes('oud for glory') ||
        n.includes('mandarin') || n.includes('aqua dubai')) return 'Maison Alhambra';
    if (n.includes('amber oud')) return 'Al Haramain';
    return 'Lattafa';
}

export async function POST() {
    try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
        const res = await fetch(csvUrl);

        if (!res.ok) {
            return NextResponse.json(
                { error: 'No se pudo leer el sheet. Asegurate de que sea público (Anyone with link → Viewer).' },
                { status: 400 }
            );
        }

        const csv  = await res.text();
        const rows = csv.trim().split('\n').slice(1); // skip header

        const products = rows
            .map(row => {
                const cols = row.split(',');
                const name  = cols[1]?.trim();
                const price = parseFloat(cols[4]?.trim()) || 0;
                const stock = parseInt(cols[10]?.trim()) || 0;

                if (!name || !price) return null;

                return {
                    name,
                    slug:              toSlug(name),
                    brand:             guessBrand(name),
                    category:          guessCategory(name),
                    price,
                    stock_quantity:    stock,
                    in_stock:          stock > 0,
                    featured:          false,
                    intensity:         'moderada',
                    description:       '',
                    short_description: '',
                    image:             '',
                    olfactory_notes:   [],
                    longevity:         '',
                };
            })
            .filter(Boolean);

        const db = getServiceClient();
        const { error } = await db
            .from('products')
            .upsert(products as any[], { onConflict: 'slug', ignoreDuplicates: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ imported: products.length, products });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
