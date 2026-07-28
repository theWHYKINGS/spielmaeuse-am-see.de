#!/usr/bin/env bash
#
# deploy.sh — publish the current index.html to GitHub Pages.
#
# Commits whatever is in the working tree (normally a freshly pulled source from
# the Claude Design "Spielmäuse am See" project) and pushes it to
# github.com/theWHYKINGS/spielmaeuse-am-see.de, served at
# https://www.spielmaeuse-am-see.de.
#
# The *pull* step (fetching the latest source out of Claude Design) is done by
# Claude via the authenticated browser session — see scripts/pull-from-design.md.
#
#   scripts/deploy.sh                 # timestamped commit message
#   scripts/deploy.sh "Update hero"   # custom message

set -euo pipefail

cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$PATH"

MSG="${1:-Update site — $(date '+%Y-%m-%d %H:%M')}"

echo "Pointing fonts + React/Babel + Leaflet at local copies…"
python3 scripts/localize_assets.py
echo "Injecting lang / favicon / meta…"
python3 scripts/inject_head.py

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing changed — working tree is clean. Nothing to deploy."
  exit 0
fi

git add -A
git status --short
git commit -q -m "$MSG

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"

echo "Pushing to GitHub…"
git push -q origin main

echo "Requesting a Pages build…"
gh api -X POST repos/theWHYKINGS/spielmaeuse-am-see.de/pages/builds --jq '.status' || \
  echo "  ! could not request a build — check https://github.com/theWHYKINGS/spielmaeuse-am-see.de/settings/pages"

echo
echo "✅ Pushed. GitHub Pages will rebuild in ~1 minute."
echo "   Live:  https://www.spielmaeuse-am-see.de"
