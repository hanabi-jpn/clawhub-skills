#!/usr/bin/env bash
# ============================================================================
# LobeHub Agent Submission Script
# Submit 43 ClawHub skills as LobeHub agents (5 packs)
#
# Usage:
#   ./submit.sh                 # Interactive mode
#   ./submit.sh --auto          # Automatic fork + PR mode (requires gh CLI)
#   ./submit.sh --manual        # Print manual submission instructions
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_JSON="$SCRIPT_DIR/agents.json"
GITHUB_USER="hanabi-jpn"
LOBEHUB_REPO="lobehub/lobe-chat-agents"
FORK_DIR="/tmp/lobe-chat-agents-fork"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ============================================================================
# Pre-flight checks
# ============================================================================

check_prerequisites() {
    log_info "Checking prerequisites..."

    if [ ! -f "$AGENTS_JSON" ]; then
        log_error "agents.json not found at $AGENTS_JSON"
        exit 1
    fi

    AGENT_COUNT=$(python3 -c "import json; d=json.load(open('$AGENTS_JSON')); print(len(d.get('agents', d) if isinstance(d, dict) else d))" 2>/dev/null || echo "0")
    if [ "$AGENT_COUNT" -lt 43 ]; then
        log_error "Expected at least 43 agents in agents.json, found $AGENT_COUNT"
        exit 1
    fi
    log_ok "agents.json validated: $AGENT_COUNT agents"

    if command -v gh &>/dev/null; then
        log_ok "GitHub CLI (gh) found"
        GH_AVAILABLE=true
    else
        log_warn "GitHub CLI (gh) not found. Automatic PR creation unavailable."
        GH_AVAILABLE=false
    fi

    if command -v git &>/dev/null; then
        log_ok "git found"
    else
        log_error "git is required but not found"
        exit 1
    fi

    if command -v python3 &>/dev/null; then
        log_ok "python3 found"
    else
        log_error "python3 is required but not found"
        exit 1
    fi
}

# ============================================================================
# Method 1: Automatic Fork + PR (requires gh CLI)
# ============================================================================

