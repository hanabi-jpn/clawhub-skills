#!/bin/bash
#
# Coze Bot Batch Creator - Convenience Launcher
# ================================================
# Creates 40 bots on Coze using either API or browser automation.
#
# Usage:
#   ./create-bots.sh              # API mode (reads .env)
#   ./create-bots.sh --browser    # Browser automation mode
#   ./create-bots.sh --dry-run    # Dry run
#   ./create-bots.sh --help       # Show help
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[92m'
RED='\033[91m'
YELLOW='\033[93m'
BLUE='\033[94m'
CYAN='\033[96m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}============================================================"
echo "  Coze Bot Batch Creator"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "============================================================${RESET}"
echo ""

# ─── Parse arguments ──────────────────────────────────────────────────────────

MODE="api"
EXTRA_ARGS=()

for arg in "$@"; do
    case "$arg" in
        --browser|-b)
            MODE="browser"
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --browser, -b    Use browser automation (Playwright)"
            echo "  --dry-run, -n    Simulate without making changes"
            echo "  --login          Browser mode: open browser for login"
            echo "  --headed         Browser mode: show browser window"
            echo "  --start N        Start from bot index N (0-based)"
            echo "  --limit N        Create only N bots"
            echo "  --validate-only  API mode: only validate token"
            echo "  --publish        API mode: auto-publish after creation"
            echo "  --help, -h       Show this help"
            echo ""
            echo "Setup:"
            echo "  1. cp .env.example .env"
            echo "  2. Edit .env with your token and space_id"
            echo "  3. Run: ./create-bots.sh"
            echo ""
            echo "Get your token at: https://www.coze.com/open/api"
            exit 0
            ;;
        *)
            EXTRA_ARGS+=("$arg")
            ;;
    esac
done

# ─── Load .env ────────────────────────────────────────────────────────────────

if [ -f "$SCRIPT_DIR/.env" ]; then
    echo -e "${BLUE}[INFO]${RESET} Loading .env file..."
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
fi

# ─── Check Python ─────────────────────────────────────────────────────────────

if ! command -v python3 &>/dev/null; then
    echo -e "${RED}[ERR]${RESET} python3 not found. Please install Python 3.8+."
    exit 1
fi

PYTHON_VER=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo -e "${BLUE}[INFO]${RESET} Python: $PYTHON_VER"

# ─── Run ──────────────────────────────────────────────────────────────────────

if [ "$MODE" = "api" ]; then
    echo -e "${BLUE}[INFO]${RESET} Mode: API"
    echo ""

    # Check for token
    if [ -z "${COZE_API_TOKEN:-}" ]; then
        echo -e "${YELLOW}[WARN]${RESET} No COZE_API_TOKEN in environment or .env"
        echo ""
        echo "  Options:"
        echo "    1. Set up .env file:   cp .env.example .env && edit .env"
        echo "    2. Pass directly:      python3 create_bots_api.py --token pat_xxx --space-id 123"
        echo "    3. Use browser mode:   ./create-bots.sh --browser"
        echo ""
    fi

    python3 "$SCRIPT_DIR/create_bots_api.py" "${EXTRA_ARGS[@]}"

elif [ "$MODE" = "browser" ]; then
    echo -e "${BLUE}[INFO]${RESET} Mode: Browser Automation (Playwright)"
    echo ""

    # Check Playwright
    if ! python3 -c "import playwright" 2>/dev/null; then
        echo -e "${YELLOW}[WARN]${RESET} Playwright not installed. Installing..."
        pip install playwright
        playwright install chromium
        echo ""
    fi

    python3 "$SCRIPT_DIR/create_bots_browser.py" "${EXTRA_ARGS[@]}"
fi
