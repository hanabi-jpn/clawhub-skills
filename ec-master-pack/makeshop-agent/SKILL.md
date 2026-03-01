---
name: "MakeShop Agent"
description: "MakeShop EC管理エージェント — GMOグループのECプラットフォームをAIで完全制御"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - makeshop
  - ecommerce
  - japan
  - gmo
  - store
---

# MakeShop Agent

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          ┌─────────────────────────────────┐                 ║
║          │     M A K E S H O P             │                 ║
║          │     A G E N T   v1.0            │                 ║
║          └─────────────────────────────────┘                 ║
║                                                              ║
║       ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               ║
║       │ 商品 │  │ 在庫 │  │ 注文 │  │ 顧客 │               ║
║       │ MGR  │  │ MGR  │  │ MGR  │  │ MGR  │               ║
║       └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘               ║
║          │         │         │         │                     ║
║          └────┬────┴────┬────┴────┬────┘                     ║
║               ▼         ▼         ▼                          ║
║          ┌──────────────────────────────┐                    ║
║          │    MakeShop REST API v2      │                    ║
║          │    GMO MakeShop Gateway      │                    ║
║          └──────────────────────────────┘                    ║
║                                                              ║
║   ┌─────┐  ┌──────┐  ┌────────┐  ┌───────┐                 ║
║   │ SEO │  │ Mail │  │ Coupon │  │Report │                  ║
║   └─────┘  └──────┘  └────────┘  └───────┘                  ║
║                                                              ║
║   GMO MAKESHOP --- AI-POWERED EC MANAGEMENT                  ║
║   ─── 流通額11年連続No.1 ECをAIで完全自動化 ───              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/clawhub-skills)
[![MakeShop](https://img.shields.io/badge/MakeShop-API_v2-E53935)](https://www.makeshop.jp/)
[![Japan](https://img.shields.io/badge/Japan-EC_Platform-ff0000)](https://github.com/hanabi-jpn/clawhub-skills)
[![GMO](https://img.shields.io/badge/GMO-Group-0066cc)](https://www.gmo.jp/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/hanabi-jpn/clawhub-skills)

`claude-code` `makeshop` `ecommerce` `japan` `store`

> **MakeShop EC管理エージェント。GMOグループが運営する流通額11年連続No.1のECプラットフォームをClaude Codeから完全操作。商品管理、在庫管理、注文処理、顧客管理、メルマガ配信、クーポン管理、SEO設定、デザインカスタマイズまで全領域をAIが統合管理する。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** makeshop, ecommerce, japan, gmo, store, api, crm, seo

---

## Overview

MakeShop Agent は、GMO MakeShop が提供する EC プラットフォーム向けの統合管理エージェントです。MakeShop は日本国内の SaaS 型 EC プラットフォームとして流通額11年連続 No.1 を誇り、22,000店舗以上が利用しています。本スキルは MakeShop の Members API および Shop Management API を通じて、商品登録から在庫管理、注文処理、顧客分析、メルマガ配信、クーポン発行、SEO 最適化、レポート出力まで、EC 運営に必要な全業務を Claude Code 上で完結させます。

日本の商習慣に完全対応しており、消費税計算（標準税率10%・軽減税率8%）、インボイス制度、電子帳簿保存法、日本語フォーマットの帳票出力、国内配送業者連携（ヤマト運輸・佐川急便・日本郵便）をネイティブサポートします。

```
┌────────────────────────────────────────────────────────────────────┐
│                  MAKESHOP AGENT ARCHITECTURE                       │
│                                                                    │
│  ┌────────────┐     ┌────────────────┐     ┌──────────────────┐   │
│  │ Claude Code │────▶│  MakeShop      │────▶│  MakeShop API    │   │
│  │ (User)      │◀────│  Agent         │◀────│  Gateway (GMO)   │   │
│  └────────────┘     └───────┬────────┘     └────────┬─────────┘   │
│                              │                       │             │
│                     ┌────────┼────────┐              │             │
│                     ▼        ▼        ▼              ▼             │
│              ┌─────────┐┌────────┐┌────────┐  ┌────────────┐      │
│              │Products ││Orders  ││Members │  │  MakeShop  │      │
│              │Engine   ││Engine  ││Engine  │  │  DataStore │      │
│              └────┬────┘└───┬────┘└───┬────┘  └────────────┘      │
│                   │         │         │                             │
│          ┌────────┼─────────┼─────────┤                            │
│          ▼        ▼         ▼         ▼                            │
│   ┌──────────┐┌──────┐┌────────┐┌─────────┐                       │
│   │Inventory ││ Mail ││ Coupon ││  SEO    │                       │
│   │Tracker   ││Sender││Manager ││Optimizer│                       │
│   └────┬─────┘└──┬───┘└───┬────┘└────┬────┘                       │
│        │         │        │          │                             │
│        └─────────┴────────┴──────────┘                             │
│                       ▼                                            │
│        ┌───────────────────────────────┐                           │
│        │   Analytics & Report Engine   │                           │
│        │   売上分析・在庫予測・顧客RFM │                           │
│        └──────────────┬────────────────┘                           │
│                       ▼                                            │
│        ┌───────────────────────────────┐                           │
│        │   Local Cache & Data Store    │                           │
│        │   .makeshop-agent/            │                           │
│        └───────────────────────────────┘                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

You are an agent equipped with **MakeShop Agent** for GMO MakeShop EC store management. Follow these rules precisely when the user invokes MakeShop commands.

### Behavioral Guidelines

1. **Always authenticate before any API call.** Verify that `MAKESHOP_SHOP_ID`, `MAKESHOP_API_KEY`, and `MAKESHOP_API_SECRET` are configured. If any is missing, prompt the user with the exact variable name and where to obtain the value in the MakeShop管理画面.

2. **Respond in Japanese by default.** All output messages, error descriptions, and report headers must be in Japanese unless the user explicitly requests English. Technical field names (API keys, JSON keys) remain in English.

3. **Validate all input before API calls.** Product prices must be non-negative integers (JPY). SKU codes must match the pattern `[A-Za-z0-9_-]{1,50}`. Email addresses must pass RFC 5322 basic validation. Date formats must be `YYYY-MM-DD`.

4. **Handle tax calculation correctly.** Apply standard tax rate (10%) by default. For food and beverage products, apply reduced tax rate (8%). Always display tax-inclusive and tax-exclusive prices separately in output.

5. **Respect rate limits.** MakeShop API allows 300 requests per 5 minutes per shop. Track request count locally and pause with a countdown when approaching the limit (270 requests). Never exceed the limit.

6. **Cache product and category data.** Store product listings and category trees locally with a 30-minute TTL. Orders and stock levels are always fetched live to ensure accuracy. Use `makeshop sync` to force a cache refresh.

7. **Log all write operations.** Every create, update, or delete operation must be logged to `.makeshop-agent/logs/operations.jsonl` with timestamp, operation type, target resource ID, and result status.

8. **Confirm destructive operations.** Before deleting products, canceling orders, or bulk-updating prices, display a summary of affected items and request explicit user confirmation.

9. **Format currency as Japanese Yen.** Always display monetary values with the `¥` prefix and comma-separated thousands (e.g., `¥12,800`). Never display decimal places for JPY amounts.

10. **Support batch operations safely.** When processing bulk updates (CSV import, batch price changes), process in chunks of 50 items with progress reporting. On any error, pause and report the failed item before continuing.

11. **Generate actionable insights.** When displaying analytics or reports, always include at least one concrete recommendation based on the data (e.g., "在庫回転率が低い商品3点をセール対象に推奨").

12. **Maintain backward compatibility.** Support both MakeShop Premium and MakeShop Enterprise plans. Detect the plan level via API and adjust available features accordingly (e.g., Enterprise has multi-warehouse support).

13. **Handle image operations carefully.** Product images must be JPEG or PNG, maximum 5MB. Validate dimensions (recommended 800x800 minimum). Compress images over 3MB before upload if possible.

14. **Implement idempotent operations.** For order status updates and stock adjustments, include an idempotency key derived from the operation parameters to prevent duplicate processing on retries.

15. **Protect customer data.** Never output full email addresses or phone numbers in logs. Mask as `t***@***.co.jp` or `090-****-1234`. Comply with Japan's Act on Protection of Personal Information (APPI).

16. **Monitor shop health proactively.** When running `makeshop report`, automatically check for anomalies: sudden sales drops (>30% vs previous period), unusually high cancellation rates (>5%), and inventory discrepancies.

17. **Support seasonal campaigns.** Recognize Japanese commercial events (初売り, バレンタイン, ホワイトデー, 母の日, お中元, お歳暮, ブラックフライデー, 年末セール) and suggest campaign timing and coupon strategies accordingly.

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MAKESHOP_SHOP_ID` | Yes | MakeShopのショップID（管理画面のURLから取得） | `hanabi-store` |
| `MAKESHOP_API_KEY` | Yes | MakeShop API認証キー（管理画面 > 外部システム連携 > API設定） | `ms_live_a1b2c3d4e5f6` |
| `MAKESHOP_API_SECRET` | Yes | MakeShop APIシークレット（API設定画面で発行） | `sec_7g8h9i0j1k2l3m4n` |
| `MAKESHOP_PLAN` | No | プランレベル（auto-detect if not set） | `premium` or `enterprise` |
| `MAKESHOP_WEBHOOK_URL` | No | 注文・在庫アラート通知用Webhook URL | `https://hooks.slack.com/services/T00/B00/abcdef` |
| `MAKESHOP_CACHE_TTL` | No | ローカルキャッシュTTL（秒、デフォルト1800） | `3600` |
| `MAKESHOP_LOG_LEVEL` | No | ログレベル（debug/info/warn/error） | `info` |
| `MAKESHOP_TAX_RATE` | No | デフォルト消費税率（デフォルト10） | `10` |
| `MAKESHOP_REDUCED_TAX` | No | 軽減税率（デフォルト8） | `8` |

---

## Commands

### `makeshop product`

商品の一覧取得、検索、作成、更新、削除、公開制御を行います。

```
$ makeshop product list --category "食品" --limit 20

╔═══════════════════════════════════════════════════════════════╗
║                 商品一覧 — カテゴリ: 食品                      ║
╠═══════════════════════════════════════════════════════════════╣
║ ID      │ 商品名                 │ 価格(税込) │ 在庫 │ 状態  ║
║─────────┼───────────────────────┼───────────┼─────┼──────  ║
║ P-00142 │ 有機宇治抹茶 100g      │   ¥3,240  │  45 │ 公開   ║
║ P-00143 │ 国産はちみつ 500g      │   ¥5,600  │  23 │ 公開   ║
║ P-00144 │ 黒豆茶ティーバッグ 30包 │   ¥1,980  │  89 │ 公開   ║
║ P-00145 │ 手作り醤油 1L           │   ¥2,160  │  12 │ 公開   ║
║ P-00146 │ 梅干し詰め合わせ       │   ¥4,320  │   7 │ 公開   ║
║ P-00147 │ 有機玄米 5kg           │   ¥3,780  │  34 │ 非公開 ║
╠═══════════════════════════════════════════════════════════════╣
║ 合計: 6商品 / 20件中  │  公開: 5  │  非公開: 1               ║
╚═══════════════════════════════════════════════════════════════╝
```

```
$ makeshop product create --name "京都宇治 煎茶セット" --price 4800 --tax-class reduced --category "食品" --sku "TEA-SENCHA-SET01"

✓ 商品を作成しました
  商品ID:    P-00201
  商品名:    京都宇治 煎茶セット
  税抜価格:  ¥4,800
  税込価格:  ¥5,184（軽減税率8%適用）
  SKU:       TEA-SENCHA-SET01
  カテゴリ:  食品
  状態:      非公開（確認後に `makeshop product publish P-00201` で公開）
```

### `makeshop inventory`

在庫の確認、更新、アラート設定、入出庫管理を行います。

```
$ makeshop inventory status --alert-threshold 10

╔═══════════════════════════════════════════════════════════════╗
║                   在庫ステータス一覧                           ║
╠═══════════════════════════════════════════════════════════════╣
║ SKU              │ 商品名               │ 在庫 │ 状態        ║
║──────────────────┼─────────────────────┼─────┼───────────  ║
║ TEA-MATCHA-100   │ 有機宇治抹茶 100g    │  45 │ 正常        ║
║ HONEY-500        │ 国産はちみつ 500g    │  23 │ 正常        ║
║ SOY-SAUCE-1L     │ 手作り醤油 1L        │  12 │ 注意        ║
║ UMEBOSHI-SET     │ 梅干し詰め合わせ     │   7 │ [!] 要発注  ║
║ RICE-GENMAI-5    │ 有機玄米 5kg         │   3 │ [!!] 緊急   ║
╠═══════════════════════════════════════════════════════════════╣
║ [!] 要発注: 2商品  │  [!!] 緊急: 1商品                       ║
║ 推奨: RICE-GENMAI-5 は過去30日の販売ペース(15個/月)から       ║
║       6日以内に在庫切れの見込みです。即時発注を推奨します。     ║
╚═══════════════════════════════════════════════════════════════╝
```

### `makeshop order`

注文の一覧取得、詳細確認、ステータス更新、配送処理を行います。

```
$ makeshop order list --status paid --from 2026-02-25

╔═══════════════════════════════════════════════════════════════╗
║              入金済み注文一覧（2026-02-25以降）                ║
╠═══════════════════════════════════════════════════════════════╣
║ 注文ID    │ 日時            │ 顧客名     │ 合計     │ 決済   ║
║───────────┼────────────────┼───────────┼─────────┼──────  ║
║ ORD-38201 │ 02-28 14:23    │ 山田 太郎  │ ¥12,960 │ カード ║
║ ORD-38199 │ 02-28 11:05    │ 佐藤 花子  │  ¥5,184 │ カード ║
║ ORD-38195 │ 02-27 22:31    │ 田中 一郎  │  ¥8,640 │ コンビニ║
║ ORD-38190 │ 02-27 09:12    │ 鈴木 美咲  │ ¥21,600 │ 銀行振込║
║ ORD-38187 │ 02-26 16:45    │ 高橋 健太  │  ¥3,240 │ カード ║
║ ORD-38183 │ 02-25 20:08    │ 伊藤 直美  │  ¥7,560 │ 代引き ║
╠═══════════════════════════════════════════════════════════════╣
║ 合計: 6件  │  総額: ¥59,184  │  発送待ち: 6件                ║
╚═══════════════════════════════════════════════════════════════╝
```

```
$ makeshop order ship ORD-38201 --carrier yamato --tracking-number 1234-5678-9012

✓ 発送処理完了
  注文ID:      ORD-38201
  顧客:        山田 太郎
  配送業者:    ヤマト運輸
  追跡番号:    1234-5678-9012
  ステータス:  入金済み → 発送済み
  通知:        発送完了メールを送信しました
```

### `makeshop customer`

顧客の一覧取得、詳細表示、セグメント分析を行います。

```
$ makeshop customer analyze --segment vip

╔═══════════════════════════════════════════════════════════════╗
║                 VIP顧客分析レポート                            ║
╠═══════════════════════════════════════════════════════════════╣
║ 会員ID    │ 顧客名     │ 累計購入額  │ 注文回数 │ 最終購入   ║
║───────────┼───────────┼───────────┼─────────┼──────────  ║
║ M-001023  │ 鈴木 美咲  │ ¥287,400   │   23回  │ 2026-02-28 ║
║ M-000891  │ 山田 太郎  │ ¥245,800   │   19回  │ 2026-02-28 ║
║ M-001102  │ 佐藤 花子  │ ¥198,600   │   16回  │ 2026-02-27 ║
║ M-000456  │ 高橋 健太  │ ¥176,200   │   14回  │ 2026-02-22 ║
║ M-000789  │ 伊藤 直美  │ ¥152,400   │   12回  │ 2026-02-20 ║
╠═══════════════════════════════════════════════════════════════╣
║ VIP顧客数: 5名  │  売上構成比: 38.2%                          ║
║ 推奨施策: VIP限定先行販売 + 送料無料クーポンで               ║
║           リピート率をさらに向上可能                           ║
╚═══════════════════════════════════════════════════════════════╝
```

### `makeshop mail`

メルマガの作成、配信、配信結果確認を行います。

```
$ makeshop mail send --template spring-sale --segment active --schedule "2026-03-05 10:00"

✓ メルマガ配信をスケジュールしました
  テンプレート:  spring-sale（春の新商品セール）
  配信対象:      アクティブ会員 1,247名
  配信日時:      2026-03-05 10:00 JST
  件名:          【期間限定】春の新商品セール開催！最大30%OFF
  プレビュー:    .makeshop-agent/mail/preview-spring-sale.html

  配信結果は `makeshop mail report spring-sale` で確認できます
```

### `makeshop coupon`

クーポンの作成、管理、利用状況確認を行います。

```
$ makeshop coupon create --name "春セール10%OFF" --type percent --value 10 --min-purchase 3000 --expires 2026-03-31 --limit 500

✓ クーポンを作成しました
  クーポンコード:  SPRING2026
  割引内容:        10% OFF
  最低購入金額:    ¥3,000
  有効期限:        2026-03-31 23:59 JST
  発行上限:        500枚
  対象:            全商品
  ステータス:      有効
```

### `makeshop seo`

商品やページのSEO設定の確認、最適化を行います。

```
$ makeshop seo analyze --page top

╔═══════════════════════════════════════════════════════════════╗
║                 SEOスコア — トップページ                       ║
╠═══════════════════════════════════════════════════════════════╣
║ 総合スコア: 72/100                                            ║
║                                                               ║
║ [OK] title タグ: 適切な長さ (32文字)                          ║
║ [OK] meta description: 設定済み (120文字)                     ║
║ [!!] h1 タグ: 未設定 → 店舗名を含むh1を追加推奨              ║
║ [OK] alt属性: 全画像に設定済み                                ║
║ [!]  ページ速度: 3.2秒 → 画像圧縮で2秒以下を推奨            ║
║ [OK] モバイル対応: レスポンシブ確認済み                       ║
║ [!]  構造化データ: Organization のみ → Product追加推奨        ║
║ [OK] canonical: 正しく設定済み                                ║
║ [OK] robots.txt: 適切に設定済み                               ║
║ [!!] サイトマップ: 最終更新が30日以上前 → 再生成推奨         ║
╠═══════════════════════════════════════════════════════════════╣
║ 改善推奨: 2件の重要課題と2件の注意事項があります              ║
║ `makeshop seo fix --page top` で自動修正を実行できます        ║
╚═══════════════════════════════════════════════════════════════╝
```

### `makeshop report`

売上レポート、在庫分析、顧客分析の統合レポートを生成します。

```
$ makeshop report --period month --month 2026-02

╔═══════════════════════════════════════════════════════════════╗
║              月次レポート — 2026年2月                          ║
╠═══════════════════════════════════════════════════════════════╣
║ 売上合計:        ¥2,847,600  (+8.3% vs 前月)                 ║
║ 注文件数:        312件       (+24件 vs 前月)                  ║
║ 客単価:          ¥9,127      (+1.2% vs 前月)                 ║
║ 新規会員:        47名        (+12名 vs 前月)                  ║
║ リピート率:      34.2%       (+2.1pt vs 前月)                 ║
║ コンバージョン率: 2.8%       (+0.3pt vs 前月)                 ║
╠═══════════════════════════════════════════════════════════════╣
║ カテゴリ別売上:                                               ║
║ 1. 食品・飲料      ¥1,423,800 (50.0%)                        ║
║ 2. 健康・美容       ¥569,520  (20.0%)                        ║
║ 3. 生活雑貨         ¥427,140  (15.0%)                        ║
║ 4. ギフト           ¥284,760  (10.0%)                        ║
║ 5. その他           ¥142,380  ( 5.0%)                        ║
╠═══════════════════════════════════════════════════════════════╣
║ AIインサイト:                                                 ║
║ - 食品カテゴリのリピート率が42%と高水準。定期購入導入を推奨   ║
║ - 新規流入の68%がスマートフォン。モバイルUX改善で             ║
║   コンバージョン率0.5pt向上の余地あり                         ║
║ - 3月はホワイトデー需要が見込まれます。                       ║
║   ギフトカテゴリのクーポン施策を推奨                          ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   MAKESHOP AGENT WORKFLOW                        │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐                  │
│  │ユーザー   │───▶│コマンド   │───▶│入力       │                  │
│  │コマンド入力│    │パーサー   │    │バリデーション│                │
│  └──────────┘    └──────────┘    └─────┬─────┘                  │
│                                        │                        │
│                                  ┌─────▼─────┐                  │
│                                  │ 認証チェック │                 │
│                                  │ API Key有効?│                 │
│                                  └─────┬─────┘                  │
│                                        │                        │
│                          ┌─────────────┼─────────────┐          │
│                          ▼             ▼             ▼          │
│                    ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│                    │キャッシュ │  │ API呼出  │  │バッチ処理│    │
│                    │ヒット判定 │  │(単件)    │  │(CSV/一括)│    │
│                    └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│                         │             │             │           │
│                         └─────────────┼─────────────┘           │
│                                       ▼                         │
│                              ┌──────────────┐                   │
│                              │レスポンス整形 │                   │
│                              │日本語フォーマット│                │
│                              └───────┬──────┘                   │
│                                      │                          │
│                               ┌──────▼──────┐                   │
│                               │ログ記録     │                   │
│                               │操作履歴保存 │                   │
│                               └──────┬──────┘                   │
│                                      │                          │
│                               ┌──────▼──────┐                   │
│                               │結果表示     │                   │
│                               │ユーザー出力 │                   │
│                               └─────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

MakeShop Agent は以下のエラーを検知し、適切に対処します。

### 1. 認証エラー (401 Unauthorized)

```
[ERROR] MakeShop API 認証エラー
  原因:  MAKESHOP_API_KEY または MAKESHOP_API_SECRET が無効です
  対処:  MakeShop管理画面 > 外部システム連携 > API設定 で
         APIキーの有効期限と値を確認してください
  確認コマンド: makeshop health
```

### 2. レートリミット超過 (429 Too Many Requests)

```
[WARN] APIレートリミットに到達しました
  現在のリクエスト数: 298/300 (5分間)
  リセットまで: 2分13秒
  対処:  自動的にリセット待ち後にリトライします (最大3回)
  進捗:  ▓▓▓▓▓▓▓▓░░ 80% 完了（残り48アイテム）
```

### 3. 商品バリデーションエラー (422 Unprocessable Entity)

```
[ERROR] 商品作成バリデーションエラー
  フィールド: price
  エラー内容: 価格は1円以上の整数で入力してください
  入力値:    -500
  対処:      正の整数値で再入力してください
  例:        makeshop product create --name "商品名" --price 4800
```

### 4. 在庫不足エラー

```
[ERROR] 在庫調整エラー — 出庫数が在庫数を超過
  商品:    有機玄米 5kg (RICE-GENMAI-5)
  現在庫:  3個
  出庫指示: 10個
  不足:    7個
  対処:    出庫数を3個以下に調整するか、入庫処理を先に行ってください
  確認:    makeshop inventory status RICE-GENMAI-5
```

### 5. ネットワーク接続エラー

```
[ERROR] MakeShop APIに接続できません
  エンドポイント: https://api.makeshop.jp/v2/products
  タイムアウト:   30秒
  対処:
    1. インターネット接続を確認してください
    2. MAKESHOP_SHOP_ID が正しいか確認してください
    3. MakeShopのステータスページ (status.makeshop.jp) を確認してください
  リトライ: 5秒後に自動リトライします (1/3)
```

### 6. CSV取込エラー

```
[ERROR] CSV取込エラー — 行 47 でエラーが発生しました
  ファイル:    products-import.csv
  エラー行:    47
  エラー内容:  SKUコード "TEA 001" に空白が含まれています
  処理済み:    46/120行
  対処:        CSVファイルの47行目を修正後、
               makeshop product import --file products-import.csv --skip 46
               で残りを処理できます
```

### 7. 決済ステータス不整合

```
[ERROR] 注文ステータス変更エラー
  注文ID:      ORD-38195
  現ステータス: 新規受付
  変更先:       発送済み
  エラー:       入金確認前のため発送処理できません
  対処:         先に入金確認を行ってください
               makeshop order update ORD-38195 --status paid
```

---

## FAQ

**Q1: MakeShopのどのプランに対応していますか？**
A: MakeShop プレミアムプラン、MakeShop エンタープライズプラン、MakeShop Platinum に対応しています。フリープランではAPI機能が制限されているため、一部コマンドが使用できません。プラン判別は `makeshop health` コマンドで自動的に行われます。

**Q2: APIキーはどこで発行できますか？**
A: MakeShop 管理画面にログイン後、「外部システム連携」>「API設定」からAPIキーとシークレットを発行できます。発行時に必要な権限スコープ（商品管理、注文管理、顧客管理など）を全て有効にしてください。

**Q3: 在庫連携は自動ですか？**
A: MakeShop Agent は API 経由でリアルタイムに在庫データを取得・更新します。ただし、他の外部システム（テンポスター、ロジレス等）との直接連携は MakeShop 側の設定が必要です。Agent は MakeShop 上の在庫データを正として動作します。

**Q4: メルマガ配信で HTMLテンプレートは使えますか？**
A: はい。`.makeshop-agent/templates/` ディレクトリに HTML テンプレートを配置することで、`makeshop mail send --template <name>` で利用できます。テンプレート内では `{{customer_name}}`, `{{shop_name}}`, `{{coupon_code}}` などの変数が使用可能です。

**Q5: 消費税の計算はどのように行われますか？**
A: 商品ごとに標準税率（10%）または軽減税率（8%）を設定できます。食品・飲料カテゴリの商品は自動的に軽減税率が適用されます。インボイス制度に対応した適格請求書フォーマットでの帳票出力にも対応しています。

**Q6: 複数ショップの管理は可能ですか？**
A: はい。`.makeshop-agent/config.json` にショップ別のプロファイルを設定することで、`--shop <profile-name>` オプションで切り替えて使用できます。各ショップの認証情報は個別に管理されます。

**Q7: CSVの文字コードは何に対応していますか？**
A: MakeShop 標準の Shift_JIS（CP932）および UTF-8 に対応しています。インポート時は自動判別し、エクスポート時はデフォルトで UTF-8(BOM付き) を使用します。Excel での文字化けを防ぐためBOMを付与しています。

**Q8: 注文の自動処理（自動発送通知など）は可能ですか？**
A: Agent 単体では定期実行機能はありませんが、cron や launchd と組み合わせることで定期的な自動処理が可能です。例えば、入金済み注文の自動発送処理を30分ごとに実行するスクリプトを生成できます。

**Q9: 商品画像の一括アップロードはできますか？**
A: はい。`makeshop product images --import <directory>` で、ファイル名が SKU コードに対応する画像を一括アップロードできます。JPEG/PNG 対応、1ファイル最大5MBです。3MB を超えるファイルは自動圧縮されます。

**Q10: MakeShop の決済方法にはどんなものがありますか？**
A: クレジットカード（GMOペイメントゲートウェイ）、コンビニ決済、銀行振込、代金引換、Amazon Pay、楽天ペイ、PayPay に対応しています。決済方法ごとのフィルタリングは `makeshop order list --payment <method>` で可能です。

**Q11: データのバックアップ機能はありますか？**
A: `makeshop export --all --format json` で商品・注文・顧客データの全量エクスポートが可能です。定期バックアップの設定は `.makeshop-agent/config.json` の `backup` セクションで設定できます。

**Q12: APIリクエスト数の制限は？**
A: MakeShop API は5分間あたり300リクエストの制限があります。Agent は内部でリクエスト数をカウントし、270リクエストに達した時点で自動的にペースダウンします。大量処理時はバッチ処理モードを使用してください。

---

## Data Storage

```
.makeshop-agent/
├── config.json                  # ショップ接続設定・マルチショップ対応
├── cache/
│   ├── products.json            # 商品キャッシュ (TTL: 30分)
│   ├── categories.json          # カテゴリツリー (TTL: 30分)
│   ├── customers-segments.json  # 顧客セグメント (TTL: 1時間)
│   └── seo-scores.json          # SEOスコアキャッシュ (TTL: 24時間)
├── analytics/
│   ├── daily-sales.jsonl        # 日次売上集計
│   ├── monthly-report.jsonl     # 月次レポートアーカイブ
│   ├── rfm-analysis.json        # RFM分析最新結果
│   ├── inventory-forecast.json  # 在庫消費予測
│   └── conversion-funnel.json   # CVファネル分析
├── mail/
│   ├── templates/               # メルマガHTMLテンプレート
│   ├── drafts/                  # 配信下書き
│   └── reports/                 # 配信結果レポート
├── coupons/
│   └── active-coupons.json      # 有効クーポン一覧
├── exports/
│   ├── products-*.csv           # 商品エクスポート
│   ├── orders-*.csv             # 注文エクスポート
│   └── customers-*.csv          # 顧客エクスポート
├── logs/
│   ├── operations.jsonl         # 全操作ログ (書込操作)
│   ├── api-calls.jsonl          # APIコールログ (直近7日)
│   └── errors.jsonl             # エラーログ
└── backups/
    └── *.json.gz                # 圧縮バックアップファイル
```

---

## Comparison Table

| 機能 | MakeShop Agent | EC-CUBE | Shopify | BASE | STORES | カラーミーショップ |
|------|---------------|---------|---------|------|--------|-----------------|
| 運営形態 | **SaaS (GMO)** | OSS (自前) | SaaS (海外) | SaaS | SaaS | SaaS (GMO) |
| 月額費用 | ¥12,100~ | 無料(+サーバ代) | $29~ | 無料~ | 無料~ | ¥4,950~ |
| 商品登録数 | **10,000~無制限** | 無制限 | 無制限 | 無制限 | 無制限 | 無制限 |
| 日本語対応 | **ネイティブ** | ネイティブ | 翻訳 | ネイティブ | ネイティブ | ネイティブ |
| API提供 | **REST API v2** | Web API | REST/GraphQL | 限定的 | 限定的 | REST API |
| 消費税対応 | **10%+軽減8%** | プラグイン | アプリ | 基本対応 | 基本対応 | 基本対応 |
| インボイス制度 | **標準対応** | プラグイン | 非対応 | 対応 | 対応 | 対応 |
| 決済方法 | **15種類以上** | プラグイン依存 | Shopify Pay他 | BASEかんたん決済 | STORES決済 | 10種類以上 |
| メルマガ機能 | **標準搭載** | 別途 | Shopify Email | 標準搭載 | 標準搭載 | オプション |
| クーポン機能 | **標準搭載** | プラグイン | 標準搭載 | 標準搭載 | 標準搭載 | 標準搭載 |
| SEOツール | **標準搭載** | 基本対応 | 標準搭載 | 限定的 | 限定的 | 基本対応 |
| デザイン自由度 | **HTML/CSS編集** | 完全自由 | Liquid | テンプレート | テンプレート | HTML/CSS |
| サポート | **日本語電話対応** | コミュニティ | 英語メイン | メール | メール | 電話/メール |
| 流通額実績 | **11年連続No.1** | 国内シェア高い | 世界最大 | 200万ショップ | 毎月1万新規 | 老舗 |
| AI Agent対応 | **MakeShop Agent** | EC-CUBE Operator | 複数あり | なし | なし | なし |

---

## MakeShop API Endpoint Reference

全エンドポイントは `https://api.makeshop.jp/v2/{MAKESHOP_SHOP_ID}/` をベースとします。認証は Bearer トークン方式です。

**Products:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | 商品一覧取得（ページネーション、最大100件/ページ） |
| GET | `/products/{id}` | 商品詳細取得（バリエーション含む） |
| POST | `/products` | 商品新規作成 |
| PUT | `/products/{id}` | 商品更新 |
| DELETE | `/products/{id}` | 商品削除（論理削除） |
| POST | `/products/{id}/images` | 商品画像アップロード |
| PUT | `/products/{id}/seo` | SEOメタデータ更新 |

**Orders:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | 注文一覧取得（フィルタ・ソート対応） |
| GET | `/orders/{id}` | 注文詳細取得 |
| PUT | `/orders/{id}/status` | 注文ステータス更新 |
| POST | `/orders/{id}/shipping` | 配送情報登録 |

**Customers:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/members` | 会員一覧取得 |
| GET | `/members/{id}` | 会員詳細取得 |
| PUT | `/members/{id}` | 会員情報更新 |

**Inventory:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stock` | 在庫一覧取得 |
| PUT | `/stock/{product_id}` | 在庫数更新 |
| POST | `/stock/adjust` | 一括在庫調整 |

**Mail & Coupons:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/mail/send` | メルマガ配信 |
| GET | `/mail/reports` | 配信結果取得 |
| POST | `/coupons` | クーポン作成 |
| GET | `/coupons` | クーポン一覧取得 |

---

## Order Status Workflow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  新規受付 │───▶│  入金待ち │───▶│  入金済み │───▶│  発送準備 │
│  (new)   │    │(pending) │    │  (paid)  │    │(preparing│
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

---

## Seasonal Campaign Calendar

| 時期 | イベント | 推奨施策 |
|------|---------|---------|
| 1月 | 初売り・福袋 | 福袋セット商品、期間限定クーポン |
| 2月 | バレンタイン | ギフト特集、送料無料キャンペーン |
| 3月 | ホワイトデー・卒業 | お返しセット、名入れ対応 |
| 5月 | 母の日 | ギフトラッピング、メッセージカード |
| 7月 | お中元 | のし対応、法人向けまとめ買い |
| 11月 | ブラックフライデー | 全品割引、タイムセール |
| 12月 | お歳暮・クリスマス | 年末ギフト、限定商品 |

`makeshop coupon` と `makeshop mail` を組み合わせて、各イベントに合わせた自動キャンペーン設定が可能です。