auto_submit() {
    log_info "=== Automatic Submission Mode ==="

    if [ "$GH_AVAILABLE" != "true" ]; then
        log_error "GitHub CLI (gh) is required for automatic submission."
        log_info "Install with: brew install gh && gh auth login"
        log_info "Or use --manual for manual instructions."
        exit 1
    fi

    # Step 1: Fork the repo
    log_info "Step 1/5: Forking $LOBEHUB_REPO..."
    gh repo fork "$LOBEHUB_REPO" --clone --remote 2>/dev/null || true

    # Step 2: Clone or use existing fork
    if [ -d "$FORK_DIR" ]; then
        log_info "Using existing fork at $FORK_DIR"
        cd "$FORK_DIR"
        git checkout main 2>/dev/null || git checkout master
        git pull origin main 2>/dev/null || git pull origin master
    else
        log_info "Cloning fork..."
        gh repo clone "$GITHUB_USER/lobe-chat-agents" "$FORK_DIR" 2>/dev/null || \
            git clone "https://github.com/$GITHUB_USER/lobe-chat-agents.git" "$FORK_DIR"
        cd "$FORK_DIR"
    fi

    # Step 3: Create branch
    BRANCH="add-clawhub-skills-$(date +%Y%m%d)"
    log_info "Step 2/5: Creating branch $BRANCH..."
    git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"

    # Step 4: Generate individual agent files
    log_info "Step 3/5: Generating agent files..."
    AGENTS_JSON="$AGENTS_JSON" python3 << 'PYTHON_SCRIPT'
import json, os

agents_path = os.environ.get("AGENTS_JSON", "agents.json")
with open(agents_path) as f:
    data = json.load(f)

# Support both schemaVersion-1 wrapper and flat array
agents = data.get("agents", data) if isinstance(data, dict) else data

# LobeHub expects individual JSON files per agent in src/ directory
src_dir = "src"
os.makedirs(src_dir, exist_ok=True)

for agent in agents:
    agent_file = os.path.join(src_dir, f"{agent['identifier']}.json")
    agent_data = {
        "author": agent.get("author", "hanabi-jpn"),
        "config": agent.get("config", {"systemRole": agent.get("systemRole", "")}),
        "createdAt": agent.get("createdAt", "2026-03-02"),
        "homepage": agent.get("homepage", f"https://github.com/hanabi-jpn/clawhub-skills/tree/main/{agent['identifier']}"),
        "identifier": agent["identifier"],
        "meta": agent.get("meta", {
            "avatar": "🤖",
            "description": agent.get("description", ""),
            "tags": agent.get("tags", []),
            "title": agent.get("title", agent["identifier"])
        }),
        "schemaVersion": 1
    }
    with open(agent_file, "w") as f:
        json.dump(agent_data, f, indent=2, ensure_ascii=False)
    print(f"  Created: {agent_file}")

print(f"\nTotal: {len(agents)} agent files created")
PYTHON_SCRIPT

    # Step 5: Commit and push
    log_info "Step 4/5: Committing changes..."
    git add -A
    git commit -m "feat: add 43 ClawHub AI agent skills by hanabi-jpn

Add 43 specialized AI agent skills organized in 5 packs:
- ec-master-pack (9): Amazon, Rakuten, Yahoo, Shopify, EC-CUBE, etc.
- finance-accounting-pack (10): freee, MoneyForward, Yayoi, PayPay, e-Tax, etc.
- marketing-growth-pack (8): GA4, Google Ads, HubSpot, SEO, Humanizer, etc.
- business-ops-pack (13): LINE, Slack, kintone, Backlog, SmartHR, etc.
- security-devops-pack (3): Mac Sentinel, Repo Guardian, Credential Vault

All skills by hanabi-jpn - https://github.com/hanabi-jpn/clawhub-skills"

    log_info "Step 5/5: Pushing and creating PR..."
    git push origin "$BRANCH"

    gh pr create \
        --title "feat: add 43 ClawHub AI agent skills by hanabi-jpn" \
        --body "## Summary

This PR adds 43 specialized AI agent skills from [ClawHub Skills](https://github.com/hanabi-jpn/clawhub-skills) by hanabi-jpn, organized in 5 packs.

### Packs
- **ec-master-pack** (9): Amazon Japan, Rakuten, Yahoo Shopping, Shopify Japan, EC-CUBE, MakeShop, Mercari Shops, BASE/STORES, Stripe Japan
- **finance-accounting-pack** (10): freee, MoneyForward, Yayoi, PayPay Biz, JP Tax Calc, e-Tax, Japan Invoice, Misoca, AirPay, Square Japan
- **marketing-growth-pack** (8): GA4 Search Console, Google Ads, Google Maps Biz, HubSpot Japan, JP Humanizer, JP SEO Writer, Sansan, Social Media Publisher
- **business-ops-pack** (13): LINE, LINE WORKS, Slack Japan, kintone, Backlog, Chatwork, SmartHR, Notion JP, Google Workspace, KING OF TIME, Jooto, Lark Workflow, Cybozu Garoon
- **security-devops-pack** (3): Mac Sentinel, Repo Guardian, Credential Vault

### All agents include
- Full system prompts extracted from SKILL.md
- Proper tags, descriptions, and pack-specific avatars
- Author attribution to hanabi-jpn

Generated with ClawHub Skills LobeHub submission tool." \
        --repo "$LOBEHUB_REPO"

    log_ok "PR created successfully!"
}

# ============================================================================
# Method 2: Manual submission instructions
# ============================================================================

manual_submit() {
    echo ""
    echo "============================================================"
    echo "  LobeHub Manual Submission Instructions"
    echo "============================================================"
    echo ""
    echo "The agents.json file is ready at:"
    echo "  $AGENTS_JSON"
    echo ""
    echo "It contains 43 agents formatted for LobeHub."
    echo ""
    echo "=== Option A: Submit via GitHub PR ==="
    echo ""
    echo "1. Fork https://github.com/lobehub/lobe-chat-agents"
    echo ""
    echo "2. Clone your fork:"
    echo "   git clone https://github.com/$GITHUB_USER/lobe-chat-agents.git"
    echo "   cd lobe-chat-agents"
    echo ""
    echo "3. Create a branch:"
    echo "   git checkout -b add-clawhub-skills"
    echo ""
    echo "4. Copy individual agent JSON files to src/:"
    echo "   python3 -c \""
    echo "   import json, os"
    echo "   with open('$AGENTS_JSON') as f:"
    echo "       data = json.load(f)"
    echo "   agents = data.get('agents', data) if isinstance(data, dict) else data"
    echo "   for a in agents:"
    echo "       with open(f'src/{a[\"identifier\"]}.json', 'w') as out:"
    echo "           json.dump({"
    echo "               'author': a.get('author', 'hanabi-jpn'),"
    echo "               'config': a.get('config', {}),"
    echo "               'createdAt': a.get('createdAt', '2026-03-02'),"
    echo "               'homepage': a.get('homepage', ''),"
    echo "               'identifier': a['identifier'],"
    echo "               'meta': a.get('meta', {}),"
    echo "               'schemaVersion': 1"
    echo "           }, out, indent=2, ensure_ascii=False)"
    echo "   \""
    echo ""
    echo "5. Commit and push:"
    echo "   git add -A"
    echo "   git commit -m 'feat: add 43 ClawHub AI agent skills'"
    echo "   git push origin add-clawhub-skills"
    echo ""
    echo "6. Create a PR at:"
    echo "   https://github.com/lobehub/lobe-chat-agents/compare"
    echo ""
    echo "=== Option B: Submit via LobeHub Agent Market Website ==="
    echo ""
    echo "1. Visit https://chat-agents.lobehub.com/submit"
    echo "2. Fill in agent details from agents.json"
    echo "3. Submit each agent individually"
    echo ""
    echo "=== Option C: Use the LobeHub Agent Submission API ==="
    echo ""
    echo "Check the latest LobeHub documentation for API-based submission:"
    echo "  https://github.com/lobehub/lobe-chat-agents#submit-your-agent"
    echo ""
    echo "============================================================"
}

# ============================================================================
# Main
# ============================================================================

main() {
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║  LobeHub Agent Submission — 43 ClawHub Skills ║"
    echo "╚══════════════════════════════════════════════╝"
    echo ""

    check_prerequisites

    MODE="${1:-}"

    case "$MODE" in
        --auto)
            auto_submit
            ;;
        --manual)
            manual_submit
            ;;
        *)
            echo ""
            echo "Choose submission method:"
            echo "  1) Automatic (fork + PR via gh CLI)"
            echo "  2) Manual instructions"
            echo ""
            read -rp "Enter choice [1/2]: " choice
            case "$choice" in
                1) auto_submit ;;
                2) manual_submit ;;
                *) log_error "Invalid choice"; exit 1 ;;
            esac
            ;;
    esac
}

main "$@"
