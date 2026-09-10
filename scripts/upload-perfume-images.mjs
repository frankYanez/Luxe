import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SUPABASE_URL = 'https://mkttzqoovwepcsmrbgce.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY || '';
const IMAGES_DIR   = 'C:\\Users\\frank\\Downloads\\perfumes';

const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// Normalize string for matching: lowercase, no accents, no special chars
function norm(s) {
    return s.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9 ]/g, ' ')
        .replace(/\s+/g, ' ').trim();
}

// Pick best image from a folder
function pickImage(folderPath) {
    const files = readdirSync(folderPath).filter(f => {
        const ext = extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)
            && statSync(join(folderPath, f)).isFile();
    });
    if (!files.length) return null;
    // Prefer packshot, then 1x1, then first
    const packshot = files.find(f => f.includes('packshot'));
    if (packshot) return join(folderPath, packshot);
    const square = files.find(f => f.includes('1x1'));
    if (square) return join(folderPath, square);
    return join(folderPath, files[0]);
}

// Get MIME type
function mime(filePath) {
    const ext = extname(filePath).toLowerCase();
    const map = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };
    return map[ext] || 'image/jpeg';
}

async function main() {
    // Fetch all products
    const { data: products, error } = await db.from('products').select('id, name, image');
    if (error) { console.error('Error fetching products:', error.message); process.exit(1); }
    console.log(`Found ${products.length} products in Supabase\n`);

    // Get subfolders
    const folders = readdirSync(IMAGES_DIR).filter(f => {
        try { return statSync(join(IMAGES_DIR, f)).isDirectory(); } catch { return false; }
    });

    console.log(`Found ${folders.length} image folders\n`);

    const results = [];

    for (const folder of folders) {
        const folderPath = join(IMAGES_DIR, folder);
        const imgPath = pickImage(folderPath);
        if (!imgPath) {
            console.log(`[SKIP] ${folder} — no images`);
            continue;
        }

        // Match product by name similarity
        const folderNorm = norm(folder);
        let bestMatch = null;
        let bestScore = 0;

        for (const product of products) {
            const productNorm = norm(product.name);
            // Check if folder words appear in product name or vice versa
            const folderWords = folderNorm.split(' ').filter(w => w.length > 2);
            const matchCount = folderWords.filter(w => productNorm.includes(w)).length;
            const score = matchCount / Math.max(folderWords.length, 1);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = product;
            }
        }

        if (!bestMatch || bestScore < 0.4) {
            console.log(`[NO MATCH] "${folder}" — best: "${bestMatch?.name}" (score: ${bestScore.toFixed(2)})`);
            results.push({ folder, status: 'no_match', productName: bestMatch?.name });
            continue;
        }

        console.log(`[MATCH] "${folder}" → "${bestMatch.name}" (score: ${bestScore.toFixed(2)})`);
        console.log(`  Image: ${imgPath}`);

        // Upload image
        const buffer = readFileSync(imgPath);
        const ext = extname(imgPath).toLowerCase();
        const fileName = `${Date.now()}-${folder.replace(/[^a-z0-9]/gi, '-')}${ext}`;

        const { error: uploadErr } = await db.storage
            .from('product-images')
            .upload(fileName, buffer, { contentType: mime(imgPath), upsert: false });

        if (uploadErr) {
            console.log(`  [ERROR] Upload failed: ${uploadErr.message}`);
            results.push({ folder, status: 'upload_error', error: uploadErr.message });
            continue;
        }

        const { data: { publicUrl } } = db.storage.from('product-images').getPublicUrl(fileName);

        // Update product
        const { error: updateErr } = await db
            .from('products')
            .update({ image: publicUrl })
            .eq('id', bestMatch.id);

        if (updateErr) {
            console.log(`  [ERROR] Update failed: ${updateErr.message}`);
            results.push({ folder, status: 'update_error', error: updateErr.message });
            continue;
        }

        console.log(`  [OK] Updated. URL: ${publicUrl}\n`);
        results.push({ folder, status: 'ok', productName: bestMatch.name, url: publicUrl });
    }

    console.log('\n=== SUMMARY ===');
    for (const r of results) {
        console.log(`${r.status.padEnd(12)} | ${r.folder.padEnd(25)} | ${r.productName || r.error || ''}`);
    }
}

main();
