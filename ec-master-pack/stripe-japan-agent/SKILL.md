---
name: stripe-japan-agent
description: "Payment management for Japan — PayPay, konbini payments, subscriptions, invoicing via Stripe"
author: hanabi-jpn
version: 1.0.0
tags:
  - stripe
  - payments
  - japan
  - paypay
  - konbini
  - subscriptions
  - invoicing
  - fintech
---

```
  ____  _____  ____  ___  ____  _____
 / ___||_   _||  _ \|_ _||  _ \| ____|
 \___ \  | |  | |_) || | | |_) |  _|
  ___) | | |  |  _ < | | |  __/| |___
 |____/  |_|  |_| \_\___||_|   |_____|

       ___   __    ___   __    _  _
      | _ ) / _\  | _ \ / _\  | \| |
      _ | / /_\\  |  _// /_\\ | .` |
     |___/ /  _  \|_|  /  _  \|_|\_|
          /_/   \_\   /_/   \_\

    ~~~ Payment Intelligence for Japan ~~~
```

`stripe-japan-agent` `tekikaku-invoice` `paypay` `konbini` `jpy-native`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![JP Payments](https://img.shields.io/badge/JP_payments-PayPay%2Bkonbini-ff6b6b)]()

> **Accept every way Japan pays -- from konbini counters to PayPay QR codes, managed entirely from your terminal.**

---

## Overview

Stripe Japan Agent brings the full Stripe payment stack to the command line with first-class support for Japan-specific payment methods. In a market where credit cards account for only 30% of e-commerce transactions, supporting konbini (convenience store) payments, PayPay, and bank transfers is not optional -- it is table stakes. This agent wraps the Stripe API with opinionated defaults tuned for the Japanese market: JPY zero-decimal currency handling, proper furigana fields for customer names, and invoice formatting that complies with the Qualified Invoice System (Tekikaku Invoice) introduced in October 2023.

The agent operates in two modes. Interactive mode lets you create charges, manage subscriptions, and issue invoices through direct commands. Automation mode lets you pipe webhook events through the agent for real-time payment monitoring, automatic retry logic for failed konbini payments, and dispute response workflows. Both modes share the same authentication layer and output formatting engine.

```
  MERCHANT (CLI)
       |
       v
 +-----------+      +------------------+      +------------------+
 | Command   |----->| Stripe API       |----->| Payment Methods  |
 | Router    |      | (v2024-12-18)    |      |                  |
 +-----------+      +------------------+      | - Card (Visa/MC) |
       |                   |                  | - PayPay          |
       |                   |                  | - Konbini          |
       |                   v                  | - Bank Transfer    |
       |            +------------------+      +------------------+
       |            | Webhook Listener |             |
       |            | (localhost:4242) |             |
       |            +--------+---------+             |
       |                     |                       |
       v                     v                       v
 +-----------+      +------------------+      +------------------+
 | Dashboard |      | Event Processor  |      | Customer DB      |
 | Renderer  |<-----| (retry, notify)  |      | (Stripe-hosted)  |
 +-----------+      +------------------+      +------------------+
       |
       v
  TERMINAL OUTPUT
  (tables / receipts / reports)
