#!/usr/bin/env python3
"""inject_head.py — add the bits a real hosted page needs that the Claude Design
source omits: a language attribute, a favicon / touch icon, a meta description
and Open Graph tags for link previews.

The design source already carries a <title>, so we keep it. Everything here is
idempotent (guarded by a marker) so it re-applies cleanly on every deploy.

    python3 scripts/inject_head.py
"""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
MARKER = "<!-- injected-head -->"

DESCRIPTION = ("Abschlussfest der Spielmäuse am Lußsee: Termin, Treffpunkt, "
               "Tagesablauf, wer dabei ist, die Picknickdecke und die Karte.")
ICON = "uploads/Laimer-Spielmaeuse_Logo.png"
SITE_URL = "https://www.spielmaeuse-am-see.de/"


def main() -> int:
    idx = root / "index.html"
    html = idx.read_text(encoding="utf-8")

    # 1. <html> -> <html lang="de">
    html = re.sub(r'<html(?![^>]*\blang=)', '<html lang="de"', html, count=1)

    title = (re.search(r'<title>([^<]*)</title>', html) or [None, "Spielmäuse am See"])[1]

    block = f'''{MARKER}
    <meta name="description" content="{DESCRIPTION}">
    <link rel="icon" href="{ICON}">
    <link rel="apple-touch-icon" href="{ICON}">
    <meta name="theme-color" content="#4a9d9c">
    <meta property="og:type" content="website">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{DESCRIPTION}">
    <meta property="og:image" content="{SITE_URL}{ICON}">
    <meta property="og:url" content="{SITE_URL}">
    <meta name="twitter:card" content="summary_large_image">
    <!-- /injected-head -->'''

    # remove any previous injection, then insert right after </title>
    html = re.sub(re.escape(MARKER) + r".*?<!-- /injected-head -->\s*", "", html, flags=re.S)
    html = re.sub(r'(</title>)', r'\1\n    ' + block, html, count=1)

    idx.write_text(html, encoding="utf-8")
    print("+ inject_head: lang, favicon, description, Open Graph")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
