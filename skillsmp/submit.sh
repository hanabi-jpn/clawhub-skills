#!/usr/bin/env bash
# ============================================================================
# SkillsMP Submission Script
# Submit ClawHub skills repo for indexing on SkillsMP marketplace
#
# SkillsMP auto-discovers GitHub repos with SKILL.md files that have
# YAML frontmatter. This script verifies the repo is ready and submits.
#
# Usage:
#   ./submit.sh                 # Interactive mode
#   ./submit.sh --verify-only   # Just verify, don't submit
#   ./submit.sh --submit        # Submit directly
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(dirname "$SCRIPT_DIR")"
REPO_URL="https://github.com/hanabi-jpn/clawhub-skills"
SKILLSMP_SUBMIT_URL="https://skillsmp.com/submit"
SKILLSMP_API_URL="https://api.skillsmp.com/v1/repos"
REQUIRED_FIELDS=("name" "description" "author" "version" "tags")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
log_ok()    { echo -e "${GREEN}[ OK ]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[FAIL]${NC} $*"; }

# ============================================================================
# Verify all SKILL.md files have proper YAML frontmatter
# ============================================================================

verify_skills() {
    log_info "Verifying SKILL.md files in $SKILLS_ROOT..."
    echo ""

    TOTAL=0
    VALID=0
    INVALID=0
    MISSING_FIELDS_LIST=""

    for skill_dir in "$SKILLS_ROOT"/*/; do
        skill_name="$(basename "$skill_dir")"
        skill_md="$skill_dir/SKILL.md"

        # Skip non-skill directories
        if [ ! -f "$skill_md" ]; then
            continue
        fi

        TOTAL=$((TOTAL + 1))

        # Check for YAML frontmatter (starts with ---)
        FIRST_LINE=$(head -1 "$skill_md")
        if [ "$FIRST_LINE" != "---" ]; then
            log_error "$skill_name: Missing YAML frontmatter (no --- delimiter)"
            INVALID=$((INVALID + 1))
            continue
        fi

        # Extract frontmatter content between --- markers
        FRONTMATTER=$(python3 -c "
import re, sys
with open('$skill_md') as f:
    content = f.read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if m:
    print(m.group(1))
else:
    sys.exit(1)
" 2>/dev/null)

        if [ $? -ne 0 ] || [ -z "$FRONTMATTER" ]; then
            log_error "$skill_name: Could not parse YAML frontmatter"
            INVALID=$((INVALID + 1))
            continue
        fi

        # Check each required field
        SKILL_VALID=true
        MISSING=""
        for field in "${REQUIRED_FIELDS[@]}"; do
            if ! echo "$FRONTMATTER" | grep -q "^${field}:"; then
                SKILL_VALID=false
                MISSING="$MISSING $field"
            fi
        done

        if [ "$SKILL_VALID" = true ]; then
            # Extract name for display
            SKILL_TITLE=$(echo "$FRONTMATTER" | grep "^name:" | sed 's/^name:\s*//' | tr -d '"' | tr -d "'")
            log_ok "$skill_name ($SKILL_TITLE)"
            VALID=$((VALID + 1))
        else
            log_error "$skill_name: Missing fields:$MISSING"
            MISSING_FIELDS_LIST="$MISSING_FIELDS_LIST\n  $skill_name: $MISSING"
            INVALID=$((INVALID + 1))
        fi
    done

    echo ""
    echo "============================================================"
    echo "  Verification Summary"
    echo "============================================================"
    echo "  Total SKILL.md files:  $TOTAL"
    echo -e "  ${GREEN}Valid:${NC}                 $VALID"
    if [ "$INVALID" -gt 0 ]; then
        echo -e "  ${RED}Invalid:${NC}               $INVALID"
        echo -e "\n  Missing fields:$MISSING_FIELDS_LIST"
    else
        echo -e "  ${RED}Invalid:${NC}               0"
    fi
    echo "============================================================"
    echo ""

    if [ "$INVALID" -gt 0 ]; then
        return 1
    fi
    return 0
}

