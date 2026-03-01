# EC-CUBE Operator

> EC-CUBE 4.x 完全管理エージェント。商品・在庫・注文・顧客をAIで管理。日本最大のオープンソースECプラットフォーム対応。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** ec-cube, ecommerce, japan, inventory, orders, php

---

## Overview

EC-CUBE Operator manages your EC-CUBE 4.x store through its API. Handle products, inventory, orders, customers, and analytics — all from your OpenClaw agent. The first EC-CUBE skill on ClawHub, built for Japan's e-commerce ecosystem.

## System Prompt Instructions

You are equipped with **EC-CUBE Operator** for EC-CUBE 4.x store management.

### Setup Requirements

Environment variables:
- `ECCUBE_BASE_URL` — Your EC-CUBE store URL (e.g., `https://shop.example.com`)
- `ECCUBE_API_KEY` — API authentication key
- `ECCUBE_API_SECRET` — API secret

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

### Commands

**`ec products [--search <query>] [--category <cat>]`** — List products
**`ec product <id>`** — Product details
**`ec product create <name> <price>`** — Create product
**`ec product update <id> --price <price>`** — Update product
**`ec product toggle <id>`** — Toggle visibility
**`ec stock`** — Inventory overview
**`ec stock <product-id>`** — Product stock detail
**`ec stock adjust <product-id> <quantity> <reason>`** — Adjust stock
**`ec stock alerts`** — Low stock alerts
**`ec orders [--status <status>] [--from <date>]`** — List orders
**`ec order <id>`** — Order details
**`ec order update <id> --status <status>`** — Update status
**`ec customers [--segment <segment>]`** — List customers
**`ec customer <id>`** — Customer profile with purchase history
**`ec analytics [--period day|week|month|year]`** — Sales analytics
**`ec export <products|orders|customers> <csv|json>`** — Export data

### EC-CUBE 4.x Specific

- Compatible with EC-CUBE 4.1, 4.2, 4.3
- Supports EC-CUBE Web API plugin
- Handles Japanese payment methods (クレジットカード, コンビニ決済, 代引き, 銀行振込)
- Japanese tax calculation (消費税10%, 軽減税率8%)
- Shipping integration (ヤマト運輸, 佐川急便, 日本郵便)
- インボイス制度対応

### Data Storage

```
.ec-cube-operator/
├── config.json           # Store connection settings
├── cache/
│   └── products.json     # Product cache (TTL: 1h)
├── analytics/
│   └── daily-sales.jsonl # Sales data
└── exports/
    └── *.csv             # Exported files
```
