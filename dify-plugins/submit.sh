#!/bin/bash
# ============================================================================
# Dify Plugin Submission Script
# Submits ClawHub skills as pull requests to langgenius/dify-plugins
# ============================================================================
#
# Prerequisites:
#   1. GitHub CLI (gh) installed and authenticated
#   2. Git configured with your identity
#   3. Fork of langgenius/dify-plugins in your GitHub account
#
# Usage:
#   ./submit.sh                    # Submit all 10 plugins
#   ./submit.sh chatwork-agent     # Submit a single plugin
#   ./submit.sh --dry-run          # Preview without submitting
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GITHUB_USER="hanabi-jpn"
UPSTREAM_REPO="langgenius/dify-plugins"
FORK_REPO="${GITHUB_USER}/dify-plugins"

# All 10 plugins
ALL_PLUGINS=(
  "google-workspace-agent"
  "google-ads-agent"
  "ga4-search-console"
  "chatwork-agent"
  "kintone-agent"
  "stripe-japan-agent"
  "fx-trader-pro"
  "smarthr-agent"
  "line-agent"
  "social-media-publisher"
)

DRY_RUN=false
TARGET_PLUGIN=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      TARGET_PLUGIN="$1"
      shift
      ;;
  esac
done

# Determine which plugins to submit
if [[ -n "$TARGET_PLUGIN" ]]; then
  PLUGINS=("$TARGET_PLUGIN")
else
  PLUGINS=("${ALL_PLUGINS[@]}")
fi

echo "============================================"
echo "  Dify Plugin Submission Tool"
echo "  ClawHub Skills -> langgenius/dify-plugins"
echo "============================================"
echo ""

# Check prerequisites
check_prerequisites() {
  echo "[1/4] Checking prerequisites..."

  if ! command -v gh &> /dev/null; then
    echo "  ERROR: GitHub CLI (gh) not found. Install: brew install gh"
    exit 1
  fi
  echo "  - GitHub CLI: OK"

  if ! gh auth status &> /dev/null 2>&1; then
    echo "  ERROR: Not authenticated with GitHub CLI. Run: gh auth login"
    exit 1
  fi
  echo "  - GitHub auth: OK"

  if ! command -v git &> /dev/null; then
    echo "  ERROR: git not found."
    exit 1
  fi
  echo "  - Git: OK"
  echo ""
}

# Clone or update the fork
setup_repo() {
  echo "[2/4] Setting up repository..."

  WORK_DIR="/tmp/dify-plugins-submit"

  if [[ -d "$WORK_DIR" ]]; then
    echo "  - Cleaning existing work directory..."
    rm -rf "$WORK_DIR"
  fi

  echo "  - Forking upstream repo (if needed)..."
  if $DRY_RUN; then
    echo "  [DRY RUN] Would fork ${UPSTREAM_REPO}"
  else
    gh repo fork "$UPSTREAM_REPO" --clone=false 2>/dev/null || true
  fi

  echo "  - Cloning fork..."
  if $DRY_RUN; then
    echo "  [DRY RUN] Would clone ${FORK_REPO} to ${WORK_DIR}"
    mkdir -p "$WORK_DIR"
  else
    gh repo clone "$FORK_REPO" "$WORK_DIR"
    cd "$WORK_DIR"
    git remote add upstream "https://github.com/${UPSTREAM_REPO}.git" 2>/dev/null || true
    git fetch upstream
    git checkout main
    git merge upstream/main --no-edit 2>/dev/null || true
  fi
  echo ""
}

# Submit a single plugin
submit_plugin() {
  local plugin_name="$1"
  local plugin_dir="${SCRIPT_DIR}/${plugin_name}"
  local manifest="${plugin_dir}/manifest.yaml"

  echo "  Submitting: ${plugin_name}"

  if [[ ! -f "$manifest" ]]; then
    echo "    ERROR: manifest.yaml not found at ${manifest}"
    return 1
  fi

  local branch_name="feat/add-${plugin_name}"
  local pr_title="feat: Add ${plugin_name} plugin by hanabi-jpn"
  local pr_body="## New Plugin: ${plugin_name}

### Author
- GitHub: @hanabi-jpn
- Publisher: ClawHub Skills (https://github.com/hanabi-jpn/clawhub-skills)

### Description
$(grep -A2 'en_US:' "$manifest" | head -3 | sed 's/.*en_US: *\"//' | sed 's/\"$//')

### Plugin Type
Extension (Agent Strategy)

### Checklist
- [x] manifest.yaml follows Dify plugin specification
- [x] All required fields populated (name, label, description, icon, category)
- [x] Bilingual labels (en_US, ja_JP)
- [x] Credentials properly defined
- [x] Tested locally

### Related
Part of the ClawHub Skills collection — 40 AI agent skills for the Japanese market.
"

  if $DRY_RUN; then
    echo "    [DRY RUN] Would create branch: ${branch_name}"
    echo "    [DRY RUN] Would copy: ${plugin_dir}/ -> plugins/${plugin_name}/"
    echo "    [DRY RUN] Would create PR: ${pr_title}"
    echo "    OK (dry run)"
    return 0
  fi

  cd "$WORK_DIR"

  # Create branch
  git checkout main
  git checkout -b "$branch_name"

  # Copy plugin files
  mkdir -p "plugins/${plugin_name}"
  cp -r "${plugin_dir}/"* "plugins/${plugin_name}/"

  # Commit
  git add "plugins/${plugin_name}/"
  git commit -m "$pr_title"

  # Push and create PR
  git push origin "$branch_name" --force
  gh pr create \
    --repo "$UPSTREAM_REPO" \
    --title "$pr_title" \
    --body "$pr_body" \
    --head "${GITHUB_USER}:${branch_name}" \
    --base main

  echo "    PR created successfully!"

  # Return to main for next plugin
  git checkout main
}

# Main submission loop
submit_all() {
  echo "[3/4] Submitting plugins..."
  echo ""

  local success=0
  local failed=0

  for plugin in "${PLUGINS[@]}"; do
    if submit_plugin "$plugin"; then
      ((success++))
    else
      ((failed++))
    fi
    echo ""
  done

  echo "[4/4] Summary"
  echo "  Submitted: ${success}"
  echo "  Failed:    ${failed}"
  echo "  Total:     ${#PLUGINS[@]}"
  echo ""

  if $DRY_RUN; then
    echo "  This was a dry run. No PRs were created."
    echo "  Remove --dry-run to submit for real."
  fi
}

# Run
check_prerequisites
setup_repo
submit_all

echo "Done!"
