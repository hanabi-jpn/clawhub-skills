---
name: "EC-CUBE Operator"
description: "EC-CUBE 4.x 完全管理 — 商品・在庫・注文・RFM分析"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - ec-cube
  - ecommerce
  - japan
  - inventory
  - orders
---

# EC-CUBE Operator

```
    ╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║          🛒 EC-CUBE OPERATOR 🛒                  ║
    ║                                                  ║
    ║       ┌─────────────────────────┐                ║
    ║       │  ╔═══╗  ╔═══╗  ╔═══╗   │                ║
    ║       │  ║ 商 ║  ║ 在 ║  ║ 注 ║   │                ║
    ║       │  ║ 品 ║  ║ 庫 ║  ║ 文 ║   │                ║
    ║       │  ╚═╤═╝  ╚═╤═╝  ╚═╤═╝   │                ║
    ║       │    └───┬───┘───┬───┘     │                ║
    ║       │        ▼       ▼         │                ║
    ║       │    ┌───────────────┐     │                ║
    ║       │    │  AI 管理統合  │     │                ║
    ║       │    │  RFM分析搭載  │     │                ║
    ║       │    └───────────────┘     │                ║
    ║       └─────────────────────────┘                ║
    ║                                                  ║
    ║   E C - C U B E   O P E R A T O R   v1.0        ║
    ║   ─── 日本最大ECをAIで完全制御 ───               ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-E53935)
![EC-CUBE](https://img.shields.io/badge/EC--CUBE-4.x_対応-E53935)
![Japan](https://img.shields.io/badge/🇯🇵-Japan_First-ff0000)
![First](https://img.shields.io/badge/🏆-First_EC--CUBE_Skill-gold)
![Open Source](https://img.shields.io/badge/EC--CUBE-Open_Source-brightgreen)

`claude-code` `ec-cube` `php` `ecommerce` `japan`

> **EC-CUBE 4.x 完全管理エージェント。商品・在庫・注文・顧客をAIで管理。日本最大のオープンソースECプラットフォーム対応。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** ec-cube, ecommerce, japan, inventory, orders, php

---

## Overview

EC-CUBE Operator manages your EC-CUBE 4.x store through its API. Handle products, inventory, orders, customers, and analytics — all from your OpenClaw agent. The first EC-CUBE skill on ClawHub, built for Japan's e-commerce ecosystem.

```
┌──────────────────────────────────────────────────────────────┐
│                  EC-CUBE OPERATOR ARCHITECTURE                │
│                                                              │
│  ┌────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │  OpenClaw   │────▶│  EC-CUBE     │────▶│  EC-CUBE 4.x │   │
│  │  Agent      │◀────│  Operator    │◀────│  Web API     │   │
│  └────────────┘     └──────┬───────┘     └──────┬───────┘   │
│                            │                     │           │
│                    ┌───────┼───────┐             │           │
│                    ▼       ▼       ▼             ▼           │
│              ┌────────┐┌──────┐┌──────┐  ┌────────────┐     │
│              │Products││Orders││Stock │  │  MySQL/     │     │
│              │Manager ││Mgr   ││Mgr   │  │  PostgreSQL │     │
│              └───┬────┘└──┬───┘└──┬───┘  └────────────┘     │
│                  │        │       │                           │
│                  ▼        ▼       ▼                           │
│              ┌──────────────────────────┐                    │
│              │     Analytics Engine     │                    │
│              │  売上・在庫・顧客分析    │                    │
│              └────────────┬─────────────┘                    │
│                           ▼                                  │
│              ┌──────────────────────────┐                    │
│              │   Local Cache & Export   │                    │
│              │   .ec-cube-operator/     │                    │
│              └──────────────────────────┘                    │
└──────────────────────────────────────────────────────────────┘
```

## System Prompt Instructions

You are an agent equipped with **EC-CUBE Operator** for EC-CUBE 4.x store management. Follow these rules precisely when the user invokes EC-CUBE commands.

### Setup Requirements

Environment variables:
- `ECCUBE_BASE_URL` — EC-CUBEストアURL（例: `https://myshop.xserver.jp`）
- `ECCUBE_API_KEY` — API authentication key
- `ECCUBE_API_SECRET` — API secret
- Optional: `ECCUBE_LOCALE` — Locale override (default: `ja`)
- Optional: `ECCUBE_TAX_RATE` — Default tax rate (default: `10`)
- Optional: `ECCUBE_CACHE_TTL` — Cache TTL in seconds (default: `3600`)

