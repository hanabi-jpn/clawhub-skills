#!/usr/bin/env bash
# ============================================================================
# SkillsMP YAML Frontmatter Verification Script
# Lists all 40 skills with their YAML frontmatter and validates required fields
#
# Usage:
#   ./verify.sh              # Full verification with frontmatter listing
#   ./verify.sh --summary    # Summary table only
#   ./verify.sh --json       # Output as JSON
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(dirname "$SCRIPT_DIR")"
REQUIRED_FIELDS=("name" "description" "author" "version" "tags")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ============================================================================
# Extract and display frontmatter for each skill
# ============================================================================

verify_full() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  SkillsMP YAML Frontmatter Verification — 40 ClawHub Skills  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    TOTAL=0
    VALID=0
    INVALID=0
    WARNINGS=0

    for skill_dir in "$SKILLS_ROOT"/*/; do
        skill_name="$(basename "$skill_dir")"
        skill_md="$skill_dir/SKILL.md"

        # Skip non-skill directories
        if [ ! -f "$skill_md" ]; then
            continue
        fi

        TOTAL=$((TOTAL + 1))

        echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}[$TOTAL] $skill_name${NC}"
        echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

        # Check for YAML frontmatter
        FIRST_LINE=$(head -1 "$skill_md")
        if [ "$FIRST_LINE" != "---" ]; then
            echo -e "  ${RED}ERROR: No YAML frontmatter found${NC}"
            INVALID=$((INVALID + 1))
            echo ""
            continue
        fi

        # Extract and display frontmatter
        FRONTMATTER=$(python3 -c "
import re
with open('$skill_md') as f:
    content = f.read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if m:
    print(m.group(1))
" 2>/dev/null || echo "")

        if [ -z "$FRONTMATTER" ]; then
            echo -e "  ${RED}ERROR: Could not parse YAML frontmatter${NC}"
            INVALID=$((INVALID + 1))
            echo ""
            continue
        fi

        # Display frontmatter
        echo "$FRONTMATTER" | while IFS= read -r line; do
            echo "  $line"
        done

        # Validate required fields
        SKILL_VALID=true
        MISSING=""
        for field in "${REQUIRED_FIELDS[@]}"; do
            if echo "$FRONTMATTER" | grep -q "^${field}:"; then
                VALUE=$(echo "$FRONTMATTER" | grep "^${field}:" | head -1 | sed "s/^${field}:\s*//" | tr -d '"' | tr -d "'")
                if [ -z "$VALUE" ] && [ "$field" != "tags" ]; then
                    echo -e "  ${YELLOW}WARN: '$field' is empty${NC}"
                    WARNINGS=$((WARNINGS + 1))
                fi
            else
                SKILL_VALID=false
                MISSING="$MISSING $field"
            fi
        done

        # Check tags count
        TAG_COUNT=$(echo "$FRONTMATTER" | grep -c "^  - " || echo "0")
        if [ "$TAG_COUNT" -lt 3 ]; then
            echo -e "  ${YELLOW}WARN: Only $TAG_COUNT tags (recommend 3+)${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi

        # Check for System Prompt Instructions section
        if grep -q "^## System Prompt Instructions" "$skill_md"; then
            SP_LINE=$(grep -n "^## System Prompt Instructions" "$skill_md" | head -1 | cut -d: -f1)
            echo -e "  ${GREEN}System Prompt: found at line $SP_LINE${NC}"
        else
            echo -e "  ${YELLOW}WARN: No '## System Prompt Instructions' section${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi

        if [ "$SKILL_VALID" = true ]; then
            echo -e "  ${GREEN}Status: VALID${NC}"
            VALID=$((VALID + 1))
        else
            echo -e "  ${RED}Status: INVALID — Missing:$MISSING${NC}"
            INVALID=$((INVALID + 1))
        fi

        echo ""
    done

    # Summary
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  Verification Summary                                        ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    printf "║  Total skills:        %-38s ║\n" "$TOTAL"
    printf "║  Valid:               %-38s ║\n" "$VALID"
    printf "║  Invalid:             %-38s ║\n" "$INVALID"
    printf "║  Warnings:            %-38s ║\n" "$WARNINGS"
    echo "╠══════════════════════════════════════════════════════════════╣"

    if [ "$INVALID" -eq 0 ]; then
        echo "║  Result: ALL SKILLS READY FOR SKILLSMP                       ║"
    else
        echo "║  Result: FIX $INVALID INVALID SKILL(S) BEFORE SUBMISSION          ║"
    fi

    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  Required fields: name, description, author, version, tags   ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# ============================================================================
# Summary table view
# ============================================================================

