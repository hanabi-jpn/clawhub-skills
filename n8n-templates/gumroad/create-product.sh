#!/usr/bin/env bash
# =============================================================================
# create-product.sh
# Creates the "n8n Japan Business Automation Pack" on Gumroad via API
#
# Usage:
#   export GUMROAD_ACCESS_TOKEN="your_token_here"
#   bash create-product.sh
#
# Prerequisites:
#   - curl installed
#   - jq installed (for JSON parsing; brew install jq)
#   - GUMROAD_ACCESS_TOKEN environment variable set
#   - ZIP file exists at expected path
#
# Gumroad API docs: https://app.gumroad.com/api
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_BASE="https://api.gumroad.com/v2"
ZIP_FILE="${SCRIPT_DIR}/hanabi-jpn-n8n-japan-business-pack-v1.zip"
PRODUCT_NAME="n8n Japan Business Automation Pack"
PRICE_CENTS=4900  # $49.00
TAGS="n8n,automation,workflow,ChatWork,kintone,Stripe,Japan,business,templates,no-code"

# ---------------------------------------------------------------------------
# Product description (from product-listing.md -- "Product Description" section)
# ---------------------------------------------------------------------------
read -r -d '' DESCRIPTION << 'DESCRIPTION_EOF' || true
### Stop Building From Scratch. Start Automating Today.

If you run a business in Japan, you already know the pain: ChatWork notifications that never got built, Stripe webhooks you keep meaning to set up, that kintone-to-Sheets sync you've been doing by hand every week.

These 5 n8n workflow templates solve the automation problems that every Japan-based business faces. They are not toy demos. They are production-grade workflows with real error handling, Japanese locale support, and JST timezone awareness baked in.

**Import. Configure. Activate. Done.**

Each template took 10-20 hours to build and test. You get all five for the price of a team lunch.

---

### What You Get

This pack includes **5 complete n8n workflow JSON files** plus a detailed setup guide. Every template is:

- Importable with one click into any n8n instance (cloud or self-hosted)
- Built with n8n v1.x compatible nodes (HTTP Request v4.2, Code v2, Schedule Trigger v1.2)
- Configured for JST (Asia/Tokyo) timezone
- Documented with every required environment variable listed
- Production-tested on live systems

---

### The 5 Templates

**1. ChatWork Notification Hub -- Multi-Source Alert Router**
Route deployment notifications, error alerts, and daily team greetings through ChatWork -- Japan's most-used business chat platform. Webhook endpoint, smart routing, automatic task creation, daily morning greeting at 9 AM JST. 8 nodes, 2 triggers.

**2. Stripe Japan Payment Flow -- PayPay, Konbini & Card Processing**
Handle Stripe webhook events with full support for Japan-specific payment methods. HMAC-SHA256 signature verification, JPY zero-decimal formatting, Japan payment method tracking (Card, PayPay, Konbini, Bank Transfer), Google Sheets logging, ChatWork notifications. 10 nodes, 1 trigger.

**3. Social Media Cross-Post Scheduler -- X, Instagram, LINE**
One content calendar. Three platforms. Zero manual posting. Google Sheets content calendar, X/Twitter posting via API v2, Instagram two-step publishing, LINE broadcast messaging. Posting at optimal JST engagement times. 9 nodes, 1 trigger.

**4. GA4 Weekly Report -- Automated SEO & Traffic Analysis**
Your Monday morning analytics briefing, delivered automatically. Pulls GA4 and Google Search Console data, week-over-week comparison, traffic by channel, top 10 Search Console keywords, formatted ChatWork report. 6 nodes, 1 trigger.

**5. kintone Bi-Directional Sync -- Google Sheets to kintone Records**
Two-way synchronization between Google Sheets and Cybozu kintone. Bi-directional sync, scheduled every 15 minutes plus real-time via webhook, smart difference calculation, Japanese field name support (会社名, ステータス, 売上見込). 11 nodes, 2 triggers.

---

### What's Inside the ZIP

```
hanabi-jpn-n8n-japan-business-pack-v1/
  README.txt                          -- Quick start guide
  setup-guide.md                      -- Detailed setup instructions
  workflows/
    chatwork-notification.json        -- Template 1
    stripe-payment-flow.json          -- Template 2
    social-media-scheduler.json       -- Template 3
    ga4-weekly-report.json            -- Template 4
    kintone-sync.json                 -- Template 5
```