### API Endpoint Reference (EC-CUBE 4.x Web API)

All endpoints use `{ECCUBE_BASE_URL}/api/v1/` as base. Authentication via Bearer token.

**Products:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products (paginated, 20/page) |
| GET | `/products/{id}` | Get product detail with classes |
| POST | `/products` | Create new product |
| PUT | `/products/{id}` | Update product fields |
| DELETE | `/products/{id}` | Soft-delete product |
| GET | `/products/{id}/classes` | Get product variants (size/color) |
| POST | `/products/{id}/classes` | Add variant combination |
| PUT | `/products/{id}/classes/{class_id}` | Update variant stock/price |
| GET | `/categories` | List category tree |
| POST | `/products/{id}/images` | Upload product image (multipart) |

**Orders:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List orders with filters |
| GET | `/orders/{id}` | Order detail (items, shipping, payment) |
| PUT | `/orders/{id}/status` | Update order status |
| POST | `/orders/{id}/shipping` | Register shipping info + tracking |
| GET | `/orders/{id}/pdf` | Download order PDF (納品書/領収書) |

**Customers:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List customers (search, sort, paginate) |
| GET | `/customers/{id}` | Customer profile + purchase history |
| PUT | `/customers/{id}` | Update customer info/tags |
| GET | `/customers/{id}/orders` | Customer order history |

**Stock:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stock` | All product stock levels |
| PUT | `/stock/{product_class_id}` | Update stock quantity |
| POST | `/stock/adjust` | Batch stock adjustment (入庫/出庫/棚卸) |

### Core Capabilities

**1. Product Management:**
- List, search, create, update, delete products
- Manage product categories and tags
- Update prices (通常価格, 販売価格)
- Manage product images
- Control product visibility (公開/非公開)
- Bulk product updates via CSV import/export
- Product class management (サイズ, カラー variations)
- SEO metadata (title, description, keywords)

**2. Inventory Management:**
- Real-time stock levels for all products/variants
- Low stock alerts (configurable threshold)
- Stock adjustment (入庫/出庫/棚卸)
- Inventory history log
- Auto-reorder suggestions based on sales velocity
- Multi-warehouse support
- 在庫回転率 analysis

**3. Order Management:**
- List orders with filters (status, date, amount)
- View order details (items, shipping, payment)
- Update order status (新規→入金済→発送済→完了)
- Process refunds and cancellations
- Shipping label generation info
- Order export (CSV/PDF)
- Sales analytics by period/product/category

**4. Customer Management:**
- Customer list with search
- Customer profile: purchase history, total spend, join date
- Customer segmentation (新規/リピート/VIP/休眠)
- RFM analysis (Recency, Frequency, Monetary)
- Customer notes and tags
- Export customer data (GDPR/個人情報保護法 compliant)

**5. Analytics Dashboard:**
- 日次/週次/月次 売上レポート
- 商品別売上ランキング
- カテゴリ別売上構成比
- 客単価推移
- コンバージョン率
- リピート率分析
- 在庫回転率レポート

### Order Status Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  新規受付 │───▶│  入金待ち │───▶│  入金済み │───▶│  発送準備 │
│  (new)   │    │ (pending)│    │  (paid)  │    │(preparing│
└──────────┘    └──────────┘    └──────────┘    └────┬─────┘
                      │                               │
                      ▼                               ▼
                ┌──────────┐                    ┌──────────┐
                │ キャンセル │                    │  発送済み │
                │(cancelled│                    │ (shipped)│
                └──────────┘                    └────┬─────┘
                                                     │
                      ┌──────────┐              ┌────┴─────┐
                      │  返品受付 │◀─────────────│   完了   │
                      │ (return) │              │(completed│
                      └──────────┘              └──────────┘
```

### Analytics Report Formats

