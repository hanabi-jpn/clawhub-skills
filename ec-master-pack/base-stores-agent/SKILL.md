---
name: base-stores-agent
description: "Manage Japanese EC shops on BASE and STORES — products, orders, inventory for instant-commerce"
author: hanabi-jpn
version: 1.0.0
tags:
  - ecommerce
  - base
  - stores
  - japan-ec
  - product-management
  - inventory
  - order-management
  - instant-commerce
---

```
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║    ██████╗  █████╗ ███████╗███████╗       ██╗                ║
  ║    ██╔══██╗██╔══██╗██╔════╝██╔════╝    ██╬╝                 ║
  ║    ██████╔╝███████║███████╗█████╗    ███████╗                ║
  ║    ██╔══██╗██╔══██║╚════██║██╔══╝    ╚══██╔═╝               ║
  ║    ██████╔╝██║  ██║███████║███████╗     ╚═╝                  ║
  ║    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝                         ║
  ║       ███████╗████████╗ ██████╗ ██████╗ ███████╗███████╗     ║
  ║       ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝██╔════╝    ║
  ║       ███████╗   ██║   ██║   ██║██████╔╝█████╗  ███████╗    ║
  ║       ╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝  ╚════██║    ║
  ║       ███████║   ██║   ╚██████╔╝██║  ██║███████╗███████║    ║
  ║       ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝   ║
  ║                                                              ║
  ║          ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐       ║
  ║          │ Shop │───>│ Cart │───>│ Pay  │───>│ Ship │       ║
  ║          └──────┘    └──────┘    └──────┘    └──────┘       ║
  ╚══════════════════════════════════════════════════════════════╝
```

`claude-code` `base` `stores` `ecommerce` `japan`

