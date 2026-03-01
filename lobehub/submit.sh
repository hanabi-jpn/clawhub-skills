#!/usr/bin/env bash
# ============================================================================
# LobeHub Agent Submission Script
# Submit 40 ClawHub skills as LobeHub agents
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

    AGENT_COUNT=$(python3 -c "import json; print(len(json.load(open('$AGENTS_JSON'))))" 2>/dev/null || echo "0")
    if [ "$AGENT_COUNT" -ne 40 ]; then
        log_error "Expected 40 agents in agents.json, found $AGENT_COUNT"
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
    python3 << 'PYTHON_SCRIPT'
import json, os

agents_path = os.environ.get("AGENTS_JSON", "agents.json")
with open(agents_path) as f:
    agents = json.load(f)

# LobeHub expects individual JSON files per agent in src/ directory
src_dir = "src"
os.makedirs(src_dir, exist_ok=True)

for agent in agents:
    agent_file = os.path.join(src_dir, f"{agent['identifier']}.json")
    agent_data = {
        "author": agent["author"],
        "config": {
            "systemRole": agent["systemRole"]
        },
        "createdAt": "2026-03-01",
        "homepage": f"https://github.com/hanabi-jpn/clawhub-skills/tree/main/{agent['identifier']}",
        "identifier": agent["identifier"],
        "meta": {
            "avatar": "🤖",
            "description": agent["description"],
            "tags": agent["tags"],
            "title": agent["title"]
        },
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
    git commit -m "feat: add 40 ClawHub AI agent skills by hanabi-jpn

Add 40 specialized AI agent skills covering:
- Japan SaaS integrations (freee, SmartHR, kintone, Backlog, etc.)
- Security tools (Skill Guardian, Mac Sentinel, Repo Guardian, Credential Vault)
- Productivity (Summarize Pro, Context Slim, Brain Trust, Agent Dashboard)
- Creative (Nano Banana Ultra, Humanize AI Pro, JP Humanizer)
- Trading (FX Trader Pro)
- Japan business tools (LINE Agent, Rakuten Seller, PayPay Biz, etc.)

All skills by hanabi-jpn - https://github.com/hanabi-jpn/clawhub-skills"

    log_info "Step 5/5: Pushing and creating PR..."
    git push origin "$BRANCH"

    gh pr create \
        --title "feat: add 40 ClawHub AI agent skills by hanabi-jpn" \
        --body "## Summary

This PR adds 40 specialized AI agent skills from [ClawHub Skills](https://github.com/hanabi-jpn/clawhub-skills) by hanabi-jpn.

### Categories
- **Japan SaaS** (15): freee, SmartHR, kintone, Backlog, Chatwork, LINE, LINE WORKS, Sansan, MoneyForward, KING OF TIME, Jooto, Yayoi, Rakuten, BASE/STORES, Notion JP
- **Security** (4): Skill Guardian, Mac Sentinel, Repo Guardian, Credential Vault
- **Productivity** (6): Summarize Pro, Context Slim, Brain Trust, Agent Dashboard, Self-Learning Agent, Capability Evolver Pro
- **Creative** (4): Nano Banana Ultra, Humanize AI Pro, JP Humanizer, JP SEO Writer
- **Google** (4): GA4 Search Console, Google Ads, Google Workspace, Google Maps Biz
- **Commerce/Finance** (5): FX Trader Pro, EC-CUBE Operator, Stripe Japan, PayPay Biz, JP Tax Calc
- **Communication** (2): Social Media Publisher, Lark Workflow

### All agents include
- Full system prompts extracted from SKILL.md
- Proper tags and descriptions
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
    echo "It contains 40 agents formatted for LobeHub."
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
    echo "       agents = json.load(f)"
    echo "   for a in agents:"
    echo "       with open(f'src/{a[\"identifier\"]}.json', 'w') as out:"
    echo "           json.dump({"
    echo "               'author': a['author'],"
    echo "               'config': {'systemRole': a['systemRole']},"
    echo "               'createdAt': '2026-03-01',"
    echo "               'homepage': f'https://github.com/hanabi-jpn/clawhub-skills/tree/main/{a[\"identifier\"]}',"
    echo "               'identifier': a['identifier'],"
    echo "               'meta': {'avatar': '🤖', 'description': a['description'], 'tags': a['tags'], 'title': a['title']},"
    echo "               'schemaVersion': 1"
    echo "           }, out, indent=2, ensure_ascii=False)"
    echo "   \""
    echo ""
    echo "5. Commit and push:"
    echo "   git add -A"
    echo "   git commit -m 'feat: add 40 ClawHub AI agent skills'"
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
    echo "║  LobeHub Agent Submission — 40 ClawHub Skills ║"
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
