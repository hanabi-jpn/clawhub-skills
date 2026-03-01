#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# register-mcp.sh
#
# Registers all 20 @hanabi-jpn MCP server packages on the MCP Registry
# using the mcp-publisher CLI tool and each package's server.json manifest.
#
# Usage:
#   ./scripts/register-mcp.sh              # register all packages
#   ./scripts/register-mcp.sh --dry-run    # preview without registering
#   ./scripts/register-mcp.sh --package mcp-fx-trader-pro   # single package
#
# =============================================================================
#
# PREREQUISITES:
#
#   1. Packages must be published to npm first:
#        ./scripts/quick-publish.sh
#
#   2. mcp-publisher is installed automatically via npx if not present.
#      Or install globally:
#        npm install -g mcp-publisher
#
#   3. You may need to authenticate with the MCP Registry:
#        npx mcp-publisher login
#      (Follow the prompts to authenticate via GitHub)
#
# =============================================================================

MCP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DRY_RUN=false
SINGLE_PACKAGE=""
MAX_RETRIES=3
RETRY_DELAY=10
RATE_LIMIT_DELAY=3

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --package)
      SINGLE_PACKAGE="$2"
      shift 2
      ;;
    --retries)
      MAX_RETRIES="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --dry-run              Preview without registering"
      echo "  --package <name>       Register a single package (e.g., mcp-fx-trader-pro)"
      echo "  --retries <n>          Max retry attempts per package (default: 3)"
      echo "  --help, -h             Show this help"
      echo ""
      echo "Examples:"
      echo "  $0                                        # register all 20 packages"
      echo "  $0 --package mcp-fx-trader-pro            # register one package"
      echo "  $0 --dry-run                              # preview mode"
      echo ""
      echo "Prerequisites:"
      echo "  1. Publish packages to npm first: ./scripts/quick-publish.sh"
      echo "  2. Authenticate: npx mcp-publisher login"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information."
      exit 1
      ;;
  esac
done

cd "${MCP_ROOT}"

echo "============================================"
echo "  @hanabi-jpn MCP Registry Registration"
echo "============================================"
echo ""

if ${DRY_RUN}; then
  echo ">>> DRY RUN MODE — no actual registration will occur <<<"
  echo ""
fi

# ---------------------------------------------------------------------------
# Step 1: Ensure mcp-publisher is available
# ---------------------------------------------------------------------------

echo "Checking mcp-publisher..."

MCP_CMD=""

if command -v mcp-publisher &>/dev/null; then
  MCP_CMD="mcp-publisher"
  echo "[OK] mcp-publisher found (global): $(mcp-publisher --version 2>/dev/null || echo 'version unknown')"
else
  echo "[INFO] mcp-publisher not installed globally."
  echo "       Installing via npx on first use..."
  echo ""

  # Pre-install so it's cached for all subsequent calls
  if npx --yes mcp-publisher --version &>/dev/null 2>&1; then
    MCP_CMD="npx --yes mcp-publisher"
    echo "[OK] mcp-publisher available via npx"
  else
    echo ""
    echo "ERROR: Failed to install mcp-publisher."
    echo ""
    echo "  Install manually:"
    echo "    npm install -g mcp-publisher"
    echo ""
    echo "  Then run this script again."
    exit 1
  fi
fi

echo ""

# ---------------------------------------------------------------------------
# Step 2: Check authentication
# ---------------------------------------------------------------------------

echo "Checking MCP Registry authentication..."
# Note: mcp-publisher may not have a 'whoami' command.
# We'll detect auth failures during publish and provide instructions.
echo "[INFO] Authentication will be verified during first publish attempt."
echo "       If you see auth errors, run: ${MCP_CMD} login"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Register packages
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Registering packages"
echo "============================================"
echo ""

SUCCESS=0
FAILED=0
SKIPPED=0
TOTAL=0
FAILED_PACKAGES=""

# Build list of packages to process
PACKAGE_DIRS=()
if [ -n "${SINGLE_PACKAGE}" ]; then
  # Single package mode
  TARGET_DIR="packages/${SINGLE_PACKAGE}"
  if [ ! -d "${TARGET_DIR}" ]; then
    echo "ERROR: Package directory not found: ${TARGET_DIR}"
    echo ""
    echo "Available packages:"
    ls -1 packages/ | sed 's/^/  /'
    exit 1
  fi
  PACKAGE_DIRS=("${TARGET_DIR}")
else
  # All packages
  for pkg_dir in packages/mcp-*; do
    if [ -d "${pkg_dir}" ]; then
      PACKAGE_DIRS+=("${pkg_dir}")
    fi
  done
fi

