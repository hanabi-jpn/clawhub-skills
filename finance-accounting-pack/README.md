# :yen: Finance & Accounting Pack -- 決済・会計オールインワン

> **決済処理から仕訳・確定申告・インボイス発行まで。日本の経理業務をエンドツーエンドで完全自動化。**

[![Skills](https://img.shields.io/badge/skills-10-blue)](.) [![License](https://img.shields.io/badge/license-MIT-green)](.) [![Author](https://img.shields.io/badge/author-hanabi--jpn-orange)](.)

---

## What's Included

| # | Skill | Description | Key API |
|---|-------|-------------|---------|
| 1 | **freee-agent** | freee会計・人事労務 自動化 -- 仕訳・P/L・B/S・確定申告 | freee API |
| 2 | **paypay-biz** | PayPay決済管理・売上分析 -- 65M+ユーザー QR決済 | PayPay for Business API |
| 3 | **jp-tax-calc** | 日本の税金計算・確定申告支援 -- 所得税・消費税・e-Tax | 国税庁仕様準拠 |
| 4 | **moneyforward-agent** | マネーフォワード会計連携 -- 自動仕訳・経費精算・請求書 | MoneyForward API |
| 5 | **yayoi-agent** | 弥生会計・弥生販売 連携 -- 中小企業向け会計自動化 | 弥生 API / Misoca連携 |
| 6 | **misoca-agent** | Misoca請求書管理 -- 見積書・納品書・請求書の発行と追跡 | Misoca API |
| 7 | **airpay-agent** | Airペイ決済管理 -- マルチ決済端末の売上・入金管理 | AirPAY API |
| 8 | **square-japan** | Square日本決済 -- POS・オンライン決済・在庫管理 | Square API |
| 9 | **e-tax-agent** | e-Tax電子申告支援 -- 確定申告書作成・電子送信サポート | e-Tax仕様準拠 |
| 10 | **japan-invoice** | 適格請求書（インボイス）管理 -- 2023年制度対応 | インボイス制度仕様 |

---

## Who Is This For?

**経理担当者・税理士・個人事業主・CFO** のための財務オールインワンパッケージです。

- freee・マネーフォワード・弥生を使い分けている **経理担当者**
- 複数クライアントの会計処理を効率化したい **税理士・会計事務所**
- 確定申告を自力で完了させたい **個人事業主・フリーランス**
- PayPay・Airペイ・Squareの売上を統合管理したい **店舗経営者**
- インボイス制度・電子帳簿保存法に完全対応したい **全事業者**

---

## Quick Start

```bash
# パッケージごとインストール
npx clawhub@latest install hanabi-jpn/finance-accounting-pack

# 個別スキルのインストール
npx clawhub@latest install hanabi-jpn/freee-agent
npx clawhub@latest install hanabi-jpn/jp-tax-calc

# 同期して最新版に更新
npx clawhub@latest sync
```

会計ソフトのAPIキーを環境変数に設定すれば、仕訳の自動登録や決算レポートの生成が即座に開始できます。

---

## Package Architecture

```
                 FINANCE & ACCOUNTING PACK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          |
         ┌────────────────┼────────────────┐
         |                |                |
    ┌────┴─────┐    ┌─────┴──────┐   ┌────┴──────┐
    | 決済入口  |    | 会計処理    |   | 税務申告   |
    | Payment  |    | Accounting |   | Tax Filing |
    └────┬─────┘    └─────┬──────┘   └────┬──────┘
         |                |                |
    ┌────┼────┐    ┌──────┼──────┐   ┌────┼────┐
    |    |    |    |      |      |   |    |    |
  PayPay AirPay Square freee   MF   弥生 e-Tax  jp-tax
    |    |    |    |      |      |   |    |    |
    └────┼────┘    └──────┼──────┘   └────┼────┘
         |                |                |
         |          ┌─────┴──────┐         |
         └─────────>| 自動仕訳    |<────────┘
                    | Auto-Entry |
                    └─────┬──────┘
                          |
                    ┌─────┴──────┐
                    | 請求書発行  |
                    | Invoicing  |
                    └─────┬──────┘
                    |     |      |
                  Misoca  japan  freee
                         invoice
                          |
                    ┌─────┴──────────────┐
                    | 適格請求書(インボイス) |
                    | 電子帳簿保存法対応    |
                    └────────────────────┘
```

**決済データが自動的に仕訳に変換され、確定申告書の作成まで一気通貫で処理されます。** PayPayやSquareの売上がfreeeやマネーフォワードの帳簿に自動反映。インボイス制度にも完全準拠。

---

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 全10スキル利用可能（MIT License） |
| **Pro Support** | $29/月 | 優先サポート + 確定申告チェックリスト + 月次レビュー |
| **Enterprise** | 要相談 | 税理士向けマルチクライアント対応 + カスタム帳票 + SLA保証 |

---

## Comparison with Alternatives

| 観点 | Finance Pack | freee単体 | MF単体 | 税理士委託 |
|------|-------------|----------|--------|----------|
| 対応会計ソフト | **freee + MF + 弥生** | freeeのみ | MFのみ | ソフト不問 |
| 対応決済 | **PayPay + Airペイ + Square** | freee連携のみ | MF連携のみ | 手動入力 |
| インボイス対応 | **自動発行+番号検証** | 対応 | 対応 | 手動 |
| 確定申告支援 | **e-Tax連携+税額計算** | 対応 | 対応 | 委託費 |
| AI仕訳提案 | **Claude Code統合** | freee AI | MF AI | 税理士判断 |
| 月額コスト | **$0 (OSS)** | 2,680円~ | 2,980円~ | 3-5万円/月 |
| CLI操作 | **完全対応** | Web UI | Web UI | 対面/メール |
| 電子帳簿保存法 | **自動アーカイブ** | 対応 | 対応 | 手動管理 |
| 軽減税率計算 | **8%/10%自動判別** | 対応 | 対応 | 手動 |
| レポート出力 | **P/L, B/S, CF自動** | 対応 | 対応 | 月次報告 |

---

<p align="center">
  <b>Built by hanabi-jpn</b><br>
  <i>日本の経理をAIで解放する</i>
</p>
