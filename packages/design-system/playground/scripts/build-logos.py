#!/usr/bin/env python3
"""Generate playground logo assets from logo_original.png.

logo_original.png uses a checkerboard preview pattern baked into pixels (alpha=255).
This script converts those areas to real transparency and writes:
  - logo-full.png  (cropped, full resolution)
  - logo.png       (header size)
  - logo.svg       (SVG wrapper with embedded header PNG)
"""

from __future__ import annotations

import base64
from collections import deque
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / 'assets'
SRC = ASSETS / 'logo_original.png'
HEADER_HEIGHT = 40


def is_checkerboard(r: int, g: int, b: int) -> bool:
    if max(r, g, b) < 215:
        return False
    return max(r, g, b) - min(r, g, b) <= 5


def to_transparent(img: Image.Image) -> Image.Image:
    rgba = img.convert('RGBA')
    px = rgba.load()
    w, h = rgba.size
    visited: set[tuple[int, int]] = set()

    def flood_from(x: int, y: int) -> None:
        if (x, y) in visited:
            return
        q: deque[tuple[int, int]] = deque([(x, y)])
        while q:
            x, y = q.popleft()
            if (x, y) in visited:
                continue
            visited.add((x, y))
            r, g, b, _a = px[x, y]
            if not is_checkerboard(r, g, b):
                continue
            px[x, y] = (0, 0, 0, 0)
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h:
                    q.append((nx, ny))

    for x in range(w):
        flood_from(x, 0)
        flood_from(x, h - 1)
    for y in range(h):
        flood_from(0, y)
        flood_from(w - 1, y)

    bbox = rgba.getbbox()
    if bbox is None:
        raise RuntimeError('No visible pixels found after transparency conversion')
    return rgba.crop(bbox)


def main() -> None:
    full = to_transparent(Image.open(SRC))
    full_path = ASSETS / 'logo-full.png'
    full.save(full_path, optimize=True)

    header_w = max(1, round(full.width * (HEADER_HEIGHT / full.height)))
    header = full.resize((header_w, HEADER_HEIGHT), Image.Resampling.LANCZOS)
    header_path = ASSETS / 'logo.png'
    header.save(header_path, optimize=True)

    b64 = base64.b64encode(header_path.read_bytes()).decode('ascii')
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {header_w} {HEADER_HEIGHT}" '
        f'role="img" aria-hidden="true">\n'
        f'  <image href="data:image/png;base64,{b64}" width="{header_w}" height="{HEADER_HEIGHT}" '
        f'preserveAspectRatio="xMidYMid meet" />\n'
        f'</svg>\n'
    )
    (ASSETS / 'logo.svg').write_text(svg)

    print(f'Wrote {full_path.name} ({full.size[0]}x{full.size[1]})')
    print(f'Wrote {header_path.name} ({header_w}x{HEADER_HEIGHT})')
    print('Wrote logo.svg')


if __name__ == '__main__':
    main()
