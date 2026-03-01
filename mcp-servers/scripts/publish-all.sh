#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# publish-all.sh
#
# Build, publish to npm, and register with MCP Registry for all packages.
#
# Usage:
#   ./scripts/publish-all.sh [--dry-run]
#
# Prerequisites:
#   - npm login (for @hanabi-jpn scope)
#   - mcp-publisher installed (for MCP Registry)
# =============================================================================

MCP_ROOT="/Users/ishiharatatsuya/clawhub-skills/mcp-servers"
DRY_RUN=false

if [ "${1:-}" = "--dry-run" ]; then
  DRY_RUN=true
  echo "=== DRY RUN MODE — no actual publishing ==="
  echo ""
fi

cd "${MCP_ROOT}"

# ---------------------------------------------------------------------------
# Step 1: Build all packages
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Step 1: Build all packages"
echo "============================================"

if ! npm run build --workspaces 2>&1; then
  echo ""
  echo "ERROR: Build failed. Fix compilation errors before publishing."
  exit 1
fi

echo ""
echo "Build successful."
echo ""

# ---------------------------------------------------------------------------
# Step 2: Publish each package
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Step 2: Publish packages"
echo "============================================"
echo ""

SUCCESS=0
FAILED=0
TOTAL=0

for pkg_dir in packages/mcp-*; do
  if [ ! -d "${pkg_dir}" ]; then continue; fi
  if [ ! -f "${pkg_dir}/package.json" ]; then continue; fi

  TOTAL=$((TOTAL + 1))
  PKG_NAME=$(node -p "require('./${pkg_dir}/package.json').name")
  PKG_VERSION=$(node -p "require('./${pkg_dir}/package.json').version")

  echo "[${TOTAL}] Publishing ${PKG_NAME}@${PKG_VERSION}"
  echo "    Directory: ${pkg_dir}"

  # --- npm publish ---
  if ${DRY_RUN}; then
    echo "    [DRY] npm publish --access public (skipped)"
  else
    if (cd "${pkg_dir}" && npm publish --access public 2>&1); then
      echo "    [OK]  npm publish"
    else
      echo "    [FAIL] npm publish — may already be published at this version"
      FAILED=$((FAILED + 1))
      continue
    fi
  fi

  # --- MCP Registry publish ---
  if [ -f "${pkg_dir}/server.json" ]; then
    if ${DRY_RUN}; then
      echo "    [DRY] mcp-publisher publish (skipped)"
    else
      if command -v mcp-publisher &>/dev/null; then
        if (cd "${pkg_dir}" && mcp-publisher publish 2>&1); then
          echo "    [OK]  MCP Registry published"
        else
          echo "    [WARN] MCP Registry publish failed (non-critical)"
        fi
      else
        echo "    [SKIP] mcp-publisher not installed — skipping MCP Registry"
      fi
    fi
  fi

  SUCCESS=$((SUCCESS + 1))
  echo ""

  # Rate limit between publishes
  if ! ${DRY_RUN}; then
    echo "    Waiting 5s before next publish..."
    sleep 5
  fi
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Publishing Summary"
echo "============================================"
echo "  Total:    ${TOTAL}"
echo "  Success:  ${SUCCESS}"
echo "  Failed:   ${FAILED}"
echo ""

if ${DRY_RUN}; then
  echo "This was a DRY RUN. No packages were actually published."
  echo "Remove --dry-run to publish for real."
fi

if [ ${FAILED} -gt 0 ]; then
  echo "WARNING: ${FAILED} packages failed to publish."
  exit 1
fi

echo "Done! All packages published successfully."
