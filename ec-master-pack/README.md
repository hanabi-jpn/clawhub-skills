# :shopping_cart: EC Master Pack -- EC・物販マスターパック

> **日本の主要ECモール全9プラットフォームを1パッケージで完全制御。出品・在庫・注文・分析をAIで統合管理。**

[![Skills](https://img.shields.io/badge/skills-9-blue)](.) [![License](https://img.shields.io/badge/license-MIT-green)](.) [![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)](.)

---

## What's Included

| # | Skill | Description | Key API |
|---|-------|-------------|---------|
| 1 | **ec-cube-operator** | EC-CUBE 4.x 完全管理 -- 商品・在庫・注文・RFM分析 | EC-CUBE Web API |
| 2 | **rakuten-seller** | 楽天市場ショップ運営AI -- RMS API, レビュー・売上分析 | RMS API (REST/SOAP) |
| 3 | **stripe-japan-agent** | Stripe決済管理 -- PayPay, コンビニ決済, インボイス対応 | Stripe API |
| 4 | **base-stores-agent** | BASE & STORES 統合管理 -- 在庫同期・売上統合レポート | BASE API / STORES API |
| 5 | **amazon-japan-seller** | Amazon.co.jp出品・FBA管理 -- SP-API, 広告, A+コンテンツ | Amazon SP-API |
| 6 | **yahoo-shopping-agent** | Yahoo!ショッピング運営 -- ストアマッチ広告, PayPay経済圏 | Yahoo! Shopping API |
| 7 | **mercari-shops-agent** | メルカリShops運営 -- 相場分析, らくらくメルカリ便最適化 | Mercari Shops API |
| 8 | **shopify-japan** | Shopify日本市場D2C -- テーマ, SEO, 国内配送・決済連携 | Shopify Admin/Storefront API |
| 9 | **makeshop-agent** | MakeShop EC管理 -- GMOグループ, メルマガ, クーポン | MakeShop REST API v2 |

---

## Who Is This For?

**ECセラー・物販事業者・D2Cブランド** のためのオールインワンパッケージです。

- 複数モールに出品し、在庫・注文を一元管理したい **EC運営担当者**
- 楽天・Amazon・Yahoo!の3大モールで売上を最大化したい **マルチチャネルセラー**
- EC-CUBEやShopifyで自社ECを運営する **D2Cブランドオーナー**
- BASE/STORESでハンドメイド・小規模販売を行う **個人事業主・クリエイター**
- メルカリShopsでC2C市場に参入する **新規EC事業者**

---

## Quick Start

```bash
# パッケージごとインストール
npx clawhub@latest install hanabi-jpn/ec-master-pack

# 個別スキルのインストール
npx clawhub@latest install hanabi-jpn/rakuten-seller
npx clawhub@latest install hanabi-jpn/amazon-japan-seller

# 同期して最新版に更新
npx clawhub@latest sync
```

各スキルの環境変数（APIキー等）を設定後、すぐに利用開始できます。

---

## Package Architecture

```
                        EC MASTER PACK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         |
         ┌───────────────┼───────────────┐
         |               |               |
    ┌────┴────┐    ┌─────┴─────┐   ┌─────┴─────┐
    | 3大モール |    | 自社EC    |   | 簡易EC    |
    | Cluster  |    | Cluster   |   | Cluster   |
    └────┬────┘    └─────┬─────┘   └─────┬─────┘
         |               |               |
    ┌────┼────┐    ┌─────┼─────┐   ┌─────┼─────┐
    |    |    |    |     |     |   |     |     |
  楽天 Amazon Yahoo! EC-CUBE Shopify  BASE  STORES
    |    |    |    |     |     |   |     |     |
    └────┼────┘    └─────┼─────┘   └─────┼─────┘
         |               |               |
         └───────┬───────┘       ┌───────┘
                 |               |
           ┌─────┴─────┐  ┌─────┴─────┐
           | Stripe    |  | Mercari   |
           | 決済統合  |  | Shops     |
           └───────────┘  └───────────┘
                 |               |
         ┌───────┴───────────────┘
         |
    ┌────┴──────────────────────────┐
    |     Unified Operations        |
    |  在庫同期 / 売上分析 / 配送統合 |
    |  ヤマト運輸 / 佐川急便 / 日本郵便 |
    └───────────────────────────────┘
```

9スキルは **クロスプラットフォーム在庫同期** に対応。楽天で売れた在庫がAmazon・Yahoo!にも自動反映され、売り越しを防止します。

---

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 全9スキル利用可能（MIT License） |
| **Pro Support** | $29/月 | 優先サポート + セットアップガイド + 月次運用レビュー |
| **Enterprise** | 要相談 | カスタム開発 + 専用エージェント構築 + SLA保証 |

---

## Comparison with Alternatives

| 観点 | EC Master Pack | ネクストエンジン | クロスモール | 手動運用 |
|------|---------------|----------------|------------|---------|
| 対応モール数 | **9プラットフォーム** | 7モール | 5モール | 各モール個別 |
| AI搭載 | **Claude Code統合** | なし | なし | なし |
| SEO最適化 | **各モール別最適化** | なし | なし | 手動 |
| レビュー返信AI | **自動生成** | なし | なし | 手動 |
| 広告運用 | **RPP/SP/ストアマッチ** | 非対応 | 非対応 | 各管理画面 |
| 月額コスト | **$0 (OSS)** | 月額3,000円~ | 月額9,800円~ | 人件費 |
| CLI操作 | **完全対応** | Web UI | Web UI | Web UI |
| カスタマイズ | **無制限** | プラン依存 | プラン依存 | -- |

---

<p align="center">
  <b>Built by hanabi-jpn</b><br>
  <i>日本のEC運営をAIで革新する</i>
</p>
