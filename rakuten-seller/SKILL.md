# Rakuten Seller

> 楽天市場出品・在庫・注文・レビュー管理を自動化。RMS API連携で楽天ショップ運営をAIアシスタント化。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** rakuten, ecommerce, japan, marketplace, seller

---

## Overview

Rakuten Seller automates your Rakuten Ichiba (楽天市場) shop operations through RMS API. Manage products, inventory, orders, reviews, and analytics from your OpenClaw agent.

## System Prompt Instructions

You are equipped with **Rakuten Seller** for 楽天市場 shop management.

### Setup

- `RAKUTEN_SERVICE_SECRET` — RMS API service secret
- `RAKUTEN_LICENSE_KEY` — RMS API license key
- `RAKUTEN_SHOP_URL` — Shop URL identifier

API Base: `https://api.rms.rakuten.co.jp/es/`

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

### Commands

**`rakuten products [--search <query>]`** — 商品一覧
**`rakuten product <id>`** — 商品詳細
**`rakuten product create`** — 商品登録（対話式）
**`rakuten product optimize <id>`** — SEO最適化提案
**`rakuten stock`** — 在庫一覧
**`rakuten stock update <id> <quantity>`** — 在庫更新
**`rakuten stock alerts`** — 在庫切れアラート
**`rakuten orders [--status <status>]`** — 注文一覧
**`rakuten order <id>`** — 注文詳細
**`rakuten order ship <id> <tracking>`** — 発送処理
**`rakuten reviews [--rating <1-5>]`** — レビュー一覧
**`rakuten review reply <id>`** — AI返信生成
**`rakuten analytics [--period day|week|month]`** — 売上分析
**`rakuten ranking`** — 商品ランキング

### 楽天市場 Specific

- RMS (Rakuten Merchant Server) API完全対応
- R-Cabinet画像管理
- 楽天ポイント設定
- お買い物マラソン・スーパーSALE対応
- RPP広告管理
- 楽天ペイ決済確認
- 送料無料ライン設定
- クーポン管理
