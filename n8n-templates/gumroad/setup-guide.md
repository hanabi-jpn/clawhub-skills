# n8n Japan Business Automation Pack -- Setup Guide

*Version 1.0 | by hanabi-jpn*

This guide walks you through importing, configuring, testing, and activating each of the 5 workflow templates included in this pack.

**Estimated setup time:** 15-30 minutes per template (depending on how many API keys you already have).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Import a Workflow into n8n](#step-1-import-a-workflow-into-n8n)
3. [Step 2: Configure Environment Variables](#step-2-configure-environment-variables)
4. [Step 3: Test the Workflow](#step-3-test-the-workflow)
5. [Step 4: Activate the Workflow](#step-4-activate-the-workflow)
6. [Template-Specific Configuration](#template-specific-configuration)
   - [ChatWork Notification Hub](#chatwork-notification-hub)
   - [Stripe Japan Payment Flow](#stripe-japan-payment-flow)
   - [Social Media Cross-Post Scheduler](#social-media-cross-post-scheduler)
   - [GA4 Weekly Report](#ga4-weekly-report)
   - [kintone Bi-Directional Sync](#kintone-bi-directional-sync)
7. [Swapping ChatWork for Slack](#swapping-chatwork-for-slack)
8. [Troubleshooting](#troubleshooting)
9. [Getting Help](#getting-help)

---

## Prerequisites

Before you begin, make sure you have:

- **An n8n instance** running v1.0 or later (self-hosted or n8n Cloud)
- **Admin access** to create workflows and set environment variables
- **API keys** for the services you plan to connect (details below)
- **A web browser** to access your n8n dashboard

### n8n Environment Variables Setup

All templates use n8n environment variables (accessed via `$env.VARIABLE_NAME` in expressions). To set these:

**n8n Cloud:**
1. Go to Settings > Environment Variables
2. Add each variable listed below
3. Save and restart workflows if needed

**Self-hosted (Docker):**
Add variables to your `docker-compose.yml` or `.env` file:
```
N8N_ENVIRONMENT_VARIABLES=CHATWORK_API_TOKEN=your_token,CHATWORK_DEPLOY_ROOM_ID=12345
```

Or set them as system environment variables that n8n can read.

**Self-hosted (npm):**
Export them before starting n8n:
```bash
export CHATWORK_API_TOKEN="your_token"
export CHATWORK_DEPLOY_ROOM_ID="12345"
n8n start
```

---

## Step 1: Import a Workflow into n8n

### Method A: Web UI (Recommended)

1. Log in to your n8n instance
2. Click the **"+"** button in the top left to create a new workflow
3. Click the **three-dot menu** (top right corner of the canvas)
4. Select **"Import from File..."**
5. Navigate to the `workflows/` folder and select the `.json` file you want to import
6. The workflow will appear on your canvas with all nodes pre-configured
7. Repeat for each template you want to use

### Method B: n8n CLI

```bash
n8n import:workflow --input=workflows/chatwork-notification.json
n8n import:workflow --input=workflows/stripe-payment-flow.json
n8n import:workflow --input=workflows/social-media-scheduler.json
n8n import:workflow --input=workflows/ga4-weekly-report.json
n8n import:workflow --input=workflows/kintone-sync.json
```

### Method C: n8n REST API

```bash
curl -X POST "https://your-n8n-instance.com/api/v1/workflows" \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d @workflows/chatwork-notification.json
```

---

## Step 2: Configure Environment Variables

Below is the master list of every environment variable used across all 5 templates. Set only the ones needed for the templates you plan to use.

### Shared Variables (used by multiple templates)

| Variable | Used By | How to Get It |
|----------|---------|---------------|
| `CHATWORK_API_TOKEN` | All 5 templates | ChatWork > Personal Settings > API Token |
| `CHATWORK_ONCALL_ACCOUNT_ID` | ChatWork Hub, Stripe | ChatWork > Contact list > click user > URL contains the ID |

### ChatWork Room IDs

| Variable | Template | Description |
|----------|----------|-------------|
| `CHATWORK_DEPLOY_ROOM_ID` | ChatWork Hub | Room for deployment notifications |
| `CHATWORK_ERROR_ROOM_ID` | ChatWork Hub | Room for error alerts |
| `CHATWORK_TEAM_ROOM_ID` | ChatWork Hub | Room for daily greetings |
| `CHATWORK_SALES_ROOM_ID` | Stripe | Room for payment notifications |
| `CHATWORK_MARKETING_ROOM_ID` | Social Media, GA4 | Room for marketing updates |
| `CHATWORK_OPS_ROOM_ID` | kintone Sync | Room for sync status |

**How to find a ChatWork Room ID:** Open the room in your browser. The URL will be `https://www.chatwork.com/#!rid12345678`. The number after `rid` is your Room ID.

### Stripe Variables

| Variable | How to Get It |
|----------|---------------|
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Developers > Webhooks > Add endpoint > Copy signing secret |
| `GOOGLE_SHEET_ID` | The long string in your Google Sheet URL: `https://docs.google.com/spreadsheets/d/THIS_PART/edit` |

### Social Media Variables

| Variable | How to Get It |
|----------|---------------|
| `CONTENT_SHEET_ID` | Same as GOOGLE_SHEET_ID format -- the ID from your content calendar Sheet URL |
| `X_API_KEY` | X Developer Portal > Project > Keys and Tokens > API Key |
| `X_API_SECRET` | X Developer Portal > Project > Keys and Tokens > API Key Secret |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Meta Business Suite > Settings > Business Account ID, or via Graph API |
| `INSTAGRAM_ACCESS_TOKEN` | Meta Developers > Your App > Generate long-lived token |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Developers Console > Messaging API > Channel access token |

### GA4 Variables

| Variable | How to Get It |
|----------|---------------|
| `GA4_PROPERTY_ID` | Google Analytics > Admin > Property Settings > Property ID (numeric) |
| `GSC_SITE_URL` | The URL-encoded site URL, e.g., `https%3A%2F%2Fexample.com%2F` |

### kintone Variables

| Variable | How to Get It |
|----------|---------------|
| `KINTONE_DOMAIN` | Your kintone subdomain, e.g., `mycompany.cybozu.com` |
| `KINTONE_API_TOKEN` | kintone app > Settings > API Token > Generate (enable Read + Write) |
| `KINTONE_APP_ID` | The number in the kintone app URL: `https://mycompany.cybozu.com/k/APP_ID/` |
| `SYNC_SHEET_ID` | The Google Sheet ID for your sync data sheet |

---

## Step 3: Test the Workflow

Before activating any workflow, test it manually:

### For Webhook-triggered workflows (ChatWork Hub, Stripe, kintone Webhook)

1. Open the workflow in the n8n editor
2. Click **"Listen for Test Event"** on the Webhook node (or click "Execute Workflow")
3. Send a test request using curl:

**ChatWork Notification Hub test:**
```bash
curl -X POST https://your-n8n.com/webhook-test/chatwork-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "deployment",
    "service_name": "web-app",
    "version": "1.2.3",
    "environment": "production",
    "deployer": "test-user"
  }'
```

**Stripe Payment Flow test:**
Use Stripe CLI to send test events:
```bash
stripe trigger payment_intent.succeeded
```
Or use the Stripe Dashboard > Developers > Webhooks > Send test webhook.

**kintone Sync webhook test:**
```bash
curl -X POST https://your-n8n.com/webhook-test/kintone-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ADD_RECORD",
    "record": {
      "$id": {"value": "9999"},
      "会社名": {"value": "Test Company"},
      "担当者": {"value": [{"name": "Test User"}]},
      "ステータス": {"value": "商談中"},
      "売上見込": {"value": "1000000"}
    }
  }'
```

### For Schedule-triggered workflows (GA4 Report, Social Media, Daily Greeting)

1. Open the workflow in the n8n editor
2. Click the **Schedule Trigger** node
3. Click **"Execute Node"** to simulate a trigger event
4. Watch the execution flow through each subsequent node
5. Check for errors by clicking on any node with a red indicator

### Verifying results

After running a test:
- Check your ChatWork rooms for the notification message
- Check your Google Sheet for logged data (Stripe, kintone)
- Check your social media accounts for test posts (Social Media Scheduler -- be careful with live accounts!)

---

## Step 4: Activate the Workflow

Once testing is successful:

1. Click the **toggle switch** in the top right corner of the workflow editor (or the Active toggle in the workflow list)
2. The workflow will turn green/active
3. Schedule-triggered workflows will begin running at their configured times
4. Webhook-triggered workflows will start listening for incoming requests

**Important reminders:**
- Schedule times assume JST (Asia/Tokyo) timezone. Make sure your n8n instance timezone is set correctly: Settings > General > Timezone > `Asia/Tokyo`
- Webhook URLs change between test and production mode. Make sure external services point to the production webhook URL (without `-test` in the path)

---

## Template-Specific Configuration

### ChatWork Notification Hub

**Required Environment Variables:**
- `CHATWORK_API_TOKEN`
- `CHATWORK_DEPLOY_ROOM_ID`
- `CHATWORK_ERROR_ROOM_ID`
- `CHATWORK_TEAM_ROOM_ID`
- `CHATWORK_ONCALL_ACCOUNT_ID`

**Webhook URL to share with your CI/CD and monitoring systems:**
```
https://your-n8n.com/webhook/chatwork-webhook
```

**Payload format:**
```json
{
  "event_type": "deployment" | "error",
  "service_name": "your-service",
  "version": "1.0.0",
  "environment": "production",
  "deployer": "username",
  "error_message": "Error description (for errors)",
  "severity": "critical" | "warning" | "info",
  "stack_trace": "Full stack trace (for errors)"
}
```

**Daily greeting schedule:** Weekdays at 9:00 AM JST. To change the time, edit the cron expression in the "Daily 9AM Trigger" node. Example: `0 8 * * 1-5` for 8 AM.

---

### Stripe Japan Payment Flow

**Required Environment Variables:**
- `STRIPE_WEBHOOK_SECRET`
- `CHATWORK_API_TOKEN`
- `CHATWORK_SALES_ROOM_ID`
- `CHATWORK_ONCALL_ACCOUNT_ID`
- `GOOGLE_SHEET_ID`

**Google Sheets setup:**
1. Create a new Google Sheet (or use an existing one)
2. Rename the first tab to `Payments`
3. Add these headers in row 1: `Date | Payment ID | Amount | Currency | Method | Customer Email | Description | Receipt URL`
4. Share the sheet with your n8n Google OAuth service account

**Stripe webhook setup:**
1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-n8n.com/webhook/stripe-webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.dispute.created`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`) and set it as `STRIPE_WEBHOOK_SECRET`

**Google OAuth2 credential in n8n:**
1. In n8n, go to Credentials > Add Credential > Google OAuth2 API
2. Set scopes to include `https://www.googleapis.com/auth/spreadsheets`
3. Complete the OAuth flow
4. This credential is used by the "Log to Google Sheets" node

---

### Social Media Cross-Post Scheduler

**Required Environment Variables:**
- `CONTENT_SHEET_ID`
- `X_API_KEY` / `X_API_SECRET`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `INSTAGRAM_ACCESS_TOKEN`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `CHATWORK_API_TOKEN`
- `CHATWORK_MARKETING_ROOM_ID`

**Google Sheets content calendar setup:**
1. Create a Google Sheet and name the first tab `ContentCalendar`
2. Add headers in row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Date | Hour (JST) | X Text | Instagram Caption | LINE Message | Image URL | Status |

3. Example row:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 2026-03-10 | 12 | Spring sale! Check our new items | Spring sale! New items available. #sakura #spring | Spring sale details -- check our store for 20% off | https://example.com/image.jpg | scheduled |

4. The `Status` column should be `scheduled` for posts waiting to go out. The workflow does not update this column automatically -- you can add a node to do so if needed.

**Schedule:** Posts at 10:00, 12:00, and 18:00 JST on weekdays (Mon-Fri). To change times, edit the cron expression in the "Post Schedule" node.

**X/Twitter OAuth1 credentials in n8n:**
1. Go to the [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a project and app (Free tier is sufficient for posting)
3. Generate OAuth 1.0a credentials (Consumer Key + Secret, Access Token + Secret)
4. In n8n, create an OAuth1 API credential with these values

**Instagram setup:**
1. You need a Facebook Business Page connected to an Instagram Professional account
2. Get your Business Account ID from Meta Business Suite or via the Graph API
3. Generate a long-lived access token from the Meta Developers portal

**LINE Messaging API setup:**
1. Create a channel at [LINE Developers Console](https://developers.line.biz/console/)
2. Choose Messaging API
3. Issue a Channel access token (long-lived)
4. Note: The broadcast endpoint sends to all followers. For targeted messages, modify the workflow to use the push message API.

---

### GA4 Weekly Report

**Required Environment Variables:**
- `GA4_PROPERTY_ID`
- `GSC_SITE_URL`
- `CHATWORK_API_TOKEN`
- `CHATWORK_MARKETING_ROOM_ID`

**Google OAuth2 credential in n8n:**
1. In Google Cloud Console, enable these APIs:
   - Google Analytics Data API (GA4)
   - Google Search Console API
2. Create OAuth2 credentials (or use existing ones)
3. In n8n, create a Google OAuth2 API credential with scopes:
   - `https://www.googleapis.com/auth/analytics.readonly`
   - `https://www.googleapis.com/auth/webmasters.readonly`
4. Assign this credential to the three HTTP Request nodes: "GA4 Overview Metrics", "GA4 Channel Breakdown", and "Search Console Top Keywords"

**Finding your GA4 Property ID:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click Admin (gear icon, bottom left)
3. Under Property, click Property Settings
4. The Property ID is the numeric value (e.g., `123456789`)

**Finding your Search Console Site URL:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Your property URL is shown in the property selector
3. URL-encode it: `https://example.com/` becomes `https%3A%2F%2Fexample.com%2F`

**Schedule:** Every Monday at 9:00 AM JST. To change, edit the cron expression in the "Every Monday 9AM JST" node.

---

### kintone Bi-Directional Sync

**Required Environment Variables:**
- `KINTONE_DOMAIN`
- `KINTONE_API_TOKEN`
- `KINTONE_APP_ID`
- `SYNC_SHEET_ID`
- `CHATWORK_API_TOKEN`
- `CHATWORK_OPS_ROOM_ID`

**Google Sheets setup:**
1. Create a Google Sheet and name the first tab `SyncData`
2. Add headers in row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Record ID | Company | Contact | Status | Amount | Updated |

3. This sheet will be populated by the sync workflow. You can also add rows manually -- prefix the Record ID with `NEW-` (e.g., `NEW-001`) for records that should be created in kintone.

**kintone app setup:**
1. Your kintone app must have these fields (or you need to edit the workflow to match your field names):
   - `会社名` (Text) -- Company name
   - `担当者` (User select) -- Contact person
   - `ステータス` (Dropdown) -- Status
   - `売上見込` (Number) -- Estimated revenue
   - `更新日時` (Updated datetime, auto-generated) -- Last updated

2. Generate an API token:
   - Open your kintone app
   - Go to Settings > API Token
   - Generate a token with Read and Write permissions
   - Copy the token and set it as `KINTONE_API_TOKEN`

**kintone webhook setup (for real-time sync):**
1. In your kintone app, go to Settings > Webhooks
2. Add a webhook URL: `https://your-n8n.com/webhook/kintone-webhook`
3. Select events: Record Add, Record Edit, Record Delete
4. Save and activate

**Sync schedule:** Every 15 minutes. To change, edit the cron expression in the "Every 15 Minutes" node. Example: `*/30 * * * *` for every 30 minutes.

---

## Swapping ChatWork for Slack

All 5 templates use ChatWork as the notification channel. If your team uses Slack instead:

1. **Delete** the ChatWork HTTP Request node
2. **Add** an n8n Slack node (available as a built-in integration)
3. **Configure** the Slack node:
   - Set your Slack OAuth credential
   - Choose the target channel
   - Map the message body from the previous node's output
4. **Connect** the new Slack node where the ChatWork node was

**Message format changes:**
- ChatWork uses `[info][title]...[/title]...[/info]` blocks
- Slack uses Block Kit or plain markdown
- Replace `[info]` blocks with Slack markdown formatting (bold with `*text*`, code with backticks)

The core workflow logic remains identical. Only the final notification node changes.

---

## Troubleshooting

### Common Issues

**"Expression evaluation error" or "Cannot read property of undefined"**
- Cause: An environment variable is not set or is misspelled
- Fix: Go to Settings > Environment Variables and verify every variable needed by the template is present and correctly spelled. Variable names are case-sensitive.

**Webhook returns 404**
- Cause: The workflow is not active, or the URL path is wrong
- Fix: Make sure the workflow is toggled ON (active). Verify the webhook path matches what you configured in the external service. Remember that test URLs contain `-test` in the path.

**"CHATWORK_API_TOKEN is invalid" (401 error)**
- Cause: Expired or incorrect ChatWork API token
- Fix: Generate a new token at ChatWork > Personal Settings > API Token. Update the environment variable.

**Google OAuth "invalid_grant" error**
- Cause: OAuth refresh token has expired or been revoked
- Fix: In n8n, go to Credentials > find your Google OAuth2 credential > reconnect and re-authorize.

**Stripe webhook signature verification fails**
- Cause: The `STRIPE_WEBHOOK_SECRET` doesn't match the endpoint
- Fix: In Stripe Dashboard > Webhooks, find your endpoint and copy the signing secret again. Make sure you're using the secret for the correct endpoint (test vs. live).

**kintone "403 Forbidden" error**
- Cause: API token doesn't have the required permissions
- Fix: In your kintone app settings, regenerate the API token and make sure both Read and Write permissions are checked.

**Schedule trigger not firing at expected time**
- Cause: n8n instance timezone is not set to JST
- Fix: Go to n8n Settings > General > set Timezone to `Asia/Tokyo`. Alternatively, adjust the cron expressions to UTC (JST = UTC+9).

**Social Media Scheduler posts are not going out**
- Cause: The content calendar date/hour doesn't match the current date/time in JST, or the Status column is already set to "published"
- Fix: Verify the date format is `YYYY-MM-DD`, the hour is a number (10, 12, or 18), and the Status column says `scheduled`.

**GA4 report shows all zeros**
- Cause: Wrong GA4 Property ID, or the OAuth credential doesn't have access to that property
- Fix: Verify the Property ID in GA4 Admin. Make sure the Google account used for OAuth has Viewer access or higher on the GA4 property.

### Debugging Tips

1. **Check execution logs:** In n8n, go to Executions (left sidebar) to see past runs, including error details for each node.
2. **Test nodes individually:** Click any node and click "Execute Node" to test it in isolation.
3. **Use the "Sticky Note" node:** Add notes to your workflow canvas to document your configuration changes.
4. **Check n8n server logs:** For self-hosted instances, check `docker logs n8n` or your process manager logs for server-side errors.

---

## Getting Help

1. **Check this guide first** -- most issues are covered in the Troubleshooting section
2. **Search the n8n community** -- [community.n8n.io](https://community.n8n.io) has answers to many common questions
3. **Email us** -- hanabi.jpn.dev@gmail.com -- include your n8n version, the template name, the error message, and a screenshot of the failing node
4. **30-day money-back guarantee** -- if we can't fix it, you get a full refund

---

*Thank you for purchasing the n8n Japan Business Automation Pack. We hope these templates save you hours of work.*

*-- hanabi-jpn*
