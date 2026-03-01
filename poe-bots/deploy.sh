#!/bin/bash
# ─────────────────────────────────────────────────────────
# Deploy hanabi-jpn Poe Bots to Modal
# ─────────────────────────────────────────────────────────
#
# Prerequisites:
#   1. Install Modal:   pip install modal
#   2. Authenticate:    modal token new
#   3. Create secret:   modal secret create poe-access-key POE_ACCESS_KEY=your_key
#
# Usage:
#   ./deploy.sh         — Deploy to Modal
#   ./deploy.sh local   — Run locally on port 8080
# ─────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   hanabi-jpn Poe Bots — Deployment Script   ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# Step 0: Extract prompts (ensure configs/ is up to date)
echo -e "${YELLOW}[1/4] Extracting system prompts from SKILL.md files...${NC}"
python3 extract_prompts.py
echo ""

# Step 1: Verify configs
CONFIG_COUNT=$(ls configs/*.json 2>/dev/null | grep -v _all_bots | wc -l | tr -d ' ')
echo -e "${GREEN}[2/4] Found ${CONFIG_COUNT} bot configurations${NC}"

if [ "$CONFIG_COUNT" -lt 20 ]; then
    echo -e "${RED}ERROR: Expected 20 configs, found ${CONFIG_COUNT}. Check extract_prompts.py output.${NC}"
    exit 1
fi

# Step 2: Install dependencies
echo -e "${YELLOW}[3/4] Installing dependencies...${NC}"
pip install -q -r requirements.txt
echo ""

# Step 3: Deploy or run locally
if [ "${1:-}" = "local" ]; then
    echo -e "${CYAN}[4/4] Starting local server on port 8080...${NC}"
    echo -e "${YELLOW}NOTE: Set POE_ACCESS_KEY before running:${NC}"
    echo "  export POE_ACCESS_KEY=your_key_here"
    echo ""
    python3 server.py
else
    echo -e "${CYAN}[4/4] Deploying to Modal...${NC}"

    # Check Modal is installed
    if ! command -v modal &> /dev/null; then
        echo -e "${YELLOW}Modal not found. Installing...${NC}"
        pip install modal
    fi

    # Check Modal auth
    if ! modal token list &> /dev/null; then
        echo -e "${RED}Modal not authenticated. Run: modal token new${NC}"
        exit 1
    fi

    # Deploy
    modal deploy server.py

    echo ""
    echo -e "${GREEN}Deployment complete!${NC}"
    echo -e "Your bots are now accessible at the Modal-provided URL."
    echo -e "Register each bot at: ${CYAN}https://poe.com/create_bot${NC}"
fi
