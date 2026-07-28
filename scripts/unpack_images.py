#!/usr/bin/env python3
"""unpack_images.py — decode an sm_images.json bundle (uploads/*) pulled from the
Claude Design "Spielmäuse am See" project into the repo. Only re-run when a local
render shows broken images.

    python3 scripts/unpack_images.py [path/to/sm_images.json]
    (defaults to the newest ~/Downloads/sm_images*.json)
"""
import base64
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent

if len(sys.argv) > 1:
    src = Path(sys.argv[1])
else:
    matches = sorted(Path.home().glob("Downloads/sm_images*.json"), key=lambda p: p.stat().st_mtime)
    if not matches:
        raise SystemExit("No sm_images*.json found in ~/Downloads")
    src = matches[-1]
print(f"reading {src.name}")

data = json.loads(src.read_text(encoding="utf-8"))
for path, b64 in data.items():
    out = root / path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(base64.b64decode(b64))
    print(f"  wrote {path} ({out.stat().st_size} bytes)")

print("+ unpack_images done")