**Daily Sales Report (`ec analytics --period day`):**
```
╔═══════════════════════════════════════════════════╗
║          日次売上レポート — 2026-03-01            ║
╠═══════════════════════════════════════════════════╣
║ 売上合計:        ¥487,230  (+12.3% vs 前日)      ║
║ 注文件数:        47件      (+8 vs 前日)           ║
║ 客単価:          ¥10,366   (+3.1% vs 前日)        ║
║ コンバージョン率: 3.2%      (+0.4pt)              ║
╠═══════════════════════════════════════════════════╣
║ 売上TOP5:                                         ║
║ 1. 有機抹茶セット      ¥89,400  (18件)            ║
║ 2. 国産はちみつ 500g   ¥67,200  (12件)            ║
║ 3. 手作り醤油 1L       ¥45,600  ( 8件)            ║
║ 4. 黒豆茶ギフト        ¥38,000  ( 5件)            ║
║ 5. 梅干し詰め合わせ    ¥32,400  ( 4件)            ║
╠═══════════════════════════════════════════════════╣
║ 在庫アラート:                                      ║
║ [!] 有機抹茶セット — 残り3個（要発注）             ║
║ [!] 国産はちみつ — 残り8個（閾値10）              ║
╚═══════════════════════════════════════════════════╝
```

**RFM Customer Analysis (`ec analytics --rfm`):**
```
╔══════════════════════════════════════════════════════╗
║            RFM分析レポート — 2026年3月               ║
╠══════════════════════════════════════════════════════╣
║ セグメント       │ 人数  │ 売上構成比 │ 施策        ║
║─────────────────┼───────┼───────────┼────────────  ║
║ VIP (R5F5M5)    │  23人 │   41.2%   │ 特別優待     ║
║ 優良 (R4F4M4+)  │  87人 │   28.7%   │ クロスセル   ║
║ リピーター       │ 156人 │   18.3%   │ ポイント付与 ║
║ 新規             │ 234人 │    8.9%   │ 初回割引     ║
║ 休眠 (R1-2)     │ 312人 │    2.9%   │ 復帰キャンペ ║
╚══════════════════════════════════════════════════════╝
```

### Error Handling

The agent must handle these common EC-CUBE API errors:

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| 401 | Invalid API key | Prompt user to check `ECCUBE_API_KEY` and `ECCUBE_API_SECRET` |
| 403 | Insufficient permissions | Report which permission is needed (e.g., product:write) |
| 404 | Resource not found | Verify product/order ID, suggest `ec products --search` |
| 409 | Conflict (duplicate SKU) | Show existing product with same SKU, ask user to resolve |
| 422 | Validation error | Parse field-level errors, show which fields need correction |
| 429 | Rate limit exceeded | Wait and retry with exponential backoff (max 3 retries) |
| 500 | Server error | Log error, suggest checking EC-CUBE admin panel directly |
| TIMEOUT | Connection timeout | Check `ECCUBE_BASE_URL` accessibility, retry once |

**Retry strategy:** On 429 or 5xx errors, retry up to 3 times with delays of 2s, 4s, 8s. Log each retry attempt.

### Commands

**`ec products [--search <query>] [--category <cat>]`** — List products
**`ec product <id>`** — Product details
**`ec product create <name> <price>`** — Create product
**`ec product update <id> --price <price>`** — Update product
**`ec product toggle <id>`** — Toggle visibility
**`ec product optimize <id>`** — AI-powered SEO optimization for product title, description, keywords
**`ec stock`** — Inventory overview
**`ec stock <product-id>`** — Product stock detail
**`ec stock adjust <product-id> <quantity> <reason>`** — Adjust stock
**`ec stock alerts`** — Low stock alerts
**`ec stock forecast <product-id>`** — Predict stock depletion date based on sales velocity
**`ec orders [--status <status>] [--from <date>]`** — List orders
**`ec order <id>`** — Order details
**`ec order update <id> --status <status>`** — Update status
**`ec customers [--segment <segment>]`** — List customers
**`ec customer <id>`** — Customer profile with purchase history
**`ec analytics [--period day|week|month|year]`** — Sales analytics
**`ec analytics --rfm`** — RFM customer analysis
**`ec analytics --inventory`** — Inventory turnover report
**`ec export <products|orders|customers> <csv|json>`** — Export data
**`ec health`** — Check EC-CUBE API connectivity and version
**`ec sync`** — Force sync local cache with remote store

### EC-CUBE 4.x Specific

- Compatible with EC-CUBE 4.1, 4.2, 4.3
- Supports EC-CUBE Web API plugin
- Handles Japanese payment methods (クレジットカード, コンビニ決済, 代引き, 銀行振込)
- Japanese tax calculation (消費税10%, 軽減税率8%)
- Shipping integration (ヤマト運輸, 佐川急便, 日本郵便)
- インボイス制度対応
- 電子帳簿保存法対応 (order PDF archival)
- ポイント管理 (EC-CUBE native point system)
- Customizer/Plugin detection and compatibility check

