"""Rebuild the studio's share imagery from the master mark.

    python3 tools/build-share-card.py <master.png> <fonts-dir> [target]

    target: card    -> assets/share-card.jpg  (1200x630, default)
            banner  -> banner.jpeg            (1920x600)
            both

<master.png> is heartstrings-mark-MASTER-1254.png from the studio's Drive (Misc
Graphics) — never an already-downscaled copy. <fonts-dir> holds
LibreCaslonDisplay.ttf and DMSans-Bold.ttf, the same two faces the page loads
from Google Fonts.

Both images use the cream ground and walnut/amber tokens from style.css, and
the same mark, type and gradient rule as the Story Room's own share-card.jpg,
so anything the studio puts in a feed reads as one brand. Keep them in step if
any one of them is redrawn.

  card    the page's og:image JPEG fallback and twitter:image. 1200x630, what
          Facebook, iMessage and Twitter crop to. Centred stack.
  banner  the keepsake builder's no-song-linked fallback. Stays 1920x600 under
          its original name because keepsake pages already sent to clients
          hardcode that URL and those dimensions — replacing it in place is
          what carries the new mark onto pages that shipped months ago. The
          3.2:1 format takes a horizontal lockup rather than the centred stack.

This is a one-off tool, not a build step: the site still serves as plain static
files.
"""
import sys

from PIL import Image, ImageDraw, ImageFont

MASTER   = sys.argv[1] if len(sys.argv) > 1 else 'heartstrings-mark-MASTER-1254.png'
FONT_DIR = sys.argv[2].rstrip('/') if len(sys.argv) > 2 else 'fonts'
TARGET   = sys.argv[3] if len(sys.argv) > 3 else 'card'

CREAM     = (244, 232, 210)
WALNUT    = (119, 72,  38)
WALNUT_D  = (90,  52,  25)
INK_SOFT  = (125, 106, 85)
GRAD      = [(90, 52, 25), (119, 72, 38), (237, 178, 104)]  # --grad stops

WORDMARK = 'Heartstrings Studio'
SUBLINE  = 'LUMBERPORT, WEST VIRGINIA  ·  CUSTOM SONGWRITING'
TAGLINE  = 'Your story deserves a song.'   # the slogan in index.html's JSON-LD

caslon = lambda s: ImageFont.truetype(FONT_DIR + '/LibreCaslonDisplay.ttf', s)
sans   = lambda s: ImageFont.truetype(FONT_DIR + '/DMSans-Bold.ttf', s)


def ground(w, h, glow_y):
    """Cream, with the page's radial warmth bled in from above."""
    img = Image.new('RGB', (w, h), CREAM)
    glow = Image.new('L', (w, h), 0)
    gd = ImageDraw.Draw(glow)
    for i in range(120, 0, -1):
        r = i * 6
        gd.ellipse([w//2 - r, glow_y - r, w//2 + r, glow_y + r], fill=int(20 * (1 - i / 120)))
    img.paste(Image.new('RGB', (w, h), WALNUT), (0, 0), glow)
    return img


def load_mark(width):
    """The mark, trimmed and scaled exactly as the logo.png files are."""
    src = Image.open(MASTER).convert('RGBA')
    bbox = src.getchannel('A').point(lambda v: 255 if v >= 12 else 0).getbbox()
    mark = src.crop(bbox)
    return mark.resize((width, round(mark.height * width / mark.width)), Image.LANCZOS)


def tracked_width(draw, text, font, tracking):
    return sum(draw.textlength(c, font=font) for c in text) + tracking * (len(text) - 1)


def draw_tracked(draw, x, y, text, font, fill, tracking):
    for c in text:
        draw.text((x, y), c, font=font, fill=fill)
        x += draw.textlength(c, font=font) + tracking


def grad_rule(draw, x, y, width, height=2):
    for i in range(width):
        t = i / (width - 1)
        if t < 0.55:
            a, b, u = GRAD[0], GRAD[1], t / 0.55
        else:
            a, b, u = GRAD[1], GRAD[2], (t - 0.55) / 0.45
        draw.rectangle([x + i, y, x + i, y + height],
                       fill=tuple(round(a[k] + (b[k] - a[k]) * u) for k in range(3)))


def build_card(out='assets/share-card.jpg'):
    W, H = 1200, 630
    card = ground(W, H, -140)
    draw = ImageDraw.Draw(card)

    mark = load_mark(210)
    mark_y = 74
    card.paste(mark, ((W - mark.width) // 2, mark_y), mark)
    y = mark_y + mark.height + 34

    def centered(text, font, fill, y, tracking=0):
        if tracking:
            draw_tracked(draw, (W - tracked_width(draw, text, font, tracking)) / 2,
                         y, text, font, fill, tracking)
        else:
            draw.text((W / 2, y), text, font=font, fill=fill, anchor='ma')

    centered(WORDMARK, caslon(78), WALNUT_D, y);            y += 104
    centered(SUBLINE, sans(22), INK_SOFT, y, tracking=5);   y += 58
    grad_rule(draw, (W - 300) // 2, y, 300);                y += 46
    centered(TAGLINE, caslon(40), WALNUT, y)

    card.save(out, quality=92, optimize=True, progressive=True)
    print('wrote', out, card.size)


def build_banner(out='banner.jpeg'):
    W, H = 1920, 600
    banner = ground(W, H, -260)
    draw = ImageDraw.Draw(banner)

    mark = load_mark(352)
    gap = 84

    f_word, f_sub, f_tag = caslon(104), sans(25), caslon(46)
    tracking = 6
    block_w = max(draw.textlength(WORDMARK, font=f_word),
                  tracked_width(draw, SUBLINE, f_sub, tracking),
                  draw.textlength(TAGLINE, font=f_tag))

    x0 = round((W - (mark.width + gap + block_w)) / 2)
    banner.paste(mark, (x0, (H - mark.height) // 2), mark)

    tx = x0 + mark.width + gap
    y = 168
    draw.text((tx, y), WORDMARK, font=f_word, fill=WALNUT_D);        y += 132
    draw_tracked(draw, tx, y, SUBLINE, f_sub, INK_SOFT, tracking);   y += 60
    grad_rule(draw, tx, y, 360);                                     y += 48
    draw.text((tx, y), TAGLINE, font=f_tag, fill=WALNUT)

    banner.save(out, quality=92, optimize=True, progressive=True)
    print('wrote', out, banner.size)


if TARGET in ('card', 'both'):
    build_card()
if TARGET in ('banner', 'both'):
    build_banner()
if TARGET not in ('card', 'banner', 'both'):
    sys.exit('unknown target %r — expected card, banner or both' % TARGET)
