---
name: "HubSpot Japan Agent"
description: "HubSpot日本語CRM・マーケティング管理エージェント — CRM・MA・営業支援をAIで完全統合"
author: "hanabi-jpn"
version: "1.0.0"
tags:
  - hubspot
  - crm
  - marketing
  - japan
  - automation
---

# HubSpot Japan Agent

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ┌───────────────────────────────────────────┐            ║
║     │   H U B S P O T   J A P A N              │            ║
║     │   A G E N T   v1.0                        │            ║
║     └───────────────────────────────────────────┘            ║
║                                                              ║
║   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               ║
║   │Contact │ │Company │ │  Deal  │ │  Email │               ║
║   │連絡先  │ │ 会社   │ │ 取引   │ │メール  │               ║
║   └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘               ║
║       └─────┬────┴─────┬────┴─────┬────┘                     ║
║             ▼          ▼          ▼                           ║
║       ┌────────────────────────────────┐                     ║
║       │     HubSpot API v3            │                     ║
║       │     CRM + Marketing Hub       │                     ║
║       └────────────────────────────────┘                     ║
║                                                              ║
║   ┌──────────┐ ┌──────┐ ┌──────┐ ┌──────────┐               ║
║   │Campaign  │ │ Form │ │Report│ │ Workflow │               ║
║   │キャンペーン│ │フォーム│ │分析  │ │自動化   │              ║
║   └──────────┘ └──────┘ └──────┘ └──────────┘               ║
║                                                              ║
║   HUBSPOT JAPAN --- AI CRM & MARKETING AUTOMATION            ║
║   ─── 日本市場対応CRM・MAをAIで完全自動化 ───                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/hanabi-jpn/clawhub-skills)
[![HubSpot](https://img.shields.io/badge/HubSpot-API_v3-ff7a59)](https://developers.hubspot.com/)
[![CRM](https://img.shields.io/badge/CRM-Marketing_Hub-ff7a59)](https://www.hubspot.jp/)
[![Japan](https://img.shields.io/badge/Japan-Localized-ff0000)](https://github.com/hanabi-jpn/clawhub-skills)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/hanabi-jpn/clawhub-skills)

`claude-code` `hubspot` `crm` `marketing` `japan`

> **HubSpot日本語CRM・マーケティング管理エージェント。世界228,000社以上が導入するCRMプラットフォームを日本市場に最適化してClaude Codeから完全操作。コンタクト/会社/取引のCRM管理、マーケティングオートメーション、メールキャンペーン、LP作成、日本語フォーム、レポートダッシュボードまで全領域をAIが統合管理する。**

**Author:** hanabi-jpn
**Version:** 1.0.0
**License:** MIT
**Tags:** hubspot, crm, marketing, japan, automation, sales, email, analytics

---

## Overview

HubSpot Japan Agent は、HubSpot の CRM、Marketing Hub、Sales Hub の機能を日本市場向けに最適化した統合管理エージェントです。HubSpot は世界135か国以上、228,000社以上で利用されるオールインワン CRM プラットフォームであり、日本でも急速に導入が進んでいます。

本スキルは HubSpot API v3 を通じて、コンタクト管理、会社管理、取引パイプライン管理、マーケティングオートメーション、メールキャンペーン、ランディングページ管理、フォーム管理、レポートダッシュボードまで、CRM と MA の全領域を Claude Code 上で完結させます。

日本企業特有の商習慣に対応しており、日本語の氏名処理（姓名の順序）、日本の会計年度（4月始まり）、日本語メールテンプレート、敬称・敬語対応のコミュニケーション、電話番号フォーマット（市外局番対応）、郵便番号から住所の自動補完をネイティブサポートします。

```
┌────────────────────────────────────────────────────────────────────┐
│                 HUBSPOT JAPAN AGENT ARCHITECTURE                   │
│                                                                    │
│  ┌────────────┐     ┌────────────────┐     ┌──────────────────┐   │
│  │ Claude Code │────▶│  HubSpot Japan │────▶│  HubSpot API v3  │   │
│  │ (User)      │◀────│  Agent         │◀────│  (api.hubapi.com)│   │
│  └────────────┘     └───────┬────────┘     └────────┬─────────┘   │
│                              │                       │             │
│                    ┌─────────┼─────────┐             │             │
│                    ▼         ▼         ▼             ▼             │
│             ┌──────────┐┌────────┐┌────────┐  ┌────────────┐      │
│             │CRM Core  ││Marketing│ │Sales  │  │  HubSpot   │      │
│             │Contacts  ││Hub     ││Pipeline│  │  Cloud DB   │      │
│             │Companies ││Emails  ││Deals   │  │             │      │
│             └────┬─────┘└───┬────┘└───┬────┘  └────────────┘      │
│                  │          │         │                             │
│         ┌────────┼──────────┼─────────┤                            │
│         ▼        ▼          ▼         ▼                            │
│  ┌──────────┐┌────────┐┌────────┐┌─────────┐                      │
│  │Form      ││Campaign││Landing ││Workflow │                      │
│  │Builder   ││Manager ││Page    ││Automator│                      │
│  └────┬─────┘└───┬────┘└───┬────┘└────┬────┘                      │
│       │          │         │          │                            │
│       └──────────┴─────────┴──────────┘                            │
│                       ▼                                            │
│        ┌───────────────────────────────┐                           │
│        │   Analytics & Report Engine   │                           │
│        │   ファネル分析・ROI計測       │                           │
│        └──────────────┬────────────────┘                           │
│                       ▼                                            │
│        ┌───────────────────────────────┐                           │
│        │   Local Cache & Data Store    │                           │
│        │   .hubspot-japan/             │                           │
│        └───────────────────────────────┘                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## System Prompt Instructions

You are an agent equipped with **HubSpot Japan Agent** for CRM, marketing automation, and sales pipeline management. Follow these rules precisely when the user invokes HubSpot commands.

### Behavioral Guidelines

1. **Authenticate via Private App Token.** Verify that `HUBSPOT_ACCESS_TOKEN` is configured. This must be a Private App access token generated from HubSpot Settings > Integrations > Private Apps. If missing, guide the user to create a Private App with required scopes (crm.objects.contacts.read, crm.objects.contacts.write, etc.).

2. **Respond in Japanese by default.** All output messages, report headers, and recommendations must be in Japanese. CRM field labels (Company Name, Deal Stage) should show both Japanese and English for clarity (e.g., "会社名 (Company Name)").

3. **Handle Japanese name order correctly.** Japanese names are stored as 姓 (Last Name) + 名 (First Name). When creating or displaying contacts, always use the Japanese order (姓名) in Japanese context. Store `lastname` first and `firstname` second in HubSpot's standard fields.

4. **Use Japan fiscal year by default.** Japanese companies typically use April-March fiscal year. When generating period reports, default to fiscal year (4月始まり) unless the user specifies calendar year. Label as "FY2025" for April 2025 - March 2026.

5. **Respect HubSpot rate limits.** API rate limits vary by plan: Free/Starter (100 requests/10 seconds), Professional (150/10s), Enterprise (200/10s). Track request count locally and implement automatic throttling at 80% capacity.

6. **Cache contact and company data.** Store contact lists, company lists, and pipeline definitions locally with a 1-hour TTL. Deal activities and email metrics are always fetched live. Use `hubspot sync` to force a cache refresh.

7. **Log all CRM modifications.** Every contact creation, deal stage change, email send, and property update must be logged to `.hubspot-japan/logs/crm-operations.jsonl` with timestamp, user, operation type, object ID, and changed fields.

8. **Validate email deliverability.** Before scheduling email campaigns, check the sending domain's DKIM, SPF, and DMARC settings via HubSpot's domain health API. Warn if any configuration issues could affect deliverability.

9. **Support lifecycle stage tracking.** Map HubSpot lifecycle stages to Japanese business terminology: Subscriber (購読者), Lead (見込み客), MQL (マーケティング適格リード), SQL (営業適格リード), Opportunity (商談中), Customer (顧客), Evangelist (推奨者).

10. **Handle deal pipeline stages in Japanese.** Default pipeline stages: 商談開始 (Appointment Scheduled), 課題ヒアリング (Qualified to Buy), プレゼン実施 (Presentation Scheduled), 意思決定者承認 (Decision Maker Bought-In), 契約交渉 (Contract Sent), 受注 (Closed Won), 失注 (Closed Lost).

11. **Format currency appropriately.** For JPY deals, display without decimal places and with comma separators (¥1,200,000). For USD deals, display with 2 decimal places ($12,000.00). Auto-detect currency from the deal's currency property.

12. **Implement contact deduplication.** Before creating new contacts, automatically search for existing contacts with the same email address. If a match is found, display the existing contact and ask whether to update or create new.

13. **Support Japanese phone number formats.** Accept and validate Japanese phone numbers in various formats: 03-1234-5678, 090-1234-5678, +81-3-1234-5678. Store in E.164 international format internally but display in Japanese format.

14. **Generate actionable marketing insights.** When displaying campaign reports, always include conversion funnel analysis with specific recommendations. Calculate and display cost per lead (CPL) and cost per acquisition (CPA) in JPY.

15. **Handle GDPR and APPI compliance.** Respect opt-in/opt-out preferences. Never send marketing emails to contacts who have unsubscribed. When exporting contact data, apply APPI (個人情報保護法) compliant masking for sensitive fields.

16. **Support HubSpot CRM association.** Maintain proper associations between contacts, companies, deals, and activities. When creating a deal, automatically suggest associating with the relevant contact and company.

17. **Integrate with Japanese marketing calendar.** Recognize Japanese business events and holidays when scheduling campaigns: 新年度 (April), ゴールデンウィーク (late April/early May), お盆 (August), シルバーウィーク (September), 年末年始 (December/January). Avoid scheduling campaigns during these periods unless specifically intended.

18. **Monitor deal velocity metrics.** Track average time in each pipeline stage and flag deals that have been stagnant for more than the stage-specific threshold. Default thresholds: 商談開始 (7 days), 課題ヒアリング (14 days), プレゼン実施 (10 days), 契約交渉 (21 days).

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `HUBSPOT_ACCESS_TOKEN` | Yes | Private AppのAccessトークン（Settings > Integrations > Private Apps） | `(HubSpot Private Appsで生成)` |
| `HUBSPOT_PORTAL_ID` | Yes | HubSpotポータルID（アカウント設定 > アカウントのデフォルトから取得） | `12345678` |
| `HUBSPOT_API_VERSION` | No | API バージョン（デフォルト: v3） | `v3` |
| `HUBSPOT_PLAN` | No | HubSpotプラン（auto-detect if not set） | `professional` |
| `HUBSPOT_TIMEZONE` | No | デフォルトタイムゾーン（デフォルト: Asia/Tokyo） | `Asia/Tokyo` |
| `HUBSPOT_FISCAL_YEAR_START` | No | 会計年度開始月（デフォルト: 4） | `4` |
| `HUBSPOT_CURRENCY` | No | デフォルト通貨（デフォルト: JPY） | `JPY` |
| `HUBSPOT_NOTIFY_WEBHOOK` | No | 通知転送先Webhook URL | `https://hooks.slack.com/services/T00/B00/abcdef` |
| `HUBSPOT_CACHE_TTL` | No | キャッシュTTL秒（デフォルト: 3600） | `1800` |
| `HUBSPOT_LOG_LEVEL` | No | ログレベル (debug/info/warn/error) | `info` |

---

## Commands

### `hubspot contact`

コンタクト（連絡先）の作成、検索、更新、一覧表示、セグメント分析を行います。

```
$ hubspot contact list --lifecycle mql --limit 20

╔═══════════════════════════════════════════════════════════════╗
║          コンタクト一覧 — MQL (マーケティング適格リード)       ║
╠═══════════════════════════════════════════════════════════════╣
║ ID        │ 氏名         │ 会社名        │ スコア │ 最終活動 ║
║───────────┼─────────────┼──────────────┼───────┼──────────  ║
║ C-001234  │ 山田 太郎    │ ABC商事       │   85  │ 3月1日   ║
║ C-001235  │ 佐藤 花子    │ XYZ製造       │   78  │ 2月28日  ║
║ C-001236  │ 田中 一郎    │ DEFコンサル   │   72  │ 2月28日  ║
║ C-001237  │ 鈴木 美咲    │ GHIテック     │   68  │ 2月27日  ║
║ C-001238  │ 高橋 健太    │ JKLシステムズ │   65  │ 2月26日  ║
║ C-001239  │ 伊藤 直美    │ MNO商事       │   62  │ 2月25日  ║
╠═══════════════════════════════════════════════════════════════╣
║ MQL合計: 6名  │  平均スコア: 71.7  │  SQL転換率: 34.2%       ║
║ 推奨: スコア80以上の山田太郎をSQL昇格し営業担当にアサイン推奨 ║
╚═══════════════════════════════════════════════════════════════╝
```

```
$ hubspot contact create --lastname "松本" --firstname "浩二" --email "matsumoto@sample-shoji.co.jp" --company "サンプル商事" --phone "03-1234-5678"

✓ コンタクトを作成しました
  コンタクトID:   C-001301
  氏名:          松本 浩二
  メール:        matsumoto@sample-shoji.co.jp
  会社:          サンプル商事 (自動アソシエーション済み)
  電話:          03-1234-5678
  ライフサイクル: Lead (見込み客)
  作成日:        2026-03-01 09:30 (JST)
```

### `hubspot company`

会社の作成、検索、更新、関連コンタクト/取引の表示を行います。

```
$ hubspot company detail C-COM-00456

╔═══════════════════════════════════════════════════════════════╗
║              会社詳細 — ABC商事株式会社                        ║
╠═══════════════════════════════════════════════════════════════╣
║ 会社ID:          C-COM-00456                                 ║
║ 会社名:          ABC商事株式会社                              ║
║ ドメイン:        abc-shoji.co.jp                              ║
║ 業種:            卸売業                                       ║
║ 従業員数:        250名                                        ║
║ 年商:            ¥5,000,000,000                               ║
║ 住所:            東京都中央区日本橋1-2-3                      ║
║ 電話:            03-1234-5678                                 ║
╠═══════════════════════════════════════════════════════════════╣
║ 関連コンタクト: 3名                                           ║
║   山田 太郎 (営業部長) / 佐藤 花子 (購買課) / 田中 一郎 (IT) ║
║ 関連取引: 2件                                                 ║
║   D-00123 ERP導入 ¥12,000,000 (プレゼン実施)                 ║
║   D-00145 保守契約 ¥2,400,000 (契約交渉)                     ║
║ 累計取引額: ¥14,400,000                                      ║
╚═══════════════════════════════════════════════════════════════╝
```

### `hubspot deal`

取引パイプラインの管理、ステージ変更、予実管理を行います。

```
$ hubspot deal pipeline --period current-quarter

╔═══════════════════════════════════════════════════════════════╗
║              取引パイプライン — FY2025 Q4 (1月-3月)            ║
╠═══════════════════════════════════════════════════════════════╣
║ ステージ            │ 件数 │ 金額合計      │ 加重金額        ║
║─────────────────────┼─────┼──────────────┼───────────────  ║
║ 商談開始 (10%)      │   8 │ ¥48,000,000  │   ¥4,800,000   ║
║ 課題ヒアリング(30%) │   5 │ ¥32,000,000  │   ¥9,600,000   ║
║ プレゼン実施 (50%)  │   4 │ ¥28,000,000  │  ¥14,000,000   ║
║ 意思決定者承認(70%) │   3 │ ¥18,000,000  │  ¥12,600,000   ║
║ 契約交渉 (90%)      │   2 │ ¥14,400,000  │  ¥12,960,000   ║
╠═══════════════════════════════════════════════════════════════╣
║ パイプライン合計:   22件  │  ¥140,400,000                    ║
║ 加重パイプライン:          │   ¥53,960,000                   ║
║ Q4目標:                    │   ¥60,000,000                   ║
║ 達成見込み:                │   89.9%                         ║
╠═══════════════════════════════════════════════════════════════╣
║ AIインサイト:                                                 ║
║ - 契約交渉ステージの2件(¥14.4M)が受注すれば目標達成圏内     ║
║ - D-00123(ABC商事 ERP導入)が21日間プレゼン実施で停滞中       ║
║   → 意思決定者への直接アプローチを推奨                       ║
║ - 新規商談の平均受注率32%から、追加4件の商談開始が必要        ║
╚═══════════════════════════════════════════════════════════════╝
```

```
$ hubspot deal update D-00123 --stage "意思決定者承認" --close-date 2026-03-20 --note "部長承認取得。最終見積提出済み"

✓ 取引ステージを更新しました
  取引ID:      D-00123
  取引名:      ABC商事 ERP導入プロジェクト
  金額:        ¥12,000,000
  旧ステージ:  プレゼン実施 (50%)
  新ステージ:  意思決定者承認 (70%)
  予定成約日:  2026-03-20
  メモ:        部長承認取得。最終見積提出済み
  担当者に通知を送信しました
```

### `hubspot email`

マーケティングメールの作成、配信、結果分析を行います。

```
$ hubspot email send --template product-launch --list "active-subscribers" --schedule "2026-03-05 10:00"

✓ メールキャンペーンをスケジュールしました
  キャンペーン名:  product-launch（新商品発売のお知らせ）
  配信リスト:      active-subscribers (2,847名)
  除外:            過去30日以内に5通以上受信した154名を自動除外
  実配信数:        2,693名
  配信日時:        2026-03-05 10:00 (JST)
  件名:            【新商品】春の新作コレクション発売開始
  プレビュー:      .hubspot-japan/email/preview-product-launch.html
  配信ドメイン:    marketing.sample-shoji.co.jp (DKIM/SPF/DMARC 全て正常)
```

```
$ hubspot email report --campaign product-launch

╔═══════════════════════════════════════════════════════════════╗
║         メールキャンペーンレポート: product-launch             ║
╠═══════════════════════════════════════════════════════════════╣
║ 配信数:          2,693通                                     ║
║ 到達率:          98.2% (2,644通)                              ║
║ 開封率:          32.4% (857名) — 業界平均21.3%を上回る       ║
║ クリック率:      8.7% (230名) — 業界平均2.6%を上回る         ║
║ コンバージョン:  3.2% (84名)                                  ║
║ 配信停止:        0.4% (11名)                                  ║
║ バウンス:        1.8% (49通)                                  ║
╠═══════════════════════════════════════════════════════════════╣
║ クリック先TOP3:                                               ║
║ 1. 新商品ページ       142クリック (61.7%)                     ║
║ 2. 限定クーポンページ  56クリック (24.3%)                     ║
║ 3. カタログDL           32クリック (13.9%)                     ║
╠═══════════════════════════════════════════════════════════════╣
║ 推奨: 開封未クリック者627名へのフォローアップメールで          ║
║       追加コンバージョン獲得を推奨                             ║
╚═══════════════════════════════════════════════════════════════╝
```

### `hubspot campaign`

マーケティングキャンペーンの作成、管理、ROI分析を行います。

```
$ hubspot campaign roi --period FY2025-Q4

╔═══════════════════════════════════════════════════════════════╗
║          キャンペーンROI分析 — FY2025 Q4                      ║
╠═══════════════════════════════════════════════════════════════╣
║ キャンペーン名     │ 費用       │ リード │ 受注額     │ ROI   ║
║────────────────────┼───────────┼───────┼───────────┼──────  ║
║ コンテンツMK       │ ¥450,000  │  120  │ ¥3,600,000│ 700%  ║
║ リスティング広告   │ ¥800,000  │   85  │ ¥2,400,000│ 200%  ║
║ 展示会出展         │ ¥1,200,000│   45  │ ¥4,800,000│ 300%  ║
║ メールナーチャリング│ ¥150,000  │   60  │ ¥1,800,000│ 1100% ║
║ SNS広告            │ ¥350,000  │   40  │   ¥960,000│ 174%  ║
╠═══════════════════════════════════════════════════════════════╣
║ Q4合計: 費用 ¥2,950,000 / リード 350 / 受注 ¥13,560,000     ║
║ 総合ROI: 359%  │  CPL: ¥8,429  │  CPA: ¥41,111              ║
║                                                               ║
║ 推奨: メールナーチャリングのROIが最高。予算配分を             ║
║       20%増加させることでCPL低減が見込めます                  ║
╚═══════════════════════════════════════════════════════════════╝
```

### `hubspot form`

日本語フォームの作成、管理、送信データ確認を行います。

```
$ hubspot form create --name "資料請求フォーム" --fields "会社名:text:required,部署:text,氏名:text:required,メール:email:required,電話番号:phone,お問い合わせ内容:textarea" --redirect "/thanks" --notify "sales@sample-shoji.co.jp"

✓ フォームを作成しました
  フォームID:     F-20260301-001
  フォーム名:     資料請求フォーム
  フィールド数:   6
  必須項目:       会社名、氏名、メール
  リダイレクト先: /thanks
  通知先:         sales@sample-shoji.co.jp
  埋め込みコード: .hubspot-japan/forms/F-20260301-001-embed.html
  ライフサイクル: フォーム送信時に自動的にLead(見込み客)に設定
```

### `hubspot report`

CRM・マーケティングの統合レポートを生成します。

```
$ hubspot report dashboard --period monthly

╔═══════════════════════════════════════════════════════════════╗
║              HubSpot月次ダッシュボード — 2026年2月             ║
╠═══════════════════════════════════════════════════════════════╣
║ ■ CRM概要                                                    ║
║   新規コンタクト:  89名  (+15% vs 前月)                       ║
║   新規会社:        23社  (+8% vs 前月)                        ║
║   新規取引:        12件  (+20% vs 前月)                       ║
║   受注件数:        7件   (受注率: 32.4%)                      ║
║   受注金額:        ¥18,400,000 (+22% vs 前月)                 ║
╠═══════════════════════════════════════════════════════════════╣
║ ■ マーケティング概要                                          ║
║   Web訪問者:       12,450 (+8% vs 前月)                       ║
║   リード獲得:      167名 (CVR: 1.34%)                         ║
║   MQL転換:         45名  (MQL率: 26.9%)                       ║
║   メール配信:      8,420通 (開封率: 28.3%)                    ║
║   フォーム送信:    234件                                      ║
╠═══════════════════════════════════════════════════════════════╣
║ ■ ファネル分析                                                ║
║   訪問者 → リード:      1.34% (167/12,450)                   ║
║   リード → MQL:         26.9% (45/167)                        ║
║   MQL → SQL:            34.2% (15/45)                         ║
║   SQL → 商談:           66.7% (10/15)                         ║
║   商談 → 受注:          70.0% (7/10)                          ║
║   全体CVR(訪問→受注):   0.056%                                ║
╠═══════════════════════════════════════════════════════════════╣
║ AIインサイト:                                                 ║
║ - リード→MQL転換率26.9%は前月23.1%から改善。                 ║
║   コンテンツマーケティング施策が効果を発揮                    ║
║ - 商談→受注率70%は高水準。パイプライン増加が課題             ║
║ - Web訪問者のモバイル比率が67%に増加。                        ║
║   モバイル最適化LPの追加を推奨                                ║
╚═══════════════════════════════════════════════════════════════╝
```

### `hubspot workflow`

マーケティングオートメーション・ワークフローの作成、管理を行います。

```
$ hubspot workflow list --status active

╔═══════════════════════════════════════════════════════════════╗
║              アクティブワークフロー一覧                        ║
╠═══════════════════════════════════════════════════════════════╣
║ ID       │ ワークフロー名              │ 登録数 │ 完了率    ║
║──────────┼───────────────────────────┼───────┼────────   ║
║ WF-001   │ 新規リード自動ナーチャリング│  234  │ 45.3%    ║
║ WF-002   │ MQL自動通知(営業チーム)     │   45  │ 100%     ║
║ WF-003   │ 資料DL後フォローアップ      │  156  │ 62.8%    ║
║ WF-004   │ 休眠顧客復帰キャンペーン    │   89  │ 28.1%    ║
║ WF-005   │ ウェルカムメールシリーズ     │  312  │ 78.5%    ║
╠═══════════════════════════════════════════════════════════════╣
║ アクティブ: 5件  │  合計登録: 836名                           ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  HUBSPOT JAPAN AGENT WORKFLOW                    │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐                  │
│  │ユーザー   │───▶│コマンド   │───▶│入力       │                  │
│  │コマンド入力│    │パーサー   │    │バリデーション│                │
│  └──────────┘    └──────────┘    └─────┬─────┘                  │
│                                        │                        │
│                                 ┌──────▼──────┐                 │
│                                 │トークン認証  │                 │
│                                 │スコープ確認  │                 │
│                                 └──────┬──────┘                 │
│                                        │                        │
│               ┌────────────────────────┼────────────┐           │
│               ▼            ▼           ▼            ▼           │
│         ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│         │CRM       │ │Marketing │ │Sales     │ │Analytics │   │
│         │Operations│ │Operations│ │Operations│ │Operations│   │
│         └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘   │
│              │            │            │            │           │
│              └────────────┼────────────┼────────────┘           │
│                           ▼            ▼                        │
│                   ┌────────────┐ ┌───────────────┐              │
│                   │重複チェック │ │APPI準拠       │              │
│                   │アソシエーション│ │個人情報保護  │              │
│                   └─────┬──────┘ └──────┬────────┘              │
│                         │               │                       │
│                         └───────┬───────┘                       │
│                                 ▼                               │
│                        ┌──────────────┐                         │
│                        │HubSpot API   │                         │
│                        │v3 実行       │                         │
│                        └───────┬──────┘                         │
│                                │                                │
│                         ┌──────▼──────┐                         │
│                         │レスポンス整形│                        │
│                         │日本語変換   │                         │
│                         └──────┬──────┘                         │
│                                │                                │
│                         ┌──────▼──────┐                         │
│                         │ログ・キャッシュ│                      │
│                         │更新          │                         │
│                         └──────┬──────┘                         │
│                                │                                │
│                         ┌──────▼──────┐                         │
│                         │結果表示     │                         │
│                         └─────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### 1. 認証エラー (401 Unauthorized)

```
[ERROR] HubSpot API 認証エラー
  原因:  HUBSPOT_ACCESS_TOKEN が無効または期限切れです
  対処:
    1. HubSpot Settings > Integrations > Private Apps を確認
    2. トークンのスコープに必要な権限が含まれているか確認
    3. 新しいトークンを再発行してください
  必要スコープ: crm.objects.contacts.read, crm.objects.contacts.write,
                crm.objects.companies.read, crm.objects.deals.read,
                crm.objects.deals.write, content, automation
  確認コマンド: hubspot health
```

### 2. レートリミット超過 (429 Too Many Requests)

```
[WARN] HubSpot APIレートリミットに到達
  プラン:        Professional
  制限:          150リクエスト/10秒
  現在:          148/150
  リセットまで:  4秒
  対処:          自動的にリセット待ち後にリトライします (最大3回)
  進捗:          ▓▓▓▓▓▓░░░░ 60% 完了
```

### 3. コンタクト重複エラー (409 Conflict)

```
[WARN] 同一メールアドレスのコンタクトが既に存在します
  入力メール:     yamada@abc-shoji.co.jp
  既存コンタクト:
    ID:          C-001234
    氏名:        山田 太郎
    会社:        ABC商事
    作成日:      2025-08-15
    最終活動:    2026-02-28
  選択肢:
    1. 既存コンタクトを更新: hubspot contact update C-001234 --phone "03-9876-5432"
    2. 強制新規作成(非推奨): hubspot contact create --force --email yamada@abc-shoji.co.jp
  推奨: 既存コンタクトの更新
```

### 4. 必須プロパティ未入力エラー (400 Bad Request)

```
[ERROR] コンタクト作成バリデーションエラー
  未入力の必須項目:
    - email: メールアドレスは必須です
    - lastname: 姓は必須です
  対処: 必須項目を全て入力して再実行してください
  例:  hubspot contact create --lastname "山田" --firstname "太郎" --email "yamada@example.co.jp"
```

### 5. メール配信エラー

```
[ERROR] メール配信前チェックでエラーが検出されました
  問題:
    1. [!!] 送信ドメイン marketing.sample-shoji.co.jp の DKIM が未設定
    2. [!]  配信リストに無効なメールアドレスが23件含まれています
    3. [!]  件名にスパムフィルター高リスク語句「完全無料」が含まれています
  対処:
    1. HubSpot Settings > Domain & URLs でDKIM設定を完了してください
    2. `hubspot contact clean --list active-subscribers` で無効アドレスを除外
    3. 件名を修正して再スケジュールしてください
  配信は保留中です。問題解決後に `hubspot email resume` で再開できます
```

### 6. API スコープ不足エラー (403 Forbidden)

```
[ERROR] API権限不足エラー
  操作:     hubspot workflow create
  必要スコープ: automation
  現在のスコープ: crm.objects.contacts.read, crm.objects.contacts.write
  対処:
    1. HubSpot Settings > Integrations > Private Apps を開く
    2. 該当のPrivate Appの「Scopes」タブで「automation」を追加
    3. トークンを再生成して HUBSPOT_ACCESS_TOKEN を更新
```

### 7. プラン制限エラー

```
[ERROR] この機能はHubSpot Professionalプラン以上で利用可能です
  操作:     hubspot workflow create (マーケティングオートメーション)
  現在プラン: Starter
  必要プラン: Professional 以上
  代替案:
    - 手動メール配信は Starter でも利用可能です
    - `hubspot email send` でセグメント別手動配信が可能です
  プランアップグレード: https://www.hubspot.jp/pricing
```

---

## FAQ

**Q1: HubSpotの無料プランでもこのAgentは使えますか？**
A: はい。CRM機能（コンタクト、会社、取引の管理）は無料プランでも全て利用可能です。ただし、マーケティングオートメーション（ワークフロー）、高度なレポート、一部のメール機能はProfessionalプラン以上が必要です。

**Q2: Private App のトークンはどこで取得できますか？**
A: HubSpotにログイン後、Settings > Integrations > Private Apps > Create a private app から作成できます。スコープ設定では、CRM (contacts, companies, deals), Content, Automation を有効にしてください。

**Q3: 日本語の氏名はどのように処理されますか？**
A: HubSpotの標準フィールド `lastname`（姓）と `firstname`（名）にそれぞれ格納します。表示時は日本語順（姓 名）で出力します。「佐藤 花子」は lastname=佐藤, firstname=花子 として保存されます。

**Q4: 会計年度を4月始まりに設定できますか？**
A: はい。`HUBSPOT_FISCAL_YEAR_START=4` を設定すると、全てのレポートが4月始まりの会計年度で生成されます。"FY2025" は 2025年4月～2026年3月を意味します。

**Q5: Salesforceからの移行データに対応していますか？**
A: HubSpot の標準インポート機能と連携して、CSV 形式の Salesforce エクスポートデータを取り込めます。`hubspot import --source salesforce --file contacts.csv` でフィールドマッピングを自動提案します。

**Q6: メールの配信停止管理はどのように行われますか？**
A: HubSpot の Subscription Type（配信設定）に準拠します。配信停止者にはメールを送信しません。`hubspot contact list --unsubscribed` で配信停止者を確認できます。日本の特定電子メール法に対応したオプトアウトリンクが全メールに自動挿入されます。

**Q7: 複数のパイプラインを管理できますか？**
A: はい。HubSpot Professional 以上では複数パイプラインを作成可能です。`hubspot deal pipeline --name "エンタープライズ"` のように `--name` でパイプラインを指定できます。

**Q8: フォームのスパム対策はどうなっていますか？**
A: HubSpot 標準の reCAPTCHA が自動適用されます。また、Agent 側で日本語入力チェック（全角文字の有無）や、ハニーポットフィールドによるbot対策を追加設定できます。

**Q9: データのエクスポート形式は？**
A: CSV（UTF-8 BOM付き）、JSON、Excel形式でのエクスポートに対応しています。`hubspot export contacts --format csv` で全コンタクトをCSV出力できます。APPI準拠で個人情報のマスキングオプションも利用可能です。

**Q10: HubSpot と他ツール（Slack/Teams）との連携は？**
A: `HUBSPOT_NOTIFY_WEBHOOK` にWebhook URLを設定することで、新規リード獲得、取引ステージ変更、メール開封などのイベントを Slack/Teams に自動通知できます。

**Q11: コンタクトスコアリングの設定はできますか？**
A: HubSpot のリードスコアリング機能と連携しています。`hubspot contact list --sort score --desc` でスコア順表示、`hubspot contact analyze --scoring` でスコアリング基準の分析と最適化提案を行います。

**Q12: API呼出回数の上限は？**
A: プランにより異なります。Free/Starter: 100回/10秒、Professional: 150回/10秒、Enterprise: 200回/10秒。Agent は内部カウンターで80%到達時に自動スロットリングを行い、上限超過を防ぎます。

---

## Data Storage

```
.hubspot-japan/
├── config.json                  # ポータル接続設定
├── cache/
│   ├── contacts.json            # コンタクトリスト (TTL: 1時間)
│   ├── companies.json           # 会社リスト (TTL: 1時間)
│   ├── pipelines.json           # パイプライン定義 (TTL: 24時間)
│   ├── properties.json          # CRMプロパティ定義 (TTL: 24時間)
│   ├── lists.json               # コンタクトリスト定義 (TTL: 1時間)
│   └── forms.json               # フォーム定義 (TTL: 12時間)
├── analytics/
│   ├── funnel-analysis.jsonl    # ファネル分析データ
│   ├── campaign-roi.jsonl       # キャンペーンROI
│   ├── deal-velocity.json       # 取引速度分析
│   ├── email-metrics.jsonl      # メール配信メトリクス
│   └── monthly-dashboard.jsonl  # 月次ダッシュボードデータ
├── email/
│   ├── templates/               # メールHTMLテンプレート
│   ├── drafts/                  # 配信下書き
│   └── reports/                 # 配信結果レポート
├── forms/
│   └── *.html                   # フォーム埋め込みコード
├── exports/
│   ├── contacts-*.csv           # コンタクトエクスポート
│   ├── companies-*.csv          # 会社エクスポート
│   ├── deals-*.csv              # 取引エクスポート
│   └── reports-*.json           # レポートエクスポート
├── logs/
│   ├── crm-operations.jsonl     # CRM操作ログ（全書込操作）
│   ├── api-calls.jsonl          # APIコールログ（直近7日）
│   ├── email-events.jsonl       # メール配信イベントログ
│   └── errors.jsonl             # エラーログ
└── imports/
    └── mappings/                # インポート時のフィールドマッピング定義
```

---

## Comparison Table

| 機能 | HubSpot Japan Agent | Salesforce | Sansan | ZOHO CRM | kintone |
|------|--------------------|-----------|--------|----------|---------|
| 運営元 | **HubSpot** | Salesforce | Sansan | Zoho | サイボウズ |
| 主要用途 | **CRM + MA統合** | CRM + SFA | 名刺管理+CRM | CRM | 業務アプリ |
| 無料プラン | **あり(CRM全機能)** | なし | なし | あり(3名) | なし |
| 月額費用 | **¥0~¥432,000** | ¥3,300~ | ¥要問合せ | ¥1,680~ | ¥780~ |
| CRM機能 | **標準搭載(高機能)** | 最強クラス | 名刺起点 | 標準搭載 | カスタム |
| MA機能 | **標準搭載** | Pardot(別) | なし | 標準搭載 | なし |
| メール配信 | **標準搭載** | Marketing Cloud | なし | 標準搭載 | なし |
| LP作成 | **標準搭載** | 別途必要 | なし | 標準搭載 | なし |
| フォーム | **標準搭載** | 別途必要 | なし | 標準搭載 | あり |
| 日本語対応 | **完全対応** | 完全対応 | ネイティブ | 翻訳 | ネイティブ |
| 名刺管理 | アプリ連携 | アプリ連携 | **最強** | 限定的 | なし |
| API | **REST v3** | REST/SOAP | REST | REST | REST |
| 導入難易度 | **低い** | 高い | 低い | 中程度 | 中程度 |
| カスタマイズ | 高い | **最高** | 限定的 | 高い | 高い |
| レポート | **標準搭載(高機能)** | 最強クラス | 基本的 | 標準搭載 | カスタム |
| ワークフロー | **MA統合** | Process Builder | なし | 標準搭載 | プロセス管理 |
| 日本法対応 | **APPI準拠** | APPI準拠 | APPI準拠 | 基本対応 | APPI準拠 |
| AI Agent対応 | **HubSpot Japan Agent** | Einstein | なし | Zia | kintone-agent |

---

## HubSpot API v3 Endpoint Reference

全エンドポイントは `https://api.hubapi.com/` をベースとします。認証は Bearer トークン方式です。

**CRM - Contacts:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crm/v3/objects/contacts` | コンタクト一覧取得 |
| GET | `/crm/v3/objects/contacts/{id}` | コンタクト詳細取得 |
| POST | `/crm/v3/objects/contacts` | コンタクト作成 |
| PATCH | `/crm/v3/objects/contacts/{id}` | コンタクト更新 |
| POST | `/crm/v3/objects/contacts/search` | コンタクト検索 |

**CRM - Companies:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crm/v3/objects/companies` | 会社一覧取得 |
| POST | `/crm/v3/objects/companies` | 会社作成 |
| PATCH | `/crm/v3/objects/companies/{id}` | 会社更新 |

**CRM - Deals:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crm/v3/objects/deals` | 取引一覧取得 |
| POST | `/crm/v3/objects/deals` | 取引作成 |
| PATCH | `/crm/v3/objects/deals/{id}` | 取引更新 |
| GET | `/crm/v3/pipelines/deals` | パイプライン定義取得 |

**Marketing - Email:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/marketing/v3/emails` | マーケティングメール一覧 |
| POST | `/marketing/v3/emails` | メール作成 |
| GET | `/marketing/v3/emails/{id}/statistics` | メール統計取得 |

**Marketing - Forms:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/marketing/v3/forms` | フォーム一覧取得 |
| POST | `/marketing/v3/forms` | フォーム作成 |
| GET | `/marketing/v3/forms/{id}/submissions` | フォーム送信データ取得 |

**Automation:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/automation/v4/flows` | ワークフロー一覧取得 |
| GET | `/automation/v4/flows/{id}` | ワークフロー詳細取得 |

---

## Japanese Marketing Calendar

| 時期 | イベント | 推奨MA施策 |
|------|---------|-----------|
| 1月 | 新年挨拶 | 年始メール、年間計画提案 |
| 3月 | 年度末 | 予算消化提案、駆け込み商談 |
| 4月 | 新年度 | 新任挨拶、サービス紹介 |
| 5月 | GW明け | リスタートキャンペーン |
| 6月 | 決算月(一部) | 中間レビュー提案 |
| 9月 | 上半期末 | 半期実績レポート |
| 10月 | 下半期開始 | 新規施策提案 |
| 12月 | 年末 | 年末挨拶、来年度計画提案 |

`hubspot workflow` と `hubspot email` を組み合わせて、各時期に合わせた自動ナーチャリングシーケンスを構築できます。