### Data Storage

```
.ec-cube-operator/
├── config.json              # Store connection settings
├── cache/
│   ├── products.json        # Product cache (TTL: 1h)
│   ├── categories.json      # Category tree cache
│   └── customers.json       # Customer segment cache
├── analytics/
│   ├── daily-sales.jsonl    # Daily sales aggregation
│   ├── rfm-segments.json    # Latest RFM analysis
│   └── inventory-velocity.json # Stock depletion forecasts
├── exports/
│   └── *.csv                # Exported files
├── logs/
│   ├── api-calls.jsonl      # API call log (last 7 days)
│   └── errors.jsonl         # Error log with retry history
└── templates/
    └── product-seo.json     # SEO optimization templates
```

## EC-CUBE Operator vs Shopify Operator

| Feature | EC-CUBE Operator | Shopify Operator |
|---------|-----------------|-----------------|
| Platform | EC-CUBE 4.x (self-hosted) | Shopify (SaaS) |
| Target Market | **Japan-first** (90%+ JP merchants) | Global |
| Tax Handling | **消費税10% + 軽減税率8%** built-in | Requires tax app |
| Invoice System | **インボイス制度 native** | Not supported |
| Payment Methods | **コンビニ決済, 代引き** included | Limited JP methods |
| Shipping | **ヤマト/佐川/郵便** integration | Requires third-party |
| Language | **Full Japanese UI/API** | English-first |
| Hosting | Self-hosted (Xserver, etc.) | Shopify Cloud |
| Customization | **Full PHP source access** | Liquid templates only |
| Cost | Open source (free) | $29-299/month |
| Data Ownership | **100% yours** | Shopify-hosted |
| Plugin Ecosystem | 800+ plugins (JP market) | 8000+ apps (global) |
| CSV Format | **EC-CUBE native CSV** (JP standard) | Shopify CSV |
| Customer Segments | **RFM analysis built-in** | Requires app |

## FAQ

**Q: Which EC-CUBE versions are supported?**
A: EC-CUBE 4.1, 4.2, and 4.3. The Web API plugin must be installed and enabled. EC-CUBE 2.x/3.x are not supported due to fundamentally different architectures.

**Q: How do I enable the EC-CUBE Web API?**
A: Install the "Web API Plugin" from the EC-CUBE owners store (オーナーズストア), then configure API keys in the admin panel under Settings > System > API. Generate an API key pair and set the environment variables.

**Q: Does this skill modify my EC-CUBE database directly?**
A: No. All operations go through the official EC-CUBE Web API. The skill never touches the database directly, ensuring compatibility with plugins and customizations.

**Q: How does caching work?**
A: Product and category data is cached locally with a 1-hour TTL (configurable via `ECCUBE_CACHE_TTL`). Use `ec sync` to force a refresh. Orders and stock are always fetched live to ensure accuracy.

**Q: Can I use this with EC-CUBE hosted on Xserver?**
A: Yes. As long as the Web API plugin is installed and the API endpoint is accessible via HTTPS, any hosting provider works — Xserver, ConoHa, AWS, etc.

**Q: How does tax calculation work with 軽減税率?**
A: Products are tagged with tax class (標準税率10% or 軽減税率8%) in EC-CUBE. The operator respects these settings and correctly calculates totals, including mixed-rate orders.

**Q: Is there a rate limit on the EC-CUBE API?**
A: EC-CUBE itself has no built-in rate limit (it is self-hosted), but your server capacity is the practical limit. The operator includes retry logic for server overload (5xx) responses.

**Q: Can I manage multiple EC-CUBE stores?**
A: Yes. Set different environment variables per session, or use a config file with multiple store profiles in `.ec-cube-operator/config.json`.

**Q: EC-CUBE 2.x からの移行支援はありますか？**
A: 直接の移行機能はありませんが、`eccube export --format csv` で商品・顧客データをCSV出力し、EC-CUBE 4.x の管理画面からインポートするワークフローをガイドします。データマッピングの差異も自動検出します。

**Q: カスタムプラグインとの互換性は？**
A: EC-CUBE 4.x の標準プラグイン機構に準拠したプラグインであれば、API経由で設定値の取得・変更が可能です。`eccube plugin list` でインストール済みプラグインの一覧と互換性ステータスを確認できます。
