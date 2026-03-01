#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# generate-all.sh
#
# Generates MCP server packages for all 20 hanabi-jpn ClawHub skills.
# Calls generate-package.sh for each skill.
#
# Usage:
#   ./scripts/generate-all.sh
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_ROOT="/Users/ishiharatatsuya/clawhub-skills"
MCP_ROOT="/Users/ishiharatatsuya/clawhub-skills/mcp-servers"

# All 20 skills
SKILLS=(
  capability-evolver-pro
  self-learning-agent
  summarize-pro
  humanize-ai-pro
  nano-banana-ultra
  skill-guardian
  fx-trader-pro
  brain-trust
  context-slim
  agent-dashboard
  line-agent
  ec-cube-operator
  freee-agent
  rakuten-seller
  paypay-biz
  jp-tax-calc
  notion-jp
  jp-humanizer
  lark-workflow
  jp-seo-writer
)

echo "============================================"
echo "  MCP Server Generator — hanabi-jpn skills"
echo "============================================"
echo ""
echo "Skills to process: ${#SKILLS[@]}"
echo ""

SUCCESS=0
FAILED=0
SKIPPED=0

for skill in "${SKILLS[@]}"; do
  SKILL_MD="${SKILLS_ROOT}/${skill}/SKILL.md"

  if [ ! -f "${SKILL_MD}" ]; then
    echo "[SKIP] ${skill} — SKILL.md not found"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  # Skip fx-trader-pro if it already has a hand-crafted implementation
  if [ "${skill}" = "fx-trader-pro" ] && [ -f "${MCP_ROOT}/packages/mcp-fx-trader-pro/src/index.ts" ]; then
    echo "[SKIP] ${skill} — hand-crafted reference implementation exists"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo "[GEN]  ${skill}"
  if "${SCRIPT_DIR}/generate-package.sh" "${skill}"; then
    SUCCESS=$((SUCCESS + 1))
  else
    echo "[FAIL] ${skill} — generation failed"
    FAILED=$((FAILED + 1))
  fi
  echo ""
done

echo "============================================"
echo "  Generation Summary"
echo "============================================"
echo "  Success:  ${SUCCESS}"
echo "  Failed:   ${FAILED}"
echo "  Skipped:  ${SKIPPED}"
echo "  Total:    ${#SKILLS[@]}"
echo ""

if [ ${FAILED} -gt 0 ]; then
  echo "WARNING: ${FAILED} packages failed to generate."
  exit 1
fi

echo "All packages generated. Next steps:"
echo "  1. cd ${MCP_ROOT}"
echo "  2. npm install"
echo "  3. npm run build"
echo "  4. npm run publish-all  (when ready to publish)"
