#!/usr/bin/env python3
"""localize_assets.py — point the pulled source at locally hosted assets.

The Claude Design source loads, from third-party CDNs:
  * index.html : Google Fonts (Baloo 2 + Nunito) via fonts.googleapis.com
  * index.html : Leaflet 1.9.4 CSS + JS via unpkg.com  (the map)
  * support.js : React / ReactDOM / Babel via unpkg.com

Each of these sends the visitor's IP to a third party. We vendor everything into
this repo instead and rewrite the references after every pull — idempotently, so
it runs on every deploy.

  * Google Fonts  <link>  ->  vendor/fonts-local.css  (+ drop the preconnects)
  * Leaflet css/js        ->  vendor/leaflet.css / vendor/leaflet.js
  * unpkg React/DOM/Babel ->  vendor/*.js

NOTE: the map's *tiles* (basemaps.cartocdn.com) are still fetched live from
CARTO — that is inherent to a slippy map and cannot be vendored. It is the only
remaining third-party request and is disclosed in the Datenschutzerklärung.

    python3 scripts/localize_assets.py
"""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent

UNPKG = {
    "https://unpkg.com/react@18.3.1/umd/react.production.min.js": "vendor/react.production.min.js",
    "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js": "vendor/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js": "vendor/babel.min.js",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css": "vendor/leaflet.css",
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js": "vendor/leaflet.js",
}
FONTS_LOCAL = "vendor/fonts-local.css"


def main() -> int:
    changed = []

    # --- index.html: fonts + leaflet ---
    idx = root / "index.html"
    html = idx.read_text(encoding="utf-8")
    before = html
    # drop preconnect hints to Google's font hosts
    html = re.sub(r'\s*<link[^>]*href="https://fonts\.g(?:oogleapis|static)\.com"[^>]*>', "", html)
    # swap the Google Fonts css2 <link> (href may carry &amp; entities) for the local css
    html = re.sub(
        r'<link[^>]*href="https://fonts\.googleapis\.com/css2[^"]*"[^>]*>',
        f'<link rel="stylesheet" href="{FONTS_LOCAL}">', html)
    # leaflet css + js
    html = html.replace("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "vendor/leaflet.css")
    html = html.replace("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "vendor/leaflet.js")
    if html != before:
        idx.write_text(html, encoding="utf-8")
        changed.append("index.html fonts+leaflet -> local")
    for stray in re.findall(r'https://fonts\.g(?:oogleapis|static)\.com[^"\')\s]*', html):
        print("  ! index.html still references Google Fonts: " + stray)
    for stray in re.findall(r'https://unpkg\.com/leaflet[^"\')\s]*', html):
        print("  ! index.html still references unpkg leaflet: " + stray)

    # --- support.js: React/ReactDOM/Babel ---
    support = root / "support.js"
    if support.exists():
        s = support.read_text(encoding="utf-8")
        for url, rel in UNPKG.items():
            if url in s:
                s = s.replace(url, rel)
                changed.append("support.js -> " + rel)
        for stray in re.findall(r"https://unpkg\.com/[^\"'\s)]+", s):
            print(f"  ! support.js still points at unpkg: {stray}")
        support.write_text(s, encoding="utf-8")

    print("+ localize_assets: " + (", ".join(changed) if changed else "already local"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
