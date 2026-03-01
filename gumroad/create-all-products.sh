#!/usr/bin/env bash
# =============================================================================
# create-all-products.sh
# Creates all 5 hanabi-jpn product packs on Gumroad via API
#
# Usage:
#   export GUMROAD_ACCESS_TOKEN="your_token_here"
#   bash create-all-products.sh              # Create all products
#   bash create-all-products.sh --dry-run    # Preview without creating
#   bash create-all-products.sh --product 3  # Create only product #3
#
# Prerequisites:
#   - curl installed
#   - jq installed (brew install jq)
#   - GUMROAD_ACCESS_TOKEN environment variable set
#
# Gumroad API docs: https://app.gumroad.com/api
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_BASE="https://api.gumroad.com/v2"
RESULTS_FILE="${SCRIPT_DIR}/create-results.json"
DRY_RUN=false
SINGLE_PRODUCT=""

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --product)
            SINGLE_PRODUCT="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: bash create-all-products.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dry-run         Preview products without creating them"
            echo "  --product N       Create only product number N (1-5)"
            echo "  -h, --help        Show this help message"
            echo ""
            echo "Products:"
            echo "  1  EC Master Pack              \$49"
            echo "  2  Finance & Accounting Pack    \$49"
            echo "  3  Marketing & Growth Pack      \$39"
            echo "  4  Business Ops Pack            \$49"
            echo "  5  All-in-One Bundle            \$149"
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option: $1"
            echo "Run with --help for usage information."
            exit 1
            ;;
    esac
done

# ---------------------------------------------------------------------------
# Product Definitions
# ---------------------------------------------------------------------------

# --- Product 1: EC Master Pack ---
PRODUCT_1_NAME="EC Master Pack -- 9 AI Agent Skills for Japanese E-Commerce"
PRODUCT_1_PRICE=4900
PRODUCT_1_TAGS="claude-code,ai-agent,ec,ecommerce,rakuten,amazon,yahoo-shopping,shopify,japan,automation"
read -r -d '' PRODUCT_1_DESC << 'EOF' || true
### Your EC Operations Are Scattered Across 9 Tabs. Fix That.

9 Claude Code AI agent skills that let you manage Rakuten, Amazon, Yahoo Shopping, Mercari, Shopify, EC-CUBE, BASE/STORES, MakeShop, and Stripe -- all from your terminal.

**Install. Configure API keys. Start talking to your stores.**

---

### The 9 Skills

1. **rakuten-seller** -- Rakuten Ichiba shop management (RMS API)
2. **amazon-japan-seller** -- Amazon.co.jp seller operations (SP-API)
3. **yahoo-shopping-agent** -- Yahoo! Shopping store management
4. **mercari-shops-agent** -- Mercari Shops operations & price optimization
5. **shopify-japan** -- Shopify Japan D2C (Admin/Storefront API)
6. **ec-cube-operator** -- EC-CUBE 4.x full management (Web API)
7. **base-stores-agent** -- BASE & STORES unified management
8. **makeshop-agent** -- MakeShop EC management (REST API v2)
9. **stripe-japan-agent** -- Stripe Japan payments (PayPay, konbini, bank transfer)

---

### Cross-Platform Power

- Sync inventory across all 9 platforms in one command
- Compare pricing across Rakuten, Amazon, and Yahoo simultaneously
- Pull unified sales reports covering all your stores
- Detect overselling risk before it happens

### Who This Is For

- Multi-channel EC sellers on Rakuten, Amazon, Yahoo Shopping
- D2C brand owners running Shopify or EC-CUBE
- Solo sellers on BASE, STORES, or Mercari Shops
- EC operations managers automating platform tasks

### Requirements

- Claude Code installed and configured
- ClawHub CLI (`npx clawhub@latest install hanabi-jpn/ec-master-pack`)
- API keys for platforms you use (each skill documents its requirements)

### 30-Day Money-Back Guarantee

If these skills don't make your EC operations faster, email hanabi.jpn.dev@gmail.com within 30 days for a full refund.

---

Built by hanabi-jpn | github.com/hanabi-jpn | hanabi.jpn.dev@gmail.com
EOF

# --- Product 2: Finance & Accounting Pack ---
PRODUCT_2_NAME="Finance & Accounting Pack -- 10 AI Agent Skills for Japanese Accounting"
PRODUCT_2_PRICE=4900
PRODUCT_2_TAGS="claude-code,ai-agent,accounting,freee,moneyforward,yayoi,tax,invoice,japan,automation"
read -r -d '' PRODUCT_2_DESC << 'EOF' || true
### Japanese Accounting Is Complex. Your Tools Should Not Be.