```

All monetary values are handled as integers in JPY (no decimal conversion needed), and the agent automatically formats amounts with the yen symbol and thousands separators for display. Tax calculations follow the Japanese consumption tax rules with support for both 10% standard rate and 8% reduced rate for food and beverages.

---

## System Prompt Instructions

You are Stripe Japan Agent, a payment management assistant optimized for the Japanese market. Follow these rules precisely:

1. Validate `STRIPE_SECRET_KEY` before any API call. Detect whether it is a test key (`sk_test_`) or live key (`sk_live_`) and display a prominent `[TEST MODE]` or `[LIVE MODE]` indicator in all output.
2. Default currency is JPY. All amounts are integers (no decimals). Display with `¥` prefix and thousands separators: `¥12,800` not `128.00`.
3. For PayPay payments, always create a PaymentIntent with `payment_method_types: ["paypay"]` and return the authorization URL for the customer to complete payment.
4. For konbini payments, always include `payment_method_options.konbini.expires_after_days` defaulting to 3 days. Display the payment code and store instructions.
5. Never log or display full card numbers, secret keys, or webhook secrets. Mask as `****4242` for cards and `sk_****XXXX` for keys.
6. When creating customers, accept and store both `name` (roman) and `name_kana` (furigana) fields for Japanese compliance.
7. Subscription commands must specify a `price_id` or allow inline price creation with `--amount` and `--interval`. Default interval is `month`.
8. Invoice generation must comply with the Tekikaku Invoice System: include registration number (T + 13 digits), tax breakdown by rate (8%/10%), and seller information.
9. Refund commands require confirmation for amounts over ¥50,000. Use `--force` to skip confirmation in automated pipelines.
10. Dispute responses should auto-collect available evidence (shipping tracking, customer correspondence, delivery confirmation) and format it for Stripe's dispute evidence object.
11. All webhook events must be verified using `STRIPE_WEBHOOK_SECRET` before processing. Reject unverified events with a clear error.
12. Rate limit API calls to 25 requests/second (Stripe's standard limit). Queue excess requests with exponential backoff.
13. For reporting commands, query the Stripe Reporting API and format results as terminal tables. Support date ranges with `--from` and `--to` flags.
14. Track payment method distribution (card vs PayPay vs konbini vs bank transfer) in all reports to help merchants understand customer preferences.
15. When handling errors from Stripe, translate error codes into actionable Japanese-market-specific advice. For example, `card_declined` should suggest trying PayPay or konbini as alternatives.
16. Support Stripe Connect for marketplace payouts when `STRIPE_ACCOUNT_ID` is set. Route commands to the connected account context.
17. Log all operations to `~/.clawhub/stripe-japan-agent/operations.log` with timestamps, amounts, and anonymized customer references for audit purposes.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Yes | -- | Stripe secret key (test or live). Determines mode automatically. |
| `STRIPE_WEBHOOK_SECRET` | No | -- | Webhook signing secret for event verification. Required for `stripe listen`. |
| `STRIPE_ACCOUNT_ID` | No | -- | Connected account ID for Stripe Connect marketplace operations. |
| `STRIPE_DEFAULT_CURRENCY` | No | `jpy` | Default currency for all payment operations. |

---

## Commands

### `stripe charge`

Create a one-time payment intent.

```bash
$ stripe charge 4800 --method card --customer cus_PxR4m8kJnW --description "Monthly box subscription"

 [LIVE MODE]
 Payment Intent Created
 ─────────────────────────────────────────
 ID:            pi_3QxY7mBkR2f8LNWZ1a2b3c4d
 Amount:        ¥4,800
 Currency:      JPY
 Status:        succeeded
 Method:        Visa ****4242
 Customer:      cus_PxR4m8kJnW (田中太郎)
 Description:   Monthly box subscription
 Created:       2026-03-01 14:23:07 JST
 Fee:           ¥163 (3.4%)
 Net:           ¥4,637

 Receipt URL: https://pay.stripe.com/receipts/...
```

### `stripe subscribe`

Create or manage recurring subscriptions.

```bash
$ stripe subscribe cus_PxR4m8kJnW --price price_1QxMNBkR2f8LNWZ --trial-days 14

 [LIVE MODE]
 Subscription Created
 ─────────────────────────────────────────
 ID:            sub_1QxY8nCkR2f8LNWZ
 Customer:      cus_PxR4m8kJnW (田中太郎)
 Plan:          Premium Plan - ¥9,800/month
 Status:        trialing
 Trial Ends:    2026-03-15
 Next Invoice:  2026-03-15 - ¥9,800
 Payment:       Visa ****4242

 Subscription active. Customer will be charged after trial ends.
```

### `stripe invoice`

Generate and send a compliant invoice.

```bash
$ stripe invoice cus_PxR4m8kJnW --items "Web制作費:¥150,000:10%,ドメイン費用:¥3,200:10%"

 [LIVE MODE]
 Invoice Created (Tekikaku Invoice Compliant)
 ─────────────────────────────────────────
 Invoice #:     INV-2026-0301-001
 Reg. Number:   T1234567890123
 Customer:      田中太郎 (cus_PxR4m8kJnW)
 Date:          2026-03-01

 Items:
   Web制作費                      ¥150,000   (税10%)
   ドメイン費用                     ¥3,200   (税10%)
 ─────────────────────────────────────────
 Subtotal:                        ¥153,200
 消費税 (10%):                     ¥15,320
 Total:                           ¥168,520

 Status: draft | Send with: stripe invoice send inv_1QxYAb...
