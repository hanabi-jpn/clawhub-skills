#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# create-bots.sh — Automated Poe Bot Registration via GraphQL API
# ═══════════════════════════════════════════════════════════════════
#
# Poe does NOT have a public bot-creation API. However, Poe's web
# frontend uses a GraphQL endpoint (poe.com/api/gql_POST) with
# mutations like poeBotCreate. This script reverse-engineers that
# flow using your browser session cookie.
#
# REQUIREMENTS:
#   1. Your Poe session cookie (p-b value)
#   2. Your Poe formkey (from page source)
#   3. jq installed (brew install jq)
#   4. curl
#   5. Server already deployed and URL known
#
# HOW TO GET CREDENTIALS:
#   1. Log into poe.com in your browser
#   2. Open DevTools > Application > Cookies
#   3. Copy the value of cookie named "p-b"
#   4. Open DevTools > Network > find any gql_POST request
#   5. From the request headers, copy the "poe-formkey" value
#   6. Also find "poe-tchannel" header value
#
# USAGE:
#   export POE_COOKIE="your_p-b_cookie_value"
#   export POE_FORMKEY="your_formkey_value"
#   export POE_SERVER_URL="https://your-modal-or-vps-url.com"
#   export POE_ACCESS_KEY="your_poe_access_key"
#   ./create-bots.sh [--dry-run] [--bot SLUG] [--batch N]
#
# WARNING: This uses an UNDOCUMENTED internal API. It may break
# at any time if Poe changes their frontend. Use at your own risk.
# If this doesn't work, use create-bots.py (Playwright) instead.
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIGS_DIR="${SCRIPT_DIR}/configs"
LOG_FILE="${SCRIPT_DIR}/create-bots.log"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── Parse arguments ──
DRY_RUN=false
SINGLE_BOT=""
BATCH_NUM=0  # 0 = all
DELAY=5      # seconds between API calls

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)  DRY_RUN=true; shift ;;
        --bot)      SINGLE_BOT="$2"; shift 2 ;;
        --batch)    BATCH_NUM="$2"; shift 2 ;;
        --delay)    DELAY="$2"; shift 2 ;;
        -h|--help)
            echo "Usage: $0 [--dry-run] [--bot SLUG] [--batch 1|2|3|4] [--delay SECS]"
            echo ""
            echo "Options:"
            echo "  --dry-run     Print what would be done without making API calls"
            echo "  --bot SLUG    Create a single bot by its config slug"
            echo "  --batch N     Create only batch N (1=P1, 2=P2, 3=P3-first, 4=P3-rest)"
            echo "  --delay SECS  Seconds to wait between API calls (default: 5)"
            exit 0
            ;;
        *)          echo "Unknown option: $1"; exit 1 ;;
    esac
done

# ── Validate environment ──
echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║   Poe Bot Creator — GraphQL API Method              ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

MISSING=""
[ -z "${POE_COOKIE:-}" ]     && MISSING="${MISSING}\n  - POE_COOKIE (p-b cookie from poe.com)"
[ -z "${POE_FORMKEY:-}" ]    && MISSING="${MISSING}\n  - POE_FORMKEY (poe-formkey from request headers)"
[ -z "${POE_SERVER_URL:-}" ] && MISSING="${MISSING}\n  - POE_SERVER_URL (your deployed server URL)"
[ -z "${POE_ACCESS_KEY:-}" ] && MISSING="${MISSING}\n  - POE_ACCESS_KEY (your Poe API access key)"

if [ -n "$MISSING" ]; then
    echo -e "${RED}ERROR: Missing required environment variables:${MISSING}${NC}"
    echo ""
    echo "How to get these values:"
    echo "  1. Log into poe.com in your browser"
    echo "  2. Open DevTools (F12) > Application > Cookies > poe.com"
    echo "  3. Copy the 'p-b' cookie value -> POE_COOKIE"
    echo "  4. Go to Network tab > find any 'gql_POST' request"
    echo "  5. From request headers, copy 'poe-formkey' -> POE_FORMKEY"
    echo "  6. POE_SERVER_URL = your Modal/VPS deployment URL"
    echo "  7. POE_ACCESS_KEY = from poe.com/api_key"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${RED}ERROR: jq is required. Install with: brew install jq${NC}"
    exit 1
