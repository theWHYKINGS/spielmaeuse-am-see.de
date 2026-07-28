# spielmaeuse-am-see.de

Private, password-gated event landing page — **"Spielmäuse am See – Unser
Abschlussfest am Lußsee"** (Laimer Spielmäuse e.V.), served free on GitHub Pages
at https://www.spielmaeuse-am-see.de.

It is the Claude Design source (client-rendered React) hosted together with its
vendored dependencies, so the live page always matches the current design.

## Deploy loop

Designed in Claude Design; published here. To ship the latest design:

```bash
# 1. Claude pulls the source via the authenticated browser session
#    (see scripts/pull-from-design.md) into ~/Downloads/sm_code.json + sm_images.json
python3 scripts/unpack_code.py
python3 scripts/unpack_images.py   # only if images changed
# 2. publish
scripts/deploy.sh "what changed"
```

`deploy.sh` runs `localize_assets.py` (fonts + React/Babel + Leaflet → local) and
`inject_head.py` (lang/favicon/meta/OG), then commits, pushes and requests a
Pages build.

## Privacy

No third-party requests except the map's CARTO tiles (inherent to the map).
Fonts (Baloo 2 + Nunito), React/ReactDOM/Babel and Leaflet 1.9.4 are all vendored
locally under `vendor/` and `assets/fonts/`.

## Layout

- `index.html` — the design entry (published from `Spielmäuse am See.dc.html`)
- `support.js` — omelette React harness
- `event-data.js` — all event content + the client-side gate password
- `uploads/` — logo/favicon
- `vendor/`, `assets/fonts/` — vendored libs + fonts
- `scripts/` — the deploy tooling
- `CNAME`, `.nojekyll` — GitHub Pages config
