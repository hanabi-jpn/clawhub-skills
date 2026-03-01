# ClawHub Skills — n8n Workflow Templates

## Overview

This directory contains 5 production-ready n8n workflow templates that automate common business processes using ClawHub skill patterns. Each template is a valid n8n workflow JSON file that can be imported directly into any n8n instance.

## Templates

### 1. ChatWork Notification Hub (`chatwork-notification.json`)

Multi-source alert router for ChatWork — Japan's #1 business chat platform.

**Features:**
- Webhook endpoint for receiving deployment and error notifications
- Smart routing: deployments go to the deploy room, errors go to the error room
- Automatic task creation for error investigation with deadlines
- Daily morning greeting with task reminder (weekdays 9 AM JST)
- ChatWork mention syntax (`[To:ID]`) for on-call engineer alerts

**Triggers:** Webhook (incoming events) + Schedule (daily 9 AM)

**Required Environment Variables:**
| Variable | Description |
|----------|-------------|
| `CHATWORK_API_TOKEN` | ChatWork API token |
| `CHATWORK_DEPLOY_ROOM_ID` | Room ID for deployment notifications |
| `CHATWORK_ERROR_ROOM_ID` | Room ID for error alerts |
| `CHATWORK_TEAM_ROOM_ID` | Room ID for team messages |
| `CHATWORK_ONCALL_ACCOUNT_ID` | Account ID of on-call engineer |

---

### 2. Stripe Japan Payment Flow (`stripe-payment-flow.json`)

Complete payment event processing for Stripe with Japan-specific payment methods.

**Features:**
- Webhook signature verification (HMAC-SHA256) for security
- Event routing: payment succeeded, payment failed, dispute created
- JPY zero-decimal currency formatting with yen symbol
- Payment method tracking (Card, PayPay, Konbini, Bank Transfer)
- Automatic logging to Google Sheets for accounting
- ChatWork notifications for sales team
- Dispute alerts with deadline warnings

**Triggers:** Webhook (Stripe events)

**Required Environment Variables:**
| Variable | Description |
|----------|-------------|
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `CHATWORK_API_TOKEN` | ChatWork API token |
| `CHATWORK_SALES_ROOM_ID` | Room ID for payment notifications |
| `CHATWORK_ONCALL_ACCOUNT_ID` | Account ID for dispute alerts |
| `GOOGLE_SHEET_ID` | Spreadsheet ID for payment logging |

**Stripe Webhook Setup:**
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-n8n-domain.com/webhook/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

---

### 3. Social Media Cross-Post Scheduler (`social-media-scheduler.json`)

Automated cross-platform posting to X/Twitter, Instagram, and LINE from a Google Sheets content calendar.

**Features:**
- Scheduled posting at optimal times (10 AM, 12 PM, 6 PM JST weekdays)
- Content calendar in Google Sheets with per-platform text columns
- X/Twitter posting via API v2
- Instagram two-step publishing (create media + publish)
- LINE broadcast messaging to all followers
- Aggregated results summary
- ChatWork notification to marketing team

**Triggers:** Schedule (10:00, 12:00, 18:00 JST weekdays)

**Google Sheets Format (ContentCalendar tab):**
| A: Date | B: Hour (JST) | C: X Text | D: Instagram Caption | E: LINE Message | F: Image URL | G: Status |
|---------|---------------|-----------|---------------------|-----------------|-------------|-----------|
| 2026-03-03 | 12 | Spring sale! | Spring sale! #sakura | Spring sale details | https://... | scheduled |

**Required Environment Variables:**
| Variable | Description |
|----------|-------------|
| `CONTENT_SHEET_ID` | Google Sheets spreadsheet ID |
| `X_API_KEY` / `X_API_SECRET` | X/Twitter OAuth credentials |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Instagram Business account ID |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram Graph API token |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API token |
| `CHATWORK_API_TOKEN` | ChatWork API token |
| `CHATWORK_MARKETING_ROOM_ID` | Room ID for marketing notifications |

---

### 4. GA4 Weekly Report (`ga4-weekly-report.json`)

Automated weekly analytics report combining GA4 and Google Search Console data, delivered to ChatWork.

**Features:**
- Weekly trigger every Monday at 9 AM JST
- GA4 overview metrics with week-over-week comparison
- Traffic breakdown by channel (Organic, Paid, Direct, Social, etc.)
- Top 10 Search Console keywords with clicks, impressions, and position
- Revenue tracking in JPY
- Formatted ChatWork message with `[info]` blocks

**Triggers:** Schedule (Monday 9 AM JST)

**Report Sections:**
1. Overview (Users, Sessions, Pageviews, Duration, Bounce Rate, Conversions, Revenue)
2. Traffic by Channel
3. Top 10 Search Keywords

