import json, shutil, subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
audit = json.loads((root / 'output/perfume-images/video-audit.json').read_text(encoding='utf-8'))
target = root / 'public/videos/products'
target.mkdir(parents=True, exist_ok=True)
mapping = {}
for product in audit:
    if not product['videos']:
        product['video_status'] = 'missing_in_drive'
        continue
    video = sorted(product['videos'], key=lambda v: int(v['size']))[0]
    source = Path('C:/Users/frank/Downloads') / video['title']
    if not source.exists():
        product['video_status'] = 'local_copy_needed'
        continue
    if source.stat().st_size != int(video['size']):
        raise RuntimeError(f"Size mismatch: {source}")
    dest = target / (product['slug'] + '.mp4')
    shutil.copy2(source, dest)
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(dest)], encoding='utf-8'))
    stream = next(s for s in info['streams'] if s['codec_type'] == 'video')
    product.update(video_status='integrated', source_file=str(source), video_file=str(dest), width=stream['width'], height=stream['height'], duration=info['format']['duration'])
    mapping[product['id']] = '/videos/products/' + dest.name
(root / 'src/core/data/product-videos.json').write_text(json.dumps(mapping, indent=2), encoding='utf-8')
(root / 'output/perfume-images/video-audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps([{'name': p['name'], 'status': p['video_status'], 'width': p.get('width'), 'height': p.get('height')} for p in audit], ensure_ascii=False))
