# Pulling the latest from Claude Design (Spielmäuse am See)

Claude does this through the authenticated browser session (Claude-in-Chrome),
because the Claude Design API needs your claude.ai login. You just say
**"deploy spielmäuse"**.

## Project

- **Project ID:** `f54aa6b5-e7b8-4ecf-a64f-36bb87d6b4e0`
  (share link: https://claude.ai/design/p/f54aa6b5-e7b8-4ecf-a64f-36bb87d6b4e0)
- **Entry file:** the top-level **`Spielmäuse am See.dc.html`** → published as `index.html`
- **API base:** `https://claude.ai/design/anthropic.omelette.api.v1alpha.OmeletteService/`
- **Auth:** claude.ai session cookies (same-origin fetch from an open claude.ai tab)

This is a **private, password-gated** single-page event site ("Abschlussfest am
Lußsee") — the parole lives in `event-data.js` and is checked client-side, so it
is a soft gate, not real security.

## We host the SOURCE, not an offline export

The page is hosted as its Claude Design source (client-rendered) plus its
dependencies, so it always reflects the current design without a re-export.

## Discover the file list DYNAMICALLY

`ListFiles` first, then pull the entry and parse **its own** references — never
hardcode. Current dependency set:

- `support.js` — the omelette React harness (loads React/ReactDOM/Babel)
- `event-data.js` — all event content (date, treffpunkt, schedule, families,
  picnic list, map markers, and the gate password)
- `uploads/Laimer-Spielmaeuse_Logo.png` — logo + favicon

The `uploads/` folder also holds two 5.9 MB lake overview PNGs and a screenshot
that the design does **not** reference — skip them (keep the repo lean).

Bundle prefix is **`sm_`** (`sm_code.json` / `sm_images.json`) so it never mixes
with `wk_` (main), `ak_` (Academy), `cm_` (CMON) in ~/Downloads.

```js
const PID = 'f54aa6b5-e7b8-4ecf-a64f-36bb87d6b4e0';
const BASE = 'https://claude.ai/design/anthropic.omelette.api.v1alpha.OmeletteService/';
const get = async (p) => (await fetch(BASE+'GetFile',{method:'POST',
  headers:{'Content-Type':'application/json','Connect-Protocol-Version':'1'},
  credentials:'include', body:JSON.stringify({projectId:PID,path:p})})).json();
// pull entry, parse refs, bundle code -> sm_code.json, images -> sm_images.json
```

## Then, locally

```bash
python3 scripts/unpack_code.py        # newest sm_code*.json -> index.html + support.js + event-data.js
python3 scripts/unpack_images.py      # only when images changed
scripts/deploy.sh "describe what changed"   # localize + inject + commit + push + request build
```

## Post-processing applied on every deploy (deploy.sh)

Two idempotent scripts re-apply what the design source omits, so a re-pull never
loses them:

- `localize_assets.py` — rewrites the third-party CDN references to the vendored
  copies: Google Fonts (Baloo 2 + Nunito) → `vendor/fonts-local.css`
  (`assets/fonts/*.woff2`); Leaflet 1.9.4 css+js → `vendor/leaflet.*`
  (`vendor/images/` holds Leaflet's marker/layer PNGs); React/ReactDOM/Babel in
  support.js → `vendor/*.js`. **The only remaining third-party request is the
  map's CARTO tiles** (`basemaps.cartocdn.com`) — inherent to a slippy map, can't
  be vendored.
- `inject_head.py` — adds `lang="de"`, a favicon/touch-icon (the logo), a meta
  description and Open Graph tags. The source already carries a `<title>`.

## Refreshing fonts

If the design introduces new font weights/families, re-run the css2 fetch (modern
browser UA) into `assets/fonts/` and regenerate `vendor/fonts-local.css`.

## Gotchas

- The source's `<script data-omelette-injected>` harness is re-minified
  server-side on every fetch → `index.html` can show a noise diff. Inert when
  hosted standalone.
- `.nojekyll` must stay.
- DNS: `spielmaeuse-am-see.de` nameservers are at all-inkl (`ns5`/`ns6.kasserver.com`).
  `www` must CNAME to `theWHYKINGS.github.io.` and the apex A records must be the
  4 GitHub Pages IPs (185.199.108–111.153), or the custom domain won't serve.
- The form (Picknickdecke / Mitbringen) is **client-side only** (no backend
  action) — entries are not persisted anywhere. If real RSVPs are needed, wire a
  form backend (e.g. Web3Forms, as on the Academy).

## Open before wider sharing

- **Impressum / Datenschutz:** none in the design. Site owner is **Laimer
  Spielmäuse e.V.** (a Verein, not theWHYKINGS GmbH). A purely private, password-
  gated family page may be exempt from §5 DDG Impressum duty, but confirm — and
  the CARTO map tiles / no-cookies facts belong in a short Datenschutz note if one
  is added.
