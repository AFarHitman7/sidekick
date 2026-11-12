"""Compose the concept sheet from the four Cycles renders."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(ROOT, "renders")
OUT = os.path.join(R, "sidekick_sheet.png")

W, H = 3200, 2960
PAPER = (232, 228, 218)
CARD = (243, 240, 232)
INK = (26, 27, 24)
MUTED = (105, 102, 94)
HAIR = (206, 200, 189)
ORANGE = (226, 58, 5)

MONO = r"C:\Windows\Fonts\consola.ttf"
MONOB = r"C:\Windows\Fonts\consolab.ttf"
SANS = r"C:\Windows\Fonts\bahnschrift.ttf"


def f(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def tracked(d, xy, s, font, fill, spacing, anchor=None):
    s = (" " * spacing).join(list(s))
    d.text(xy, s, font=font, fill=fill, anchor=anchor)


def main():
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)

    # header
    d.rectangle((80, 78, 108, 106), fill=ORANGE)
    tracked(d, (128, 62), "SIDEKICK", f(MONOB, 58), INK, 1)
    tracked(d, (132, 136), "COMPANION DISPLAY  /  CONCEPT 01  /  TACTILE INSTRUMENT",
            f(SANS, 23), MUTED, 1)
    tracked(d, (W - 80, 66), "DESIGNED TO BE PUT DOWN", f(MONOB, 23), INK, 1, anchor="ra")
    d.text((W - 80, 108), "101 × 63 × 9 mm   ·   4.0″ 540 × 960   ·   85 g",
           font=f(SANS, 21), fill=MUTED, anchor="ra")
    d.line((80, 196, W - 80, 196), fill=HAIR, width=2)
    tracked(d, (80, 216), "01  PHYSICAL OBJECT", f(MONOB, 18), MUTED, 1)
    d.text((W - 80, 216), "BLENDER / CYCLES  ·  1:1 MODEL", font=f(SANS, 18),
           fill=MUTED, anchor="ra")

    cells = {
        "hero": (80, 300, 2000, 1400, "01 / HERO — BONE POLYCARBONATE, CHARCOAL FACEPLATE, TE ORANGE"),
        "front": (2120, 300, 1000, 1400, "02 / FRONT — 4.0″ THREAD, DRAFTED REPLIES, BOUNDED SESSION"),
        "back": (80, 1740, 1500, 1050, "03 / BACK — SIX-MAGNET RING, MOULDED LANYARD LOOP, REFUSAL LIST"),
        "detail": (1620, 1740, 1500, 1050, "04 / DETAIL — KNURLED WHEEL, ORANGE RING, 1.55 mm KEY TRAVEL"),
    }
    caption_h = 36
    for name, (x, y, cw, ch, cap) in cells.items():
        d.rectangle((x, y, x + cw, y + ch), fill=CARD, outline=HAIR, width=2)
        p = os.path.join(R, "sidekick_%s.png" % name)
        if not os.path.exists(p):
            continue
        src = Image.open(p).convert("RGB")
        pad = 30
        fit = ImageOps.contain(src, (cw - pad * 2, ch - pad * 2 - caption_h), Image.LANCZOS)
        im.paste(fit, (x + (cw - fit.width) // 2, y + pad + (ch - pad * 2 - caption_h - fit.height) // 2))
        d.text((x + pad, y + ch - 44), cap, font=f(MONOB, 17), fill=MUTED)

    # footer
    d.line((80, H - 130, W - 80, H - 130), fill=HAIR, width=2)
    tracked(d, (80, H - 96),
            "NO BROWSER   ·   NO FEED   ·   NO STORE   ·   NO SUBSCRIPTION",
            f(MONOB, 20), INK, 1)
    d.text((W - 80, H - 96), "CYCLES  ·  88–112 SPP  ·  OPENIMAGEDENOISE",
           font=f(SANS, 18), fill=MUTED, anchor="ra")

    im.save(OUT)
    print("wrote", OUT, im.size)


if __name__ == "__main__":
    main()
