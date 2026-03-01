#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# quick-publish.sh
#
# One-shot script to build, publish all 20 @hanabi-jpn MCP server packages
# to npm, and then register them on the MCP Registry.
#
# Usage:
#   ./scripts/quick-publish.sh              # full publish
#   ./scripts/quick-publish.sh --dry-run    # preview without publishing
#
# =============================================================================
#
# PREREQUISITES (manual, one-time setup):
#
#   1. Create an npm account (if you don't have one):
#        npm adduser
#      or sign up at https://www.npmjs.com/signup
#      Username should be: hanabi-jpn
#
#   2. Log in to npm:
#        npm login
#
#   3. Create the @hanabi-jpn organization on npm (required for scoped packages):
#        npm org create hanabi-jpn
#      Or create it at: https://www.npmjs.com/org/create
#      NOTE: Free orgs allow unlimited public packages.
#
#   4. Install mcp-publisher (optional, for MCP Registry):
#        npm install -g mcp-publisher
#      Or: npx mcp-publisher (runs without global install)
#
# =============================================================================

MCP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DRY_RUN=false
SKIP_BUILD=false
SKIP_MCP=false

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------

for arg in "$@"; do
  case "${arg}" in
    --dry-run)
      DRY_RUN=true
      ;;
    --skip-build)
      SKIP_BUILD=true
      ;;
    --skip-mcp)
      SKIP_MCP=true
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --dry-run      Preview without actually publishing"
      echo "  --skip-build   Skip the build step (use existing dist/)"
      echo "  --skip-mcp     Skip MCP Registry registration"
      echo "  --help, -h     Show this help"
      echo ""
      echo "Prerequisites:"
      echo "  npm login                   # authenticate with npm"
      echo "  npm org create hanabi-jpn   # create the @hanabi-jpn org (once)"
      echo "  npm install -g mcp-publisher  # for MCP Registry (optional)"
      exit 0
      ;;
    *)
      echo "Unknown option: ${arg}"
      echo "Use --help for usage information."
      exit 1
      ;;
  esac
done

cd "${MCP_ROOT}"

echo "============================================"
echo "  @hanabi-jpn MCP Servers — Quick Publish"
echo "============================================"
echo ""
echo "  Monorepo: ${MCP_ROOT}"
echo "  Dry run:  ${DRY_RUN}"
echo ""

if ${DRY_RUN}; then
  echo ">>> DRY RUN MODE — no actual publishing will occur <<<"
  echo ""
fi

# ---------------------------------------------------------------------------
# Step 0: Pre-flight checks
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Step 0: Pre-flight checks"
echo "============================================"
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed."
  echo "  Install it from https://nodejs.org/ or via nvm."
  exit 1
fi
echo "[OK] Node.js $(node --version)"

# Check npm
if ! command -v npm &>/dev/null; then
  echo "ERROR: npm is not installed."
  exit 1
fi
echo "[OK] npm $(npm --version)"

# Check npm login status
NPM_USER=""
if NPM_USER=$(npm whoami 2>/dev/null); then
  echo "[OK] npm logged in as: ${NPM_USER}"
else
  echo ""
  echo "ERROR: Not logged in to npm."
  echo ""
  echo "  Run the following command to log in:"
  echo ""
  echo "    npm login"
  echo ""
  echo "  If you don't have an npm account yet:"
  echo "    1. Go to https://www.npmjs.com/signup"
  echo "    2. Create account with username: hanabi-jpn"
  echo "    3. Then run: npm login"
  echo ""
  exit 1
fi

# Check if the @hanabi-jpn scope is accessible
# Try to access the org. If it fails, give instructions.
if ! ${DRY_RUN}; then
  echo ""
  echo "Checking @hanabi-jpn npm scope..."
  # npm org ls will fail if the org doesn't exist
  if npm org ls hanabi-jpn &>/dev/null 2>&1; then
    echo "[OK] @hanabi-jpn organization exists on npm"
  else
    echo ""
    echo "WARNING: The @hanabi-jpn organization may not exist on npm."
    echo ""
    echo "  To create it, run ONE of the following:"
    echo ""
    echo "    Option A (CLI):"
    echo "      npm org create hanabi-jpn"
    echo ""
    echo "    Option B (Web):"
    echo "      Go to https://www.npmjs.com/org/create"
    echo "      Enter org name: hanabi-jpn"
    echo "      Choose: Free (unlimited public packages)"
    echo ""
    echo "  After creating the org, run this script again."
    echo ""
    echo "  NOTE: If you are publishing as a user scope (not org),"
    echo "  this warning can be ignored — your username must match"
    echo "  the scope name 'hanabi-jpn'."
    echo ""
    read -r -p "Continue anyway? [y/N] " response
    case "${response}" in
      [yY][eE][sS]|[yY])
        echo "Continuing..."
        ;;
      *)
        echo "Aborted."
        exit 1
        ;;
    esac
  fi
