#!/bin/bash
# ClawHub bulk publisher with rate limit handling
# Usage: ./publish-all.sh

cd /Users/ishiharatatsuya/clawhub-skills

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

echo "========================================="
echo "  ClawHub Bulk Publisher"
echo "  Total skills: $TOTAL"
echo "========================================="

for entry in "${SKILLS[@]}"; do
  IFS='|' read -r slug name <<< "$entry"

  echo ""
  echo "--- Publishing [$((SUCCESS + FAILED + 1))/$TOTAL]: $name ---"

  MAX_RETRIES=3
  RETRY=0

  while [ $RETRY -lt $MAX_RETRIES ]; do
    OUTPUT=$(npx clawhub@latest publish "/Users/ishiharatatsuya/clawhub-skills/$slug" \
      --slug "$slug" \
      --name "$name" \
      --version "1.0.0" \
      --no-input 2>&1)

    if echo "$OUTPUT" | grep -q "rate limit"; then
      RETRY=$((RETRY + 1))
      WAIT=$((60 * RETRY))
      echo "⏳ Rate limited. Waiting ${WAIT}s before retry $RETRY/$MAX_RETRIES..."
      sleep $WAIT
    elif echo "$OUTPUT" | grep -q "✔\|published\|success\|OK"; then
      echo "✅ $name published successfully!"
      SUCCESS=$((SUCCESS + 1))
      break
    else
      echo "❌ $name failed: $OUTPUT"
      RETRY=$((RETRY + 1))
      if [ $RETRY -lt $MAX_RETRIES ]; then
        echo "⏳ Retrying in 30s..."
        sleep 30
      fi
    fi
  done

  if [ $RETRY -eq $MAX_RETRIES ]; then
    echo "❌ $name failed after $MAX_RETRIES retries"
    FAILED=$((FAILED + 1))
  fi

  # Small delay between publishes to avoid rate limit
  echo "⏳ Cooling down 15s..."
  sleep 15
done

echo ""
echo "========================================="
echo "  RESULTS"
echo "  Success: $SUCCESS / $TOTAL"
echo "  Failed:  $FAILED / $TOTAL"
echo "========================================="
