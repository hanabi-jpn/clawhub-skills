#!/usr/bin/env bash
# Bulk publish all MCP packages to npmjs.com
set -euo pipefail

PACKAGES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/packages"
SUCCESS=0
FAIL=0
SKIP=0
TOTAL=$(ls -d "$PACKAGES_DIR"/mcp-* 2>/dev/null | wc -l | tr -d ' ')

echo "╔══════════════════════════════════════════════════╗"
echo "║  MCP Publisher → npmjs.com — $TOTAL packages     ║"
echo "╚══════════════════════════════════════════════════╝"

for pkg_dir in "$PACKAGES_DIR"/mcp-*; do
    pkg_name=$(basename "$pkg_dir")
    NUM=$((SUCCESS + FAIL + SKIP + 1))
    echo -n "[$NUM/$TOTAL] $pkg_name ... "

    cd "$pkg_dir"

    # Install deps silently
    npm install 2>/dev/null 1>/dev/null || true

    # Build
    if npx tsc 2>/dev/null; then
        # Publish to npmjs.com (default registry)
        OUTPUT=$(npm publish --access public 2>&1) && {
            echo "PUBLISHED ✓"
            SUCCESS=$((SUCCESS + 1))
        } || {
            if echo "$OUTPUT" | grep -q "already exists\|EPUBLISHCONFLICT\|previously published"; then
                echo "SKIP (exists)"
                SKIP=$((SKIP + 1))
            elif echo "$OUTPUT" | grep -q "403\|402\|payment"; then
                echo "FAIL (scoped pkg needs --access public or paid)"
                FAIL=$((FAIL + 1))
            else
                echo "FAIL: $(echo "$OUTPUT" | grep -i error | head -1)"
                FAIL=$((FAIL + 1))
            fi
        }
    else
        echo "FAIL (build)"
        FAIL=$((FAIL + 1))
    fi
done

echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✓ Published: $SUCCESS  → Skipped: $SKIP  ✗ Failed: $FAIL  (Total: $TOTAL)"
echo "════════════════════════════════════════════════════════"
