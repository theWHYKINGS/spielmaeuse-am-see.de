#!/usr/bin/env python3
"""unpack_code.py — decode an sm_code.json bundle (source HTML + support.js +
event-data.js) pulled from the Claude Design "Spielmäuse am See" project into the
repo.

We host the Claude Design *source* (client-rendered) plus its dependencies, so
the page always reflects the current design without an offline re-export. The
entry .dc.html is written as index.html.

    python3 scripts/unpack_code.py [path/to/sm_code.json]
    (defaults to the newest ~/Downloads/sm_code*.json)
"""
import base64
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent

if len(sys.argv) > 1:
    src = Path(sys.argv[1])
else:
    matches = sorted(Path.home().glob("Downloads/sm_code*.json"), key=lambda p: p.stat().st_mtime)
    if not matches:
        raise SystemExit("No sm_code*.json found in ~/Downloads")
    src = matches[-1]
print(f"reading {src.name}")

data = json.loads(src.read_text(encoding="utf-8"))

# The entry file becomes index.html. Don't hardcode its name — it is the only
# top-level .html in the bundle; everything else keeps its path.
entries = [p for p in data if p.lower().endswith(".html") and "/" not in p]
if len(entries) != 1:
    raise SystemExit(f"expected exactly one top-level .html entry, got: {entries}")
entry = entries[0]

for path, b64 in data.items():
    raw = base64.b64decode(b64)
    out = root / "index.html" if path == entry else root / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(raw)
    print(f"  wrote {out.relative_to(root)} ({len(raw)} bytes)")

print("+ unpack_code done (entry:", entry, "-> index.html)")
