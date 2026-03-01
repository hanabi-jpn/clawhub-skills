#!/bin/bash
# ═══════════════════════════════════════════════════════
#  ClawHub Bulk Publisher — hanabi-jpn
#  20 skills, one command
#
#  Usage:
#    ./publish-all.sh           # Publish all (sync mode)
#    ./publish-all.sh --dry-run # Preview only
#    ./publish-all.sh --manual  # Individual publish mode
# ═══════════════════════════════════════════════════════

set -euo pipefail

ROOT="/Users/ishiharatatsuya/clawhub-skills"
cd "$ROOT"

echo "╔═══════════════════════════════════════════════════╗"
echo "║     🔥 hanabi-jpn ClawHub Publisher 🔥           ║"
echo "║     20 Premium Skills — Ready to Ship            ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# ─── Pre-flight checks ───
echo "▶ Pre-flight checks..."

# 1. Check login
WHOAMI=$(npx clawhub@latest whoami 2>&1) || true
if echo "$WHOAMI" | grep -q "hanabi-jpn"; then
  echo "  ✅ Logged in as hanabi-jpn"
else
  echo "  ❌ Not logged in! Run: npx clawhub@latest login"
  exit 1
fi

# 2. Check git is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "  ⚠️  Uncommitted changes detected. Commit first!"
  git status --short
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]] || exit 1
else
  echo "  ✅ Git working tree clean"
fi

# 3. Count skills
SKILL_COUNT=$(find "$ROOT" -maxdepth 2 -name "SKILL.md" | wc -l | tr -d ' ')
echo "  ✅ Found $SKILL_COUNT skills"
echo ""

# ─── Mode selection ───
MODE="${1:---sync}"

case "$MODE" in
  --dry-run)
    echo "▶ DRY RUN — Preview what would be published:"
    echo ""
    npx clawhub@latest sync --root "$ROOT" --dry-run
    echo ""
    echo "Run without --dry-run to publish for real."
    ;;

  --sync|"")
    echo "▶ SYNC MODE — Publishing all skills..."
    echo ""
    npx clawhub@latest sync \
      --root "$ROOT" \
      --all \
      --changelog "Initial release v1.0.0 — 20 premium skills by hanabi-jpn" \
      --tags "latest"

    echo ""
    echo "╔═══════════════════════════════════════════════════╗"
    echo "║  ✅ SYNC COMPLETE                                ║"
    echo "╚═══════════════════════════════════════════════════╝"
    ;;

  --manual)
    echo "▶ MANUAL MODE — Publishing skills individually..."
    echo ""

    SKILLS=(
      "capability-evolver-pro|Capability Evolver Pro"
      "self-learning-agent|Self-Learning Agent"
      "summarize-pro|Summarize Pro"
      "humanize-ai-pro|Humanize AI Pro"
      "nano-banana-ultra|Nano Banana Ultra"
      "skill-guardian|Skill Guardian"
      "fx-trader-pro|FX Trader Pro"
      "brain-trust|Brain Trust"
      "context-slim|Context Slim"
      "agent-dashboard|Agent Dashboard"
      "line-agent|LINE Agent"
      "ec-cube-operator|EC-CUBE Operator"
      "freee-agent|Freee Agent"
      "rakuten-seller|Rakuten Seller"
      "paypay-biz|PayPay Biz"
      "jp-tax-calc|JP Tax Calc"
      "notion-jp|Notion JP"
      "jp-humanizer|JP Humanizer"
      "lark-workflow|Lark Workflow"
      "jp-seo-writer|JP SEO Writer"
    )

    SUCCESS=0
    FAILED=0
    TOTAL=${#SKILLS[@]}

    for entry in "${SKILLS[@]}"; do
      IFS='|' read -r slug name <<< "$entry"
      NUM=$((SUCCESS + FAILED + 1))
      echo "[$NUM/$TOTAL] Publishing: $name"

      MAX_RETRIES=3
      RETRY=0

      while [ $RETRY -lt $MAX_RETRIES ]; do
        OUTPUT=$(npx clawhub@latest publish "$ROOT/$slug" \
          --slug "$slug" \
          --name "$name" \
          --version "1.0.0" \
          --no-input 2>&1) || true

        if echo "$OUTPUT" | grep -qi "rate.limit\|429\|too many"; then
          RETRY=$((RETRY + 1))
          WAIT=$((60 * RETRY))
          echo "  ⏳ Rate limited. Waiting ${WAIT}s (retry $RETRY/$MAX_RETRIES)..."
          sleep $WAIT
        elif echo "$OUTPUT" | grep -qi "✔\|published\|success\|OK\|uploaded"; then
          echo "  ✅ $name published!"
          SUCCESS=$((SUCCESS + 1))
          break
        else
          RETRY=$((RETRY + 1))
          if [ $RETRY -lt $MAX_RETRIES ]; then
            echo "  ⚠️  Retry $RETRY/$MAX_RETRIES in 30s... ($OUTPUT)"
            sleep 30
          fi
        fi
      done

      if [ $RETRY -eq $MAX_RETRIES ]; then
        echo "  ❌ $name FAILED after $MAX_RETRIES retries: $OUTPUT"
        FAILED=$((FAILED + 1))
      fi

      # Cool down between publishes
      sleep 10
    done

    echo ""
    echo "╔═══════════════════════════════════════════════════╗"
    echo "║  RESULTS                                         ║"
    echo "║  ✅ Success: $SUCCESS / $TOTAL                        ║"
    echo "║  ❌ Failed:  $FAILED / $TOTAL                         ║"
    echo "╚═══════════════════════════════════════════════════╝"
    ;;

  *)
    echo "Usage: $0 [--dry-run|--sync|--manual]"
    exit 1
    ;;
esac
