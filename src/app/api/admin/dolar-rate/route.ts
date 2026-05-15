import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // cache 1 minute

export async function GET() {
    try {
        const res = await fetch('https://dolarapi.com/v1/dolares/blue', {
            next: { revalidate: 60 },
            headers: { 'User-Agent': 'Luxe-Essence-CRM/1.0' },
        });
        if (!res.ok) throw new Error(`dolarapi.com status ${res.status}`);
        const data = await res.json();
        return NextResponse.json({
            compra: data.compra,
            venta:  data.venta,
            rate:   data.venta, // use sell rate (what we'd pay to buy USD)
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 502 });
    }
}
