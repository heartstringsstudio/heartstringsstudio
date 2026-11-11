#!/usr/bin/env python3
"""Cut the 800px gallery copy of every song cover in assets/.

The weekly spotlight shows a cover at full size (1280x720). Gallery cards
show the same cover at a third of that, so script.js asks for
`<name>-800.<ext>` there and falls back to the full file if it is missing.
Run this after adding or replacing a cover:

    python3 tools/build-song-thumbs.py

tests/seo.test.mjs fails if a cover named in `songs` has no 800px copy.
"""
import pathlib
from PIL import Image

ASSETS = pathlib.Path(__file__).resolve().parent.parent / "assets"

for src in sorted(ASSETS.glob("*-youtube.*")):
    if src.stem.endswith("-800") or src.suffix not in (".webp", ".jpg"):
        continue
    out = src.with_name(f"{src.stem}-800{src.suffix}")
    im = Image.open(src).convert("RGB")
    im.thumbnail((800, 800), Image.LANCZOS)
    if src.suffix == ".webp":
        im.save(out, "WEBP", quality=78, method=6)
    else:
        im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    print(f"{out.name}: {src.stat().st_size // 1024} KB -> {out.stat().st_size // 1024} KB")