verify_summary() {
    echo ""
    echo "╔═══════════════════════════════════════════════════════════════════════════════════════╗"
    echo "║  SkillsMP Verification Summary                                                       ║"
    echo "╠══════════════════════════╦════════════════════════════════════════╦═══════╦═══════════╣"
    echo "║  Skill Slug              ║  Name                                  ║ Tags  ║ Status    ║"
    echo "╠══════════════════════════╬════════════════════════════════════════╬═══════╬═══════════╣"

    TOTAL=0
    VALID=0

    for skill_dir in "$SKILLS_ROOT"/*/; do
        skill_name="$(basename "$skill_dir")"
        skill_md="$skill_dir/SKILL.md"

        if [ ! -f "$skill_md" ]; then
            continue
        fi

        TOTAL=$((TOTAL + 1))

        # Extract fields
        RESULT=$(python3 -c "
import re
with open('$skill_md') as f:
    content = f.read()
m = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
if not m:
    print('NO_FM|||0|||INVALID')
else:
    fm = m.group(1)
    name_m = re.search(r'name:\s*[\"\\']?([^\"\\'\\n]+)', fm)
    name = name_m.group(1).strip().rstrip('\"').rstrip(\"'\") if name_m else 'N/A'
    tags = len(re.findall(r'  - ', fm))
    required = ['name:', 'description:', 'author:', 'version:', 'tags:']
    valid = all(any(line.startswith(r) for line in fm.split('\n')) for r in required)
    status = 'VALID' if valid else 'INVALID'
    print(f'{name}|||{tags}|||{status}')
" 2>/dev/null || echo "ERROR|||0|||ERROR")

        DISPLAY_NAME=$(echo "$RESULT" | cut -d'|' -f1)
        TAG_COUNT=$(echo "$RESULT" | cut -d'|' -f4)
        STATUS=$(echo "$RESULT" | cut -d'|' -f7)

        # Truncate name for display
        if [ ${#DISPLAY_NAME} -gt 36 ]; then
            DISPLAY_NAME="${DISPLAY_NAME:0:33}..."
        fi

        if [ "$STATUS" = "VALID" ]; then
            STATUS_DISPLAY="${GREEN}VALID${NC}    "
            VALID=$((VALID + 1))
        else
            STATUS_DISPLAY="${RED}INVALID${NC}  "
        fi

        printf "║  %-24s ║  %-38s ║  %-4s ║ " "$skill_name" "$DISPLAY_NAME" "$TAG_COUNT"
        echo -e "$STATUS_DISPLAY║"
    done

    echo "╠══════════════════════════╩════════════════════════════════════════╩═══════╩═══════════╣"
    printf "║  Total: %-3s  |  Valid: %-3s  |  Invalid: %-3s                                        ║\n" "$TOTAL" "$VALID" "$((TOTAL - VALID))"
    echo "╚═════════════════════════════════════════════════════════════════════════════════════════╝"
    echo ""
}

# ============================================================================
# JSON output
# ============================================================================

verify_json() {
    python3 -c "
import os, re, json

base = '$SKILLS_ROOT'
results = []

for d in sorted(os.listdir(base)):
    skill_path = os.path.join(base, d, 'SKILL.md')
    if not os.path.isfile(skill_path):
        continue

    with open(skill_path) as f:
        content = f.read()

    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        results.append({'slug': d, 'valid': False, 'error': 'no frontmatter'})
        continue

    fm = fm_match.group(1)
    fields = {}
    for field in ['name', 'description', 'author', 'version']:
        m = re.search(rf'{field}:\s*[\"\\']?([^\"\\'\\n]+)', fm)
        fields[field] = m.group(1).strip().rstrip('\"').rstrip(\"'\") if m else None

    tags = re.findall(r'  - (.+)', fm)
    fields['tags'] = [t.strip().strip('\"').strip(\"'\") for t in tags]

    has_system_prompt = '## System Prompt Instructions' in content

    required_ok = all(fields.get(f) for f in ['name', 'description', 'author', 'version'])
    tags_ok = len(fields['tags']) > 0

    results.append({
        'slug': d,
        'valid': required_ok and tags_ok,
        'fields': fields,
        'has_system_prompt': has_system_prompt,
        'tag_count': len(fields['tags'])
    })

summary = {
    'total': len(results),
    'valid': sum(1 for r in results if r['valid']),
    'invalid': sum(1 for r in results if not r['valid']),
    'skills': results
}

print(json.dumps(summary, indent=2, ensure_ascii=False))
"
}

# ============================================================================
# Main
# ============================================================================

main() {
    MODE="${1:-}"

    case "$MODE" in
        --summary)
            verify_summary
            ;;
        --json)
            verify_json
            ;;
        *)
            verify_full
            ;;
    esac
}

main "$@"
