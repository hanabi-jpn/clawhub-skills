#!/usr/bin/env bash
#
# bundle.sh — Package n8n Japan Business Automation Pack for Gumroad upload
#
# Usage:
#   cd /path/to/n8n-templates/gumroad/
#   bash bundle.sh
#
# Output:
#   hanabi-jpn-n8n-japan-business-pack-v1.zip
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUNDLE_NAME="hanabi-jpn-n8n-japan-business-pack-v1"
OUTPUT_ZIP="$SCRIPT_DIR/$BUNDLE_NAME.zip"
STAGING_DIR="$SCRIPT_DIR/.staging"

echo "=============================================="
echo "  n8n Japan Business Automation Pack Bundler"
echo "  by hanabi-jpn"
echo "=============================================="
echo ""

# Clean up any previous build
if [ -d "$STAGING_DIR" ]; then
    echo "[1/6] Cleaning previous staging directory..."
    rm -rf "$STAGING_DIR"
fi

if [ -f "$OUTPUT_ZIP" ]; then
    echo "       Removing previous ZIP..."
    rm -f "$OUTPUT_ZIP"
fi

# Create staging directory structure
echo "[2/6] Creating staging directory..."
mkdir -p "$STAGING_DIR/$BUNDLE_NAME/workflows"

# Copy workflow JSON files
echo "[3/6] Copying workflow templates..."

WORKFLOW_FILES=(
    "chatwork-notification.json"
    "ga4-weekly-report.json"
    "kintone-sync.json"
    "social-media-scheduler.json"
    "stripe-payment-flow.json"
)

FOUND_COUNT=0
for wf in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$TEMPLATES_DIR/$wf" ]; then
        cp "$TEMPLATES_DIR/$wf" "$STAGING_DIR/$BUNDLE_NAME/workflows/"
        echo "       + $wf"
        FOUND_COUNT=$((FOUND_COUNT + 1))
    else
        echo "       ! WARNING: $wf not found in $TEMPLATES_DIR"
    fi
done

if [ "$FOUND_COUNT" -ne 5 ]; then
    echo ""
    echo "WARNING: Expected 5 workflow files, found $FOUND_COUNT."
    echo "         The bundle will be created but may be incomplete."
    echo ""
fi

# Copy setup guide
echo "[4/6] Copying setup guide..."
if [ -f "$SCRIPT_DIR/setup-guide.md" ]; then
    cp "$SCRIPT_DIR/setup-guide.md" "$STAGING_DIR/$BUNDLE_NAME/setup-guide.md"
    echo "       + setup-guide.md"
else
    echo "       ! WARNING: setup-guide.md not found. Skipping."
fi

# Generate README.txt for the ZIP
echo "[5/6] Generating README.txt..."
cat > "$STAGING_DIR/$BUNDLE_NAME/README.txt" << 'READMEEOF'
================================================================
  n8n Japan Business Automation Pack v1.0
  by hanabi-jpn
================================================================

Thank you for your purchase!

This pack contains 5 production-ready n8n workflow templates
designed for businesses operating in Japan.


CONTENTS
--------
  workflows/
    chatwork-notification.json    ChatWork multi-source alert router
    stripe-payment-flow.json      Stripe Japan payment processing
    social-media-scheduler.json   X/Instagram/LINE cross-poster
    ga4-weekly-report.json        GA4 + Search Console weekly report
    kintone-sync.json             kintone <-> Google Sheets sync

  setup-guide.md                  Detailed setup instructions
  README.txt                      This file


QUICK START (5 minutes)
-----------------------
1. Open your n8n instance (self-hosted or cloud)
2. Create a new workflow
3. Click the menu (three dots, top right) > "Import from File"
4. Select any .json file from the workflows/ folder
5. Set your environment variables (see setup-guide.md)
6. Test the workflow with "Execute Workflow"
7. Toggle the workflow to Active

For detailed instructions, open setup-guide.md.


REQUIRED ENVIRONMENT VARIABLES (by template)
---------------------------------------------

ChatWork Notification Hub:
  CHATWORK_API_TOKEN
  CHATWORK_DEPLOY_ROOM_ID
  CHATWORK_ERROR_ROOM_ID
  CHATWORK_TEAM_ROOM_ID
  CHATWORK_ONCALL_ACCOUNT_ID

Stripe Japan Payment Flow:
  STRIPE_WEBHOOK_SECRET
  CHATWORK_API_TOKEN
  CHATWORK_SALES_ROOM_ID
  CHATWORK_ONCALL_ACCOUNT_ID
  GOOGLE_SHEET_ID

Social Media Cross-Post Scheduler:
  CONTENT_SHEET_ID
  X_API_KEY / X_API_SECRET
  INSTAGRAM_BUSINESS_ACCOUNT_ID
  INSTAGRAM_ACCESS_TOKEN
  LINE_CHANNEL_ACCESS_TOKEN
  CHATWORK_API_TOKEN
  CHATWORK_MARKETING_ROOM_ID

GA4 Weekly Report:
  GA4_PROPERTY_ID
  GSC_SITE_URL
  CHATWORK_API_TOKEN
  CHATWORK_MARKETING_ROOM_ID

kintone Bi-Directional Sync:
  KINTONE_DOMAIN
  KINTONE_API_TOKEN
  KINTONE_APP_ID
  SYNC_SHEET_ID
  CHATWORK_API_TOKEN
  CHATWORK_OPS_ROOM_ID


SUPPORT
-------
  Email:  hanabi.jpn.dev@gmail.com
  GitHub: github.com/hanabi-jpn
  X:      @hanabi_jpn

If something doesn't work, check setup-guide.md first. If you're
still stuck, email us and we'll help you debug it.

30-day money-back guarantee. No questions asked.


LICENSE
-------
You may use these templates in your own projects and client
projects. You may not redistribute the template files as-is or
include them in a competing template pack for sale.

Copyright 2026 hanabi-jpn. All rights reserved.
================================================================
READMEEOF

echo "       + README.txt"

# Create the ZIP
echo "[6/6] Creating ZIP archive..."
cd "$STAGING_DIR"
zip -r "$OUTPUT_ZIP" "$BUNDLE_NAME/" -x "*.DS_Store" "*__MACOSX*"
cd "$SCRIPT_DIR"

# Clean up staging directory
rm -rf "$STAGING_DIR"

# Report
ZIP_SIZE=$(du -h "$OUTPUT_ZIP" | cut -f1)
echo ""
echo "=============================================="
echo "  Bundle created successfully!"
echo ""
echo "  File: $OUTPUT_ZIP"
echo "  Size: $ZIP_SIZE"
echo "  Templates: $FOUND_COUNT / 5"
echo ""
echo "  Next steps:"
echo "  1. Upload this ZIP to Gumroad"
echo "  2. Set price to \$49 (bundle) or \$19 (individual)"
echo "  3. Use product-listing.md for the product description"
echo "  4. See gumroad-setup.md for full setup instructions"
echo "=============================================="