---

### Who This Is For

- Startups and SMBs operating in Japan that use ChatWork, kintone, Stripe, or LINE
- Digital agencies serving Japanese clients who need repeatable automation templates
- Solo developers and freelancers building n8n automations for Japanese companies
- n8n enthusiasts who want production-quality Japan-market templates

### Requirements

- n8n instance (self-hosted or n8n Cloud) running v1.0 or later
- API keys for the services each template connects to (listed in the setup guide)
- 15-30 minutes per template for initial configuration

### 30-Day Money-Back Guarantee

If these templates don't save you time, email hanabi.jpn.dev@gmail.com within 30 days and we'll refund your full purchase price. No questions asked.

---

Built in Japan. For Japan. By automation engineers who actually use ChatWork.

Support: hanabi.jpn.dev@gmail.com
GitHub: github.com/hanabi-jpn
DESCRIPTION_EOF

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
echo "=============================================="
echo "  Gumroad Product Creator"
echo "  n8n Japan Business Automation Pack"
echo "=============================================="
echo ""

# Check for access token
if [[ -z "${GUMROAD_ACCESS_TOKEN:-}" ]]; then
    echo "ERROR: GUMROAD_ACCESS_TOKEN environment variable is not set."
    echo ""
    echo "To get an access token:"
    echo "  1. Go to https://gumroad.com/settings/advanced#application-form"
    echo "  2. Create an application (or use an existing one)"
    echo "  3. Generate an access token"
    echo "  4. Run: export GUMROAD_ACCESS_TOKEN=\"your_token_here\""
    echo "  5. Then re-run this script"
    echo ""
    echo "See: ${SCRIPT_DIR}/gumroad-api-instructions.md for detailed steps."
    exit 1
fi

# Check for required tools
for cmd in curl jq; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "ERROR: '$cmd' is required but not installed."
        if [[ "$cmd" == "jq" ]]; then
            echo "  Install with: brew install jq"
        fi
        exit 1
    fi
done

# Check ZIP file exists
if [[ ! -f "$ZIP_FILE" ]]; then
    echo "ERROR: ZIP file not found at: $ZIP_FILE"
    echo "  Run 'bash bundle.sh' first to generate the ZIP."
    exit 1
fi

ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
echo "[OK] Access token: set (${GUMROAD_ACCESS_TOKEN:0:8}...)"
echo "[OK] ZIP file: $ZIP_FILE ($ZIP_SIZE)"
echo "[OK] Product: $PRODUCT_NAME"
echo "[OK] Price: \$$(echo "scale=2; $PRICE_CENTS / 100" | bc)"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Create the product
# ---------------------------------------------------------------------------
echo ">>> Step 1: Creating product on Gumroad..."
echo ""

CREATE_RESPONSE=$(curl -s -X POST "${API_BASE}/products" \
    -F "access_token=${GUMROAD_ACCESS_TOKEN}" \
    -F "name=${PRODUCT_NAME}" \
    -F "price=${PRICE_CENTS}" \
    -F "description=${DESCRIPTION}" \
    -F "customizable_price=true" \
    -F "preview_url=https://github.com/hanabi-jpn" \
    -F "tags[]=${TAGS}" \
)

# Check for success
SUCCESS=$(echo "$CREATE_RESPONSE" | jq -r '.success // false')
if [[ "$SUCCESS" != "true" ]]; then
    echo "ERROR: Failed to create product."
    echo "API Response:"
    echo "$CREATE_RESPONSE" | jq .
    exit 1
fi

PRODUCT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.product.id')
PRODUCT_PERMALINK=$(echo "$CREATE_RESPONSE" | jq -r '.product.short_url // .product.permalink')
PRODUCT_URL=$(echo "$CREATE_RESPONSE" | jq -r '.product.short_url')

echo "[OK] Product created successfully!"
echo "     Product ID: $PRODUCT_ID"
echo "     URL: $PRODUCT_URL"
echo ""

# ---------------------------------------------------------------------------
# Step 2: Upload the ZIP file
# ---------------------------------------------------------------------------
echo ">>> Step 2: Uploading ZIP file..."
echo ""

