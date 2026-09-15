import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifest = JSON.parse(readFileSync(new URL('./catalog-september-2026.json', import.meta.url), 'utf8'));
const apply = process.argv.includes('--apply');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data: before, error } = await db.from('products').select('*');
if (error) throw error;
const newSlugs = new Set(manifest.newProducts.map(p => p.slug));
if (manifest.prices.length !== 35 || newSlugs.size !== 5) throw new Error('Invalid catalog manifest');
const plan = [];
for (const entry of manifest.prices) {
    const matches = before.filter(p => p.slug === entry.slug);
    if (matches.length > 1) throw new Error(`Duplicate slug: ${entry.slug}`);
    if (!matches.length && !newSlugs.has(entry.slug)) throw new Error(`Missing existing product: ${entry.slug}`);
    const current = matches[0];
    const item = { ...entry, id: current?.id, previousPrice: current?.price, action: current ? 'update' : 'insert' };
    if (newSlugs.has(entry.slug)) {
        item.file = `output/perfume-images/${entry.slug}/${entry.slug}-card-white-v1.png`;
        const bytes = readFileSync(item.file);
        if (bytes.subarray(1, 4).toString() !== 'PNG') throw new Error(`Invalid PNG: ${item.file}`);
        item.width = bytes.readUInt32BE(16);
        item.height = bytes.readUInt32BE(20);
        item.hash = createHash('sha256').update(bytes).digest('hex');
        item.object = `catalog-white/${entry.slug}-${item.hash.slice(0, 16)}.png`;
        item.image = db.storage.from('product-images').getPublicUrl(item.object).data.publicUrl;
    }
    plan.push(item);
}
writeFileSync('output/perfume-images/september-update-plan.json', JSON.stringify(plan, null, 2));
if (!apply) {
    console.log(JSON.stringify(plan, null, 2));
}

if (apply) {
// Snapshot before writing; keep earlier snapshots when rerunning this migration.
writeFileSync(`output/perfume-images/september-backup-${Date.now()}.json`, JSON.stringify(before, null, 2));
for (const item of plan) {
    if (item.file) {
        const { error: uploadError } = await db.storage.from('product-images').upload(item.object, readFileSync(item.file), { contentType: 'image/png', upsert: false });
        if (uploadError && String(uploadError.statusCode) !== '409') throw uploadError;
    }
    let result;
    if (item.action === 'insert') {
        const details = manifest.newProducts.find(p => p.slug === item.slug);
        // Frank confirmed two units per new arrival. Existing records retain
        // their current inventory when this migration is rerun.
        result = await db.from('products').insert({ ...details, price: item.price, image: item.image, in_stock: true, stock_quantity: 2, featured: false }).select('id').single();
    } else {
        const patch = { price: item.price, ...(item.image ? { image: item.image } : {}) };
        result = await db.from('products').update(patch).eq('id', item.id).eq('slug', item.slug).select('id').single();
    }
    if (result.error) throw result.error;
    console.log(`${item.action}: ${item.slug} — ${item.price}`);
}

const { data: after, error: verifyError } = await db.from('products').select('*');
if (verifyError) throw verifyError;
for (const item of plan) {
    const matches = after.filter(p => p.slug === item.slug);
    if (matches.length !== 1 || Number(matches[0].price) !== item.price) throw new Error(`Price verification failed: ${item.slug}`);
    if (item.image && matches[0].image !== item.image) throw new Error(`Image verification failed: ${item.slug}`);
}
for (const previous of before) {
    const current = after.find(p => p.id === previous.id);
    if (!current || current.in_stock !== previous.in_stock || current.stock_quantity !== previous.stock_quantity) throw new Error(`Existing stock changed: ${previous.slug}`);
    if (!plan.some(p => p.slug === previous.slug) && Number(current.price) !== Number(previous.price)) throw new Error(`Unlisted price changed: ${previous.slug}`);
}
writeFileSync('output/perfume-images/september-update-result.json', JSON.stringify({ verifiedAt: new Date().toISOString(), pricesVerified: plan.length, totalProducts: after.length, stockPending: after.filter(p => newSlugs.has(p.slug) && !p.in_stock).map(p => p.slug), products: after }, null, 2));
console.log(`Verified ${plan.length} prices, ${newSlugs.size} arrival images, ${after.length} total products. Existing stock preserved.`);
}
