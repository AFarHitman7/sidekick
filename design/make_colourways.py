"""Compose the colourway sheet from the four hero renders."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(ROOT, "renders")
OUT = os.path.join(R, "sidekick_colourways.png")

W, H = 3200, 2580
PAPER = (232, 228, 218)
CARD = (243, 240, 232)
INK = (26, 27, 24)
MUTED = (105, 102, 94)
HAIR = (206, 200, 189)
ORANGE = (226, 58, 5)

MONOB = r"C:\Windows\Fonts\consolab.ttf"
SANS = r"C:\Windows\Fonts\bahnschrift.ttf"

CELLS = [
    ("studio", "STUDIO", "BONE  /  CHARCOAL  /  ORANGE", ["#D6D0C1", "#1D1E1B", "#FF3D02"]),
    ("night",  "NIGHT",  "GRAPHITE  /  BLACK  /  ORANGE", ["#4A4A44", "#121311", "#FF5A1F"]),
    ("field",  "FIELD",  "SILVER  /  CHARCOAL  /  MINT", ["#C6C9C4", "#2A2B29", "#3FB98F"]),
    ("clay",   "CLAY",   "SAND  /  UMBER  /  TOMATO", ["#C8B69E", "#2B2420", "#E0472B"]),
]


def f(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def tracked(d, xy, s, font, fill, spacing, anchor=None):
    s = (" " * spacing).join(list(s))
    d.text(xy, s, font=font, fill=fill, anchor=anchor)


def main():
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)

    # header
    d.rectangle((80, 78, 108, 106), fill=ORANGE)
    tracked(d, (128, 62), "SIDEKICK", f(MONOB, 56), INK, 1)
    tracked(d, (132, 136), "COLOURWAYS  /  CONCEPT 01  /  FOUR FINISHES",
            f(SANS, 23), MUTED, 1)
    tracked(d, (W - 80, 66), "STUDIO   ·   NIGHT   ·   FIELD   ·   CLAY",
            f(MONOB, 22), INK, 1, anchor="ra")
    d.text((W - 80, 108), "one geometry, four material stories",
           font=f(SANS, 21), fill=MUTED, anchor="ra")
    d.line((80, 196, W - 80, 196), fill=HAIR, width=2)
    tracked(d, (80, 216), "02  MATERIAL STORIES", f(MONOB, 18), MUTED, 1)
    d.text((W - 80, 216), "BLENDER / CYCLES  ·  1:1 MODEL", font=f(SANS, 18),
           fill=MUTED, anchor="ra")

    cw, ch = 1500, 1030
    img_h = 900
    pad = 34
    positions = [(80, 290), (1620, 290), (80, 1350), (1620, 1350)]

    for (name, label, sub, colors), (x, y) in zip(CELLS, positions):
        d.rectangle((x, y, x + cw, y + ch), fill=CARD, outline=HAIR, width=2)
        p = os.path.join(R, "sidekick_hero.png" if name == "studio" else "sidekick_hero_%s.png" % name)
        if os.path.exists(p):
            src = Image.open(p).convert("RGB")
            fit = ImageOps.contain(src, (cw - pad * 2, img_h - pad * 2), Image.LANCZOS)
            im.paste(fit, (x + (cw - fit.width) // 2, y + pad + (img_h - pad * 2 - fit.height) // 2))
        # swatches
        sx = x + pad
        sy = y + img_h + 6
        for c in colors:
            d.rectangle((sx, sy, sx + 34, sy + 34), fill=hexrgb(c), outline=(180, 174, 163), width=1)
            sx += 44
        # name + descriptor
        d.text((x + pad + 156, sy - 8), label, font=f(MONOB, 30), fill=INK)
        d.text((x + cw - pad, sy + 2), sub, font=f(SANS, 17), fill=MUTED, anchor="ra")
        d.line((x + pad, y + ch - 8, x + cw - pad, y + ch - 8), fill=HAIR, width=1)

    # footer
    d.line((80, H - 120, W - 80, H - 120), fill=HAIR, width=2)
    tracked(d, (80, H - 88), "SAME OBJECT.  FOUR STORIES.  NO SUBSCRIPTION.",
            f(MONOB, 20), INK, 1)
    d.text((W - 80, H - 88), "HERO 1800–2400 PX  ·  CYCLES  ·  OPENIMAGEDENOISE",
           font=f(SANS, 18), fill=MUTED, anchor="ra")

    im.save(OUT)
    print("wrote", OUT, im.size)


if __name__ == "__main__":
    main()
