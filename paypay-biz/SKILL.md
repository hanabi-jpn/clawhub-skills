---
name: "PayPay Biz"
description: "PayPay決済管理・売上分析 — 65M+ users, QR決済"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - paypay
  - payment
  - japan
  - qr-code
  - analytics
---

# PayPay Biz

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║         ┌─────────────────────┐                  ║
    ║         │   ╔═══════════╗     │                  ║
    ║         │   ║  PayPay   ║     │                  ║
    ║         │   ║  ┌─────┐  ║     │                  ║
    ║         │   ║  │ $$$ │  ║     │                  ║
    ║         │   ║  │ QR  │  ║     │                  ║
    ║         │   ║  └─────┘  ║     │                  ║
    ║         │   ╚═══════════╝     │                  ║
    ║         │                     │                  ║
    ║         │  💰 決済管理        │                  ║
    ║         │  🔄 返金処理        │                  ║
    ║         │  📊 売上分析        │                  ║
    ║         │  📱 QR生成          │                  ║
    ║         └─────────────────────┘                  ║
    ║                                                  ║
    ║      P A Y P A Y   B I Z   v1.0                 ║
    ║      ─── 6500万ユーザーの決済基盤 ───            ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-FF0033?style=for-the-badge)
![PayPay](https://img.shields.io/badge/PayPay-Business_API-FF0033?style=for-the-badge)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000?style=for-the-badge)
![Users](https://img.shields.io/badge/65M+-ユーザー対応-FF0033?style=for-the-badge)

> PayPay決済連携・売上分析エージェント。決済状況確認、返金処理、売上分析をAIで管理。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** paypay, payment, japan, fintech, analytics

---

## Overview

PayPay Biz connects to PayPay for Business API, enabling payment management, refund processing, and sales analytics for Japan's largest mobile payment platform (65M+ users). Full support for QR code payments, subscription billing, refund workflows, and real-time reconciliation.

```
┌──────────────────────────────────────────────────────────────────┐
│                    PAYPAY BIZ ARCHITECTURE                       │
│                                                                  │
│  ┌──────────┐         ┌──────────────┐        ┌──────────────┐  │
│  │ Customer  │  scan   │  PayPay Biz  │  API   │  PayPay      │  │
│  │ (PayPay   │────────▶│  (OpenClaw)  │───────▶│  for         │  │
│  │  App)     │◀────────│              │◀───────│  Business    │  │
│  └──────────┘ payment  └──────┬───────┘ result └──────┬───────┘  │
│                               │                       │          │
│                      ┌────────┼────────┐              │          │
│                      ▼        ▼        ▼              ▼          │
│                ┌────────┐┌────────┐┌────────┐  ┌────────────┐   │
│                │Payment ││Refund  ││Subscr. │  │ Settlement │   │
│                │Manager ││Engine  ││Manager │  │ (入金管理) │   │
│                └───┬────┘└───┬────┘└───┬────┘  └────────────┘   │
│                    │         │         │                          │
│                    ▼         ▼         ▼                          │
│                ┌──────────────────────────────┐                   │
│                │    Analytics & Reconciliation │                   │
│                │    売上分析・照合・手数料計算  │                   │
│                └──────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **PayPay Biz** for PayPay payment management. Follow these rules precisely when the user invokes PayPay commands. Always handle monetary values with exact precision (no floating point). All amounts are in JPY (integer yen).

### Setup

Environment variables:
- `PAYPAY_API_KEY` — PayPay for Business API key
- `PAYPAY_API_SECRET` — API secret
- `PAYPAY_MERCHANT_ID` — Merchant identifier
- `PAYPAY_ENVIRONMENT` — `sandbox` (default) or `production`
- Optional: `PAYPAY_FEE_RATE` — Merchant fee rate (default: `0.0198` for 1.98%)
- Optional: `PAYPAY_SETTLEMENT_CYCLE` — Settlement cycle (default: `monthly`)

API Base: `https://stg-api.paypay.ne.jp/v2/` (sandbox) or `https://api.paypay.ne.jp/v2/` (production)

### PayPay API Endpoint Reference

Authentication: HMAC-SHA256 signature with API key and secret. All requests include `Authorization` header with computed HMAC.

**QR Code Payment (MPM - Merchant Presented Mode):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/codes` | Create QR code for payment |
| DELETE | `/codes/{codeId}` | Delete unpaid QR code |
| GET | `/codes/payments/{merchantPaymentId}` | Get payment status by merchant ID |

**Payment Management:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payments/{merchantPaymentId}` | Get payment detail |
| POST | `/payments/preauthorize` | Pre-authorize payment (hold funds) |
| POST | `/payments/capture/{merchantPaymentId}` | Capture pre-authorized payment |
| POST | `/payments/cancel/{merchantPaymentId}` | Cancel pre-authorized payment |
| POST | `/payments` | Create direct payment (CPM mode) |

**Refunds:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/refunds` | Process refund (full or partial) |
| GET | `/refunds/{merchantRefundId}` | Get refund status |

**Subscription (Continuous Payments):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/subscription/payments` | Create subscription payment |
| GET | `/subscription/payments/{merchantPaymentId}` | Get subscription status |
| DELETE | `/subscription/user/{userAuthorizationId}` | Cancel user subscription |

**User Authorization:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/authorization` | Request user payment authorization |
| GET | `/user/authorization/{userAuthorizationId}` | Check authorization status |

**Cashback:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cashback` | Give cashback to user |
| POST | `/cashback/reversal` | Reverse cashback |
| GET | `/cashback/{merchantCashbackId}` | Check cashback status |

### Payment Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    QR CODE PAYMENT FLOW                       │
│                                                              │
│  MPM (Merchant Presented Mode):                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │ 1. Agent  │───▶│ 2. PayPay │───▶│ 3. QR Code│               │
│  │ creates   │    │ API      │    │ generated │               │
│  │ payment   │    │ /codes   │    │ (URL+img) │               │
│  └──────────┘    └──────────┘    └────┬──────┘               │
│                                       │                      │
│                                       ▼                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │ 6. Agent  │◀───│ 5. Webhook│◀───│ 4. User   │               │
│  │ confirms  │    │ or poll  │    │ scans QR  │               │
│  │ + receipt │    │ payment  │    │ + pays    │               │
│  └──────────┘    └──────────┘    └──────────┘               │
│                                                              │
│  CPM (Customer Presented Mode):                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │ 1. User   │───▶│ 2. Store  │───▶│ 3. Agent  │               │
│  │ shows     │    │ scans    │    │ sends to  │               │
│  │ barcode   │    │ barcode  │    │ PayPay API│               │
│  └──────────┘    └──────────┘    └────┬──────┘               │
│                                       │                      │
│                                       ▼                      │
│                                  ┌──────────┐               │
│                                  │ 4. Payment│               │
│                                  │ confirmed │               │
│                                  │ instantly  │               │
│                                  └──────────┘               │
└──────────────────────────────────────────────────────────────┘
```

### Core Capabilities

**1. 決済管理:**
- QRコード決済の作成・管理
- 決済状況の確認・検索
- 決済一覧（日付、金額、ステータスでフィルタ）
- 決済詳細（顧客情報、タイムスタンプ）
- サブスクリプション（継続課金）管理

**2. 返金処理:**
- 全額返金・部分返金
- 返金理由の記録
- 返金履歴管理
- 返金ポリシー自動適用

**3. 売上分析:**
- 日次/週次/月次売上レポート
- 時間帯別売上分析
- 平均決済額推移
- 決済手段別集計
- キャッシュバック・ポイント還元追跡
- 売上予測（過去トレンドベース）

**4. 入金管理:**
- 入金サイクル確認
- 入金予定額
- 入金履歴
- 手数料計算

### Reconciliation Workflow

The agent provides automated daily/monthly reconciliation between PayPay transactions and your accounting:

```
┌─────────────────────────────────────────────────┐
│          日次照合ワークフロー                     │
│                                                 │
│  Step 1: PayPay決済データ取得                    │
│  └─ 当日の全決済をAPI経由で取得                  │
│  └─ ステータス: COMPLETED, REFUNDED, CANCELLED  │
│                                                 │
│  Step 2: 売上集計                                │
│  └─ 総決済額の算出（税込）                      │
│  └─ 返金額の差し引き                            │
│  └─ 純売上の確定                                │
│                                                 │
│  Step 3: 手数料計算                              │
│  └─ 決済手数料 = 純売上 × 手数料率              │
│  └─ 入金予定額 = 純売上 - 手数料                │
│                                                 │
│  Step 4: 照合チェック                            │
│  └─ POS/EC売上データとの突合                    │
│  └─ 差異がある場合はアラート                    │
│  └─ 不一致リスト出力                            │
│                                                 │
│  Step 5: レポート出力                            │
│  └─ 日次照合レポートを生成                      │
│  └─ freee Agent連携: 自動仕訳データ送信         │
└─────────────────────────────────────────────────┘
```

### Analytics Dashboard Format

**`paypay analytics --period month`:**
```
╔══════════════════════════════════════════════════════════╗
║        PayPay 月次決済レポート — 2026年2月               ║
╠══════════════════════════════════════════════════════════╣
║ 決済件数:      1,847件    (前月比 +9.2%)                ║
║ 決済総額:      ¥5,234,800 (前月比 +11.5%)              ║
║ 平均決済額:    ¥2,834     (前月比 +2.1%)               ║
║ 返金件数:      23件       (返金率 1.2%)                ║
║ 返金額:        ¥67,200                                  ║
║ 純売上:        ¥5,167,600                               ║
╠══════════════════════════════════════════════════════════╣
║ 時間帯別決済:                                            ║
║  06-09  ██░░░░░░░░░░░░░░░░░░  8%                       ║
║  09-12  ████████░░░░░░░░░░░░  21%                      ║
║  12-15  ██████████████░░░░░░  35%  ← ピーク             ║
║  15-18  ████████████░░░░░░░░  24%                      ║
║  18-21  ████░░░░░░░░░░░░░░░░  10%                      ║
║  21-24  █░░░░░░░░░░░░░░░░░░░  2%                       ║
╠══════════════════════════════════════════════════════════╣
║ 入金情報:                                                ║
║   手数料率:    1.98%                                     ║
║   月間手数料:  ¥102,318                                  ║
║   入金予定額:  ¥5,065,282                                ║
║   次回入金日:  2026-03-15                                ║
╠══════════════════════════════════════════════════════════╣
║ PayPayポイント還元:                                       ║
║   ユーザー還元総額: ¥156,400                              ║
║   キャッシュバック: ¥23,100 (キャンペーン分)              ║
╚══════════════════════════════════════════════════════════╝
```

### Subscription Management

For recurring payments (月額課金サービス):

```
┌─────────────────────────────────────────────────┐
│          サブスクリプション管理                   │
│                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ 1. User   │───▶│ 2. Auth  │───▶│ 3. Store │  │
│  │ approves  │    │ PayPay   │    │ receives │  │
│  │ recurring │    │ saves    │    │ auth ID  │  │
│  └──────────┘    │ consent  │    └────┬─────┘  │
│                  └──────────┘         │        │
│                                       ▼        │
│                                 ┌──────────┐   │
│                                 │ Monthly  │   │
│                                 │ Charge:  │   │
│                                 │ Agent    │   │
│                                 │ auto-    │   │
│                                 │ bills    │   │
│                                 └──────────┘   │
│                                                 │
│  Subscription States:                           │
│  ACTIVE ──▶ PAUSED ──▶ ACTIVE (resume)         │
│     │                                           │
│     └──▶ CANCELLED (user or merchant)           │
│                                                 │
│  Agent monitors:                                │
│  - Payment failures (insufficient balance)      │
│  - Subscription churn rate                      │
│  - Revenue per subscriber (ARPU)                │
│  - Renewal success rate                         │
└─────────────────────────────────────────────────┘
```

### Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| INVALID_REQUEST_PARAMS | Bad request parameters | Parse error fields, show which param is invalid |
| UNAUTHORIZED | Invalid API key/secret | Prompt user to verify credentials |
| INVALID_MERCHANT | Merchant ID not found | Check `PAYPAY_MERCHANT_ID` |
| UNACCEPTABLE_OP | Operation not allowed (e.g., refund > payment) | Explain constraint to user |
| ALREADY_CAPTURED | Payment already captured | Show payment status |
| EXPIRED_QR_CODE | QR code has expired (default: 5 min) | Suggest creating new QR code |
| INSUFFICIENT_BALANCE | User has insufficient PayPay balance | Not actionable by merchant |
| RATE_LIMIT | Too many requests | Queue and retry with exponential backoff |
| INTERNAL_SERVER_ERROR | PayPay server error | Retry once, log for monitoring |

**Idempotency:** All payment creation requests use `merchantPaymentId` as idempotency key. The agent generates unique IDs and prevents duplicate charges.

### Commands

**`paypay status`** — 本日の決済サマリー
**`paypay payments [--from <date>] [--to <date>]`** — 決済一覧
**`paypay payment <id>`** — 決済詳細
**`paypay create-qr <amount> <description>`** — QRコード生成 (MPM)
**`paypay charge <barcode> <amount>`** — バーコード決済 (CPM)
**`paypay preauth <amount> <description>`** — 仮売上（与信枠確保）
**`paypay capture <payment-id>`** — 仮売上の実売上確定
**`paypay refund <payment-id> [amount]`** — 返金処理
**`paypay refunds`** — 返金履歴
**`paypay analytics [--period day|week|month]`** — 売上分析
**`paypay analytics --hourly`** — 時間帯別分析
**`paypay deposits`** — 入金予定・履歴
**`paypay fees [--month <YYYY-MM>]`** — 手数料計算
**`paypay reconcile [--date <YYYY-MM-DD>]`** — 日次照合処理
**`paypay subscription list`** — サブスクリプション一覧
**`paypay subscription create <user-auth-id> <amount>`** — 継続課金作成
**`paypay subscription cancel <id>`** — サブスクリプション解約
**`paypay cashback <user-id> <amount>`** — キャッシュバック付与
**`paypay health`** — API接続チェック＆環境確認

### PayPay Specific

- PayPay for Business Web API完全対応
- QRコード決済（MPM/CPM対応）
- PayPayあと払い対応
- PayPayポイント還元追跡
- 加盟店手数料率管理（2023年10月〜有料化: 1.98%）
- テスト環境（sandbox）完備
- Webhook通知対応（決済完了、返金完了）
- 仮売上（Pre-Authorization）対応
- キャッシュバックAPI対応
- PayPayクーポン連携

### Data Storage

```
.paypay-biz/
├── config.json              # API credentials and environment
├── cache/
│   └── payments.json        # Recent payment cache (TTL: 5m)
├── analytics/
│   ├── daily-sales.jsonl    # Daily sales aggregation
│   ├── hourly-stats.jsonl   # Hourly transaction breakdown
│   ├── fee-summary.jsonl    # Monthly fee calculations
│   └── forecasts.json       # Sales prediction model data
├── reconciliation/
│   ├── daily/
│   │   └── {YYYY-MM-DD}.json # Daily reconciliation reports
│   └── discrepancies.jsonl  # Unresolved discrepancies
├── subscriptions/
│   ├── active.json          # Active subscription list
│   └── churn-log.jsonl      # Subscription cancellation log
├── refunds/
│   └── history.jsonl        # Refund history with reasons
└── logs/
    ├── api-calls.jsonl      # API call log (7 day retention)
    ├── webhooks.jsonl       # Webhook event log
    └── errors.jsonl         # Error log
```

## PayPay Biz vs Other JP Payment Agents

| Feature | PayPay Biz | Stripe JP | Square JP |
|---------|-----------|----------|----------|
| Platform | PayPay (QR/Barcode) | Card + Konbini + Bank | Card + QR + Terminal |
| Users | **65M+ (Japan #1)** | Global developers | SMB merchants |
| Fee Rate | **1.98%** (competitive) | 3.6% | 3.25% |
| Settlement | Monthly/Weekly/Daily | 4 business days | Next business day |
| QR Payment | **Native (MPM+CPM)** | Not supported | Square QR only |
| Subscription | **Native API** | Stripe Billing | Square Subscriptions |
| Cashback | **API for merchant cashback** | Not supported | Not supported |
| Offline | **QR + Barcode** | Terminal needed | Square Terminal |
| あと払い | **PayPay あと払い** | Konbini deferred | Not supported |
| Integration | PayPay ecosystem only | Multi-gateway | Multi-gateway |
| Sandbox | **Full sandbox** | Test mode | Sandbox |
| Target | JP physical + EC stores | Global web/app | Physical retail |

## FAQ

**Q: PayPay for Business APIの申請方法は？**
A: PayPay for Business (https://business.paypay.ne.jp/) に加盟店登録後、開発者ポータルからAPIキーを取得します。sandbox環境は即座に利用可能です。本番環境は審査後に有効化されます。

**Q: MPMとCPMの違いは？**
A: MPM (Merchant Presented Mode) は加盟店がQRコードを表示し、顧客がスキャンする方式です。ECサイトに最適。CPM (Customer Presented Mode) は顧客がバーコードを表示し、加盟店がスキャンする方式です。店頭レジに最適。

**Q: 手数料率はいくらですか？**
A: 2023年10月以降、決済手数料は1.98%です（以前は無料キャンペーン期間あり）。入金サイクルによって追加手数料が発生する場合があります。月次入金 = 追加なし、週次 = +0.38%、翌日 = +0.38%。

**Q: sandbox環境でテストできますか？**
A: はい。`PAYPAY_ENVIRONMENT=sandbox` に設定すると、全APIがテスト環境で動作します。テスト用のQRコード生成、決済シミュレーション、返金処理が可能です。

**Q: freee Agentとの連携は？**
A: 両スキルが有効な場合、PayPayの日次決済データをfreeeに自動仕訳できます。`paypay reconcile` 実行時にfreeeへの自動記帳オプションが表示されます。

**Q: EC-CUBEの決済手段としてPayPayを使えますか？**
A: はい。EC-CUBE Operatorと連携して、EC-CUBEの注文時にPayPay QRコードを生成し、決済完了をWebhookで受信して注文ステータスを自動更新できます。

**Q: 返金の上限は？**
A: 元の決済額が上限です。部分返金は複数回可能ですが、合計が元の決済額を超えることはできません。返金は即座にユーザーのPayPay残高に反映されます。

**Q: Webhook通知は必要ですか？**
A: 推奨されますが必須ではありません。Webhookなしの場合、エージェントはポーリング（定期的な状態確認）で決済完了を検知します。Webhook設定により即座に決済完了を受信できます。