for pkg_dir in "${PACKAGE_DIRS[@]}"; do
  if [ ! -f "${pkg_dir}/server.json" ]; then
    echo "[SKIP] ${pkg_dir} — no server.json"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  TOTAL=$((TOTAL + 1))
  PKG_NAME=$(node -p "require('./${pkg_dir}/package.json').name" 2>/dev/null || basename "${pkg_dir}")
  MCP_NAME=$(node -p "require('./${pkg_dir}/server.json').name" 2>/dev/null || echo "unknown")
  PKG_VERSION=$(node -p "require('./${pkg_dir}/package.json').version" 2>/dev/null || echo "0.0.0")

  echo "[${TOTAL}] ${PKG_NAME}@${PKG_VERSION}"
  echo "    MCP name: ${MCP_NAME}"
  echo "    server.json: ${pkg_dir}/server.json"

  if ${DRY_RUN}; then
    echo "    [DRY] Would run: ${MCP_CMD} publish"
    echo "    [DRY] server.json contents:"
    node -e "const s = require('./${pkg_dir}/server.json'); console.log('      Name:', s.name); console.log('      Packages:', (s.packages||[]).length); console.log('      Transport:', s.packages?.[0]?.transport?.type || 'unknown');" 2>/dev/null || echo "      (could not parse server.json)"
    SUCCESS=$((SUCCESS + 1))
    echo ""
    continue
  fi

  # Attempt to register with retry logic
  REGISTERED=false
  LAST_ERROR=""

  for attempt in $(seq 1 "${MAX_RETRIES}"); do
    echo "    Attempt ${attempt}/${MAX_RETRIES}..."

    # Run mcp-publisher publish from the package directory
    if OUTPUT=$(cd "${pkg_dir}" && ${MCP_CMD} publish 2>&1); then
      echo "    [OK] Registered on MCP Registry"
      REGISTERED=true
      break
    else
      LAST_ERROR="${OUTPUT}"

      # Check if this is a rate limit error (HTTP 429)
      if echo "${OUTPUT}" | grep -qi "rate.limit\|429\|too.many.requests\|throttl"; then
        if [ "${attempt}" -lt "${MAX_RETRIES}" ]; then
          WAIT=$((RETRY_DELAY * attempt))
          echo "    [RATE LIMITED] Waiting ${WAIT}s before retry..."
          sleep "${WAIT}"
          continue
        fi
      fi

      # Check if this is an auth error
      if echo "${OUTPUT}" | grep -qi "auth\|unauthorized\|401\|403\|login\|token"; then
        echo "    [AUTH ERROR] Not authenticated with MCP Registry."
        echo ""
        echo "    Run the following to authenticate:"
        echo "      ${MCP_CMD} login"
        echo ""
        echo "    Then run this script again."
        exit 1
      fi

      # Check if already registered (not an error)
      if echo "${OUTPUT}" | grep -qi "already.registered\|already.exists\|conflict\|409"; then
        echo "    [OK] Already registered (skipping)"
        REGISTERED=true
        break
      fi

      # Generic error — retry with backoff
      if [ "${attempt}" -lt "${MAX_RETRIES}" ]; then
        WAIT=$((RETRY_DELAY * attempt))
        echo "    [FAIL] Attempt ${attempt} failed. Retrying in ${WAIT}s..."
        echo "    Error: $(echo "${LAST_ERROR}" | head -1)"
        sleep "${WAIT}"
      else
        echo "    [FAIL] All ${MAX_RETRIES} attempts failed."
        echo "    Last error: $(echo "${LAST_ERROR}" | head -3)"
      fi
    fi
  done

  if ${REGISTERED}; then
    SUCCESS=$((SUCCESS + 1))
  else
    FAILED=$((FAILED + 1))
    FAILED_PACKAGES="${FAILED_PACKAGES}  - ${PKG_NAME} (${MCP_NAME})\n"
  fi

  # Rate limit between packages
  if ! ${DRY_RUN} && [ ${TOTAL} -lt ${#PACKAGE_DIRS[@]} ]; then
    sleep "${RATE_LIMIT_DELAY}"
  fi

  echo ""
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo "============================================"
echo "  MCP Registry Summary"
echo "============================================"
echo "  Total:    ${TOTAL}"
echo "  Success:  ${SUCCESS}"
echo "  Failed:   ${FAILED}"
echo "  Skipped:  ${SKIPPED}"
echo ""

if [ -n "${FAILED_PACKAGES}" ]; then
  echo "Failed packages:"
  printf "${FAILED_PACKAGES}"
  echo ""
  echo "To retry failed packages individually:"
  echo "  ./scripts/register-mcp.sh --package <package-name>"
  echo ""
fi

if ${DRY_RUN}; then
  echo "This was a DRY RUN. No packages were actually registered."
  echo ""
  echo "When ready, run without --dry-run:"
  echo "  ./scripts/register-mcp.sh"
fi

if [ ${FAILED} -gt 0 ]; then
  exit 1
fi

echo "All packages registered successfully on MCP Registry."
echo ""
echo "Verify at: https://registry.modelcontextprotocol.io/"
echo "Search for: hanabi-jpn"
echo ""
