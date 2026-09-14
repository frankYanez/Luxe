from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/images/decants-banner-v1.png"
CATALOG = ROOT / "output/perfume-images/catalog-white"
DEST = ROOT / "public/images/decants"


def make_decant_layer() -> Image.Image:
    banner = Image.open(SOURCE).convert("RGBA")
    # Central vial: crop it from the horizontal five-vial banner.
    vial = banner.crop((880, 35, 1180, 735))
    bbox = vial.getchannel("A").getbbox()
    if bbox:
        vial = vial.crop(bbox)
    vial.thumbnail((260, 850), Image.Resampling.LANCZOS)
    layer = Image.new("RGBA", (1254, 1254))

    shadow = Image.new("RGBA", layer.size)
    shadow_shape = Image.new("L", vial.size)
    shadow_shape.paste(vial.getchannel("A"), (0, 0))
    shadow_shape = shadow_shape.filter(ImageFilter.GaussianBlur(18))
    shadow_color = Image.new("RGBA", vial.size, (0, 0, 0, 90))
    shadow_color.putalpha(shadow_shape.point(lambda value: int(value * 0.42)))
    shadow.alpha_composite(shadow_color, (170, 286))
    layer.alpha_composite(shadow)
    layer.alpha_composite(vial, (170, 270))
    return layer


def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    vial_layer = make_decant_layer()
    count = 0
    for folder in sorted(CATALOG.iterdir()):
        if not folder.is_dir() or folder.name.startswith("__"):
            continue
        source = folder / f"{folder.name}-card-white-v1.png"
        if not source.exists():
            continue
        base = Image.open(source).convert("RGBA")
        if base.size != (1254, 1254):
            base = base.resize((1254, 1254), Image.Resampling.LANCZOS)
        result = Image.alpha_composite(base, vial_layer)
        result.save(DEST / f"{folder.name}.png")
        count += 1
    print(f"Generated {count} decant card images in {DEST}")


if __name__ == "__main__":
    main()