**Required Environment Variables:**
| Variable | Description |
|----------|-------------|
| `GA4_PROPERTY_ID` | GA4 property ID (numeric) |
| `GSC_SITE_URL` | Search Console property URL (URL-encoded) |
| `CHATWORK_API_TOKEN` | ChatWork API token |
| `CHATWORK_MARKETING_ROOM_ID` | Room ID for report delivery |

**Google OAuth Setup:**
- Enable GA4 Data API and Search Console API in Google Cloud Console
- Configure OAuth2 credentials in n8n with scopes: `analytics.readonly`, `webmasters.readonly`

---

### 5. kintone Bi-Directional Sync (`kintone-sync.json`)

Two-way synchronization between Google Sheets and Cybozu kintone records.

**Features:**
- Scheduled sync every 15 minutes
- Bi-directional: Sheets to kintone AND kintone to Sheets
- Difference calculation (create, update, sync-back)
- Bulk record creation and updates via kintone REST API
- kintone webhook handler for real-time sync
- Sync status notifications to ChatWork
- Japanese field name support (会社名, ステータス, 売上見込, etc.)

**Triggers:** Schedule (every 15 min) + Webhook (kintone events)

**Google Sheets Format (SyncData tab):**
| A: Record ID | B: Company | C: Contact | D: Status | E: Amount | F: Updated |
|-------------|-----------|---------|--------|--------|---------|
| 1042 | Tech Solutions | Ishihara | 商談中 | 5400000 | 2026-03-01 |

**Required Environment Variables:**
| Variable | Description |
|----------|-------------|
| `KINTONE_DOMAIN` | kintone subdomain (e.g., `mycompany.cybozu.com`) |
| `KINTONE_API_TOKEN` | kintone API token with read/write permissions |
| `KINTONE_APP_ID` | Target kintone app ID |
| `SYNC_SHEET_ID` | Google Sheets spreadsheet ID |
| `CHATWORK_API_TOKEN` | ChatWork API token |
| `CHATWORK_OPS_ROOM_ID` | Room ID for sync notifications |

---

## How to Import

### Method 1: n8n Web UI

1. Open your n8n instance
2. Click the **"+"** button to create a new workflow
3. Click the **three dots menu** (top right) > **"Import from File"**
4. Select the desired `.json` template file
5. Configure credentials and environment variables
6. Activate the workflow

### Method 2: n8n CLI

```bash
# Import via n8n CLI
n8n import:workflow --input=/path/to/chatwork-notification.json

# Import all templates at once
for f in /path/to/n8n-templates/*.json; do
  n8n import:workflow --input="$f"
  echo "Imported: $f"
done
```

### Method 3: n8n API

```bash
# Import via REST API
curl -X POST "https://your-n8n.com/api/v1/workflows" \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d @chatwork-notification.json
```

## How to Sell on n8n Marketplace

### Publishing to n8n Community Templates

1. **Test thoroughly** — ensure all 5 templates work end-to-end
2. **Create an n8n community account** at [community.n8n.io](https://community.n8n.io)
3. **Submit templates** via the [n8n Template Submission Form](https://n8n.io/workflows/)
4. **Required information per template:**
   - Workflow name and description
   - Screenshots of the workflow canvas
   - List of required nodes and credentials
   - Step-by-step setup instructions
   - Example use cases

### Selling Premium Templates

For monetizing templates beyond the free community marketplace:

1. **Gumroad / Lemon Squeezy**: Sell template bundles as digital products
   - Price suggestion: $19-49 per template, $99-149 for the full bundle
   - Include setup video, support, and updates

2. **n8n Template Marketplace** (if available): Submit directly
   - Follow n8n's marketplace guidelines
   - Include comprehensive documentation

3. **Your Own Store**: Host on your website
   - Build a landing page showcasing each template
   - Include live demos or video walkthroughs
   - Offer installation support as an upsell

### Pricing Strategy

| Tier | Contents | Price |
|------|----------|-------|
| Free | 1 basic template (ChatWork Notification) | $0 |
| Starter | 3 templates (ChatWork + Stripe + GA4 Report) | $29 |
| Professional | All 5 templates + setup guide | $79 |
| Enterprise | All templates + custom modifications + 1hr support | $199 |

## Technical Notes

- All templates use n8n workflow JSON format compatible with n8n v1.x+
- HTTP Request nodes use v4.2 (latest stable)
- Code nodes use v2 with JavaScript
- Templates assume JST (Asia/Tokyo) timezone
- ChatWork is used as the notification channel across all templates (replaceable with Slack, LINE WORKS, etc.)
- Google OAuth2 credentials are shared across templates that use Google APIs

## Support

- Repository: https://github.com/hanabi-jpn/clawhub-skills
- Issues: https://github.com/hanabi-jpn/clawhub-skills/issues
- Author: hanabi-jpn