```

### `stripe refund`

Process a full or partial refund.

```bash
$ stripe refund pi_3QxY7mBkR2f8LNWZ1a2b3c4d --amount 2400 --reason "customer_request"

 [LIVE MODE]
 Refund Processed
 ─────────────────────────────────────────
 Refund ID:     re_3QxYBcDkR2f8LNWZ
 Payment:       pi_3QxY7mBkR2f8LNWZ1a2b3c4d
 Type:          Partial Refund
 Refund Amount: ¥2,400
 Original:      ¥4,800
 Remaining:     ¥2,400
 Reason:        Customer request
 Status:        succeeded
 ETA:           5-10 business days to customer account
```

### `stripe customers`

List and search customers.

```bash
$ stripe customers --search "tanaka" --limit 5

 #  ID                   Name       Name (Kana)    Email                   Created      Payments
 1  cus_PxR4m8kJnW       田中太郎    タナカタロウ     tanaka@example.com      2025-08-12   ¥234,800
 2  cus_QyS5n9lKoX       田中花子    タナカハナコ     hanako.t@example.com    2025-11-03   ¥89,200
 3  cus_RzT6o0mLpY       田中次郎    タナカジロウ     jiro.tanaka@corp.co.jp  2026-01-18   ¥12,400

 Showing 3 results for "tanaka" | Total customers: 1,247
```

### `stripe report`

Generate financial reports.

```bash
$ stripe report --from 2026-02-01 --to 2026-02-28

 [LIVE MODE]
 Revenue Report: February 2026
 ═══════════════════════════════════════════

 Gross Revenue:     ¥2,847,300
 Refunds:           -¥123,400
 Net Revenue:       ¥2,723,900
 Stripe Fees:       -¥96,812
 Net Payout:        ¥2,627,088

 Payment Method Breakdown:
   Credit Card:     ¥1,823,100  (64.0%)  ████████████████
   PayPay:          ¥612,400    (21.5%)  █████
   Konbini:         ¥298,600    (10.5%)  ███
   Bank Transfer:   ¥113,200    (4.0%)   █

 Subscription MRR:  ¥1,240,000
 New Customers:     84
 Churn Rate:        2.1%

 Tax Summary:
   10% rate:  Taxable ¥2,234,000 → Tax ¥223,400
   8% rate:   Taxable ¥613,300   → Tax ¥49,064
```

### `stripe paypay`

Create a PayPay payment link.

```bash
$ stripe paypay 3200 --description "オンラインコース受講料"

 [LIVE MODE]
 PayPay Payment Created
 ─────────────────────────────────────────
 ID:            pi_3QxYCeDkR2f8LNWZ
 Amount:        ¥3,200
 Method:        PayPay
 Status:        requires_action
 Expires:       2026-03-01 15:23:07 JST (1 hour)

 Authorization URL:
 https://checkout.stripe.com/c/pay/cs_live_a1b2c3d4...

 Share this link with the customer to complete PayPay payment.
 Webhook will fire on completion: payment_intent.succeeded
```

### `stripe konbini`

Create a konbini (convenience store) payment.

```bash
$ stripe konbini 8900 --customer cus_PxR4m8kJnW --expires 3

 [LIVE MODE]
 Konbini Payment Created
 ─────────────────────────────────────────
 ID:            pi_3QxYDfEkR2f8LNWZ
 Amount:        ¥8,900
 Method:        Konbini
 Status:        requires_action
 Expires:       2026-03-04 14:23:07 JST (3 days)

 Payment Instructions:
 ┌─────────────────────────────────────┐
 │  Confirmation #:  12345-67890       │
 │                                     │
 │  Pay at any:                        │
 │  - Seven-Eleven (マルチコピー機)      │
 │  - Lawson (Loppi端末)               │
 │  - FamilyMart (Famiポート)           │
 │  - Ministop                         │
 └─────────────────────────────────────┘

 Email sent to: tanaka@example.com with payment code.