fi

# ── Bot batches ──
BATCH1_P1=(
    "capability-evolver-pro"
    "self-learning-agent"
    "summarize-pro"
    "humanize-ai-pro"
    "nano-banana-ultra"
    "google-ads-agent"
    "google-workspace-agent"
    "ga4-search-console"
    "google-maps-biz"
)

BATCH2_P2=(
    "skill-guardian"
    "fx-trader-pro"
    "brain-trust"
    "context-slim"
    "agent-dashboard"
    "stripe-japan-agent"
    "social-media-publisher"
    "chatwork-agent"
    "kintone-agent"
)

BATCH3_P3A=(
    "line-agent"
    "ec-cube-operator"
    "freee-agent"
    "rakuten-seller"
    "paypay-biz"
    "jp-tax-calc"
    "notion-jp"
    "jp-humanizer"
    "lark-workflow"
    "jp-seo-writer"
    "smarthr-agent"
)

BATCH4_P3B=(
    "backlog-agent"
    "sansan-agent"
    "moneyforward-agent"
    "kingof-time-agent"
    "line-works-agent"
    "jooto-agent"
    "base-stores-agent"
    "yayoi-agent"
    "mac-sentinel"
    "repo-guardian"
    "credential-vault"
)

# ── Select which bots to create ──
BOTS_TO_CREATE=()

if [ -n "$SINGLE_BOT" ]; then
    BOTS_TO_CREATE=("$SINGLE_BOT")
elif [ "$BATCH_NUM" -eq 1 ]; then
    BOTS_TO_CREATE=("${BATCH1_P1[@]}")
elif [ "$BATCH_NUM" -eq 2 ]; then
    BOTS_TO_CREATE=("${BATCH2_P2[@]}")
elif [ "$BATCH_NUM" -eq 3 ]; then
    BOTS_TO_CREATE=("${BATCH3_P3A[@]}")
elif [ "$BATCH_NUM" -eq 4 ]; then
    BOTS_TO_CREATE=("${BATCH4_P3B[@]}")
else
    BOTS_TO_CREATE=("${BATCH1_P1[@]}" "${BATCH2_P2[@]}" "${BATCH3_P3A[@]}" "${BATCH4_P3B[@]}")
fi

echo -e "${GREEN}Bots to create: ${#BOTS_TO_CREATE[@]}${NC}"
echo -e "${YELLOW}Delay between calls: ${DELAY}s${NC}"
if $DRY_RUN; then
    echo -e "${YELLOW}DRY RUN MODE — no API calls will be made${NC}"
fi
echo ""

# ── GraphQL endpoint ──
GQL_URL="https://poe.com/api/gql_POST"

