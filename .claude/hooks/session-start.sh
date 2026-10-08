#!/bin/bash
# Session start: make sure a cloud session can run `npm test` (needed by the
# push guard) and tools/build-share-card.py from the first command.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# The test suite uses only Node built-ins (node:test), which needs Node 18+.
node_major=$(node -p 'process.versions.node.split(".")[0]')
if [ "$node_major" -lt 18 ]; then
  echo "Node $node_major is too old for the test suite; need 18+." >&2
  exit 1
fi

# No npm dependencies today; install them if any are ever added.
if node -e 'const p=require("./package.json");process.exit(Object.keys({...p.dependencies,...p.devDependencies}).length?0:1)'; then
  npm install --no-audit --no-fund
fi

# tools/build-share-card.py redraws the share card and banner with Pillow.
python3 -c 'import PIL' 2>/dev/null || pip install --quiet Pillow