```

### `stripe disputes`

Manage payment disputes and chargebacks.

```bash
$ stripe disputes --status open

 Open Disputes (3)
 ═══════════════════════════════════════════

 #  Dispute ID        Amount     Reason              Due Date     Payment
 1  dp_1QxYEgFkR2f8   ¥12,800   product_not_received 2026-03-08  pi_3Qx...abc
 2  dp_1QxYFhGkR2f8   ¥4,200    fraudulent           2026-03-05  pi_3Qx...def
 3  dp_1QxYGiHkR2f8   ¥8,900    duplicate            2026-03-12  pi_3Qx...ghi

 Total at risk: ¥25,900 | Win rate (last 90d): 68%

 Respond with: stripe disputes respond dp_1QxYEgFkR2f8 --evidence shipping_tracking
```

### `stripe dashboard`

Display a real-time terminal dashboard.

```bash
$ stripe dashboard

 ╔═══════════════════════════════════════════════════════════╗
 ║  STRIPE JAPAN DASHBOARD          2026-03-01 14:30 JST    ║
 ╠═══════════════════════════════════════════════════════════╣
 ║                                                           ║
 ║  Today's Revenue     ¥187,400    (+12.3% vs yesterday)   ║
 ║  Successful Charges  47          (98.0% success rate)     ║
 ║  Failed Charges      1           (card_declined)          ║
 ║  Active Subs         312         (MRR: ¥1,240,000)       ║
 ║  Open Disputes       3           (¥25,900 at risk)       ║
 ║                                                           ║
 ║  Last 5 Transactions:                                     ║
 ║  14:28  ¥4,800   Visa ****4242    succeeded               ║
 ║  14:15  ¥3,200   PayPay           succeeded               ║
 ║  14:02  ¥8,900   Konbini          pending                 ║
 ║  13:48  ¥12,400  Visa ****1234    succeeded               ║
 ║  13:31  ¥2,100   PayPay           succeeded               ║
 ║                                                           ║
 ╚═══════════════════════════════════════════════════════════╝
```

---

## Workflow Diagram

```
  PAYMENT LIFECYCLE
  =================

  Customer Order
       |
       v
  +----------+     Card?     +------------------+
  | Method   |-------------->| PaymentIntent    |---> Instant confirm
  | Selection|               | (card)           |
  +----------+               +------------------+
       |
       | PayPay?    +------------------+
       +----------->| PaymentIntent    |---> Auth URL ---> Customer scans
       |            | (paypay)         |       QR code ---> Webhook confirm
       |            +------------------+
       |
       | Konbini?   +------------------+
       +----------->| PaymentIntent    |---> Payment code ---> Customer pays
       |            | (konbini, 3 day) |       at store   ---> Webhook confirm
       |            +------------------+
       |
       | Transfer?  +------------------+
       +----------->| Invoice          |---> Bank details ---> Customer transfers
                    | (bank_transfer)  |                  ---> Auto-reconcile
                    +------------------+
                           |
                           v
                    +------------------+
                    | Payment Complete |
                    | -> Receipt       |
                    | -> Fulfillment   |
                    | -> Analytics     |
                    +------------------+
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `AUTH_ERROR: No such API key` | Invalid or revoked `STRIPE_SECRET_KEY` | Verify key at dashboard.stripe.com/apikeys. Ensure you are using the correct test/live key. |
| `CARD_DECLINED: insufficient_funds` | Customer's card has insufficient balance | Suggest PayPay or konbini as alternative. Use `stripe charge --method paypay` to retry with PayPay. |
| `KONBINI_EXPIRED: Payment window closed` | Customer did not pay at konbini within the expiry window | Create a new konbini payment with `stripe konbini`. Consider extending `--expires` to 5 or 7 days. |
| `WEBHOOK_SIGNATURE_INVALID` | Mismatched `STRIPE_WEBHOOK_SECRET` or tampered payload | Regenerate webhook secret at dashboard.stripe.com/webhooks. Update `STRIPE_WEBHOOK_SECRET` env var. |
| `AMOUNT_TOO_SMALL: Below minimum` | JPY charge below Stripe's minimum (¥50) | Ensure charge amount is at least ¥50. For smaller amounts, batch multiple items. |
| `CURRENCY_MISMATCH: Expected jpy` | Attempting to charge in non-JPY currency without override | Set amount in JPY (integer, no decimals) or override with `--currency usd` if intentional. |
| `DISPUTE_DEADLINE_PASSED` | Evidence submission deadline exceeded | Future disputes require response within 7-21 days. Set up `stripe disputes --watch` for alerts. |

---

## Data Storage

All persistent data is stored under `~/.clawhub/stripe-japan-agent/`:

| Path | Purpose | Format | Retention |
|---|---|---|---|
| `operations.log` | Audit log of all payment operations | JSON lines | 1 year, rotated monthly |
| `webhooks.log` | Received webhook events | JSON lines | 90 days |
| `reports/` | Generated financial reports | JSON + CSV | Permanent |
| `dispute-evidence/` | Collected dispute response evidence | Mixed (PDF, JSON) | Until dispute resolved |
| `config.json` | Agent configuration and preferences | JSON | Permanent |

---

## Comparison Table

| Feature | stripe-japan-agent | Stripe Dashboard | Square JP | PayJP | GMO Payment |
|---|---|---|---|---|---|
| PayPay Support | Yes (native) | Yes | No | No | Yes |
| Konbini Payments | Yes (all chains) | Yes | No | Yes | Yes |
| CLI-native Interface | Yes | No (web only) | No | No | No |
| Tekikaku Invoice | Auto-generated | Manual setup | No | No | Yes |
| Subscription Mgmt | Full lifecycle | Yes | Limited | Yes | Limited |
| Dispute Automation | Evidence collection | Manual | Basic | No | Manual |
| Multi-currency | JPY default + all | Yes | JPY only | JPY only | JPY + few |
| Webhook Monitoring | Terminal real-time | Web dashboard | Web only | Web only | Web only |
| Tax Rate Handling | 8% + 10% auto | Manual config | N/A | Manual | Manual |
| Financial Reports | CLI + CSV export | Web dashboard | Web only | Web only | Web only |
| Setup Complexity | 1 env var + go | Web registration | Web + device | API key | Complex |
| Fees (domestic card) | 3.4% | 3.4% | 3.25% | 3.0% | 3.2-3.5% |

---

## FAQ

**1. Do I need a Stripe account registered in Japan?**
Yes. To accept JPY payments and use Japan-specific methods (PayPay, konbini), your Stripe account must be registered as a Japanese business entity or sole proprietor.

**2. How do I switch between test and live mode?**
The agent auto-detects based on your key prefix. Use `sk_test_` keys for testing and `sk_live_` keys for production. A clear `[TEST MODE]` or `[LIVE MODE]` badge appears in all output.

**3. Are konbini payments instant?**
No. The customer receives a payment code and has a configurable window (default 3 days) to pay at a convenience store. A webhook event fires when payment is completed.

**4. What convenience stores are supported?**
Seven-Eleven, Lawson, FamilyMart, Ministop, Daily Yamazaki, and Seicomart. The payment code works at all chains automatically.

**5. How does PayPay integration work?**
The agent creates a PaymentIntent with PayPay method, which returns an authorization URL. The customer opens this URL, scans a QR code in their PayPay app, and confirms payment. A webhook notifies you of success.

**6. What is the Tekikaku Invoice System?**
Since October 2023, Japan requires qualified invoices for consumption tax credit. The agent auto-generates compliant invoices with your registration number (T + 13 digits), itemized tax rates, and required seller information.

**7. How are JPY amounts handled?**
JPY is a zero-decimal currency. All amounts are integers: `¥4,800` is sent to Stripe as `4800`, not `48.00`. The agent handles this automatically so you never deal with decimal conversion.

**8. Can I process refunds for konbini payments?**
Yes, but konbini refunds are deposited to the customer's bank account (not returned to the store). You will need the customer's bank details, which Stripe collects during the refund flow.

**9. How do I handle the 8% reduced tax rate?**
When creating invoices, specify the tax rate per item: `--items "食品:¥1,000:8%,雑貨:¥2,000:10%"`. The agent calculates and displays tax breakdown per rate category.

**10. What happens if a webhook fails?**
Stripe retries failed webhooks with exponential backoff for up to 3 days. The agent logs all received events. Use `stripe webhooks retry` to manually re-process a specific event.

**11. Can I use this for marketplace payouts with Stripe Connect?**
Yes. Set `STRIPE_ACCOUNT_ID` to route commands to a connected account. Use `stripe charge --on-behalf-of acct_XXX` for platform charges with automatic fee splitting.

**12. How do I export data for my accountant?**
Use `stripe report --from YYYY-MM-DD --to YYYY-MM-DD --format csv` to generate CSV files compatible with freee, MoneyForward, and other Japanese accounting software.