10 Claude Code AI agent skills that handle the full financial lifecycle: payment processing (PayPay, Airpay, Square) → bookkeeping (freee, MoneyForward, Yayoi) → invoicing (Misoca) → tax filing (e-Tax).

**No more manual data entry between systems. No more missed invoices.**

---

### The 10 Skills

1. **freee-agent** -- freee accounting & HR (journal entries, P/L, B/S, tax returns)
2. **moneyforward-agent** -- MoneyForward Cloud (bookkeeping, expenses, invoices)
3. **yayoi-agent** -- Yayoi accounting & sales (SMB accounting automation)
4. **misoca-agent** -- Misoca invoice management (estimates, invoices, tracking)
5. **paypay-biz** -- PayPay Business (sales tracking, payment analytics)
6. **airpay-agent** -- Airpay multi-payment terminal management
7. **square-japan** -- Square Japan POS & payments
8. **jp-tax-calc** -- Japanese tax calculation (income, consumption 8%/10%, resident)
9. **e-tax-agent** -- e-Tax electronic filing support
10. **japan-invoice** -- Qualified Invoice (Tekikaku Seikyusho) compliance

---

### End-to-End Financial Flow

Payment comes in → Auto-journaling → Invoice generation → Tax calculation → e-Tax filing. All from your terminal. All compliant.

### Who This Is For

- Accountants managing clients across freee, MoneyForward, Yayoi
- Tax accountants (zeirishi) wanting AI-assisted calculation
- Sole proprietors handling their own books and tax returns
- Store owners using PayPay/Airpay/Square needing automated bookkeeping

### Requirements

- Claude Code installed and configured
- ClawHub CLI (`npx clawhub@latest install hanabi-jpn/finance-accounting-pack`)
- API keys for accounting/payment platforms you use

### 30-Day Money-Back Guarantee

Email hanabi.jpn.dev@gmail.com within 30 days for a full refund. No questions asked.

---

Built by hanabi-jpn | github.com/hanabi-jpn | hanabi.jpn.dev@gmail.com
EOF

# --- Product 3: Marketing & Growth Pack ---
PRODUCT_3_NAME="Marketing & Growth Pack -- 8 AI Agent Skills for Japanese Marketing"
PRODUCT_3_PRICE=3900
PRODUCT_3_TAGS="claude-code,ai-agent,seo,marketing,google-ads,ga4,social-media,japan,automation,hubspot"
read -r -d '' PRODUCT_3_DESC << 'EOF' || true
### Marketing Tools Built for English Won't Work in Japan. These Will.

8 Claude Code AI agent skills purpose-built for Japanese digital marketing. Write SEO articles with proper co-occurrence keywords. Humanize AI text to sound natural in Japanese. Manage Google Ads. Analyze GA4. Post across X, Instagram, and LINE.

**The full marketing funnel. Japan-optimized. CLI-powered.**

---

### The 8 Skills

1. **jp-seo-writer** -- Japanese SEO article generator (co-occurrence, E-E-A-T)
2. **jp-humanizer** -- AI text naturalizer for Japanese (500+ patterns, 4 modes)
3. **google-ads-agent** -- Google Ads campaign management (API integration)
4. **ga4-search-console** -- GA4 + Search Console unified analytics
5. **google-maps-biz** -- Google Business Profile & MEO optimization
6. **social-media-publisher** -- Multi-platform posting (X, Instagram, Facebook, LINE)
7. **sansan-agent** -- Sansan business card management & lead tracking
8. **hubspot-japan** -- HubSpot CRM for Japan (lead nurturing, pipelines)

---

### The Growth Loop

Create SEO content → Polish with humanizer → Distribute on social → Amplify with ads → Measure in GA4 → Capture leads in CRM → Optimize local presence → Repeat.

### Who This Is For

- Content marketers producing Japanese SEO articles
- PPC specialists managing Google Ads for Japan
- Social media managers posting across X, Instagram, LINE
- Sales managers using Sansan and HubSpot for Japanese B2B

### Requirements

- Claude Code installed and configured
- ClawHub CLI (`npx clawhub@latest install hanabi-jpn/marketing-growth-pack`)
- API keys for Google, social platforms, CRM tools you use

### 30-Day Money-Back Guarantee

Email hanabi.jpn.dev@gmail.com within 30 days for a full refund. No questions asked.

---

Built by hanabi-jpn | github.com/hanabi-jpn | hanabi.jpn.dev@gmail.com
EOF