fi

# Check TypeScript
if ! command -v npx &>/dev/null; then
  echo "ERROR: npx not found. Ensure npm is properly installed."
  exit 1
fi

# Check mcp-publisher (optional)
HAS_MCP_PUBLISHER=false
if command -v mcp-publisher &>/dev/null; then
  echo "[OK] mcp-publisher found (global)"
  HAS_MCP_PUBLISHER=true
elif npx --yes mcp-publisher --version &>/dev/null 2>&1; then
  echo "[OK] mcp-publisher available via npx"
  HAS_MCP_PUBLISHER=true
else
  echo "[INFO] mcp-publisher not found — MCP Registry publishing will be skipped"
  echo "       Install with: npm install -g mcp-publisher"
fi

echo ""

# ---------------------------------------------------------------------------
# Step 1: Install dependencies
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Step 1: Install dependencies"
echo "============================================"
echo ""

if [ ! -d "node_modules" ] || [ ! -d "node_modules/@modelcontextprotocol" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed."
fi

echo ""

# ---------------------------------------------------------------------------
# Step 2: Build all packages
# ---------------------------------------------------------------------------

if ! ${SKIP_BUILD}; then
  echo "============================================"
  echo "  Step 2: Build all packages"
  echo "============================================"
  echo ""

  # Build shared first (if it has source)
  if [ -f "shared/tsconfig.json" ]; then
    echo "Building shared library..."
    (cd shared && npx tsc) || {
      echo "ERROR: shared library build failed."
      exit 1
    }
    echo "[OK] shared built"
    echo ""
  fi

  # Build all workspace packages
  echo "Building all packages..."
  BUILD_FAILED=0
  for pkg_dir in packages/mcp-*; do
    if [ ! -d "${pkg_dir}" ]; then continue; fi
    if [ ! -f "${pkg_dir}/package.json" ]; then continue; fi
    if [ ! -f "${pkg_dir}/tsconfig.json" ]; then continue; fi

    PKG_NAME=$(node -p "require('./${pkg_dir}/package.json').name")
    printf "  Building %-45s" "${PKG_NAME}..."

    if (cd "${pkg_dir}" && npx tsc 2>&1); then
      echo " OK"
    else
      echo " FAILED"
      BUILD_FAILED=$((BUILD_FAILED + 1))
    fi
  done

  echo ""
  if [ ${BUILD_FAILED} -gt 0 ]; then
    echo "ERROR: ${BUILD_FAILED} package(s) failed to build."
    echo "Fix compilation errors before publishing."
    exit 1
  fi
  echo "All packages built successfully."
  echo ""
else
  echo "[SKIP] Build step skipped (--skip-build)"
  echo ""
fi

# ---------------------------------------------------------------------------
# Step 3: Publish each package to npm
# ---------------------------------------------------------------------------

echo "============================================"
echo "  Step 3: Publish packages to npm"
echo "============================================"
echo ""

SUCCESS=0
FAILED=0
SKIPPED=0
TOTAL=0

FAILED_PACKAGES=""

for pkg_dir in packages/mcp-*; do
  if [ ! -d "${pkg_dir}" ]; then continue; fi
  if [ ! -f "${pkg_dir}/package.json" ]; then continue; fi

  TOTAL=$((TOTAL + 1))
  PKG_NAME=$(node -p "require('./${pkg_dir}/package.json').name")
  PKG_VERSION=$(node -p "require('./${pkg_dir}/package.json').version")

  # Check if dist/ exists
  if [ ! -d "${pkg_dir}/dist" ]; then
    echo "[${TOTAL}] SKIP ${PKG_NAME}@${PKG_VERSION} — no dist/ directory (build failed?)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo "[${TOTAL}] ${PKG_NAME}@${PKG_VERSION}"

  if ${DRY_RUN}; then
    echo "    [DRY] npm publish --access public"
    # Actually run --dry-run to verify the package is valid
    if (cd "${pkg_dir}" && npm publish --access public --dry-run 2>&1 | tail -3); then
      echo "    [DRY] Package is valid"
    else
      echo "    [DRY] Package validation failed"
    fi
    SUCCESS=$((SUCCESS + 1))
  else
    if (cd "${pkg_dir}" && npm publish --access public 2>&1); then
      echo "    [OK] Published to npm"
      SUCCESS=$((SUCCESS + 1))
    else
      echo "    [FAIL] npm publish failed (may already exist at this version)"
      FAILED=$((FAILED + 1))
      FAILED_PACKAGES="${FAILED_PACKAGES}  - ${PKG_NAME}@${PKG_VERSION}\n"
    fi

    # Rate limit: wait between publishes to avoid npm throttling
    if [ ${TOTAL} -lt 20 ]; then
      sleep 3
    fi
  fi

  echo ""
done

echo "--------------------------------------------"
echo "  npm Publish Summary"
echo "--------------------------------------------"
echo "  Total:    ${TOTAL}"
echo "  Success:  ${SUCCESS}"
echo "  Failed:   ${FAILED}"
echo "  Skipped:  ${SKIPPED}"
echo ""

if [ -n "${FAILED_PACKAGES}" ]; then
  echo "Failed packages:"
  printf "${FAILED_PACKAGES}"
  echo ""
fi

# ---------------------------------------------------------------------------
# Step 4: Register with MCP Registry
# ---------------------------------------------------------------------------

if ! ${SKIP_MCP} && ${HAS_MCP_PUBLISHER}; then
  echo "============================================"
  echo "  Step 4: Register on MCP Registry"
  echo "============================================"
  echo ""

  MCP_SUCCESS=0
  MCP_FAILED=0
  MCP_TOTAL=0

  for pkg_dir in packages/mcp-*; do
    if [ ! -d "${pkg_dir}" ]; then continue; fi
    if [ ! -f "${pkg_dir}/server.json" ]; then continue; fi

    MCP_TOTAL=$((MCP_TOTAL + 1))
    PKG_NAME=$(node -p "require('./${pkg_dir}/package.json').name")

    echo "[${MCP_TOTAL}] Registering ${PKG_NAME} on MCP Registry..."

    if ${DRY_RUN}; then
      echo "    [DRY] mcp-publisher publish (skipped)"
      MCP_SUCCESS=$((MCP_SUCCESS + 1))
    else
      # Retry up to 3 times for rate limiting
      REGISTERED=false
      for attempt in 1 2 3; do
        if (cd "${pkg_dir}" && npx --yes mcp-publisher publish 2>&1); then
          echo "    [OK] Registered on MCP Registry"
          REGISTERED=true
          break
        else
          if [ ${attempt} -lt 3 ]; then
            echo "    [RETRY] Attempt ${attempt} failed, waiting 10s..."
            sleep 10
          else
            echo "    [FAIL] MCP Registry registration failed after 3 attempts"
          fi
        fi
      done

      if ${REGISTERED}; then
        MCP_SUCCESS=$((MCP_SUCCESS + 1))
      else
        MCP_FAILED=$((MCP_FAILED + 1))
      fi

      # Rate limit between registrations
      sleep 2
    fi
  done

  echo ""
  echo "--------------------------------------------"
  echo "  MCP Registry Summary"
  echo "--------------------------------------------"
  echo "  Total:    ${MCP_TOTAL}"
  echo "  Success:  ${MCP_SUCCESS}"
  echo "  Failed:   ${MCP_FAILED}"
  echo ""
elif ${SKIP_MCP}; then
  echo "[SKIP] MCP Registry registration skipped (--skip-mcp)"
  echo ""
else
  echo "[SKIP] MCP Registry registration skipped (mcp-publisher not available)"
  echo "       Install with: npm install -g mcp-publisher"
  echo "       Or run separately: ./scripts/register-mcp.sh"
  echo ""
fi

# ---------------------------------------------------------------------------
# Final summary
# ---------------------------------------------------------------------------

echo "============================================"
echo "  DONE"
echo "============================================"
echo ""

if ${DRY_RUN}; then
  echo "This was a DRY RUN. No packages were actually published."
  echo ""
  echo "When ready, run without --dry-run:"
  echo "  ./scripts/quick-publish.sh"
else
  echo "Published ${SUCCESS}/${TOTAL} packages to npm."
  if [ ${FAILED} -gt 0 ]; then
    echo ""
    echo "To republish failed packages, bump the version in their package.json"
    echo "and run this script again, or publish individually:"
    echo "  cd packages/mcp-<name> && npm publish --access public"
  fi
fi

echo ""
echo "Verify published packages at:"
echo "  https://www.npmjs.com/org/hanabi-jpn"
echo ""
echo "Each package can be installed with:"
echo "  npx @hanabi-jpn/mcp-<name>"
echo ""