# ============================================================================
# Submit to SkillsMP
# ============================================================================

submit_to_skillsmp() {
    log_info "Submitting to SkillsMP..."
    echo ""

    # Method 1: Try SkillsMP CLI (npx skillsmp)
    if command -v npx &>/dev/null; then
        log_info "Checking for SkillsMP CLI..."
        if npx skillsmp --version &>/dev/null 2>&1; then
            log_ok "SkillsMP CLI found"
            log_info "Submitting via CLI..."
            npx skillsmp submit "$REPO_URL"
            log_ok "Submitted via SkillsMP CLI"
            return 0
        else
            log_warn "SkillsMP CLI not available via npx"
        fi
    fi

    # Method 2: Try direct npm global install
    if command -v skillsmp &>/dev/null; then
        log_ok "SkillsMP CLI found (global)"
        skillsmp submit "$REPO_URL"
        log_ok "Submitted via SkillsMP CLI"
        return 0
    fi

    # Method 3: Try curl API submission
    if command -v curl &>/dev/null; then
        log_info "Attempting API submission..."
        RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
            -X POST "$SKILLSMP_API_URL" \
            -H "Content-Type: application/json" \
            -d "{\"url\": \"$REPO_URL\", \"type\": \"multi-skill\"}" \
            2>/dev/null || echo "000")

        if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "201" ] || [ "$RESPONSE" = "202" ]; then
            log_ok "Submitted via API (HTTP $RESPONSE)"
            return 0
        elif [ "$RESPONSE" = "000" ]; then
            log_warn "API endpoint not reachable (SkillsMP API may not be available yet)"
        else
            log_warn "API returned HTTP $RESPONSE"
        fi
    fi

    # Method 4: Try gh CLI to submit as GitHub topic
    if command -v gh &>/dev/null; then
        log_info "Adding 'skillsmp' topic to repo for auto-discovery..."
        gh repo edit "$REPO_URL" --add-topic skillsmp 2>/dev/null && \
            log_ok "Added 'skillsmp' topic to repo" || \
            log_warn "Could not add topic (may need auth)"
    fi

    # Fallback: Manual instructions
    echo ""
    echo "============================================================"
    echo "  Manual SkillsMP Submission"
    echo "============================================================"
    echo ""
    echo "  Automatic submission was not possible."
    echo "  Please submit manually:"
    echo ""
    echo "  1. Visit: $SKILLSMP_SUBMIT_URL"
    echo ""
    echo "  2. Enter the repository URL:"
    echo "     $REPO_URL"
    echo ""
    echo "  3. SkillsMP will auto-discover all 40 SKILL.md files"
    echo "     with their YAML frontmatter metadata."
    echo ""
    echo "  4. Alternatively, if SkillsMP supports GitHub Topics,"
    echo "     add the 'skillsmp' topic to your repo:"
    echo "     gh repo edit --add-topic skillsmp"
    echo ""
    echo "  5. Ensure your repo is public so SkillsMP can index it."
    echo ""
    echo "============================================================"

    return 0
}

# ============================================================================
# Main
# ============================================================================

main() {
    echo ""
    echo "╔══════════════════════════════════════════════════╗"
    echo "║  SkillsMP Submission — 40 ClawHub Skills         ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""

    MODE="${1:-}"

    case "$MODE" in
        --verify-only)
            verify_skills
            ;;
        --submit)
            if verify_skills; then
                submit_to_skillsmp
            else
                log_error "Verification failed. Fix issues before submitting."
                exit 1
            fi
            ;;
        *)
            if verify_skills; then
                echo ""
                read -rp "All skills verified. Submit to SkillsMP? [y/N]: " choice
                case "$choice" in
                    [yY]|[yY][eE][sS])
                        submit_to_skillsmp
                        ;;
                    *)
                        log_info "Submission skipped. Run with --submit to submit later."
                        ;;
                esac
            else
                log_error "Verification failed. Fix issues before submitting."
                exit 1
            fi
            ;;
    esac
}

main "$@"
