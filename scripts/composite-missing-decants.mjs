// One-off: Delilah and Hawas For Him were added as new-arrival products
// without a decant combo shot (generate-decant-cards.py never saw them —
// their card-white renders live outside output/perfume-images/catalog-white/,
// which is the only place that script looks). Composites the same vial
// cutout used for every other product's /images/decants/<slug>.png onto
// their existing card-white bottle shots, following the exact crop/paste
// geometry generate-decant-cards.py uses so the result matches the rest
// of the set.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const CROP = { left: 880, top: 35, width: 300, height: 700 };
const PASTE = { x: 170, y: 270 };
const SHADOW_OFFSET = { x: 170, y: 286 };
const SHADOW_ALPHA_SCALE = 0.42;
const BLUR_SIGMA = 9;

const TARGETS = [
    { slug: 'delilah', source: 'output/perfume-images/delilah/delilah-card-white-v1.png' },
    { slug: 'hawas-for-him', source: 'output/perfume-images/hawas-for-him/hawas-for-him-card-white-v1.png' },
];

async function buildVialLayer() {
    const vialCrop = await sharp('public/images/decants-banner-v1.png').extract(CROP).png().toBuffer();
    const trimmed = await sharp(vialCrop).trim().toBuffer();
    const meta = await sharp(trimmed).metadata();
    const scale = Math.min(260 / meta.width, 850 / meta.height);
    const vw = Math.round(meta.width * scale);
    const vh = Math.round(meta.height * scale);
    const vial = await sharp(trimmed).resize(vw, vh, { fit: 'fill' }).png().toBuffer();

    const alpha = await sharp(vial).ensureAlpha().extractChannel('alpha').raw().toBuffer();
    const scaledAlpha = Buffer.from(alpha.map((v) => Math.round(v * SHADOW_ALPHA_SCALE)));
    const shadowBase = await sharp({ create: { width: vw, height: vh, channels: 3, background: { r: 0, g: 0, b: 0 } } })
        .joinChannel(scaledAlpha, { raw: { width: vw, height: vh, channels: 1 } })
        .png()
        .toBuffer();
    // Pad with transparent border before blurring — otherwise the blur has
    // nowhere to spread into and gets hard-clipped at the canvas edge,
    // leaving a visible rectangle behind the soft shadow.
    const pad = Math.ceil(BLUR_SIGMA * 3);
    const shadow = await sharp(shadowBase)
        .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .blur(BLUR_SIGMA)
        .png()
        .toBuffer();

    return { vial, shadow, pad };
}

async function main() {
    const { vial, shadow, pad } = await buildVialLayer();

    for (const t of TARGETS) {
        const result = await sharp(t.source)
            .ensureAlpha()
            .composite([
                { input: shadow, left: SHADOW_OFFSET.x - pad, top: SHADOW_OFFSET.y - pad },
                { input: vial, left: PASTE.x, top: PASTE.y },
            ])
            .png()
            .toBuffer();
        await writeFile(`public/images/decants/${t.slug}.png`, result);
        console.log('wrote', t.slug);
    }
}

main();
