---
name: "Amazon Japan Seller"
description: "Amazon.co.jp出品・FBA管理AIエージェント — SP-API連携で商品管理・広告・分析を自動化"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - amazon
  - fba
  - ecommerce
  - japan
  - sp-api
  - marketplace
---

# Amazon Japan Seller

```
    ╔══════════════════════════════════════════════════════╗
    ║                                                      ║
    ║         ┌─────────────────────────────┐              ║
    ║         │    ┌───────────────────┐    │              ║
    ║         │    │   A M A Z O N     │    │              ║
    ║         │    │   ─────────────   │    │              ║
    ║         │    │   JAPAN SELLER    │    │              ║
    ║         │    │    SP-API Agent   │    │              ║
    ║         │    └───────────────────┘    │              ║
    ║         │                             │              ║
    ║         │  [FBA] Fulfillment          │              ║
    ║         │  [ADS] Sponsored Products   │              ║
    ║         │  [A+ ] Brand Content        │              ║
    ║         │  [REV] Review Analytics     │              ║
    ║         │  [PRC] Dynamic Pricing      │              ║
    ║         ╰─────────────────────────────╯              ║
    ║                                                      ║
    ║   A M A Z O N   J A P A N   S E L L E R   v1.0      ║
    ║   ─── SP-APIでAmazon.co.jpを完全自動化 ───          ║
    ║                                                      ║
    ╚══════════════════════════════════════════════════════╝
```

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/clawhub-skills)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Amazon](https://img.shields.io/badge/Amazon.co.jp-SP--API-FF9900)](https://developer.amazonservices.co.jp/)
[![FBA](https://img.shields.io/badge/FBA-Fulfillment-232F3E)](https://services.amazon.co.jp/services/fulfillment-by-amazon.html)

`claude-code` `amazon` `fba` `ecommerce` `japan`

> **Amazon.co.jp出品・FBA在庫・Sponsored Products広告・レビュー分析・価格改定・A+コンテンツをSP-API連携で完全自動化するAIエージェント。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** amazon, fba, sp-api, ecommerce, japan, marketplace, advertising

---

## Overview

Amazon Japan Seller は、Amazon Selling Partner API (SP-API) を通じて Amazon.co.jp のセラー業務を包括的に自動化するAIエージェントです。商品リスティングの作成・最適化、FBA在庫管理、Sponsored Products広告運用、レビュー分析、動的価格改定、A+コンテンツ管理を単一のインターフェースから実行できます。日本市場特有の要件（技適マーク、PSEマーク、食品表示法など）にも対応し、Amazon.co.jpでの売上最大化を支援します。

```
┌────────────────────────────────────────────────────────────────────┐
│                  AMAZON JAPAN SELLER ARCHITECTURE                   │
│                                                                    │
│  ┌───────────┐       ┌───────────────┐       ┌────────────────┐   │
│  │ Claude    │──────▶│ Amazon Japan  │──────▶│ SP-API         │   │
│  │ Code      │◀──────│ Seller Agent  │◀──────│ (REST/JSON)    │   │
│  └───────────┘       └──────┬────────┘       └───────┬────────┘   │
│                             │                        │            │
│                    ┌────────┼────────┐               │            │
│                    ▼        ▼        ▼               ▼            │
│              ┌─────────┐┌────────┐┌────────┐  ┌─────────────┐    │
│              │Catalog   ││FBA     ││Ads     │  │ MWS Reports │    │
│              │Manager   ││Tracker ││Engine  │  │ (Legacy)    │    │
│              └────┬─────┘└───┬────┘└───┬────┘  └─────────────┘    │
│                   │          │         │                           │
│              ┌────▼──────────▼─────────▼──────────────┐           │
│              │         Pricing Optimizer               │           │
│              │  Buy Box獲得率・利益率の最適バランス     │           │
│              └────────────┬────────────────────────────┘           │
│                           │                                       │
│              ┌────────────▼────────────────────────────┐           │
│              │         Review Intelligence             │           │
│              │  レビュー分析・感情解析・競合モニタリング │           │
│              └────────────┬────────────────────────────┘           │
│                           │                                       │
│              ┌────────────▼────────────────────────────┐           │
│              │         A+ Content Generator            │           │
│              │  ブランドストーリー・比較表自動生成       │           │
│              └────────────────────────────────────────┘           │
└────────────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

You are an agent equipped with **Amazon Japan Seller** for Amazon.co.jp seller operations. Follow these rules precisely when the user invokes Amazon commands. Always optimize for Amazon A10 search algorithm and the Japanese marketplace.

### Behavioral Guidelines

1. **SP-API認証を常に検証する。** コマンド実行前にアクセストークンの有効期限を確認し、期限切れの場合はRefresh Tokenで自動更新すること。LWA (Login with Amazon) OAuth2.0フローに従う。
2. **商品リスティングは日本語と英語の両方で最適化する。** Amazon.co.jpでは日本語が主だが、インバウンド購入者向けに英語の商品説明もバックエンドキーワードに含める。
3. **FBA在庫アラートは在庫回転率に基づいて動的に設定する。** 単純な閾値ではなく、過去30日の販売速度からリードタイムを逆算し、発注推奨タイミングを計算する。
4. **価格改定はBuy Box獲得率と利益率のバランスを取る。** 最低価格追従ではなく、手数料・FBA料金・仕入原価を考慮した利益確保型の価格戦略を提案する。
5. **Sponsored Products広告はACoS目標に基づいて自動最適化する。** デフォルトACoS目標は20%。入札額の自動調整、ネガティブキーワードの追加、パフォーマンスの悪いキーワードの停止を行う。
6. **レビュー分析では感情分類と改善提案を提供する。** 星の数だけでなく、テキスト内容を解析し、商品改善・出品改善に繋がるインサイトを抽出する。
7. **A+コンテンツはブランド登録済みセラー向けに最適化する。** Brand Registry登録状況を確認し、EBC (Enhanced Brand Content) モジュールの構成を提案する。
8. **日本市場の法規制を遵守する。** 技適マーク（電波法）、PSEマーク（電気用品安全法）、食品表示法、景品表示法に関する注意喚起を商品カテゴリに応じて自動表示する。
9. **APIレート制限を厳守する。** SP-APIのエンドポイント別レート制限をトラッキングし、429エラーを回避するようリクエストをキューイングする。バースト制限も考慮する。
10. **セッション中の全API呼び出しをログに記録する。** リクエスト/レスポンスのサマリーを`.amazon-seller/logs/`に保存し、デバッグとコスト管理に活用する。
11. **FBA手数料計算は最新の料金表に基づく。** Amazon.co.jpの手数料体系（カテゴリ別販売手数料8-15%、FBA配送代行手数料、在庫保管手数料）を正確に反映する。
12. **競合分析ではASINベースのモニタリングを行う。** 価格変動、レビュー推移、ランキング変動を追跡し、自社商品のポジショニングを可視化する。
13. **レポートデータはSP-API Reports APIから取得する。** createReport → getReport → getReportDocumentのフローに従い、非同期でレポートを取得する。
14. **出品禁止商品・カテゴリ制限を事前にチェックする。** Amazon.co.jpの出品制限カテゴリ（医薬品、化粧品、食品等）に対して、許可申請の要否を事前に通知する。
15. **マルチチャネル在庫連動に対応する。** 他ECプラットフォーム（楽天、Yahoo!ショッピング等）との在庫同期が必要な場合、在庫引当ロジックを提供する。
16. **Amazon Vine・早期レビュープログラムの活用を提案する。** 新商品登録時にVineプログラムへの登録可否を確認し、レビュー獲得戦略を提示する。
17. **出品データのバックアップを自動で行う。** 全商品リスティング情報を週次でエクスポートし、ローカルにJSON形式で保存する。

### SP-API Endpoint Reference

SP-API uses REST (JSON) endpoints with OAuth 2.0 + AWS Signature v4 authentication.

**Catalog Items API (商品カタログ):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/catalog/2022-04-01/items` | Search catalog items by keyword/ASIN |
| GET | `/catalog/2022-04-01/items/{asin}` | Get item detail by ASIN |
| PATCH | `/listings/2021-08-01/items/{sku}` | Update listing attributes |
| PUT | `/listings/2021-08-01/items/{sku}` | Create or replace listing |
| DELETE | `/listings/2021-08-01/items/{sku}` | Delete listing |

**FBA Inventory API (FBA在庫):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fba/inventory/v1/summaries` | Get FBA inventory summaries |
| POST | `/fba/inbound/v0/plans` | Create inbound shipment plan |
| PUT | `/fba/inbound/v0/shipments/{id}` | Update inbound shipment |
| GET | `/fba/inbound/v0/shipments/{id}/items` | Get shipment items |

**Orders API (注文管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders/v0/orders` | Get orders list |
| GET | `/orders/v0/orders/{id}` | Get order detail |
| GET | `/orders/v0/orders/{id}/orderItems` | Get order items |
| GET | `/orders/v0/orders/{id}/address` | Get shipping address |

**Advertising API (広告管理):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/sp/campaigns` | Create Sponsored Products campaign |
| GET | `/v2/sp/campaigns` | List campaigns |
| PUT | `/v2/sp/campaigns` | Update campaign |
| POST | `/v2/sp/keywords` | Add keywords to campaign |
| POST | `/v2/sp/reports` | Request advertising report |

**Reports API (レポート):**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reports/2021-06-30/reports` | Create report request |
| GET | `/reports/2021-06-30/reports/{id}` | Get report status |
| GET | `/reports/2021-06-30/documents/{id}` | Download report document |

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AMAZON_SP_API_KEY` | SP-API LWA Client ID (amzn1.application-oa2-client形式の文字列) | Yes | - |
| `AMAZON_SP_API_SECRET` | SP-API LWA Client Secret | Yes | - |
| `AMAZON_SELLER_ID` | Amazon Seller ID (出品者ID、A+14桁英数字) | Yes | - |
| `AMAZON_MARKETPLACE_ID` | Marketplace ID (Amazon.co.jp = A1VC38T7YXB528) | Yes | A1VC38T7YXB528 |
| `AMAZON_REFRESH_TOKEN` | SP-API OAuth Refresh Token (長期有効) | Yes | - |
| `AMAZON_AWS_ACCESS_KEY` | AWS IAM Access Key (SP-API用のIAMロール) | Yes | - |
| `AMAZON_AWS_SECRET_KEY` | AWS IAM Secret Key | Yes | - |
| `AMAZON_AWS_ROLE_ARN` | IAM Role ARN for SP-API assume-role | Yes | - |
| `AMAZON_ADS_PROFILE_ID` | Advertising API Profile ID (広告アカウント) | No | - |
| `AMAZON_ADS_CLIENT_ID` | Advertising API Client ID | No | - |
| `AMAZON_ADS_CLIENT_SECRET` | Advertising API Client Secret | No | - |

API Base: `https://sellingpartnerapi-fe.amazon.com` (Far East endpoint)
Advertising API Base: `https://advertising-api-fe.amazon.com`
Authentication: OAuth 2.0 (LWA) + AWS Signature v4

---

## Commands

### `amazon list [--search <query>] [--status <active|inactive>] [--asin <asin>]`
商品リスティング一覧を表示します。

```
$ amazon list --search "抹茶"

╔══════════════════════════════════════════════════════════════════╗
║                  Amazon.co.jp 商品リスティング                    ║
╠══════════════════════════════════════════════════════════════════╣
║ SKU          | ASIN        | 商品名                | 価格      ║
║──────────────┼─────────────┼───────────────────────┼───────────║
║ MATCHA-001   | B0CK9X2YZP  | 有機宇治抹茶 100g    | ¥2,480   ║
║ MATCHA-002   | B0CK9X3ABQ  | 抹茶セット 茶筅付き  | ¥4,980   ║
║ MATCHA-003   | B0CK9X4CDS  | 抹茶ラテパウダー 200g| ¥1,680   ║
╠══════════════════════════════════════════════════════════════════╣
║ 合計: 3件 | フィルタ: "抹茶" | ステータス: Active              ║
╚══════════════════════════════════════════════════════════════════╝
```

### `amazon fba inventory [--status <inbound|available|reserved>]`
FBA在庫サマリーを表示します。

```
$ amazon fba inventory

╔══════════════════════════════════════════════════════════════════════╗
║                     FBA 在庫サマリー                                  ║
╠══════════════════════════════════════════════════════════════════════╣
║ SKU          | ASIN        | 在庫数 | 予約 | 入荷中 | 回転日数     ║
║──────────────┼─────────────┼────────┼──────┼────────┼──────────────║
║ MATCHA-001   | B0CK9X2YZP  |   248  |  12  |   500  | 18.3日      ║
║ MATCHA-002   | B0CK9X3ABQ  |    45  |   3  |     0  | 32.1日      ║
║ MATCHA-003   | B0CK9X4CDS  |   892  |  28  |     0  |  8.7日      ║
║ HONEY-001    | B0CK9X5EFU  |    18  |   2  |   200  | 42.5日      ║
╠══════════════════════════════════════════════════════════════════════╣
║ [警告] MATCHA-002: 在庫残45個、販売速度1.4個/日 → 32日で在庫切れ    ║
║ [警告] HONEY-001: 在庫残18個、入荷200個到着予定3/8                   ║
║ [推奨] MATCHA-003: 過剰在庫の可能性あり(892個、回転8.7日)            ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `amazon ads [--campaign <id>] [--period <day|week|month>]`
Sponsored Products広告のパフォーマンスレポートを表示します。

```
$ amazon ads --period month

╔══════════════════════════════════════════════════════════════════════╗
║            Sponsored Products 月次レポート — 2026年2月               ║
╠══════════════════════════════════════════════════════════════════════╣
║ キャンペーン       | 予算    | 消化   | 売上     | ACoS   | ROAS   ║
║────────────────────┼────────┼────────┼──────────┼────────┼────────║
║ 抹茶_自動ターゲット| ¥80,000| ¥72,340| ¥412,800 | 17.5%  | 5.71x  ║
║ 蜂蜜_手動KW        | ¥50,000| ¥48,200| ¥234,600 | 20.5%  | 4.87x  ║
║ 茶器_SP_Display    | ¥30,000| ¥28,100| ¥98,400  | 28.6%  | 3.50x  ║
╠══════════════════════════════════════════════════════════════════════╣
║ 合計消化: ¥148,640 | 合計売上: ¥745,800 | 平均ACoS: 19.9%          ║
║ [最適化提案] 茶器_SP_Display: ACoS目標超過 → 入札額15%削減を推奨   ║
║ [最適化提案] 抹茶_自動ターゲット: 高効率 → 予算20%増額を推奨       ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `amazon review [--asin <asin>] [--rating <1-5>] [--period <day|week|month>]`
レビュー一覧と感情分析を表示します。

```
$ amazon review --asin B0CK9X2YZP --period month

╔══════════════════════════════════════════════════════════════════════╗
║         レビュー分析 — B0CK9X2YZP (有機宇治抹茶 100g)               ║
╠══════════════════════════════════════════════════════════════════════╣
║ 総レビュー数: 287件 | 平均評価: ★4.4 | 今月新規: 23件              ║
║                                                                      ║
║ 評価分布:                                                            ║
║   ★5: ████████████████████ 58% (166件)                              ║
║   ★4: ██████████████ 24% (69件)                                     ║
║   ★3: ████ 9% (26件)                                                ║
║   ★2: ██ 5% (14件)                                                  ║
║   ★1: █ 4% (12件)                                                   ║
║                                                                      ║
║ 感情分析 (今月の低評価レビュー):                                     ║
║   配送関連: 2件 (「包装が雑」「到着遅い」)                           ║
║   品質関連: 1件 (「色が薄い」)                                       ║
║   価格関連: 1件 (「もう少し安ければ」)                               ║
║                                                                      ║
║ [インサイト] 好評キーワード: 「香り」「抹茶らしい」「お点前」        ║
║ [改善提案] 包装材の見直し → FBA梱包設定の確認を推奨                  ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `amazon pricing [--asin <asin>] [--strategy <buybox|profit|competitive>]`
価格改定と競合価格分析を実行します。

```
$ amazon pricing --asin B0CK9X2YZP --strategy buybox

╔══════════════════════════════════════════════════════════════════════╗
║               価格分析 — B0CK9X2YZP (有機宇治抹茶 100g)             ║
╠══════════════════════════════════════════════════════════════════════╣
║ 現在価格:    ¥2,480                                                  ║
║ Buy Box価格: ¥2,480 (自社 — Buy Box獲得中)                          ║
║ Buy Box獲得率: 87.3% (過去30日)                                     ║
║                                                                      ║
║ 競合価格:                                                            ║
║   セラーA (FBA): ¥2,580                                              ║
║   セラーB (FBM): ¥2,280 (送料¥500)                                  ║
║   セラーC (FBA): ¥2,680                                              ║
║                                                                      ║
║ コスト構造 (¥2,480の場合):                                           ║
║   仕入原価:           ¥980                                           ║
║   FBA手数料:          ¥498 (配送代行)                                ║
║   販売手数料 (10%):   ¥248                                           ║
║   広告費 (按分):      ¥124                                           ║
║   ────────────────────────────                                       ║
║   純利益:             ¥630 (利益率 25.4%)                            ║
║                                                                      ║
║ [推奨] 現在価格を維持。Buy Box獲得率87%は良好。                     ║
║        ¥2,380に下げるとBuy Box獲得率93%予測、利益率21.4%。           ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `amazon aplus [--asin <asin>] [--action <create|preview|analyze>]`
A+コンテンツ(Enhanced Brand Content)の作成・管理を行います。

```
$ amazon aplus --asin B0CK9X2YZP --action analyze

╔══════════════════════════════════════════════════════════════════════╗
║         A+コンテンツ分析 — B0CK9X2YZP (有機宇治抹茶 100g)           ║
╠══════════════════════════════════════════════════════════════════════╣
║ A+ステータス: 公開中 (Brand Registry確認済み)                        ║
║                                                                      ║
║ 現在のモジュール構成:                                                ║
║   1. ブランドストーリー (テキスト+画像)                              ║
║   2. 商品比較表 (3商品)                                              ║
║   3. 技術スペック (テキスト+アイコン)                                ║
║   4. 使用シーン画像 (フルワイド)                                     ║
║                                                                      ║
║ スコア: 72/100                                                       ║
║   画像品質: 18/25 (解像度OK、テキストオーバーレイ改善余地)           ║
║   テキスト量: 20/25 (キーワード密度良好)                             ║
║   モジュール多様性: 16/25 (動画モジュール追加推奨)                   ║
║   モバイル最適化: 18/25 (画像内テキストが小さい)                     ║
║                                                                      ║
║ [提案] ブランドストーリーモジュールに「産地紹介」セクション追加       ║
║ [提案] 比較表に「内容量」「原産地」列を追加して差別化                ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `amazon report [--type <sales|inventory|advertising|returns>] [--period <day|week|month>]`
各種レポートの生成・ダウンロードを行います。

```
$ amazon report --type sales --period month

╔══════════════════════════════════════════════════════════════════════╗
║              月次売上レポート — 2026年2月                             ║
╠══════════════════════════════════════════════════════════════════════╣
║ 売上合計:     ¥4,287,600 (前月比 +18.2%)                            ║
║ 注文件数:     1,247件    (前月比 +15.8%)                            ║
║ 客単価:       ¥3,438     (前月比 +2.1%)                             ║
║ ユニット数:   2,134個    (前月比 +16.4%)                            ║
║ 返品率:       2.8%       (前月比 -0.3pt)                            ║
║                                                                      ║
║ カテゴリ別売上:                                                      ║
║   食品・飲料:    ¥2,847,200 (66.4%)                                 ║
║   キッチン用品:  ¥892,400  (20.8%)                                  ║
║   ホーム・ガーデン:¥548,000 (12.8%)                                  ║
║                                                                      ║
║ FBA vs FBM:                                                          ║
║   FBA売上:  ¥3,944,592 (92.0%)                                      ║
║   FBM売上:  ¥343,008   (8.0%)                                       ║
║                                                                      ║
║ Buy Box獲得率: 84.7% (全商品平均)                                   ║
╚══════════════════════════════════════════════════════════════════════╝
```

### `amazon order [--status <pending|shipped|cancelled>] [--id <order-id>]`
注文一覧と詳細を管理します。

```
$ amazon order --status pending

╔══════════════════════════════════════════════════════════════════════╗
║                  未処理注文一覧 (Pending)                             ║
╠══════════════════════════════════════════════════════════════════════╣
║ 注文ID              | 注文日     | 商品          | 金額    | 配送    ║
║─────────────────────┼────────────┼───────────────┼─────────┼────────║
║ 503-1234567-8901234 | 2026-03-01 | 有機宇治抹茶  | ¥2,480  | FBA    ║
║ 503-2345678-9012345 | 2026-03-01 | 抹茶セット    | ¥4,980  | FBA    ║
║ 503-3456789-0123456 | 2026-02-28 | 蜂蜜 500g x2  | ¥5,960  | FBM    ║
╠══════════════════════════════════════════════════════════════════════╣
║ 合計: 3件 | FBA: 2件(自動出荷) | FBM: 1件(要出荷処理)              ║
║ [要対応] 503-3456789-0123456: FBM注文 — 出荷期限 2026-03-02         ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│            Amazon Japan Seller 日次運用ワークフロー                    │
│                                                                     │
│  06:00 ┌──────────────────────────────────────────────┐             │
│        │ 1. 在庫チェック                               │             │
│        │    └─ FBA在庫サマリー取得                     │             │
│        │    └─ 在庫切れリスク商品の特定                │             │
│        │    └─ 発注推奨の通知                          │             │
│        └──────────────────┬───────────────────────────┘             │
│                           ▼                                         │
│  08:00 ┌──────────────────────────────────────────────┐             │
│        │ 2. 注文処理                                   │             │
│        │    └─ 新規注文の確認                          │             │
│        │    └─ FBM注文の出荷処理                       │             │
│        │    └─ キャンセル・返品リクエスト対応          │             │
│        └──────────────────┬───────────────────────────┘             │
│                           ▼                                         │
│  10:00 ┌──────────────────────────────────────────────┐             │
│        │ 3. 広告最適化                                 │             │
│        │    └─ 前日の広告パフォーマンス確認            │             │
│        │    └─ ACoS超過キャンペーンの入札調整          │             │
│        │    └─ ネガティブキーワード追加                │             │
│        └──────────────────┬───────────────────────────┘             │
│                           ▼                                         │
│  14:00 ┌──────────────────────────────────────────────┐             │
│        │ 4. レビュー・価格モニタリング                 │             │
│        │    └─ 新着レビューの確認                      │             │
│        │    └─ 低評価レビューの分析                    │             │
│        │    └─ 競合価格変動の検出                      │             │
│        │    └─ Buy Box獲得状況の確認                   │             │
│        └──────────────────┬───────────────────────────┘             │
│                           ▼                                         │
│  18:00 ┌──────────────────────────────────────────────┐             │
│        │ 5. 日次レポート生成                           │             │
│        │    └─ 売上サマリー                            │             │
│        │    └─ 広告効果サマリー                        │             │
│        │    └─ アクションアイテム一覧                  │             │
│        └──────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

| Error Code | Meaning | Agent Action |
|------------|---------|--------------|
| `InvalidInput` | SP-APIリクエストパラメータ不正 | エラー詳細のフィールド名を表示し、正しい形式を案内する |
| `Unauthorized` | アクセストークン期限切れ | Refresh Tokenで自動再取得を試行。失敗時は再認証を案内 |
| `Forbidden` | SP-APIアプリの権限不足 | 必要なAPI Scope(権限)を確認し、Seller Centralでの承認手順を案内 |
| `NotFound` | 指定ASIN/SKU/注文IDが存在しない | 入力値を確認し、Marketplace IDが正しいか検証 |
| `QuotaExceeded` (429) | APIレート制限超過 | リトライ間隔をExponential Backoffで自動調整（最大60秒待機） |
| `InternalFailure` (500) | Amazon内部エラー | 3回までリトライ。解消しない場合はSP-APIステータスページを案内 |
| `InvalidSignature` | AWS Signature v4署名エラー | AWS認証情報(Access Key/Secret Key/Role ARN)の設定を再確認 |
| `RestrictedResource` | 出品制限カテゴリへのアクセス | Seller Centralでのカテゴリ承認申請手順を案内 |
| `FBA_INVALID_PREP` | FBA納品プラン不備 | 商品の梱包要件（ラベル貼り、袋入れ等）を確認し修正提案 |

---

## FAQ

**Q: SP-APIの開発者登録はどうすればいい？**
A: Amazon Seller Centralにログイン後、「アプリとサービス」→「アプリ開発」から開発者登録を申請します。承認後にLWA Client IDとClient Secretが発行されます。IAMユーザーとロールの作成も必要です。全プロセスに3-5営業日かかります。

**Q: FBA在庫の最適な補充タイミングは？**
A: `amazon fba inventory` コマンドが販売速度とリードタイムから自動計算します。一般的に在庫回転日数が14日を切ったら補充準備、7日を切ったら緊急補充を推奨します。長期在庫保管手数料（365日超過）も考慮します。

**Q: Buy Boxを獲得するにはどうすれば？**
A: Buy Box獲得の主要因子は、価格（送料込み）、出荷方法（FBA優位）、セラー評価、在庫数です。`amazon pricing --strategy buybox` で最適価格を算出します。FBA利用で獲得率が平均20-30%向上します。

**Q: Sponsored Productsの推奨ACoS目標は？**
A: 商品の利益率に依存しますが、一般的にACoS 15-25%が健全な範囲です。利益率30%の商品ならACoS 20%で広告費込み利益率10%を確保できます。`amazon ads` で自動最適化が可能です。

**Q: A+コンテンツ(EBC)を作成するには？**
A: Amazon Brand Registryへの登録が必須です。ブランド名の商標登録が必要で、日本では特許庁への出願が前提となります。登録済みの場合、`amazon aplus --action create` でモジュール構成を提案します。

**Q: 出品制限カテゴリの申請方法は？**
A: Seller Centralの「在庫」→「出品許可申請」から申請します。カテゴリにより必要書類が異なります（食品: 営業許可証、化粧品: 製造販売業許可、電化製品: 技適マーク証明等）。`amazon list --check-restrictions` で事前確認できます。

**Q: 返品率が高い場合の対策は？**
A: `amazon report --type returns` で返品理由を分析します。主な対策: 商品画像の正確性向上、サイズ表の明確化、商品説明の詳細化、梱包材の改善。返品率が高いASINはBuy Box獲得率にも悪影響します。

**Q: 複数のAmazonマーケットプレイスに対応できる？**
A: はい。環境変数 `AMAZON_MARKETPLACE_ID` を切り替えることで対応可能です。Amazon.co.jp(A1VC38T7YXB528)、Amazon.com(ATVPDKIKX0DER)、Amazon.co.uk(A1F83G8C2ARO7P) 等を管理できます。

**Q: 楽天やYahoo!ショッピングとの在庫連動は？**
A: Rakuten SellerやYahoo Shopping Agentスキルと併用することで、在庫同期が可能です。`amazon sync --enable` で他プラットフォームとの在庫引当を自動化します。

**Q: Amazon Vineプログラムへの登録は？**
A: Brand Registry登録済みの新商品(レビュー30件未満)が対象です。`amazon vine enroll <asin>` で登録し、最大30個の無料サンプルをVine Voicesに送付できます。費用は1ASIN あたり約22,000円です。

**Q: セラーアカウントの健全性スコアを確認するには？**
A: `amazon health` コマンドでアカウント健全性ダッシュボードを表示します。注文不良率(ODR < 1%)、出荷前キャンセル率(< 2.5%)、出荷遅延率(< 4%)の3指標を監視し、閾値超過時にアラートを発行します。

**Q: FBA長期在庫保管手数料を回避するには？**
A: 365日以上FBA倉庫に保管された在庫には月額追加手数料が発生します。`amazon fba inventory --long-term` で対象在庫を事前に特定し、値下げ販売、FBA在庫返送、廃棄のいずれかを提案します。90日前から警告を開始します。

**Q: Amazon Business（法人向け）の価格設定は？**
A: `amazon pricing --business` で法人向け数量割引価格を設定できます。一般価格とは別に、5個以上で5%OFF、10個以上で10%OFFなどの段階的な法人価格を設定し、B2B売上の拡大を支援します。

### Competition Analysis Features

**`amazon compete <keyword>`** コマンドで競合分析を実行:

```
Competition Report: 「有機 抹茶 100g」

Rank | ASIN        | 商品名              | 価格   | レビュー | 評価 | FBA
─────┼─────────────┼─────────────────────┼────────┼──────────┼──────┼────
 1   | B0CK9A1BCD  | 京都宇治有機抹茶    | ¥2,180 | 1,847    | 4.6  | Yes
 2   | B0CK9B2DEF  | 鹿児島産オーガニック| ¥1,980 | 923      | 4.5  | Yes
 3   | ★自社商品    | 有機宇治抹茶 100g   | ¥2,480 | 287      | 4.4  | Yes
 ...

Gap Analysis:
 - レビュー数: 1位比 -84% → Amazon Vine登録でレビュー獲得加速推奨
 - 価格: 1位比 +¥300 → Buy Box戦略で¥2,280を提案(利益率22%)
 - 評価: -0.2pt → 低評価原因(包装)の改善で0.1pt向上見込み
 - 検索順位: 3位 → 商品名最適化とSP広告強化で2位獲得を目標
```

---

## Data Storage

```
.amazon-seller/
├── config.json                  # API認証情報とアカウント設定
├── cache/
│   ├── catalog.json             # 商品カタログキャッシュ (TTL: 30m)
│   ├── fba-inventory.json       # FBA在庫サマリーキャッシュ (TTL: 15m)
│   ├── pricing.json             # 競合価格データ (TTL: 1h)
│   └── buybox-history.jsonl     # Buy Box獲得率履歴
├── analytics/
│   ├── daily-sales.jsonl        # 日次売上データ
│   ├── monthly-reports/
│   │   └── 2026-02.json         # 月次レポート
│   ├── advertising/
│   │   ├── campaigns.json       # キャンペーン設定
│   │   ├── keywords.jsonl       # キーワードパフォーマンス
│   │   └── acos-history.jsonl   # ACoS推移
│   └── competition/
│       └── {asin}.json          # 競合分析スナップショット
├── reviews/
│   ├── all-reviews.jsonl        # 全レビューデータ
│   ├── sentiment-analysis.json  # 感情分析結果
│   └── insights.json            # 改善インサイト
├── fba/
│   ├── shipment-plans.json      # 納品プラン履歴
│   ├── restock-alerts.json      # 補充アラート設定
│   └── fee-calculator.json      # 手数料計算キャッシュ
├── aplus/
│   ├── content/
│   │   └── {asin}.json          # A+コンテンツ設定
│   └── templates/
│       └── *.json               # テンプレート
├── exports/
│   └── *.csv                    # エクスポートファイル
├── backups/
│   └── listings-{date}.json     # 週次バックアップ
└── logs/
    ├── api-calls.jsonl          # API呼び出しログ
    ├── errors.jsonl             # エラーログ
    └── pricing-changes.jsonl    # 価格変更履歴
```

---

## Comparison Table

| Feature | Amazon Japan Seller | セラースプライト | Keepa | price.com |
|---------|-------------------|----------------|-------|-----------|
| 対象プラットフォーム | Amazon.co.jp | Amazon全般 | Amazon全般 | 複数サイト |
| SP-API直接連携 | **対応(完全)** | 非対応(スクレイピング) | 一部対応 | 非対応 |
| FBA在庫管理 | **自動補充提案付き** | 在庫数表示のみ | 非対応 | 非対応 |
| 広告運用(SP) | **ACoS自動最適化** | キーワードリサーチ | 非対応 | 非対応 |
| 価格改定 | **Buy Box戦略+利益計算** | 価格推移表示 | **価格追跡** | **価格比較** |
| レビュー分析 | **感情解析+改善提案** | レビュー件数のみ | レビュー推移 | レビュー集約 |
| A+コンテンツ | **自動生成+スコアリング** | 非対応 | 非対応 | 非対応 |
| 注文管理 | **完全対応** | 非対応 | 非対応 | 非対応 |
| 日本語対応 | **ネイティブ** | 日本語UI | 英語中心 | **日本語** |
| コスト | 無料(API費用のみ) | 月額¥5,980〜 | 月額€19〜 | 無料 |
| AI搭載 | **Claude Code統合** | 一部AI機能 | 非対応 | 非対応 |
| CLI操作 | **完全対応** | Web UI | ブラウザ拡張 | Web UI |
| リアルタイム性 | **SP-API直結** | 数時間遅延 | 1-3時間遅延 | 日次更新 |

---

## Amazon.co.jp Specific Features

- SP-API (Selling Partner API) 完全対応
- FBA (Fulfillment by Amazon) 納品プラン作成・在庫管理
- Sponsored Products / Sponsored Brands 広告管理
- A+ Content (Enhanced Brand Content) 作成・最適化
- Amazon Brand Registry 連携
- Amazon Vine プログラム登録
- Buy Box獲得率モニタリングと価格最適化
- Amazon Business (法人向け) 価格設定対応
- マルチチャネル在庫連動 (MCF)
- FBA手数料シミュレーター
- Amazon出品大学のベストプラクティス準拠
- 日本市場法規制チェック（技適/PSE/食品表示法/景表法）
- Amazon.co.jp固有のカテゴリツリー対応
- 配送プログラム（お急ぎ便/日時指定便）の管理
- セラーアカウント健全性モニタリング (ODR/遅延率/キャンセル率)