# --- Product 4: Business Ops Pack ---
PRODUCT_4_NAME="Business Ops Pack -- 13 AI Agent Skills for Japanese Business Operations"
PRODUCT_4_PRICE=4900
PRODUCT_4_TAGS="claude-code,ai-agent,kintone,chatwork,slack,line,smarthr,backlog,japan,automation,business"
read -r -d '' PRODUCT_4_DESC << 'EOF' || true
### Your Team Uses 10 Different Tools. None of Them Talk to Each Other.

13 Claude Code AI agent skills that wire together the SaaS tools Japanese companies actually use. Chatwork, kintone, Backlog, KING OF TIME, SmartHR, LINE, Slack, Notion, and more -- all connected through your terminal.

**13 tools. 1 interface. Zero copy-pasting between tabs.**

---

### The 13 Skills

**Communication (5)**
1. **line-agent** -- LINE Official Account (96M+ users, auto-response, CRM)
2. **chatwork-agent** -- Chatwork business chat (messages, tasks, files)
3. **slack-japan-agent** -- Slack Japanese workflows (channels, bots, automation)
4. **line-works-agent** -- LINE WORKS enterprise (bots, boards, calendar)
5. **lark-workflow** -- Lark/Feishu automation (approvals, bots, docs)

**Project & Knowledge (4)**
6. **kintone-agent** -- kintone business apps (30,000+ companies use it)
7. **backlog-agent** -- Backlog project management (issues, Wiki, Git)
8. **jooto-agent** -- Jooto task management (kanban, Gantt, progress)
9. **notion-jp** -- Notion JP templates (20+ templates, meeting notes)

**HR & Administration (3)**
10. **smarthr-agent** -- SmartHR HR/labor (onboarding, payslips, year-end)
11. **kingof-time-agent** -- KING OF TIME attendance (clock, shifts, overtime)
12. **cybozu-garoon** -- Garoon groupware (schedule, facilities, workflows)

**Hub (1)**
13. **google-workspace-agent** -- Google Workspace (Gmail, Calendar, Drive, Meet)

---

### Cross-Tool Automation

- Slack message → kintone record creation
- KING OF TIME attendance → SmartHR sync
- Backlog issue completed → Chatwork notification
- LINE customer inquiry → kintone CRM entry

### Who This Is For

- General affairs managers coordinating across communication tools
- HR managers using SmartHR and KING OF TIME
- Project managers running Backlog or Jooto
- DX officers integrating kintone with other tools

### Requirements

- Claude Code installed and configured
- ClawHub CLI (`npx clawhub@latest install hanabi-jpn/business-ops-pack`)
- API keys/tokens for the tools you use

### 30-Day Money-Back Guarantee

Email hanabi.jpn.dev@gmail.com within 30 days for a full refund. No questions asked.

---

Built by hanabi-jpn | github.com/hanabi-jpn | hanabi.jpn.dev@gmail.com
EOF

# --- Product 5: All-in-One Bundle ---
PRODUCT_5_NAME="All-in-One Bundle -- 43 AI Agent Skills for Japanese Business"
PRODUCT_5_PRICE=14900
PRODUCT_5_TAGS="claude-code,ai-agent,japan,business,automation,ec,accounting,marketing,operations,bundle"
read -r -d '' PRODUCT_5_DESC << 'EOF' || true
### The Complete Japanese Business Automation Toolkit. 37% Off.

Every skill we make. Every pack we sell. **43 Claude Code AI agent skills** covering EC, finance, marketing, and business operations for the Japanese market. One purchase. $87 saved.

**Normally $236 if purchased separately. Bundle price: $149.**

---

### All 5 Packs Included

**EC Master Pack (9 skills)** -- normally $49
Rakuten, Amazon, Yahoo Shopping, Mercari, Shopify, EC-CUBE, BASE/STORES, MakeShop, Stripe Japan.

**Finance & Accounting Pack (10 skills)** -- normally $49
freee, MoneyForward, Yayoi, Misoca, PayPay, Airpay, Square, jp-tax-calc, e-Tax, Invoice.

**Marketing & Growth Pack (8 skills)** -- normally $39
JP SEO Writer, JP Humanizer, Google Ads, GA4, Google Maps/MEO, Social Media, Sansan, HubSpot.

**Business Ops Pack (13 skills)** -- normally $49
LINE, Chatwork, Slack, LINE WORKS, Lark, kintone, Backlog, Jooto, Notion JP, SmartHR, KING OF TIME, Garoon, Google Workspace.

