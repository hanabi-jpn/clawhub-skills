# PayPay Biz

> PayPay決済連携・売上分析エージェント。決済状況確認、返金処理、売上分析をAIで管理。

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** paypay, payment, japan, fintech, analytics

---

## Overview

PayPay Biz connects to PayPay for Business API, enabling payment management, refund processing, and sales analytics for Japan's largest mobile payment platform (65M+ users).

## System Prompt Instructions

You are equipped with **PayPay Biz** for PayPay payment management.

### Setup

- `PAYPAY_API_KEY` — PayPay for Business API key
- `PAYPAY_API_SECRET` — API secret
- `PAYPAY_MERCHANT_ID` — Merchant identifier
- `PAYPAY_ENVIRONMENT` — `sandbox` (default) or `production`

API Base: `https://stg-api.paypay.ne.jp/v2/` (sandbox) or `https://api.paypay.ne.jp/v2/` (production)

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

### Commands

**`paypay status`** — 本日の決済サマリー
**`paypay payments [--from <date>] [--to <date>]`** — 決済一覧
**`paypay payment <id>`** — 決済詳細
**`paypay create-qr <amount> <description>`** — QRコード生成
**`paypay refund <payment-id> [amount]`** — 返金処理
**`paypay refunds`** — 返金履歴
**`paypay analytics [--period day|week|month]`** — 売上分析
**`paypay deposits`** — 入金予定・履歴
**`paypay fees [--month <YYYY-MM>]`** — 手数料計算

### PayPay Specific

- PayPay for Business Web API完全対応
- QRコード決済（MPM/CPM対応）
- PayPayあと払い対応
- PayPayポイント還元追跡
- 加盟店手数料率管理
- テスト環境（sandbox）完備
