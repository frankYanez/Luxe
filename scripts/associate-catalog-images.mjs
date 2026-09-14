import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve('output/perfume-images');
const reportPath = resolve(root, 'association-report.json');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const apply = process.argv.includes('--apply');
const { data: products, error } = await db.from('products').select('id,slug,name,image,in_stock');
if (error) throw new Error(error.message);
const catalog = JSON.parse(readFileSync(resolve(root, 'catalog-white/catalog.json'), 'utf8').replace(/^\uFEFF/, ''));
const plan = catalog.map(item => {
    const product = products.find(p => p.id === item.id && p.slug === item.slug);
    if (!product) throw new Error(`ID/slug mismatch: ${item.slug}`);
    return { ...product, file: resolve(root, 'catalog-white', item.slug, `${item.slug}-card-white-v1.png`) };
});
const jean = products.filter(p => p.slug === 'jean-lowe-vibe');
if (jean.length === 1) plan.push({ ...jean[0], file: resolve(root, 'jean-lowe-vibe/jean-lowe-vibe-card-white-v1.png') });
for (const item of plan) {
    const buffer = readFileSync(item.file);
    if (buffer.subarray(1, 4).toString() !== 'PNG') throw new Error(`Invalid PNG: ${item.slug}`);
    item.hash = createHash('sha256').update(buffer).digest('hex');
    item.object = `catalog-white/${item.slug}-${item.hash.slice(0, 16)}.png`;
    item.url = db.storage.from('product-images').getPublicUrl(item.object).data.publicUrl;
}
if (!apply) {
    writeFileSync(resolve(root, 'association-plan.json'), JSON.stringify(plan, null, 2));
    console.log(JSON.stringify({ count: plan.length, products: plan.map(p => ({ id: p.id, slug: p.slug, in_stock: p.in_stock })), jeanCandidates: products.filter(p => /jean|vibe/i.test(p.name)) }, null, 2));
} else {
    const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf8')) : [];
    for (const item of plan) {
        let entry = report.find(r => r.id === item.id && r.url === item.url);
        if (!entry) {
            entry = { id: item.id, slug: item.slug, previous_image: item.image, url: item.url, file: item.file, status: 'pending' };
            report.push(entry);
        }
        writeFileSync(reportPath, JSON.stringify(report, null, 2));
        const { error: uploadError } = await db.storage.from('product-images').upload(item.object, readFileSync(item.file), { contentType: 'image/png', upsert: false, cacheControl: '31536000' });
        if (uploadError && String(uploadError.statusCode) !== '409' && !/already exists/i.test(uploadError.message)) throw new Error(`${item.slug}: ${uploadError.message}`);
        const response = await fetch(item.url);
        if (!response.ok) throw new Error(`Image inaccessible: ${item.slug} (${response.status})`);
        const hash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
        if (hash !== item.hash) throw new Error(`Image hash mismatch: ${item.slug}`);
        const { data: updated, error: updateError } = await db.from('products').update({ image: item.url }).eq('id', item.id).eq('slug', item.slug).select('id,image').single();
        if (updateError || updated?.image !== item.url) throw new Error(`${item.slug}: ${updateError?.message || 'Update failed'}`);
        entry.status = 'associated_verified';
        entry.verified_at = new Date().toISOString();
        writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`OK ${item.slug}`);
    }
    console.log(`Associated and verified ${plan.length} images.`);
}