**Bonus: n8n Japan Templates (5 workflows)** -- normally $49
ChatWork Notification Hub, Stripe Payment Flow, Social Media Scheduler, GA4 Weekly Report, kintone Sync.

---

### 43 Skills. 40+ Japanese Platforms. $3.47/skill.

| Option | Price | Per Skill |
|--------|-------|-----------|
| All packs separately | $236 | $5.49 avg |
| **All-in-One Bundle** | **$149** | **$3.47 avg** |
| **You save** | **$87** | **37%** |

### Who This Is For

- DX officers rolling out AI automation across their organization
- IT consulting firms serving Japanese SMB clients
- Startup CTOs wanting complete platform coverage from day one
- Agencies managing clients across different Japanese SaaS platforms
- Anyone who looked at 2+ packs and thought "I should get everything"

### Requirements

- Claude Code installed and configured
- ClawHub CLI for installation
- n8n instance (for bonus template pack)

### Already Bought a Single Pack?

Email hanabi.jpn.dev@gmail.com with your Gumroad receipt -- we'll provide a discount code for the price difference.

### 30-Day Money-Back Guarantee

Email hanabi.jpn.dev@gmail.com within 30 days for a full refund. No questions asked.

---

Built by hanabi-jpn | github.com/hanabi-jpn | hanabi.jpn.dev@gmail.com
EOF

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
echo "=============================================="
echo "  Gumroad Product Creator -- hanabi-jpn"
echo "  5 Product Packs"
echo "=============================================="
echo ""

if [[ "$DRY_RUN" == true ]]; then
    echo "  *** DRY RUN MODE -- No API calls will be made ***"
    echo ""
fi

# Check for access token (skip in dry-run)
if [[ "$DRY_RUN" == false ]]; then
    if [[ -z "${GUMROAD_ACCESS_TOKEN:-}" ]]; then
        echo "ERROR: GUMROAD_ACCESS_TOKEN environment variable is not set."
        echo ""
        echo "To get an access token:"
        echo "  1. Go to https://gumroad.com/settings/advanced#application-form"
        echo "  2. Create an application (or use an existing one)"
        echo "  3. Generate an access token"
        echo "  4. Run: export GUMROAD_ACCESS_TOKEN=\"your_token_here\""
        echo "  5. Then re-run this script"
        exit 1
    fi
    echo "[OK] Access token: set (${GUMROAD_ACCESS_TOKEN:0:8}...)"
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
echo "[OK] Required tools: curl, jq"
echo ""

# ---------------------------------------------------------------------------
# Initialize results file
# ---------------------------------------------------------------------------
echo '{"created_at": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'", "dry_run": '$DRY_RUN', "products": []}' > "$RESULTS_FILE"

