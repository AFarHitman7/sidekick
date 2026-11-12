"""Build web-ready image plates from the Blender renders."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "design" / "renders"
OUT = ROOT / "web" / "public" / "renders"
OUT.mkdir(parents=True, exist_ok=True)

# The colourway heroes share one camera. Crop them to the same object-fitted
# portrait plate so all four read at the same scale in the lookbook grid.
COLORWAY_BOX = (0.326, 0.112, 0.668, 0.917)

PLATES = [
    ("sidekick_front.png", "front", 1400, None),
    ("sidekick_back.png", "back", 1600, None),
    ("sidekick_detail.png", "detail", 1600, None),
]


def save(im: Image.Image, slug: str) -> None:
    target = OUT / f"{slug}.webp"
    im.save(target, "WEBP", quality=86, method=6)
    print(f"{target.name:14s} {im.width}x{im.height} {target.stat().st_size / 1024:.0f} KB")


for filename, slug, width, _ in PLATES:
    im = Image.open(SRC / filename).convert("RGB")
    if im.width > width:
        height = round(im.height * width / im.width)
        im = im.resize((width, height), Image.LANCZOS)
    save(im, slug)

for filename, slug in [
    ("sidekick_hero.png", "studio"),
    ("sidekick_hero_night.png", "night"),
    ("sidekick_hero_field.png", "field"),
    ("sidekick_hero_clay.png", "clay"),
]:
    im = Image.open(SRC / filename).convert("RGB")
    w, h = im.size
    crop = im.crop(
        (
            int(COLORWAY_BOX[0] * w),
            int(COLORWAY_BOX[1] * h),
            int(COLORWAY_BOX[2] * w),
            int(COLORWAY_BOX[3] * h),
        )
    )
    target_h = 1100
    crop = crop.resize(
        (round(crop.width * target_h / crop.height), target_h), Image.LANCZOS
    )
    save(crop, slug)

# Wide studio plates for the no-WebGL / render-failure poster.
for filename, slug, width in [
    ("sidekick_hero.png", "stage", 1600),
    ("sidekick_hero_night.png", "stage_night", 1280),
    ("sidekick_hero_field.png", "stage_field", 1280),
    ("sidekick_hero_clay.png", "stage_clay", 1280),
]:
    im = Image.open(SRC / filename).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    save(im, slug)

# Social card: a wide slice of the reference hero.
hero = Image.open(SRC / "sidekick_hero.png").convert("RGB")
w, h = hero.size
og = hero.crop((0, int(h * 0.04), w, int(h * 0.04) + round(w * 9 / 16)))
og = og.resize((1200, 675), Image.LANCZOS)
save(og, "og")
