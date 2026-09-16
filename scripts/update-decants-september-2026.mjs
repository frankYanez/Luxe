import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('./decant-prices-september-2026.json', import.meta.url), 'utf8'));
const apply = process.argv.includes('--apply');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data: products, error } = await db.from('products').select('id,slug,name,decant_price,in_stock,stock_quantity');
if (error) throw error;

const plan = products.map((p) => {
    const decant_price = manifest.exceptions[p.slug] ?? manifest.defaultDecantPrice;
    const outOfStock = manifest.outOfStock.includes(p.slug);
    return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        decant_price: { from: p.decant_price, to: decant_price },
        ...(outOfStock ? { stock: { from: p.stock_quantity, to: 0 } } : {}),
    };
});

console.log(JSON.stringify(plan, null, 1));

if (!apply) {
    console.log(`\nDry run — ${plan.length} products. Re-run with --apply to write.`);
    process.exit(0);
}

for (const item of plan) {
    const update = { decant_price: item.decant_price.to };
    if (item.stock) { update.stock_quantity = 0; update.in_stock = false; }
    const { error: updErr } = await db.from('products').update(update).eq('id', item.id);
    if (updErr) throw new Error(`Failed on ${item.slug}: ${updErr.message}`);
}

console.log(`\nApplied to ${plan.length} products.`);