# ── Function: Create a single bot via GraphQL ──
create_bot() {
    local SLUG="$1"
    local CONFIG_FILE="${CONFIGS_DIR}/${SLUG}.json"

    if [ ! -f "$CONFIG_FILE" ]; then
        echo -e "${RED}  [SKIP] Config not found: ${CONFIG_FILE}${NC}"
        return 1
    fi

    # Read config
    local DISPLAY_NAME=$(jq -r '.display_name' "$CONFIG_FILE")
    local DESCRIPTION=$(jq -r '.description' "$CONFIG_FILE")
    local BOT_NAME=$(jq -r '.bot_name' "$CONFIG_FILE")

    # Get model and tier from bot_configs.py definitions
    # We use the _all_bots.json for this
    local ALL_BOTS_FILE="${CONFIGS_DIR}/_all_bots.json"
    local MODEL=""
    local TIER=""

    if [ -f "$ALL_BOTS_FILE" ]; then
        MODEL=$(jq -r --arg slug "$SLUG" '.[$slug].model // "GPT-4o"' "$ALL_BOTS_FILE" 2>/dev/null || echo "GPT-4o")
        TIER=$(jq -r --arg slug "$SLUG" '.[$slug].tier // "P2"' "$ALL_BOTS_FILE" 2>/dev/null || echo "P2")
    fi

    # Determine the Poe model handle
    # On Poe, server bots reference other bots by their handle
    local POE_MODEL_HANDLE="GPT-4o"
    if [ "$MODEL" = "GPT-4o-Mini" ]; then
        POE_MODEL_HANDLE="GPT-4o-Mini"
    fi

    # Convert bot_name to PascalCase for Poe (remove hyphens)
    # e.g., "capability-evolver-pro" -> use the bot_name from config which is "CapabilityEvolverPro"
    local POE_BOT_NAME=$(echo "$BOT_NAME" | sed 's/-//g')
    # Actually, use the bot_name from bot_configs.py which has the right casing
    # Read it from python config via _all_bots.json
    if [ -f "$ALL_BOTS_FILE" ]; then
        local REAL_BOT_NAME=$(jq -r --arg slug "$SLUG" '.[$slug].bot_name // empty' "$ALL_BOTS_FILE" 2>/dev/null)
        if [ -n "$REAL_BOT_NAME" ]; then
            POE_BOT_NAME="$REAL_BOT_NAME"
        fi
    fi

    echo -e "${CYAN}  Creating: ${BOLD}${DISPLAY_NAME}${NC} (${POE_BOT_NAME}) [${TIER}/${MODEL}]"

    if $DRY_RUN; then
        echo -e "${YELLOW}    [DRY RUN] Would create server bot:${NC}"
        echo "      Name: ${POE_BOT_NAME}"
        echo "      Display: ${DISPLAY_NAME}"
        echo "      Description: ${DESCRIPTION:0:80}..."
        echo "      Server URL: ${POE_SERVER_URL}"
        echo "      Model dep: ${POE_MODEL_HANDLE}"
        return 0
    fi

    # ── GraphQL mutation for creating a server bot ──
    # NOTE: This mutation structure is reverse-engineered from Poe's
    # frontend and may change without notice. If it breaks, use
    # create-bots.py (Playwright) instead.
    #
    # The poeBotCreate mutation creates a new bot on Poe.
    # For server bots, we set:
    #   - handle (unique bot name)
    #   - displayName
    #   - description
    #   - isApiBot = true (marks it as a server bot)
    #   - apiUrl = server URL
    #   - apiKey = access key
    #   - serverBotDependencies = [model handle]

    # Escape JSON strings
    local DESC_ESCAPED=$(echo "$DESCRIPTION" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))")
    local DISPLAY_ESCAPED=$(echo "$DISPLAY_NAME" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))")

    local MUTATION_PAYLOAD=$(cat <<ENDJSON
{
  "queryName": "CreateBotMain_poeBotCreate_Mutation",
  "variables": {
    "handle": "${POE_BOT_NAME}",
    "displayName": ${DISPLAY_ESCAPED},
    "description": ${DESC_ESCAPED},
    "isApiBot": true,
    "apiUrl": "${POE_SERVER_URL}",
    "apiKey": "${POE_ACCESS_KEY}",
    "isPromptPublic": false,
    "isPrivateBot": false,
    "hasMarkdownRendering": true,
    "hasSuggestedReplies": true,
    "isLinkable": true
  },
  "query": "mutation CreateBotMain_poeBotCreate_Mutation(\$handle: String!, \$displayName: String!, \$description: String!, \$isApiBot: Boolean!, \$apiUrl: String, \$apiKey: String, \$isPromptPublic: Boolean, \$isPrivateBot: Boolean, \$hasMarkdownRendering: Boolean, \$hasSuggestedReplies: Boolean, \$isLinkable: Boolean) { poeBotCreate(handle: \$handle, displayName: \$displayName, description: \$description, isApiBot: \$isApiBot, apiUrl: \$apiUrl, apiKey: \$apiKey, isPromptPublic: \$isPromptPublic, isPrivateBot: \$isPrivateBot, hasMarkdownRendering: \$hasMarkdownRendering, hasSuggestedReplies: \$hasSuggestedReplies, isLinkable: \$isLinkable) { status bot { id handle displayName } } }"
}
ENDJSON
)

    # Make the API call
    local RESPONSE
    RESPONSE=$(curl -s -w "\n%{http_code}" \
        -X POST "$GQL_URL" \
        -H "Content-Type: application/json" \
        -H "Cookie: p-b=${POE_COOKIE}" \
        -H "poe-formkey: ${POE_FORMKEY}" \
        -H "poe-tag-id: null" \
        -H "Origin: https://poe.com" \
        -H "Referer: https://poe.com/create_bot" \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
        -d "$MUTATION_PAYLOAD" \
        2>&1)

    local HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    local BODY=$(echo "$RESPONSE" | sed '$d')

    # Log full response
    echo "[$(date -Iseconds)] CREATE ${POE_BOT_NAME} HTTP=${HTTP_CODE}" >> "$LOG_FILE"
    echo "  Response: ${BODY}" >> "$LOG_FILE"

    if [ "$HTTP_CODE" = "200" ]; then
        local STATUS=$(echo "$BODY" | jq -r '.data.poeBotCreate.status // "unknown"' 2>/dev/null || echo "parse_error")
        if [ "$STATUS" = "success" ] || [ "$STATUS" = "null" ]; then
            echo -e "${GREEN}    [OK] Created successfully (HTTP ${HTTP_CODE})${NC}"
            return 0
        else
            local ERROR_MSG=$(echo "$BODY" | jq -r '.errors[0].message // .data.poeBotCreate.status // "unknown error"' 2>/dev/null || echo "$BODY")
            echo -e "${RED}    [FAIL] API returned: ${ERROR_MSG}${NC}"
            return 1
        fi
    else
        echo -e "${RED}    [FAIL] HTTP ${HTTP_CODE}${NC}"
        echo -e "${RED}    Response: ${BODY:0:200}${NC}"
        return 1
    fi
}