# Gumroad API: PUT /v2/products/:id to add file, or use the product_files endpoint
# The file upload goes through the product update endpoint
UPLOAD_RESPONSE=$(curl -s -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
    -F "access_token=${GUMROAD_ACCESS_TOKEN}" \
    -F "product_file=@${ZIP_FILE}" \
)

UPLOAD_SUCCESS=$(echo "$UPLOAD_RESPONSE" | jq -r '.success // false')
if [[ "$UPLOAD_SUCCESS" != "true" ]]; then
    echo "WARNING: File upload via API may have failed."
    echo "API Response:"
    echo "$UPLOAD_RESPONSE" | jq .
    echo ""
    echo "If the file did not upload, you can upload it manually:"
    echo "  1. Go to https://app.gumroad.com/products/${PRODUCT_ID}/edit"
    echo "  2. Click 'Content' tab"
    echo "  3. Click 'Add file' and select: $ZIP_FILE"
    echo ""
else
    echo "[OK] ZIP file uploaded successfully!"
    echo ""
fi

# ---------------------------------------------------------------------------
# Step 3: Enable/publish the product
# ---------------------------------------------------------------------------
echo ">>> Step 3: Publishing product..."
echo ""

PUBLISH_RESPONSE=$(curl -s -X PUT "${API_BASE}/products/${PRODUCT_ID}" \
    -F "access_token=${GUMROAD_ACCESS_TOKEN}" \
    -F "published=true" \
)

PUBLISH_SUCCESS=$(echo "$PUBLISH_RESPONSE" | jq -r '.success // false')
if [[ "$PUBLISH_SUCCESS" != "true" ]]; then
    echo "WARNING: Could not auto-publish. You may need to publish manually."
    echo "  Go to: https://app.gumroad.com/products/${PRODUCT_ID}/edit"
    echo "  Click 'Publish'"
    echo ""
else
    echo "[OK] Product published!"
    echo ""
fi

# ---------------------------------------------------------------------------
# Step 4: Verify the product
# ---------------------------------------------------------------------------
echo ">>> Step 4: Verifying product..."
echo ""

VERIFY_RESPONSE=$(curl -s "${API_BASE}/products/${PRODUCT_ID}?access_token=${GUMROAD_ACCESS_TOKEN}")
VERIFY_SUCCESS=$(echo "$VERIFY_RESPONSE" | jq -r '.success // false')

if [[ "$VERIFY_SUCCESS" == "true" ]]; then
    FINAL_NAME=$(echo "$VERIFY_RESPONSE" | jq -r '.product.name')
    FINAL_PRICE=$(echo "$VERIFY_RESPONSE" | jq -r '.product.price')
    FINAL_PUBLISHED=$(echo "$VERIFY_RESPONSE" | jq -r '.product.published')
    FINAL_URL=$(echo "$VERIFY_RESPONSE" | jq -r '.product.short_url')

    echo "=============================================="
    echo "  Product Created Successfully!"
    echo "=============================================="
    echo ""
    echo "  Name:      $FINAL_NAME"
    echo "  Price:     $FINAL_PRICE cents"
    echo "  Published: $FINAL_PUBLISHED"
    echo "  URL:       $FINAL_URL"
    echo "  Edit:      https://app.gumroad.com/products/${PRODUCT_ID}/edit"
    echo ""
    echo "  Next steps:"
    echo "    1. Visit the URL above to verify the listing"
    echo "    2. Add a cover image (1280x720) in the product editor"
    echo "    3. If file upload failed, manually upload the ZIP"
    echo "    4. Create LAUNCH40 discount code (40% off, 50 uses)"
    echo "    5. Share the product URL on X/Twitter, n8n community, etc."
    echo ""
else
    echo "WARNING: Could not verify product. Check manually."
    echo "  Product ID: $PRODUCT_ID"
    echo ""
fi

# ---------------------------------------------------------------------------
# Save product info for reference
# ---------------------------------------------------------------------------
PRODUCT_INFO_FILE="${SCRIPT_DIR}/product-info.json"
echo "$VERIFY_RESPONSE" | jq '.product' > "$PRODUCT_INFO_FILE" 2>/dev/null || true
echo "Product info saved to: $PRODUCT_INFO_FILE"
echo ""
echo "Done!"