# ---------------------------------------------------------------------------
# Function: Create a single product
# ---------------------------------------------------------------------------
create_product() {
    local num="$1"
    local name="$2"
    local price="$3"
    local tags="$4"
    local description="$5"

    local price_display
    price_display=$(echo "scale=2; $price / 100" | bc)

    echo "----------------------------------------------"
    echo "  Product #${num}: ${name}"
    echo "  Price: \$${price_display}"
    echo "----------------------------------------------"

    if [[ "$DRY_RUN" == true ]]; then
        echo "  [DRY RUN] Would create product:"
        echo "    Name:  $name"
        echo "    Price: $price cents (\$${price_display})"
        echo "    Tags:  $tags"
        echo "    Description length: ${#description} chars"
        echo ""

        # Add to results file (dry run entry)
        local tmp
        tmp=$(jq --arg num "$num" \
                 --arg name "$name" \
                 --arg price "$price" \
                 --arg status "dry_run" \
                 '.products += [{"number": $num, "name": $name, "price_cents": ($price | tonumber), "status": $status}]' \
                 "$RESULTS_FILE")
        echo "$tmp" > "$RESULTS_FILE"
        return 0
    fi

    # --- Create the product via API ---
    echo "  >>> Creating product on Gumroad..."

    local create_response
    create_response=$(curl -s -X POST "${API_BASE}/products" \
        -F "access_token=${GUMROAD_ACCESS_TOKEN}" \
        -F "name=${name}" \
        -F "price=${price}" \
        -F "description=${description}" \
        -F "customizable_price=true" \
        -F "preview_url=https://github.com/hanabi-jpn" \
        -F "tags[]=${tags}" \
    )

    local success
    success=$(echo "$create_response" | jq -r '.success // false')

    if [[ "$success" != "true" ]]; then
        echo "  [ERROR] Failed to create product #${num}."
        echo "  API Response:"
        echo "$create_response" | jq . 2>/dev/null || echo "$create_response"
        echo ""

        # Log failure
        local tmp
        tmp=$(jq --arg num "$num" \
                 --arg name "$name" \
                 --arg price "$price" \
                 --arg status "failed" \
                 --arg error "$(echo "$create_response" | jq -r '.message // "unknown error"')" \
                 '.products += [{"number": $num, "name": $name, "price_cents": ($price | tonumber), "status": $status, "error": $error}]' \
                 "$RESULTS_FILE")
        echo "$tmp" > "$RESULTS_FILE"
        return 1
    fi

    local product_id product_url
    product_id=$(echo "$create_response" | jq -r '.product.id')
    product_url=$(echo "$create_response" | jq -r '.product.short_url // .product.permalink // "N/A"')

    echo "  [OK] Product created!"
    echo "       ID:  $product_id"
    echo "       URL: $product_url"

    # --- Publish the product ---
    echo "  >>> Publishing product..."

    local publish_response publish_success
    publish_response=$(curl -s -X PUT "${API_BASE}/products/${product_id}" \
        -F "access_token=${GUMROAD_ACCESS_TOKEN}" \
        -F "published=true" \
    )
    publish_success=$(echo "$publish_response" | jq -r '.success // false')

    if [[ "$publish_success" == "true" ]]; then
        echo "  [OK] Product published!"
    else
        echo "  [WARN] Could not auto-publish. Publish manually at:"
        echo "         https://app.gumroad.com/products/${product_id}/edit"
    fi

    # --- Log success ---
    local tmp
    tmp=$(jq --arg num "$num" \
             --arg name "$name" \
             --arg price "$price" \
             --arg status "created" \
             --arg product_id "$product_id" \
             --arg url "$product_url" \
             --argjson published "$(echo "$publish_success"| jq -R 'if . == "true" then true else false end')" \
             '.products += [{"number": $num, "name": $name, "price_cents": ($price | tonumber), "status": $status, "product_id": $product_id, "url": $url, "published": $published}]' \
             "$RESULTS_FILE")
    echo "$tmp" > "$RESULTS_FILE"

    echo "       Edit: https://app.gumroad.com/products/${product_id}/edit"
    echo ""
    return 0
}

# ---------------------------------------------------------------------------
# Create products
# ---------------------------------------------------------------------------
CREATED=0
FAILED=0
TOTAL=0

process_product() {
    local num="$1"
    local name_var="PRODUCT_${num}_NAME"
    local price_var="PRODUCT_${num}_PRICE"
    local tags_var="PRODUCT_${num}_TAGS"
    local desc_var="PRODUCT_${num}_DESC"

    TOTAL=$((TOTAL + 1))

    if create_product "$num" "${!name_var}" "${!price_var}" "${!tags_var}" "${!desc_var}"; then
        CREATED=$((CREATED + 1))
    else
        FAILED=$((FAILED + 1))
    fi
}

if [[ -n "$SINGLE_PRODUCT" ]]; then
    # Create a single product
    if [[ "$SINGLE_PRODUCT" -lt 1 || "$SINGLE_PRODUCT" -gt 5 ]]; then
        echo "ERROR: Product number must be between 1 and 5."
        exit 1
    fi
    process_product "$SINGLE_PRODUCT"
else
    # Create all products
    for i in 1 2 3 4 5; do
        process_product "$i"
    done
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "=============================================="
echo "  Summary"
echo "=============================================="
echo ""
if [[ "$DRY_RUN" == true ]]; then
    echo "  Mode:    DRY RUN (no products created)"
else
    echo "  Mode:    LIVE"
fi
echo "  Total:   $TOTAL"
echo "  Created: $CREATED"
echo "  Failed:  $FAILED"
echo ""
echo "  Results saved to: $RESULTS_FILE"
echo ""

if [[ "$DRY_RUN" == false && "$CREATED" -gt 0 ]]; then
    echo "  Next steps:"
    echo "    1. Visit each product URL to verify the listing"
    echo "    2. Add cover images (1280x720) in each product editor"
    echo "    3. Upload ZIP files with skill packages"
    echo "    4. Create discount codes if needed"
    echo "    5. Share product URLs on social media"
    echo ""
fi

# Print results summary
echo "  Product details:"
jq -r '.products[] | "    #\(.number) \(.name) -- \(.status) \(.url // "")"' "$RESULTS_FILE"
echo ""
echo "Done!"