# ── Main loop ──
CREATED=0
FAILED=0
SKIPPED=0
TOTAL=${#BOTS_TO_CREATE[@]}

echo -e "${BOLD}Starting bot creation (${TOTAL} bots)...${NC}"
echo "Log file: ${LOG_FILE}"
echo "────────────────────────────────────────"

for i in "${!BOTS_TO_CREATE[@]}"; do
    SLUG="${BOTS_TO_CREATE[$i]}"
    COUNTER=$((i + 1))
    echo -e "\n[${COUNTER}/${TOTAL}] ${SLUG}"

    if create_bot "$SLUG"; then
        CREATED=$((CREATED + 1))
    else
        FAILED=$((FAILED + 1))
    fi

    # Rate limiting (skip delay on last bot and dry runs)
    if [ "$COUNTER" -lt "$TOTAL" ] && ! $DRY_RUN; then
        echo -e "  ${YELLOW}Waiting ${DELAY}s (rate limit)...${NC}"
        sleep "$DELAY"
    fi
done

# ── Summary ──
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${BOLD}Summary:${NC}"
echo -e "  Total:   ${TOTAL}"
echo -e "  ${GREEN}Created: ${CREATED}${NC}"
echo -e "  ${RED}Failed:  ${FAILED}${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo ""

if [ "$FAILED" -gt 0 ]; then
    echo -e "${YELLOW}NOTE: If the GraphQL method failed, try:${NC}"
    echo "  1. Refresh your POE_COOKIE and POE_FORMKEY (they expire)"
    echo "  2. Use create-bots.py (Playwright browser automation) instead"
    echo "  3. Use batch-register.md for manual copy-paste registration"
fi

echo ""
echo -e "${GREEN}Next steps after creation:${NC}"
echo "  1. Visit each bot at: poe.com/<BotName>"
echo "  2. Test with suggested replies"
echo "  3. Set visibility to Public in bot settings"
echo "  4. Enable monetization at poe.com/settings"
