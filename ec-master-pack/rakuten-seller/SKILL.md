---
name: "Rakuten Seller"
description: "楽天市場ショップ運営AI — RMS API, レビュー・売上分析"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - rakuten
  - ecommerce
  - japan
  - marketplace
  - analytics
---

# Rakuten Seller

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║         ╭─────────────────────╮                  ║
    ║         │    ┌───────────┐    │                  ║
    ║         │    │  🐼  R   │    │                  ║
    ║         │    │ RAKUTEN   │    │                  ║
    ║         │    │  SELLER   │    │                  ║
    ║         │    └───────────┘    │                  ║
    ║         │                     │                  ║
    ║         │  📦 商品管理        │                  ║
    ║         │  📈 売上分析        │                  ║
    ║         │  ⭐ レビュー管理    │                  ║
    ║         │  🏷️  価格最適化     │                  ║
    ║         │  📊 ランキング対策  │                  ║
    ║         ╰─────────────────────╯                  ║
    ║                                                  ║
    ║   R A K U T E N   S E L L E R   v1.0            ║
    ║   ─── 楽天市場をAIで完全攻略 ───                ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-BF0000)
![Rakuten](https://img.shields.io/badge/楽天市場-RMS_API-BF0000)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000)
![Marketplace](https://img.shields.io/badge/🏪-年間流通5.6兆円-gold)

`claude-code` `rakuten` `rms-api` `ecommerce` `japan`

> **楽天市場出品・在庫・注文・レビュー管理を自動化。RMS API連携で楽天ショップ運営をAIアシスタント化。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** rakuten, ecommerce, japan, marketplace, seller

---

## Overview

Rakuten Seller automates your Rakuten Ichiba (楽天市場) shop operations through RMS API. Manage products, inventory, orders, reviews, and analytics from your OpenClaw agent. Built for Japan's largest online marketplace (55M+ monthly users, 56,000+ shops).

```
┌──────────────────────────────────────────────────────────────────┐
│                  RAKUTEN SELLER ARCHITECTURE                     │
│                                                                  │
│  ┌──────────┐        ┌──────────────┐        ┌──────────────┐   │
│  │ OpenClaw  │───────▶│  Rakuten     │───────▶│  RMS API     │   │
│  │ Agent     │◀───────│  Seller      │◀───────│  (REST/SOAP) │   │
│  └──────────┘        └──────┬───────┘        └──────┬───────┘   │
│                             │                       │           │
│                    ┌────────┼────────┐              │           │
│                    ▼        ▼        ▼              ▼           │
│              ┌────────┐┌────────┐┌────────┐  ┌────────────┐    │
│              │Product ││Order   ││Review  │  │ R-Cabinet  │    │
│              │Engine  ││Manager ││AI      │  │ (Images)   │    │
│              └───┬────┘└───┬────┘└───┬────┘  └────────────┘    │
│                  │         │         │                           │
│                  ▼         ▼         ▼                           │
│              ┌──────────────────────────────┐                    │
│              │      Analytics Engine        │                    │
│              │  売上・アクセス・転換率分析   │                    │
│              └──────────┬───────────────────┘                    │
│                         │                                       │
│              ┌──────────┴───────────────────┐                    │
│              │   Competition Intelligence   │                    │
│              │   ランキング追跡・価格監視    │                    │
│              └──────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **Rakuten Seller** for 楽天市場 shop management. Follow these rules precisely when the user invokes Rakuten commands. Always optimize for Rakuten's search algorithm (楽天SEO) and marketplace culture.

### Setup

Environment variables:
- `RAKUTEN_SERVICE_SECRET` — RMS API service secret
- `RAKUTEN_LICENSE_KEY` — RMS API license key
- `RAKUTEN_SHOP_URL` — Shop URL identifier
- Optional: `RAKUTEN_FTP_USER` — GOLD FTP username (for direct page editing)
- Optional: `RAKUTEN_FTP_PASS` — GOLD FTP password

API Base: `https://api.rms.rakuten.co.jp/es/`
Authentication: SOAP header with serviceSecret + licenseKey (ESA auth for REST endpoints)

### RMS API Endpoint Reference

RMS API uses a mix of REST (JSON) and SOAP (XML). Authentication via `Authorization: ESA {base64(serviceSecret:licenseKey)}`.

**Item API (商品管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/1/item/search` | Search items by keyword, genre, price |
| GET | `/1/item/get` | Get item detail by itemUrl/manageNumber |
| POST | `/1/item/insert` | Register new item |
| POST | `/1/item/update` | Update item fields |
| POST | `/1/item/delete` | Delete item |
| POST | `/1/items/update` | Bulk update items (max 100) |

**Inventory API (在庫管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/1/inventory/external/getInventory` | Get stock by SKU |
| POST | `/1/inventory/external/updateInventory` | Update stock quantity |
| POST | `/1/inventory/external/updateInventories` | Bulk stock update |

**Order API (注文管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/2.0/order/getOrder` | Get order detail |
| POST | `/2.0/order/searchOrder` | Search orders with filters |
| POST | `/2.0/order/confirmOrder` | Confirm order |
| POST | `/2.0/order/updateOrderShipping` | Register tracking number |
| POST | `/2.0/order/cancelOrder` | Cancel order |
| POST | `/2.0/order/updateOrderDelivery` | Update delivery info |

**R-Cabinet API (画像管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/1/cabinet/folder/insert` | Create image folder |
| GET | `/1/cabinet/folder/getAll` | List all folders |
| POST | `/1/cabinet/file/insert` | Upload image |
| POST | `/1/cabinet/file/delete` | Delete image |
| GET | `/1/cabinet/usage/get` | Get storage usage |

**Coupon API (クーポン管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/1/coupon/create` | Create coupon |
| GET | `/1/coupon/search` | Search coupons |
| POST | `/1/coupon/update` | Update coupon |
| POST | `/1/coupon/delete` | Delete coupon |

### Core Capabilities

**1. 商品管理:**
- 商品登録・編集・削除
- 商品画像管理（R-Cabinet連携）
- カテゴリ・ジャンル設定
- 商品説明文の自動生成・最適化
- SEO対策（商品名最適化、キーワード設定）
- 販売価格・ポイント設定
- 商品ページの品質スコアリング
- 一括CSV操作

**2. 在庫管理:**
- リアルタイム在庫確認
- 在庫数一括更新
- 在庫切れアラート
- 入荷予定管理
- SKU別在庫管理

**3. 注文管理:**
- 新規注文の一覧・詳細確認
- 注文ステータス更新（確認→発送→完了）
- 配送伝票番号の登録
- キャンセル・返品処理
- お届け日指定管理

**4. レビュー管理:**
- レビュー一覧・検索
- レビュー返信の自動生成（丁寧な日本語）
- 低評価レビューのアラート
- レビュー分析（評価分布、キーワード抽出）
- レビュー依頼メール

**5. 売上分析:**
- 日次/週次/月次売上レポート
- 商品別売上ランキング
- アクセス数・転換率分析
- 楽天スーパーSALE実績
- 広告（RPP）効果測定
- 競合分析

### Product Optimization Workflow

When `rakuten product optimize <id>` is invoked, the agent runs a comprehensive optimization pass:

```
┌───────────────────────────────────────────────────┐
│        商品ページ最適化ワークフロー                │
│                                                   │
│  Step 1: 現状分析                                  │
│  └─ 商品名の文字数・キーワード密度チェック        │
│  └─ 商品画像の枚数・品質スコア                    │
│  └─ 商品説明文のHTML構造チェック                   │
│  └─ 現在の検索順位取得                            │
│                                                   │
│  Step 2: 楽天SEO最適化                             │
│  └─ 商品名を最適化（127文字以内、キーワード先頭）│
│     例: NG「おいしい抹茶セット」                   │
│     例: OK「抹茶 セット 有機 京都産 ギフト 茶筅  │
│           茶碗付き お中元 プレゼント【送料無料】」 │
│  └─ キャッチコピー最適化（87文字以内）            │
│  └─ ジャンルタグ・ディレクトリ最適化              │
│                                                   │
│  Step 3: 画像最適化                                │
│  └─ メイン画像: 白背景、商品占有率80%以上         │
│  └─ サブ画像: 使用シーン、サイズ比較、素材詳細    │
│  └─ alt属性にキーワード設定                       │
│                                                   │
│  Step 4: 品質スコアリング                          │
│  └─ 100点満点でスコアを算出                       │
│     - 商品名: 25pt (キーワード、文字数)           │
│     - 画像: 25pt (枚数、品質、白背景)             │
│     - 説明文: 25pt (HTML、情報量、読みやすさ)     │
│     - レビュー: 15pt (件数、平均点)               │
│     - 価格/送料: 10pt (競争力、送料無料)          │
│                                                   │
│  Step 5: 改善提案レポート出力                      │
└───────────────────────────────────────────────────┘
```

### Review Response AI Workflow

The agent generates contextually appropriate review responses:

```
Input: 低評価レビュー (★2)
  「注文から届くまで1週間もかかった。商品自体は良いけど遅すぎ。」

AI Analysis:
  → Sentiment: Negative (delivery) / Positive (product)
  → Category: 配送遅延
  → Priority: HIGH (低評価 + 改善可能な問題)

Generated Response:
  「この度はご不便をおかけし、大変申し訳ございません。
   配送にお時間をいただいてしまい、心よりお詫び申し上げます。
   現在、配送体制の改善に取り組んでおり、
   より迅速にお届けできるよう努めてまいります。
   商品自体にご満足いただけたとのこと、
   大変嬉しく存じます。
   今後ともどうぞよろしくお願いいたします。」

Rules:
  - Always use formal Japanese (です/ます体)
  - Acknowledge the specific complaint
  - Explain corrective action
  - Thank for positive aspects if any
  - Keep under 300 characters
  - Never be defensive or argue
```

### Sales Analytics Dashboard Format

**`rakuten analytics --period month`:**
```
╔══════════════════════════════════════════════════════════╗
║         楽天市場 月次売上レポート — 2026年2月            ║
╠══════════════════════════════════════════════════════════╣
║ 売上合計:      ¥3,847,200 (前月比 +15.3%)              ║
║ 注文件数:      312件      (前月比 +12.1%)              ║
║ 客単価:        ¥12,331    (前月比 +2.8%)               ║
║ アクセス数:    48,720PV   (前月比 +8.9%)               ║
║ 転換率:        0.64%      (前月比 +0.05pt)             ║
║ リピート率:    34.2%                                    ║
╠══════════════════════════════════════════════════════════╣
║ 売上TOP5:                                               ║
║ 1. 有機抹茶セット      ¥892,400 (232件) 転換率1.2%     ║
║ 2. 国産はちみつ 500g   ¥567,200 (189件) 転換率0.9%     ║
║ 3. 手作り醤油 1L       ¥345,600 ( 87件) 転換率0.7%     ║
║ 4. 黒豆茶ギフト        ¥298,000 ( 62件) 転換率0.5%     ║
║ 5. 梅干し詰め合わせ    ¥234,800 ( 48件) 転換率0.4%     ║
╠══════════════════════════════════════════════════════════╣
║ 広告効果 (RPP):                                         ║
║   RPP投資:     ¥124,000                                 ║
║   RPP経由売上: ¥487,200                                 ║
║   ROAS:        393% (目標: 300%)                        ║
╠══════════════════════════════════════════════════════════╣
║ レビュー:                                                ║
║   新規レビュー: 47件 (平均★4.3)                         ║
║   未返信:       12件 (うち低評価3件 — 要対応)           ║
╚══════════════════════════════════════════════════════════╝
```

### Competition Analysis Features

**`rakuten compete <keyword>`:**
- Search top 30 results for a keyword in Rakuten Ichiba
- Extract: price range, review count, review score, shipping terms
- Identify your product's rank and gap vs top competitors
- Generate pricing and optimization recommendations

```
Competition Report: 「抹茶 セット ギフト」

Rank | Shop              | Price   | Reviews | Score | Shipping
-----+-------------------+---------+---------+-------+---------
 1   | 京都宇治園        | ¥3,980  | 1,247   | 4.7   | 無料
 2   | 茶の老舗 丸久小山 | ¥5,400  | 823     | 4.6   | 無料
 3   | ★あなたのショップ | ¥4,980  | 156     | 4.3   | 無料
 ...
Gap Analysis:
 - レビュー数: 1位比 -87% (施策: レビュー依頼メール強化)
 - 価格: 中間帯 (OK)
 - 評価: -0.4pt (施策: 低評価原因分析→改善)
```

### Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| N000 | Authentication error | Check `RAKUTEN_SERVICE_SECRET` and `RAKUTEN_LICENSE_KEY` |
| C001 | Invalid parameter | Parse XML error detail, show which field is wrong |
| C002 | Item not found | Verify itemUrl/manageNumber |
| C010 | Inventory shortage | Alert user, suggest restocking |
| C020 | Order already processed | Show current order status |
| E001 | System maintenance | Retry later, check RMS status page |
| E999 | Internal RMS error | Log full response, retry with backoff |
| R-Cabinet FULL | Image storage limit reached | Show usage, suggest cleanup |

**RMS API rate limit:** 100 requests per minute per endpoint. The agent queues requests and respects this limit automatically.

### Commands

**`rakuten products [--search <query>]`** — 商品一覧
**`rakuten product <id>`** — 商品詳細
**`rakuten product create`** — 商品登録（対話式）
**`rakuten product optimize <id>`** — SEO最適化提案（品質スコア付き）
**`rakuten product score <id>`** — 商品ページ品質スコアリングのみ
**`rakuten stock`** — 在庫一覧
**`rakuten stock update <id> <quantity>`** — 在庫更新
**`rakuten stock bulk <csv-file>`** — CSV一括在庫更新
**`rakuten stock alerts`** — 在庫切れアラート
**`rakuten orders [--status <status>]`** — 注文一覧
**`rakuten order <id>`** — 注文詳細
**`rakuten order ship <id> <tracking>`** — 発送処理
**`rakuten order confirm <id>`** — 注文確認処理
**`rakuten reviews [--rating <1-5>]`** — レビュー一覧
**`rakuten review reply <id>`** — AI返信生成
**`rakuten review reply-all [--pending]`** — 未返信レビュー一括AI返信
**`rakuten analytics [--period day|week|month]`** — 売上分析
**`rakuten ranking`** — 商品ランキング
**`rakuten compete <keyword>`** — 競合分析
**`rakuten coupon create <discount> <conditions>`** — クーポン作成
**`rakuten sale prepare`** — スーパーSALE/マラソン準備チェックリスト
**`rakuten health`** — API接続 & R-Cabinet容量チェック

### 楽天市場 Specific

- RMS (Rakuten Merchant Server) API完全対応
- R-Cabinet画像管理
- 楽天ポイント設定
- お買い物マラソン・スーパーSALE対応
- RPP広告管理
- 楽天ペイ決済確認
- 送料無料ライン設定（3,980円以上 = 楽天ルール）
- クーポン管理
- GOLD/RMS商品ページ最適化
- 楽天SKU対応（2024年〜のSKUプロジェクト）
- 楽天アフィリエイト料率設定
- 楽天ランキング連携

### Data Storage

```
.rakuten-seller/
├── config.json              # API credentials and shop settings
├── cache/
│   ├── items.json           # Product cache (TTL: 30m)
│   ├── categories.json      # Genre/category tree (TTL: 24h)
│   └── cabinet-usage.json   # R-Cabinet storage info
├── analytics/
│   ├── daily-sales.jsonl    # Daily sales data
│   ├── access-stats.jsonl   # PV, UU, conversion rate
│   ├── rpp-performance.jsonl # RPP advertising metrics
│   └── competition/
│       └── {keyword}.json   # Competition analysis snapshots
├── reviews/
│   ├── pending-replies.json # Reviews awaiting response
│   ├── ai-replies.jsonl     # AI-generated reply history
│   └── sentiment.json       # Review sentiment analysis
├── optimization/
│   ├── scores.json          # Product quality scores
│   └── recommendations.jsonl # SEO improvement suggestions
├── exports/
│   └── *.csv                # Exported files
└── logs/
    ├── api-calls.jsonl      # API call log
    └── errors.jsonl         # Error log
```

## Rakuten Seller vs Amazon Seller (JP Market Comparison)

| Feature | Rakuten Seller | Amazon Seller (JP) |
|---------|---------------|-------------------|
| Platform | 楽天市場 (marketplace) | Amazon.co.jp |
| Target Audience | 日本市場特化 (55M MAU) | グローバル+日本 (50M MAU) |
| Shop Branding | **独自ショップページ** | 統一的な商品ページ |
| Product Page | **自由にHTMLカスタマイズ** | テンプレート固定 |
| SEO Control | **商品名127文字最適化** | 200文字、Amazon A9 |
| Fee Structure | 月額 + 売上手数料 2-7% | 月額 + 売上手数料 8-15% |
| Point System | **楽天ポイント (強力)** | Amazonポイント |
| Events | **スーパーSALE/マラソン** | プライムデー/ブラックフライデー |
| Advertising | **RPP (楽天プロモーション)** | Sponsored Products |
| Review Response | **店舗から直接返信可** | 制限あり |
| Customer Data | **購入者情報取得可** | 制限あり (FBA) |
| FBA Equivalent | 楽天スーパーロジスティクス | FBA (Fulfillment by Amazon) |

## FAQ

**Q: RMS APIの申請方法は？**
A: 楽天RMSにログイン後、「拡張サービス一覧」→「WEB APIサービス」から申請します。審査に1-2営業日かかります。serviceSecretとlicenseKeyが発行されたら環境変数に設定してください。

**Q: 商品名の最適な文字数は？**
A: 楽天では127文字以内が推奨です。先頭30文字に主要キーワードを配置し、「ブランド名 + 商品名 + スペック + 用途 + 送料情報」の順序で構成するのが最適です。

**Q: スーパーSALE前の準備は？**
A: `rakuten sale prepare` でチェックリストを出力します。主な項目: 在庫確保、価格設定（半額以上を1品以上）、クーポン設定、商品ページ更新、RPP予算増額、配送体制確認。

**Q: RPP広告の推奨予算は？**
A: 売上目標の3-5%が目安です。ROASが300%を下回る場合はキーワードの見直しを推奨します。本エージェントは日次でROASを自動計算し、効率の悪いキーワードを報告します。

**Q: レビュー返信のAI生成精度は？**
A: テンプレート化された返信ではなく、レビュー内容を分析して個別に生成します。低評価レビューは必ず人間のレビュー後に投稿する安全機構が組み込まれています。

**Q: EC-CUBE Operatorとの在庫連動は？**
A: 両スキルが有効な場合、EC-CUBEでの注文を楽天在庫に自動反映し、逆も同様に可能です。設定は `rakuten sync ec-cube --enable` で有効化します。

**Q: SKUプロジェクト対応は？**
A: 2024年以降の楽天SKUプロジェクト（マルチSKU対応）に完全対応しています。SKU単位での在庫管理、価格設定、バリエーション表示が可能です。

**Q: 楽天ペイ（オンライン決済）の連携は可能ですか？**
A: はい、RMS APIを通じて楽天ペイの決済状況確認・返金処理が可能です。`rakuten payment status` で決済一覧を確認できます。

**Q: 複数店舗を一括管理できますか？**
A: はい、環境変数で複数のAPI認証情報を設定し、`--shop` フラグで店舗を切り替えられます。`rakuten shops list` で登録済み店舗一覧を表示できます。

**Q: R-Cabinet の画像容量が上限に近い場合の対処法は？**
A: `rakuten cabinet audit` コマンドで未使用画像を検出し、`rakuten cabinet cleanup --dry-run` で安全に削除候補を確認できます。WebP変換による容量削減も自動提案します。