[![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Shops](https://img.shields.io/badge/shops-1.4M%2B_on_BASE-ff6b6b)]()

> **Unify your BASE and STORES shops under one command line -- manage products, fulfill orders, and sync inventory across Japan's top instant-commerce platforms.**

---

## Overview

BASE and STORES are the two dominant instant-commerce platforms in Japan, together powering over 2 million online shops. BASE alone hosts 1.4 million shops and has become the go-to platform for individual creators, small businesses, and D2C brands launching their first online store. STORES (by STORES, Inc., formerly hey, Inc.) serves a similarly vibrant ecosystem with its seamless storefront builder and integrated payment processing. Despite their popularity, both platforms offer limited bulk management tooling, forcing shop owners to perform repetitive manual operations through web dashboards.

BASE & STORES Agent solves this by providing a unified CLI that speaks both the BASE API and STORES API fluently. You can list products across both platforms, synchronize inventory in real time, process orders in bulk, generate consolidated sales analytics, and manage customer data -- all from a single terminal session. The agent intelligently routes commands to the correct platform based on your configuration, or you can explicitly target one platform with the `--platform base` or `--platform stores` flag. For shops that sell on both BASE and STORES simultaneously, the inventory sync feature ensures stock levels stay consistent, preventing overselling and stockouts.

```
  Architecture Overview
  =====================

  ┌──────────────┐         ┌───────────────────────┐
  │   Terminal   │         │   BASE & STORES Agent │
  │              │         │                       │
  │  ec products │────────>│  ┌─────────────────┐  │
  │  ec orders   │         │  │  Platform Router │  │
  │  ec sync     │         │  └────────┬────────┘  │
  │  ec analytics│         │           │           │
  └──────────────┘         │     ┌─────┴─────┐     │
                           │     ▼           ▼     │
                           │  ┌──────┐  ┌────────┐ │
                           │  │ BASE │  │ STORES │ │
                           │  │ API  │  │  API   │ │
                           │  │ v1   │  │  v1    │ │
                           │  └──┬───┘  └───┬────┘ │
                           │     │          │      │
                           │     ▼          ▼      │
                           │  ┌──────────────────┐ │
                           │  │  Unified Data    │ │
                           │  │  Normalizer      │ │
                           │  └──────────────────┘ │
                           └───────────────────────┘
                                      │
                           ┌──────────▼──────────┐
                           │  ~/.ec-agent/       │
                           │  - inventory.db     │
                           │  - sync-log.json    │
                           │  - analytics-cache  │
                           └─────────────────────┘
```

---

## System Prompt Instructions

You are the BASE & STORES Agent, an expert in Japanese instant-commerce platform management. Follow these rules precisely:

1. Authenticate using `BASE_ACCESS_TOKEN` for BASE operations and `STORES_ACCESS_TOKEN` for STORES operations. Both tokens can be active simultaneously for cross-platform workflows.
2. For BASE OAuth flows, use `BASE_CLIENT_ID` and `BASE_CLIENT_SECRET` to initiate token generation. Guide the user through the OAuth2 authorization code flow if no access token is set.
3. Route all commands to the appropriate platform. If the user has configured both platforms, default to showing combined results unless `--platform base` or `--platform stores` is specified.
4. Normalize product data across platforms into a unified schema: title, description, price (JPY), stock, images, variants, status (published/draft/archived).
5. All prices must be displayed in Japanese Yen with comma formatting (e.g., 3,980). Never convert to other currencies unless explicitly asked.
6. When listing products, show up to 50 items per page by default. Support `--limit` and `--offset` for pagination. Display platform origin with a `[B]` or `[S]` prefix.
7. For order management, display order statuses using standard labels: `[NEW]`, `[PAID]`, `[SHIPPED]`, `[DELIVERED]`, `[CANCELLED]`. Map platform-specific statuses to these unified labels.
8. When syncing inventory between BASE and STORES, use the product SKU as the matching key. Warn the user if SKUs do not match across platforms and suggest a mapping.
9. Support Japanese product names, descriptions, and customer data natively. Handle Shift-JIS encoding from legacy CSV exports by auto-detecting and converting to UTF-8.
10. For bulk operations (bulk price update, bulk publish/unpublish), require explicit `--confirm` flag to prevent accidental mass changes.
11. Generate analytics using local calculation from order data. Metrics include: total revenue, order count, average order value (AOV), top products, and daily/weekly/monthly trends.
12. When creating coupons, validate discount rules: percentage discounts must be 1-99%, fixed discounts must be positive integers, expiry dates must be in the future.
13. For shipping management, integrate with Japan-standard carriers: Yamato Transport, Sagawa Express, Japan Post (Yu-Pack). Auto-format tracking numbers per carrier format.
14. Cache product and order data locally with a 10-minute TTL. The `--refresh` flag forces a fresh API call.
15. Rate-limit BASE API calls to 30/minute and STORES API calls to 60/minute per their respective documentation. Queue and batch operations accordingly.
16. On export, support CSV (Shift-JIS for Excel compatibility in Japan), UTF-8 CSV, JSON, and TSV formats. Default to Shift-JIS CSV for maximum compatibility with Japanese business tools.
17. Log all destructive operations (delete, bulk update, inventory overwrite) to `~/.ec-agent/audit.log` with timestamps and before/after values.
18. When displaying inventory sync results, show a diff-style output with stock deltas: `+5`, `-3`, `=` for unchanged items.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `BASE_CLIENT_ID` | Yes (BASE) | -- | BASE OAuth2 client ID |
| `BASE_CLIENT_SECRET` | Yes (BASE) | -- | BASE OAuth2 client secret |
| `BASE_ACCESS_TOKEN` | Yes (BASE) | -- | BASE API access token |
| `STORES_ACCESS_TOKEN` | Yes (STORES) | -- | STORES API access token |
| `EC_DEFAULT_PLATFORM` | No | `both` | Default platform: base, stores, both |
| `EC_CURRENCY_DISPLAY` | No | `jpy` | Currency display format |
| `EC_CACHE_TTL` | No | `600` | Cache TTL in seconds |
| `EC_CSV_ENCODING` | No | `shift-jis` | Default CSV encoding for exports |

---

## Commands

### `ec products` -- List Products

```bash
$ ec products
┌──────┬─────┬────────────────────────────────┬──────────┬───────┬───────────┐
│  #   │ Src │  Title                         │  Price   │ Stock │  Status   │
├──────┼─────┼────────────────────────────────┼──────────┼───────┼───────────┤
│  001 │ [B] │  Hand-dyed indigo tote bag     │  ¥4,980  │   12  │ Published │
│  002 │ [B] │  Ceramic matcha bowl (wabi)    │  ¥3,200  │    8  │ Published │
│  003 │ [S] │  Organic cotton t-shirt        │  ¥2,980  │   45  │ Published │
│  004 │ [S] │  Hinoki wood phone stand       │  ¥1,500  │   30  │ Published │
│  005 │ [B] │  Washi paper notebook A5       │  ¥1,200  │   67  │  Draft    │
│  006 │ [S] │  Beeswax food wraps (3-pack)   │  ¥1,800  │   22  │ Published │
└──────┴─────┴────────────────────────────────┴──────────┴───────┴───────────┘
  Showing 6 of 41 products | BASE: 23 | STORES: 18
```

### `ec orders` -- View Orders

```bash
$ ec orders --period 2026-02
┌────────────┬─────┬──────────────────────┬──────────┬───────────┬────────────┐
│  Order ID  │ Src │  Customer            │  Total   │  Status   │  Date      │
├────────────┼─────┼──────────────────────┼──────────┼───────────┼────────────┤
│ B-20260228 │ [B] │  Nakamura Haruki     │  ¥8,180  │ [SHIPPED] │ 2026-02-28 │
│ S-20260227 │ [S] │  Watanabe Rina       │  ¥2,980  │ [PAID]    │ 2026-02-27 │
│ B-20260226 │ [B] │  Kobayashi Sota      │  ¥4,980  │ [DELIVRD] │ 2026-02-26 │
│ S-20260225 │ [S] │  Ito Sakura          │  ¥3,300  │ [DELIVRD] │ 2026-02-25 │
│ B-20260224 │ [B] │  Takahashi Ryo       │  ¥6,400  │ [DELIVRD] │ 2026-02-24 │
└────────────┴─────┴──────────────────────┴──────────┴───────────┴────────────┘
  5 orders in February 2026 | Revenue: ¥25,840 | BASE: ¥19,560 | STORES: ¥6,280
```

### `ec inventory` -- Check Inventory

```bash
$ ec inventory --low-stock 10
Low Stock Alert (threshold: 10 units)
┌─────┬────────────────────────────────┬───────┬───────┬──────────┐
│ Src │  Product                       │ Stock │ Sold  │ Velocity │
├─────┼────────────────────────────────┼───────┼───────┼──────────┤
│ [B] │  Ceramic matcha bowl (wabi)    │   8   │  42   │ 2.1/week │
│ [B] │  Hand-dyed indigo scarf        │   3   │  28   │ 1.4/week │
│ [S] │  Yuzu body butter 100ml       │   5   │  35   │ 1.8/week │
└─────┴────────────────────────────────┴───────┴───────┴──────────┘
  3 products below threshold | Restock recommended within 1-2 weeks
```

### `ec analytics` -- Sales Analytics

```bash
$ ec analytics --period 2026-02
═══════════════════════════════════════════════════════
  Sales Report: February 2026 | Both Platforms
═══════════════════════════════════════════════════════

  Revenue:           ¥387,200
    BASE:            ¥248,600 (64.2%)
    STORES:          ¥138,600 (35.8%)

  Orders:            89
  Avg Order Value:   ¥4,350
  Unique Customers:  76

  Top Products:
    1. Hand-dyed indigo tote bag     ¥74,700 (15 sold)
    2. Ceramic matcha bowl (wabi)    ¥44,800 (14 sold)
    3. Organic cotton t-shirt        ¥38,740 (13 sold)

  Weekly Trend:
    W1: ¥82,400  ████████████████
    W2: ¥104,300 ████████████████████
    W3: ¥96,100  ███████████████████
    W4: ¥104,400 ████████████████████
```

### `ec customers` -- Customer Management

```bash
$ ec customers --top 5
┌──────────────────────┬──────────┬────────┬─────────────┬─────────────┐
│  Customer            │  Orders  │ Total  │ Last Order  │ Platform    │
├──────────────────────┼──────────┼────────┼─────────────┼─────────────┤
│  Tanaka Yui          │    7     │¥32,600 │ 2026-02-27  │ BASE        │
│  Suzuki Kenji        │    5     │¥24,100 │ 2026-02-28  │ Both        │
│  Yamada Aiko         │    5     │¥21,800 │ 2026-02-20  │ STORES      │
│  Sato Hiroshi        │    4     │¥19,200 │ 2026-02-15  │ BASE        │
│  Ogawa Miki          │    4     │¥16,400 │ 2026-02-22  │ STORES      │
└──────────────────────┴──────────┴────────┴─────────────┴─────────────┘
  Top 5 by lifetime value | Total customers: 312
```

### `ec coupons` -- Coupon Management

```bash
$ ec coupons create --platform base --code SPRING2026 --discount 15% --min-order 3000 --expires 2026-03-31
Coupon created on BASE.
  Code:          SPRING2026
  Discount:      15% off
  Min Order:     ¥3,000
  Expires:       2026-03-31
  Usage Limit:   Unlimited
  Status:        Active
```

### `ec shipping` -- Shipping Management

```bash
$ ec shipping update B-20260228 --carrier yamato --tracking 3456-7890-1234
Order B-20260228 shipping updated.
  Carrier:     Yamato Transport
  Tracking:    3456-7890-1234
  Status:      [PAID] -> [SHIPPED]
  Notification: Customer email sent to nakamura@example.com
  Tracking URL: https://toi.kuronekoyamato.co.jp/cgi-bin/tneko?number=345678901234
```

### `ec bulk` -- Bulk Operations

```bash
$ ec bulk update-price --from-csv price_update.csv --platform base --confirm
Processing bulk price update...
  ┌──────────────────────────────┬───────────┬───────────┐
  │  Product                     │  Old Price│ New Price │
  ├──────────────────────────────┼───────────┼───────────┤
  │  Hand-dyed indigo tote bag   │  ¥4,980   │  ¥5,280   │
  │  Ceramic matcha bowl (wabi)  │  ¥3,200   │  ¥3,500   │
  │  Washi paper notebook A5     │  ¥1,200   │  ¥1,380   │
  └──────────────────────────────┴───────────┴───────────┘
  3 products updated on BASE | Audit logged.
```

### `ec settings` -- Shop Settings

```bash
$ ec settings
┌────────────┬──────────────────────────────────────────────┐
│  Platform  │  Shop Details                                │
├────────────┼──────────────────────────────────────────────┤
│  BASE      │  Shop: Wabi-Sabi Crafts                      │
│            │  URL: wabisabi-crafts.thebase.in              │
│            │  Plan: Growth (¥5,980/mo)                     │
│            │  Products: 23 published, 4 draft              │
│            │  Payment: Credit card, Convenience store      │
├────────────┼──────────────────────────────────────────────┤
│  STORES    │  Shop: Wabi-Sabi Crafts STORES               │
│            │  URL: wabisabi.stores.jp                      │
│            │  Plan: Standard (¥2,178/mo)                   │
│            │  Products: 18 published, 1 draft              │
│            │  Payment: Credit card, Carrier billing        │
└────────────┴──────────────────────────────────────────────┘
```

### `ec sync` -- Inventory Sync

```bash
$ ec sync --direction base-to-stores --dry-run
Inventory Sync Preview (BASE -> STORES)
┌────────────────────────────────┬────────────┬──────────────┬───────┐
│  Product (by SKU)              │ BASE Stock │ STORES Stock │ Delta │
├────────────────────────────────┼────────────┼──────────────┼───────┤
│  SKU-001 Indigo tote bag       │     12     │      9       │  +3   │
│  SKU-002 Matcha bowl           │      8     │      8       │   =   │
│  SKU-003 Cotton t-shirt        │     45     │     40       │  +5   │
│  SKU-005 Hinoki phone stand    │     30     │     28       │  +2   │
└────────────────────────────────┴────────────┴──────────────┴───────┘
  3 products to sync | 1 unchanged | Run without --dry-run to apply
```

---

## Workflow Diagram

```
  Dual-Platform Commerce Workflow
  ════════════════════════════════

  ┌──────────────┐                    ┌──────────────┐
  │   BASE API   │                    │  STORES API  │
  │  (thebase.in)│                    │ (stores.jp)  │
  └──────┬───────┘                    └──────┬───────┘
         │                                   │
         └─────────────┬─────────────────────┘
                       ▼
              ┌────────────────┐
              │ Platform Router│
              │ & Normalizer   │
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
  ┌────────────┐ ┌─────────┐ ┌──────────┐
  │  Products  │ │ Orders  │ │Inventory │
  │  Module    │ │ Module  │ │  Sync    │
  └─────┬──────┘ └────┬────┘ └────┬─────┘
        │              │           │
        ▼              ▼           ▼
  ┌─────────────────────────────────────┐
  │         Analytics Engine            │
  │  Revenue | AOV | Trends | Rankings  │
  └──────────────────┬──────────────────┘
                     ▼
  ┌─────────────────────────────────────┐
  │  Export: CSV(SJIS) | JSON | TSV     │
  │  Reports: Daily | Weekly | Monthly  │
  └─────────────────────────────────────┘
```

---

## Error Handling

| Error | Cause | Solution |
|---|---|---|
| `BASE_AUTH_EXPIRED: Token expired` | BASE OAuth access token has expired (60-day lifetime). | Run `ec auth refresh --platform base` to use the refresh token, or re-authorize via OAuth flow. |
| `STORES_401: Unauthorized` | STORES access token is invalid or revoked. | Generate a new token in STORES dashboard > Settings > API and update `STORES_ACCESS_TOKEN`. |
| `SYNC_SKU_MISMATCH: 3 unmatched SKUs` | Product SKUs differ between BASE and STORES. | Run `ec sync --show-unmatched` to see mismatches, then create a mapping file at `~/.ec-agent/sku-map.json`. |
| `RATE_LIMIT: BASE 30/min exceeded` | Too many BASE API calls in a single minute. | Reduce batch size or wait 60 seconds. The agent queues excess calls automatically. |
| `CSV_ENCODING: Invalid Shift-JIS` | CSV file contains characters outside Shift-JIS range. | Use `--encoding utf8` flag or convert the file to UTF-8 before importing. |
| `PRICE_INVALID: Negative price` | A bulk update CSV contains a negative or zero price. | Fix the CSV and re-run. Prices must be positive integers in JPY. |
| `STOCK_NEGATIVE: Cannot set stock below 0` | Inventory sync would result in negative stock on target platform. | Use `--floor 0` flag to set minimum stock to zero instead of applying the negative delta. |

---

## FAQ

**1. Do I need both BASE and STORES accounts?**
No. You can use the agent with just one platform. Configure only the tokens for the platform you use.

**2. How does cross-platform inventory sync work?**
The agent matches products by SKU across platforms. When stock changes on one platform, `ec sync` calculates the delta and pushes it to the other.

**3. Can I import products from a CSV?**
Yes. Use `ec bulk import --from-csv products.csv --platform base`. The CSV should include: title, price, stock, description, image_url.

**4. Are prices always in JPY?**
By default, yes. Both BASE and STORES primarily operate in JPY. The agent displays all prices with yen formatting.

**5. How do I handle Shift-JIS CSV exports?**
The agent auto-detects encoding. For explicit control, use `--encoding shift-jis` or `--encoding utf8` on any export/import command.

**6. Can I manage multiple BASE shops?**
Yes. Use `--shop <shop-id>` to target a specific shop, or configure multiple shops in `~/.ec-agent/config.yaml`.

**7. What carriers are supported for shipping?**
Yamato Transport, Sagawa Express, and Japan Post (Yu-Pack) are natively supported with auto-formatted tracking URLs.

**8. Is there a sandbox/test mode?**
Use `--dry-run` on any write operation to preview changes without applying them. BASE also offers a sandbox API environment.

**9. How often should I sync inventory?**
For active shops, every 15-30 minutes is recommended. Set up a cron job: `*/15 * * * * ec sync --direction bidirectional --auto`.

**10. Can I generate tax-inclusive prices?**
Yes. Use `ec bulk tax-adjust --rate 10 --platform base` to recalculate prices with Japan's 10% consumption tax included.

**11. Does the agent handle digital products?**
Yes. Both BASE and STORES support digital downloads. Use `ec products create --type digital --file ./ebook.pdf`.

**12. How do I track conversion rates?**
Use `ec analytics --detailed` to see visitor-to-order conversion rates (requires Google Analytics integration for traffic data).

---

## Data Storage

| Location | Purpose | Retention |
|---|---|---|
| `~/.ec-agent/config.yaml` | API tokens, shop IDs, preferences | Persistent |
| `~/.ec-agent/inventory.db` | SQLite database for inventory tracking | Persistent, pruned monthly |
| `~/.ec-agent/sync-log.json` | Inventory sync history with deltas | Rolling 90 days |
| `~/.ec-agent/analytics-cache/` | Cached order and revenue data | 10-minute TTL |
| `~/.ec-agent/exports/` | Generated CSV/JSON/TSV files | User-managed |
| `~/.ec-agent/sku-map.json` | Cross-platform SKU mapping | Persistent |
| `~/.ec-agent/audit.log` | Destructive operation log | Rolling 30 days, max 10MB |

All data is stored locally. API tokens are stored in the config file; use environment variables for enhanced security. The SQLite inventory database can be backed up with standard file copy.

---

## Comparison Table

| Feature | BASE & STORES Agent | BASE Web Dashboard | STORES Web Dashboard | Shopify CLI |
|---|---|---|---|---|
| Unified multi-platform | Both in one CLI | BASE only | STORES only | Shopify only |
| Bulk product operations | CSV import/export | Limited (50 items) | Manual only | Theme-focused |
| Inventory sync | Cross-platform | Single shop | Single shop | N/A |
| Japanese-native | Full (SJIS + UTF-8) | Yes | Yes | Partial |
| Sales analytics (CLI) | Combined reports | Web dashboard | Web dashboard | Partner API |
| Carrier integration | Yamato/Sagawa/JP Post | Yamato/Sagawa | Basic | Multi-carrier |
| Coupon management | Full CRUD | Web UI | Web UI | Scripts |
| Offline product view | Cached locally | No | No | No |
| Export formats | CSV(SJIS), JSON, TSV | CSV | CSV | JSON |
| Setup time | 3 minutes | Browser | Browser | 15 minutes |
| Price | Free (OSS) | Platform fees | Platform fees | $25+/mo |
| API rate handling | Auto-queue + backoff | N/A | N/A | Manual |

---

*BASE & STORES Agent -- two platforms, one terminal, zero browser tabs.*
