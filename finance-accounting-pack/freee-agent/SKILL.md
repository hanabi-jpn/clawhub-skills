---
name: "Freee Agent"
description: "freee会計・人事労務 自動化 — AI仕訳・P/L・B/S・確定申告"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - freee
  - accounting
  - japan
  - tax
  - automation
---

# Freee Agent

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║              FREEE AGENT v1.0                    ║
    ║                                                  ║
    ║         ┌─────────────────────┐                  ║
    ║         │  📒 freee 会計      │                  ║
    ║         │  ┌───┬───┬───┐     │                  ║
    ║         │  │借方│   │貸方│     │                  ║
    ║         │  ├───┼───┼───┤     │                  ║
    ║         │  │¥  │ → │¥  │     │                  ║
    ║         │  └───┴───┴───┘     │                  ║
    ║         │                     │                  ║
    ║         │  ⚡ AI自動仕訳      │                  ║
    ║         │  📊 P/L・B/S即時   │                  ║
    ║         │  🧾 インボイス対応  │                  ║
    ║         │  📋 確定申告支援   │                  ║
    ║         └─────────────────────┘                  ║
    ║                                                  ║
    ║   ─── 経理作業を90%自動化 ───                    ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-2E7D32)
![freee](https://img.shields.io/badge/freee-会計_API-2E7D32)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000)
![Invoice](https://img.shields.io/badge/🧾-インボイス制度対応-blue)
![Cloud](https://img.shields.io/badge/Cloud-会計連携-purple)

`claude-code` `freee` `accounting` `bookkeeping` `japan`

> **freee会計・人事労務をAIで自動管理。仕訳入力、レポート生成、経費精算、請求書管理を自動化。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** freee, accounting, japan, bookkeeping, tax, invoicing

---

## Overview

Freee Agent connects to freee会計 and freee人事労務 APIs, automating bookkeeping, expense management, invoicing, and financial reporting for Japanese businesses. Works with freee's OAuth2 API. Built specifically for Japanese accounting standards, including double-entry bookkeeping, consumption tax, and the invoice system (インボイス制度).

```
┌──────────────────────────────────────────────────────────────┐
│                  FREEE AGENT PIPELINE                        │
│                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ Input     │    │ AI Engine    │    │ freee API        │   │
│  │ Sources   │───▶│ 仕訳推定    │───▶│ (OAuth2)         │   │
│  └──────────┘    └──────────────┘    └────────┬─────────┘   │
│       │                                        │             │
│       │  ┌─────────────┐                      │             │
│       ├──│ Bank CSV     │                      ▼             │
│       │  └─────────────┘              ┌──────────────────┐   │
│       │  ┌─────────────┐              │ freee会計        │   │
│       ├──│ Receipt OCR  │              │ ┌──────────────┐ │   │
│       │  └─────────────┘              │ │ 仕訳帳       │ │   │
│       │  ┌─────────────┐              │ │ 請求書       │ │   │
│       ├──│ Manual Entry │              │ │ 経費精算     │ │   │
│       │  └─────────────┘              │ │ レポート     │ │   │
│       │  ┌─────────────┐              │ └──────────────┘ │   │
│       └──│ EC-CUBE Sync │              └────────┬─────────┘   │
│          └─────────────┘                        │             │
│                                                 ▼             │
│                                        ┌──────────────────┐   │
│                                        │ Report Generator │   │
│                                        │ P/L, B/S, CF     │   │
│                                        │ 確定申告, 消費税 │   │
│                                        └──────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Freee Agent** for freee accounting and HR automation. Follow these rules precisely when the user invokes freee commands. Always use double-entry bookkeeping (複式簿記) and Japanese accounting standards.

### Setup

Environment variables:
- `FREEE_CLIENT_ID` — freee API client ID
- `FREEE_CLIENT_SECRET` — freee API client secret
- `FREEE_COMPANY_ID` — Target company ID
- `FREEE_REFRESH_TOKEN` — OAuth2 refresh token
- Optional: `FREEE_FISCAL_YEAR_END` — Fiscal year end month (default: `3` for March)
- Optional: `FREEE_DEFAULT_TAX_CLASS` — Default tax class (default: `課税10%`)

API Base: `https://api.freee.co.jp/api/1/`

### freee API Endpoint Reference

All endpoints use OAuth2 Bearer token authentication. Tokens auto-refresh via refresh_token grant.

**Deals (取引):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deals` | List deals with filters (date, type, status) |
| GET | `/deals/{id}` | Deal detail with journal entries |
| POST | `/deals` | Create new deal (auto-generates journal entry) |
| PUT | `/deals/{id}` | Update deal |
| DELETE | `/deals/{id}` | Delete deal |

**Journal Entries (仕訳):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/journals` | Download journal entries (CSV/PDF) |
| GET | `/manual_journals` | List manual journal entries |
| POST | `/manual_journals` | Create manual journal entry |
| PUT | `/manual_journals/{id}` | Update manual journal entry |

**Invoices (請求書):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | List invoices with status filter |
| GET | `/invoices/{id}` | Invoice detail |
| POST | `/invoices` | Create invoice (PDF auto-generated) |
| PUT | `/invoices/{id}` | Update invoice |
| POST | `/invoices/{id}/send` | Send invoice via email |

**Expenses (経費):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expense_applications` | List expense claims |
| POST | `/expense_applications` | Create expense claim |
| PUT | `/expense_applications/{id}` | Update expense claim |
| POST | `/receipts` | Upload receipt image (OCR) |

**Reports:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/trial_pl` | 損益計算書 (P/L) |
| GET | `/reports/trial_bs` | 貸借対照表 (B/S) |
| GET | `/reports/trial_pl_sections` | 部門別P/L |
| GET | `/reports/trial_bs_two_years` | 2期比較B/S |

**Account Items (勘定科目):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/account_items` | List all account items |
| POST | `/account_items` | Create custom account item |
| GET | `/taxes` | List tax codes |
| GET | `/partners` | List business partners (取引先) |

### Core Capabilities

**1. 仕訳管理 (Journal Entries):**
- 取引の自動仕訳（AI勘定科目推定）
- 仕訳帳の検索・閲覧
- 手動仕訳の登録・修正
- 定期仕訳の設定
- 摘要文の自動生成
- 勘定科目マスタ管理

**2. 経費精算:**
- 経費申請の作成・承認
- レシート画像からの自動入力
- 交通費の自動計算
- 経費カテゴリ別集計
- 月次経費レポート

**3. 請求書管理:**
- 請求書の作成・送付
- 入金消込の自動化
- 未入金アラート
- 請求書テンプレート管理
- インボイス制度対応（適格請求書）

**4. レポート生成:**
- 損益計算書 (P/L)
- 貸借対照表 (B/S)
- キャッシュフロー計算書
- 月次推移表
- 部門別/セグメント別集計
- 消費税集計表

**5. 確定申告支援:**
- 青色申告決算書の数値確認
- 控除項目のチェックリスト
- e-Tax用データ出力
- 税理士への共有レポート

### AI Journal Entry Prediction Workflow

When the user provides a transaction description, the agent predicts the correct journal entry:

```
Input: "Amazon AWS 月額利用料 $89.50 (¥13,425)"

Step 1: Parse transaction
  → Amount: ¥13,425
  → Vendor: Amazon Web Services
  → Category hint: "AWS", "月額", "利用料"

Step 2: AI account prediction
  → Debit:  通信費 (勘定科目コード: 7310)  ¥13,425
  → Credit: 普通預金 (勘定科目コード: 1120) ¥13,425
  → Tax:    課税仕入10%
  → Confidence: 94%

Step 3: Similar past entries check
  → Found 12 matches for "AWS" → 100% mapped to 通信費
  → Auto-confirm (confidence > 90%)

Step 4: Register to freee
  → POST /api/1/deals
  → Response: deal_id: 12345
  → Journal entry auto-generated

Output:
  仕訳登録完了 (ID: 12345)
  借方: 通信費     ¥13,425 (課税仕入10%)
  貸方: 普通預金   ¥13,425
  摘要: Amazon Web Services AWS月額利用料 3月分
```

### Monthly Closing Workflow

The agent provides a guided monthly closing process:

```
┌─────────────────────────────────────────────┐
│        月次締め処理ワークフロー              │
│                                             │
│  Step 1: 未処理取引チェック                  │
│  └─ 銀行明細の未仕訳取引を確認              │
│     └─ 自動仕訳候補を提示                   │
│                                             │
│  Step 2: 経費精算チェック                    │
│  └─ 未申請の経費を確認                      │
│     └─ 承認待ち経費を一覧表示               │
│                                             │
│  Step 3: 請求書消込                          │
│  └─ 入金済み請求書の自動消込                │
│     └─ 未入金請求書のアラート               │
│                                             │
│  Step 4: 消費税チェック                      │
│  └─ 税区分の整合性確認                      │
│     └─ 不明な税区分をハイライト             │
│                                             │
│  Step 5: レポート生成                        │
│  └─ P/L, B/S, 月次推移表を生成             │
│     └─ 前月比・前年同月比を算出             │
│                                             │
│  Step 6: 締め完了                            │
│  └─ 月次ステータスを「確定」に変更          │
│     └─ 税理士向けサマリーを出力             │
└─────────────────────────────────────────────┘
```

### Report Output Formats

**損益計算書 (P/L) — `freee report pl`:**
```
╔═══════════════════════════════════════════════════════╗
║        損益計算書 — 2026年2月度                       ║
╠═══════════════════════════════════════════════════════╣
║ 【売上高】                                            ║
║   売上高                    ¥4,827,000  (前月比+8.2%) ║
║   売上値引                   -¥123,000               ║
║   ─────────────────────────────────────               ║
║   売上高合計                ¥4,704,000               ║
║                                                       ║
║ 【売上原価】                                          ║
║   仕入高                    ¥1,890,000               ║
║   ─────────────────────────────────────               ║
║   売上総利益                ¥2,814,000  (粗利率59.8%) ║
║                                                       ║
║ 【販売管理費】                                        ║
║   人件費                      ¥980,000               ║
║   広告宣伝費                  ¥340,000               ║
║   通信費                      ¥45,000                ║
║   消耗品費                    ¥28,000                ║
║   その他                     ¥156,000                ║
║   ─────────────────────────────────────               ║
║   販管費合計                ¥1,549,000               ║
║                                                       ║
║ 【営業利益】                ¥1,265,000  (営業利益率26.9%)║
╚═══════════════════════════════════════════════════════╝
```

### Commands

**`freee journal [--from <date>] [--to <date>]`** — 仕訳一覧
**`freee journal create <debit> <credit> <amount> <description>`** — 仕訳登録
**`freee journal suggest <description>`** — AI勘定科目推定
**`freee journal bulk <csv-file>`** — CSV一括仕訳登録
**`freee expense create <amount> <category> <description>`** — 経費登録
**`freee expense report [--month <YYYY-MM>]`** — 経費レポート
**`freee expense receipt <image-path>`** — レシートOCR→経費登録
**`freee invoice create <customer> <items>`** — 請求書作成
**`freee invoice list [--status unpaid|paid|overdue]`** — 請求書一覧
**`freee invoice remind <invoice-id>`** — 入金催促
**`freee invoice reconcile`** — 入金消込の一括処理
**`freee report pl [--period <month|quarter|year>]`** — 損益計算書
**`freee report bs`** — 貸借対照表
**`freee report tax`** — 消費税集計
**`freee report cashflow`** — キャッシュフロー
**`freee report monthly-trend [--months 12]`** — 月次推移表
**`freee close [--month <YYYY-MM>]`** — 月次締め処理（ガイド付き）
**`freee status`** — 会計ステータス概要
**`freee health`** — API接続チェック＆トークン有効期限確認

### Integration Examples

**EC-CUBE Operator Integration:**
When EC-CUBE Operator processes an order, Freee Agent can auto-generate the journal entry:
```
EC-CUBE: Order #1234 completed (¥15,800 via credit card)
  → Freee Agent auto-creates:
    借方: 売掛金    ¥15,800
    貸方: 売上高    ¥15,800 (課税売上10%)
    摘要: EC-CUBE注文 #1234 クレジットカード決済
```

**PayPay Biz Integration:**
Daily PayPay settlement auto-reconciliation:
```
PayPay: Daily settlement ¥287,400 deposited
  → Freee Agent auto-creates:
    借方: 普通預金   ¥284,526 (入金額)
    借方: 支払手数料  ¥2,874  (決済手数料1.0%)
    貸方: 売掛金    ¥287,400
    摘要: PayPay日次精算 2026-03-01分
```

### Comparison: freee vs Other Cloud Accounting Platforms

| Feature                          | freee Agent (本スキル)          | MoneyForward Cloud              | 弥生会計オンライン              | マネーケア                      |
|----------------------------------|--------------------------------|--------------------------------|--------------------------------|--------------------------------|
| API連携                          | OAuth2 REST API完全対応         | API提供あり（一部制限）         | API非公開（CSV連携のみ）        | API非公開                       |
| AI自動仕訳                       | AI推定 + 学習型（95%精度）      | ルールベース自動仕訳            | パターンマッチ仕訳              | 手動入力中心                    |
| インボイス制度                   | 適格請求書の自動判定・番号管理  | 対応済み                        | 対応済み                        | 一部対応                        |
| 電子帳簿保存法                   | タイムスタンプ・検索要件対応    | 対応済み                        | 対応済み                        | 非対応                          |
| レシートOCR                      | API経由で自動経費登録           | アプリ内OCR                     | スマホ撮影取込                  | 非対応                          |
| 月次締めワークフロー             | 6ステップガイド付き自動化       | 手動チェックリスト              | 手動処理                        | 手動処理                        |
| EC連携 (EC-CUBE等)               | リアルタイム自動仕訳            | CSV取込                         | CSV取込                         | 非対応                          |
| レポート生成                     | P/L, B/S, CF, 月次推移を即時   | ダッシュボード表示              | 帳票出力                        | 基本帳票のみ                    |
| 料金                             | freee API無料 + 本スキル無料    | ¥2,980~/月 (パーソナル)         | ¥8,800~/年 (セルフプラン)       | 無料～¥980/月                   |
| 対象規模                         | 個人〜中小企業                  | 個人〜中堅企業                  | 個人〜小規模企業                | 個人事業主向け                  |
| 確定申告                         | チェックリスト + e-Tax連携      | 確定申告機能あり                | 確定申告機能あり                | 基本機能のみ                    |
| CLI/エージェント操作             | 全機能CLIコマンド対応           | Web UI中心                      | Web UI / デスクトップ           | Web UI のみ                     |

**When to use freee Agent:**
- API経由の自動化が必要な場合 → **freee Agent一択**
- EC-CUBEやPayPayとのリアルタイム連携 → **freee Agent**
- 税理士と共有しながら運用 → freee Agent または MoneyForward Cloud
- 最小コストで個人確定申告 → 弥生会計オンライン（セルフプラン無料）

### Additional Command Output Examples

**`freee journal --from 2026-02-01 --to 2026-02-28`** — 仕訳一覧表示:
```json
{
  "deals": [
    {
      "id": 98234,
      "issue_date": "2026-02-03",
      "type": "expense",
      "company_id": 1234567,
      "details": [
        {
          "account_item_id": 7310,
          "account_item_name": "通信費",
          "tax_code": 21,
          "tax_name": "課税仕入10%",
          "amount": 13425,
          "description": "Amazon Web Services AWS月額利用料 2月分"
        }
      ],
      "payments": [
        {
          "from_walletable_type": "bank_account",
          "from_walletable_id": 456,
          "amount": 13425,
          "date": "2026-02-03"
        }
      ]
    },
    {
      "id": 98235,
      "issue_date": "2026-02-05",
      "type": "income",
      "details": [
        {
          "account_item_id": 5000,
          "account_item_name": "売上高",
          "tax_code": 2,
          "tax_name": "課税売上10%",
          "amount": 158000,
          "description": "EC-CUBE注文 #4521-#4535 クレジットカード決済分"
        }
      ]
    }
  ],
  "meta": {
    "total_count": 87,
    "returned_count": 2,
    "offset": 0,
    "limit": 50
  }
}
```

**`freee expense receipt ./receipt_20260228.jpg`** — レシートOCR→経費自動登録:
```
レシートOCR処理結果:
  ┌──────────────────────────────────────────────┐
  │ 📷 OCR解析完了                                │
  │                                              │
  │ 店舗名:    ヨドバシカメラ 新宿西口本店        │
  │ 日付:      2026-02-28                        │
  │ 合計金額:  ¥32,780 (税込)                    │
  │ 内消費税:  ¥2,980                            │
  │ 支払方法:  クレジットカード                   │
  │                                              │
  │ AI仕訳推定:                                   │
  │   借方: 消耗品費     ¥32,780 (課税仕入10%)   │
  │   貸方: 未払金       ¥32,780                 │
  │   摘要: ヨドバシカメラ OA機器購入            │
  │   Confidence: 91%                            │
  │                                              │
  │ → freee登録完了 (deal_id: 98301)             │
  │ → レシート画像をfreee証憑に添付済み          │
  └──────────────────────────────────────────────┘
```

**`freee status`** — 会計ステータス概要:
```
╔══════════════════════════════════════════════════════╗
║          freee 会計ステータス — 2026年2月             ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  事業所: 株式会社サンプル (ID: 1234567)              ║
║  決算月: 3月                                         ║
║  プラン: スタンダード                                ║
║                                                      ║
║  ── 月次ステータス ──                                ║
║  2025年4月 〜 2026年1月: 確定済み ✅                  ║
║  2026年2月: 未確定 (処理中) 🔄                       ║
║                                                      ║
║  ── 未処理件数 ──                                    ║
║  未仕訳取引:       12件 (銀行明細からの自動取込分)   ║
║  承認待ち経費:      3件 (¥47,200)                    ║
║  未入金請求書:      5件 (¥892,000)                   ║
║  期限超過請求書:    1件 (¥120,000 / 15日超過)  ⚠️    ║
║                                                      ║
║  ── APIステータス ──                                 ║
║  Access Token: 有効 (残り 1h 23m)                    ║
║  API利用量: 142/300 req (5分間)                      ║
║  最終同期: 2026-03-01 09:15:32 JST                   ║
╚══════════════════════════════════════════════════════╝
```

### Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| 400 | Bad request (invalid params) | Parse error details, show which field failed |
| 401 | Token expired | Auto-refresh using refresh_token, retry |
| 403 | Company access denied | Verify `FREEE_COMPANY_ID`, check user permissions |
| 404 | Resource not found | Verify deal/invoice ID |
| 429 | Rate limit (300 req/5min) | Queue and retry with backoff |
| 503 | freee maintenance | Log and notify user, suggest retry later |

### Japanese Accounting Specific

- 複式簿記対応（借方/貸方）
- 消費税区分（課税10%, 軽減8%, 非課税, 不課税, 免税）
- インボイス制度（適格請求書保存方式）対応
- 電子帳簿保存法対応
- 勘定科目は日本標準に準拠
- 決算月カスタマイズ（3月決算, 12月決算 etc.）
- 源泉徴収税の自動計算
- 固定資産台帳・減価償却対応

### Data Storage

```
.freee-agent/
├── config.json              # API credentials and company settings
├── tokens/
│   └── oauth2.json          # Access/refresh token (encrypted)
├── cache/
│   ├── account-items.json   # 勘定科目マスタ (TTL: 24h)
│   ├── partners.json        # 取引先マスタ (TTL: 24h)
│   └── tax-codes.json       # 税区分マスタ (TTL: 7d)
├── predictions/
│   ├── account-map.json     # AI学習済み勘定科目マッピング
│   └── description-patterns.jsonl # 摘要パターンDB
├── reports/
│   ├── pl/                  # 損益計算書アーカイブ
│   ├── bs/                  # 貸借対照表アーカイブ
│   └── tax/                 # 消費税集計アーカイブ
├── closing/
│   └── {YYYY-MM}.json      # 月次締めステータス
└── logs/
    ├── api-calls.jsonl      # API call log
    └── journal-audit.jsonl  # 仕訳監査ログ
```

## FAQ

**Q: freee APIの認証はどう設定しますか？**
A: freee Developer Portal (https://developer.freee.co.jp/) でアプリを作成し、Client IDとClient Secretを取得します。OAuth2認可フローでrefresh_tokenを取得し、環境変数に設定してください。初回のみブラウザ認証が必要です。

**Q: AI勘定科目推定の精度は？**
A: 初回は約70-80%の精度です。ユーザーの修正を学習し、同じ取引先・摘要パターンは2回目以降95%以上の精度になります。学習データは `.freee-agent/predictions/` に保存されます。

**Q: 複数事業所（会社）を管理できますか？**
A: はい。`FREEE_COMPANY_ID` を切り替えるか、config.jsonに複数事業所を登録して `freee switch <company>` で切り替えられます。

**Q: 確定申告にそのまま使えますか？**
A: freee会計自体が確定申告に対応しています。本エージェントは日常の仕訳入力とレポート生成を自動化し、確定申告時の数値確認とチェックリストを提供します。最終的な申告はfreeeの確定申告機能またはe-Taxをご利用ください。

**Q: 電子帳簿保存法に対応していますか？**
A: はい。freee APIを通じて電子取引データの保存要件（タイムスタンプ、検索要件）を満たしています。レシートOCR機能もfreeeの電帳法対応機能を活用しています。

**Q: EC-CUBE Operatorとの連携は自動ですか？**
A: 両方のスキルが同じセッションで有効な場合、EC-CUBEの注文完了イベントをトリガーにfreeeへ自動仕訳できます。設定は `freee integration ec-cube --enable` で有効化します。

**Q: Rate limitはありますか？**
A: freee APIは5分間に300リクエストの制限があります。エージェントは自動的にリクエストをキューイングし、制限を超えないよう調整します。大量の一括処理にはCSVインポートの利用を推奨します。

**Q: 複数事業所の会計を一元管理できますか？**
A: はい、freee APIのcompany切り替え機能を使用して、複数事業所のデータを切り替えて処理できます。`freee company switch` で事業所を変更し、`freee company list` で登録済み事業所一覧を確認できます。

**Q: 電子帳簿保存法に対応していますか？**
A: はい、2024年1月施行の電子帳簿保存法に対応しています。`freee receipt scan` でスキャンした領収書をfreeeに自動アップロードし、タイムスタンプ付きで保存します。検索要件（日付・金額・取引先）も自動でメタデータ付与します。

**Q: 仕訳の一括インポートは可能ですか？**
A: はい、`freee journal import --file data.csv` でCSV形式の仕訳データを一括インポートできます。インポート前にバリデーション（勘定科目の存在確認、借方貸方バランス）を自動実行し、エラー行をレポートします。
