#!/usr/bin/env python3
"""inject_enhance.py — ensure index.html loads enhance.js (the two working forms
+ live list). The page is regenerated from Claude Design on every deploy, which
drops our <script> tag, so this re-adds it idempotently just before </body>.

It only injects once enhance.js actually has a backend URL — while BACKEND_URL is
still the '__BACKEND_URL__' placeholder the forms can't work, so we keep the tag
out and the live site stays clean.

    python3 scripts/inject_enhance.py
"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
idx = root / "index.html"
enh = root / "enhance.js"
html = idx.read_text(encoding="utf-8")

TAG = '<script defer src="enhance.js"></script>'
configured = enh.exists() and "'__BACKEND_URL__'" not in enh.read_text(encoding="utf-8")

if not configured:
    if 'src="enhance.js"' in html:
        html = html.replace("  " + TAG + "\n", "").replace(TAG, "")
        idx.write_text(html, encoding="utf-8")
    print("enhance.js has no backend URL yet — not injected (forms stay off).")
elif 'src="enhance.js"' in html:
    print("enhance.js already injected — nothing to do")
else:
    i = html.rfind("</body>")
    if i == -1:
        raise SystemExit("ERROR: no </body> found in index.html")
    html = html[:i] + "  " + TAG + "\n" + html[i:]
    idx.write_text(html, encoding="utf-8")
    print("enhance.js injected into index.html")
